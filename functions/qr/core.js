import { Router } from 'express'
import { createCipheriv, createDecipheriv, createHash, createHmac, hkdfSync, randomBytes, randomUUID, timingSafeEqual } from 'node:crypto'
import { applicationDefault, cert, getApps, initializeApp } from 'firebase-admin/app'
import { FieldValue, getFirestore } from 'firebase-admin/firestore'
import { getAuth } from 'firebase-admin/auth'

function firebaseApp() {
  if (getApps().length) return getApps()[0]
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
  if (serviceAccount) {
    return initializeApp({ credential: cert(JSON.parse(serviceAccount)) })
  }
  return initializeApp({ credential: applicationDefault() })
}
const app = firebaseApp()
const db = getFirestore(app)
const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
const MAX_BODY = 4096

function isInvalidAdminToken(error) {
  return ['auth/id-token-expired', 'auth/argument-error', 'auth/id-token-revoked'].includes(error.code)
}

export function normalizeActivationCode(value) {
  return String(value ?? '').toUpperCase().replace(/[\s-]/g, '')
}

export function validateReviewUrl(value) {
  if (typeof value !== 'string' || value.length > 2048) return false
  try {
    const url = new URL(value)
    if (url.protocol !== 'https:' || url.username || url.password || url.port) return false
    const host = url.hostname.toLowerCase()
    const googleHost = host === 'google.com' || host.endsWith('.google.com')
    if (!(googleHost || host === 'g.page' || host === 'maps.app.goo.gl')) return false
    if (host === 'g.page') return /^\/r\/[A-Za-z0-9_-]+\/review\/?$/.test(url.pathname)
    if (host === 'maps.app.goo.gl') return /^\/[A-Za-z0-9_-]+\/?$/.test(url.pathname)
    return /(?:\/maps(?:\/|$)|\/local\/writereview(?:\/|$)|\/review(?:\/|$)|\/reviews(?:\/|$))/i.test(url.pathname)
  } catch {
    return false
  }
}

function codeDigest(code) {
  const pepper = process.env.QR_CODE_PEPPER
  if (!pepper || pepper.length < 32) throw new Error('QR_CODE_PEPPER must contain at least 32 characters')
  return createHmac('sha256', pepper).update(code).digest('hex')
}

export function encryptBatchCsv(csv) {
  const pepper = process.env.QR_CODE_PEPPER
  if (!pepper || pepper.length < 32) throw new Error('QR_CODE_PEPPER must contain at least 32 characters')
  const key = Buffer.from(hkdfSync('sha256', Buffer.from(pepper), Buffer.from('devonyx-qr-batch-v1'), Buffer.from('csv-recovery'), 32))
  const iv = randomBytes(12)
  const cipher = createCipheriv('aes-256-gcm', key, iv)
  const encrypted = Buffer.concat([cipher.update(csv, 'utf8'), cipher.final()])
  return { encryptedCsv: encrypted.toString('base64'), csvIv: iv.toString('base64'), csvTag: cipher.getAuthTag().toString('base64') }
}

export function decryptBatchCsv(batch) {
  const pepper = process.env.QR_CODE_PEPPER
  if (!pepper || pepper.length < 32) throw new Error('QR_CODE_PEPPER must contain at least 32 characters')
  const key = Buffer.from(hkdfSync('sha256', Buffer.from(pepper), Buffer.from('devonyx-qr-batch-v1'), Buffer.from('csv-recovery'), 32))
  const decipher = createDecipheriv('aes-256-gcm', key, Buffer.from(batch.csvIv, 'base64'))
  decipher.setAuthTag(Buffer.from(batch.csvTag, 'base64'))
  return Buffer.concat([decipher.update(Buffer.from(batch.encryptedCsv, 'base64')), decipher.final()]).toString('utf8')
}

function sendBatchCsv(res, csv) {
  res.set({ 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'attachment; filename="devonyx-qr-products.csv"', 'Cache-Control': 'no-store, no-cache, must-revalidate' })
  return res.send(csv)
}

function makeCode() {
  let result = ''
  while (result.length < 20) {
    for (const byte of randomBytes(32)) {
      if (byte < 224) result += CODE_ALPHABET[byte % CODE_ALPHABET.length]
      if (result.length === 20) break
    }
  }
  return result.match(/.{1,5}/g).join('-')
}

function makeSlug() {
  return randomBytes(15).toString('base64url')
}

function safeEqual(a, b) {
  const left = Buffer.from(a)
  const right = Buffer.from(b)
  return left.length === right.length && timingSafeEqual(left, right)
}

async function rateLimit(req) {
  const ip = String(req.ip || req.socket?.remoteAddress || 'unknown')
  const key = createHash('sha256').update(ip).digest('hex')
  const ref = db.collection('qrRateLimits').doc(key)
  const now = Date.now()
  await db.runTransaction(async tx => {
    const snap = await tx.get(ref)
    const data = snap.data()
    const windowStart = data?.windowStart || now
    if (now - windowStart >= 15 * 60 * 1000) {
      tx.set(ref, { windowStart: now, count: 1, expiresAt: new Date(now + 24 * 60 * 60 * 1000) })
      return
    }
    if ((data?.count || 0) >= 12) throw Object.assign(new Error('RATE_LIMIT'), { status: 429 })
    tx.update(ref, { count: FieldValue.increment(1) })
  })
}

async function verifyAppCheck(req) {
  if (process.env.REQUIRE_APP_CHECK !== 'true') return
  const token = req.get('X-Firebase-AppCheck')
  if (!token) throw Object.assign(new Error('APP_CHECK'), { status: 403 })
  const { getAppCheck } = await import('firebase-admin/app-check')
  try { await getAppCheck(app).verifyToken(token) } catch { throw Object.assign(new Error('APP_CHECK'), { status: 403 }) }
}

export function createQrRouter() {
  const router = Router()
  router.use('/admin', (_req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate')
    next()
  })
  router.use((req, res, next) => {
    if (Number(req.headers['content-length'] || 0) > MAX_BODY) return res.status(413).json({ error: 'Request is too large.' })
    next()
  })

  router.post('/activate', async (req, res) => {
    try {
      await verifyAppCheck(req)
      await rateLimit(req)
      const { activationCode, businessName, reviewUrl } = req.body || {}
      const code = normalizeActivationCode(activationCode)
      const name = typeof businessName === 'string' ? businessName.trim() : ''
      if (code.length !== 20 || !/^[A-Z2-9]+$/.test(code) || name.length < 2 || name.length > 100 || /[<>\u0000-\u001f]/.test(name) || !validateReviewUrl(reviewUrl)) {
        return res.status(400).json({ error: 'Check the activation code, business name, and Google review link, then try again.' })
      }
      const digest = codeDigest(code)
      const normalizedReviewUrl = new URL(reviewUrl).toString()
      let activatedSlug
      await db.runTransaction(async tx => {
        const codeRef = db.collection('qrActivationCodes').doc(digest)
        const codeSnap = await tx.get(codeRef)
        if (!codeSnap.exists) throw Object.assign(new Error('INVALID'), { status: 400 })
        const productRef = db.collection('qrProducts').doc(codeSnap.get('slug'))
        const productSnap = await tx.get(productRef)
        if (!productSnap.exists) throw Object.assign(new Error('INVALID'), { status: 400 })
        activatedSlug = productRef.id
        const data = productSnap.data()
        if (!safeEqual(data.activationCodeHash || '', digest)) throw Object.assign(new Error('INVALID'), { status: 400 })
        if (data.status === 'activated' && data.businessName === name && data.reviewUrl === normalizedReviewUrl) return
        if (data.status !== 'unactivated') throw Object.assign(new Error('INVALID'), { status: 400 })
        tx.update(productRef, { status: 'activated', businessName: name, reviewUrl: normalizedReviewUrl, activatedAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp() })
      })
      const baseUrl = String(process.env.PUBLIC_BASE_URL || '').replace(/\/$/, '')
      return res.json({ ok: true, redirectUrl: baseUrl ? `${baseUrl}/r/${activatedSlug}` : `/r/${activatedSlug}` })
    } catch (err) {
      if (err.status === 429) return res.status(429).json({ error: 'Too many attempts. Please wait 15 minutes and try again.' })
      if (err.status === 403) return res.status(403).json({ error: 'Unable to verify this request. Refresh the page and try again.' })
      if (err.status === 400 || err.message === 'INVALID') return res.status(400).json({ error: 'We could not activate that code. Check it and try again, or contact DevonyX for help.' })
      console.error('QR activation failed')
      return res.status(503).json({ error: 'Activation is temporarily unavailable. Please try again shortly.' })
    }
  })

  router.get('/resolve/:slug', async (req, res) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    try {
      if (!/^[A-Za-z0-9_-]{16,40}$/.test(req.params.slug)) return res.json({ status: 'not-found' })
      const snap = await db.collection('qrProducts').doc(req.params.slug).get()
      if (!snap.exists) return res.json({ status: 'not-found' })
      const product = snap.data()
      if (product.status === 'activated' && validateReviewUrl(product.reviewUrl)) return res.json({ status: 'activated', reviewUrl: product.reviewUrl })
      if (product.status === 'disabled' || product.status === 'revoked') return res.json({ status: product.status })
      return res.json({ status: 'unactivated' })
    } catch {
      return res.status(503).json({ status: 'unavailable' })
    }
  })

  router.get('/redirect/:slug', async (req, res) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    const unavailable = '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>QR temporarily unavailable | DevonyX</title><body style="font:16px system-ui;max-width:560px;margin:15vh auto;padding:24px;color:#14141b"><p style="color:#3148d9;font-weight:700">DEVONYX</p><h1>This QR is temporarily unavailable</h1><p>Please try scanning again in a moment.</p></body></html>'
    const page = (title, body, status = 200) => res.status(status).type('html').send(`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title} | DevonyX</title><body style="font:16px system-ui;max-width:560px;margin:15vh auto;padding:24px;color:#14141b"><p style="color:#3148d9;font-weight:700">DEVONYX</p><h1>${title}</h1><p>${body}</p><a style="display:inline-block;background:#3148d9;color:white;padding:12px 18px;border-radius:28px;text-decoration:none" href="/setup">Activate your QR</a></body></html>`)
    try {
      if (!/^[A-Za-z0-9_-]{16,40}$/.test(req.params.slug)) return page('QR not found', 'Check that you scanned the QR code printed on your DevonyX product.', 404)
      const snap = await db.collection('qrProducts').doc(req.params.slug).get()
      if (!snap.exists) return page('QR not found', 'This QR code could not be found. Please contact DevonyX for help.', 404)
      const product = snap.data()
      if (product.status === 'activated' && validateReviewUrl(product.reviewUrl)) return res.redirect(302, product.reviewUrl)
      if (product.status === 'disabled' || product.status === 'revoked') return page('This QR is unavailable', 'Please contact the business that provided this stand.')
      return res.redirect(302, '/setup')
    } catch {
      return res.status(503).type('html').send(unavailable)
    }
  })

  router.post('/admin/reset-activation', async (req, res) => {
    try {
      const authorization = req.get('Authorization') || ''
      const idToken = authorization.startsWith('Bearer ') ? authorization.slice(7) : ''
      const decoded = await getAuth(app).verifyIdToken(idToken, true)
      if (decoded.admin !== true) return res.status(403).json({ error: 'Administrator access required.' })
      const slug = String(req.body?.slug || '')
      if (!/^[A-Za-z0-9_-]{16,40}$/.test(slug)) return res.status(400).json({ error: 'Invalid product.' })
      const replacementCode = makeCode()
      const replacementHash = codeDigest(normalizeActivationCode(replacementCode))
      await db.runTransaction(async tx => {
        const productRef = db.collection('qrProducts').doc(slug)
        const productSnap = await tx.get(productRef)
        if (!productSnap.exists || productSnap.get('status') !== 'unactivated') throw new Error('NOT_RESETTABLE')
        const oldCodeRef = db.collection('qrActivationCodes').doc(productSnap.get('activationCodeHash'))
        const newCodeRef = db.collection('qrActivationCodes').doc(replacementHash)
        const [oldCode, newCode] = await Promise.all([tx.get(oldCodeRef), tx.get(newCodeRef)])
        if (!oldCode.exists || oldCode.get('slug') !== slug || newCode.exists) throw new Error('CODE_CONFLICT')
        tx.delete(oldCodeRef)
        tx.create(newCodeRef, { slug, createdAt: FieldValue.serverTimestamp(), schemaVersion: 1 })
        tx.update(productRef, { activationCodeHash: replacementHash, updatedAt: FieldValue.serverTimestamp() })
        tx.create(db.collection('qrAdminAudit').doc(randomUUID()), { action: 'reset-activation', slug, adminUid: decoded.uid, createdAt: FieldValue.serverTimestamp() })
      })
      res.set('Cache-Control', 'no-store')
      return res.json({ ok: true, activationCode: replacementCode })
    } catch (err) {
      if (isInvalidAdminToken(err)) return res.status(401).json({ error: 'Sign in again to continue.' })
      if (err.message === 'NOT_RESETTABLE' || err.message === 'CODE_CONFLICT') return res.status(409).json({ error: 'This product cannot be reset. Check its status and try again.' })
      console.error('QR code recovery failed')
      return res.status(403).json({ error: 'Unable to reset the code. Check administrator access and try again.' })
    }
  })

  router.post('/admin/update-destination', async (req, res) => {
    try {
      const authorization = req.get('Authorization') || ''
      const idToken = authorization.startsWith('Bearer ') ? authorization.slice(7) : ''
      const decoded = await getAuth(app).verifyIdToken(idToken, true)
      if (decoded.admin !== true) return res.status(403).json({ error: 'Administrator access required.' })
      const slug = String(req.body?.slug || '')
      const businessName = typeof req.body?.businessName === 'string' ? req.body.businessName.trim() : ''
      const reviewUrl = req.body?.reviewUrl
      if (!/^[A-Za-z0-9_-]{16,40}$/.test(slug) || businessName.length < 2 || businessName.length > 100 || /[<>\u0000-\u001f]/.test(businessName) || !validateReviewUrl(reviewUrl)) {
        return res.status(400).json({ error: 'Check the product, business name, and Google review link.' })
      }
      await db.runTransaction(async tx => {
        const productRef = db.collection('qrProducts').doc(slug)
        const product = await tx.get(productRef)
        if (!product.exists || product.get('status') !== 'activated') throw new Error('NOT_EDITABLE')
        tx.update(productRef, { businessName, reviewUrl: new URL(reviewUrl).toString(), updatedAt: FieldValue.serverTimestamp() })
        tx.create(db.collection('qrAdminAudit').doc(randomUUID()), { action: 'update-destination', slug, adminUid: decoded.uid, createdAt: FieldValue.serverTimestamp() })
      })
      return res.json({ ok: true })
    } catch (err) {
      if (isInvalidAdminToken(err)) return res.status(401).json({ error: 'Sign in again to continue.' })
      if (err.message === 'NOT_EDITABLE') return res.status(404).json({ error: 'Product not found or unavailable for updates.' })
      if (err.status === 400) return res.status(400).json({ error: 'Check the product, business name, and Google review link.' })
      console.error('QR destination recovery failed')
      return res.status(403).json({ error: 'Unable to update the destination. Check administrator access and try again.' })
    }
  })

  router.post('/admin/generate', async (req, res) => {
    let decoded
    let batchId
    try {
      const authorization = req.get('Authorization') || ''
      const idToken = authorization.startsWith('Bearer ') ? authorization.slice(7) : ''
      decoded = await getAuth(app).verifyIdToken(idToken, true)
      if (decoded.admin !== true) return res.status(403).json({ error: 'Administrator access required.' })
      const count = Number(req.body?.count)
      if (!Number.isInteger(count) || count < 1 || count > 200) return res.status(400).json({ error: 'Choose a batch size from 1 to 200.' })
      batchId = String(req.body?.batchId || '')
      if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(batchId)) return res.status(400).json({ error: 'Start a new batch request and try again.' })
      const batchRef = db.collection('qrAdminBatches').doc(batchId)
      const previousBatch = await batchRef.get()
      if (previousBatch.exists) {
        const saved = previousBatch.data()
        if (saved.createdBy !== decoded.uid) return res.status(404).json({ error: 'This batch request was not found.' })
        if (saved.count !== count) return res.status(409).json({ error: 'This batch request belongs to a different size. Restore its original size or start a new batch.' })
        await db.collection('qrAdminAudit').doc(randomUUID()).create({ action: 'recover-batch', count, adminUid: decoded.uid, createdAt: FieldValue.serverTimestamp() })
        return sendBatchCsv(res, decryptBatchCsv(saved))
      }
      const baseUrl = String(process.env.PUBLIC_BASE_URL || '').replace(/\/$/, '')
      if (!/^(?:https:\/\/[a-z0-9.-]+|http:\/\/(?:localhost|127\.0\.0\.1)(?::\d{1,5})?)$/i.test(baseUrl)) return res.status(503).json({ error: 'PUBLIC_BASE_URL is not configured.' })
      const rows = []
      const codeSet = new Set()
      while (rows.length < count) {
        const code = makeCode()
        if (codeSet.has(code)) continue
        codeSet.add(code)
        rows.push({ slug: makeSlug(), code })
      }
      const refs = rows.map(({ slug }) => db.collection('qrProducts').doc(slug))
      const hashes = rows.map(({ code }) => codeDigest(normalizeActivationCode(code)))
      const codeRefs = hashes.map(hash => db.collection('qrActivationCodes').doc(hash))
      const csv = ['slug,redirect_url,activation_code', ...rows.map(({ slug, code }) => `${slug},${baseUrl}/r/${slug},${code}`)].join('\r\n')
      const encryptedCsv = encryptBatchCsv(csv)
      await db.runTransaction(async tx => {
        const batchSnap = await tx.get(batchRef)
        if (batchSnap.exists) throw new Error('BATCH_EXISTS')
        const existing = await Promise.all([...refs, ...codeRefs].map(ref => tx.get(ref)))
        if (existing.some(snap => snap.exists)) throw new Error('PRODUCT_COLLISION')
        refs.forEach((ref, index) => {
          tx.create(ref, { status: 'unactivated', activationCodeHash: hashes[index], createdAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp(), schemaVersion: 1 })
          tx.create(codeRefs[index], { slug: rows[index].slug, createdAt: FieldValue.serverTimestamp(), schemaVersion: 1 })
        })
        tx.create(db.collection('qrAdminAudit').doc(randomUUID()), { action: 'generate-batch', count, adminUid: decoded.uid, createdAt: FieldValue.serverTimestamp() })
        tx.create(batchRef, { count, ...encryptedCsv, createdAt: FieldValue.serverTimestamp(), createdBy: decoded.uid, schemaVersion: 1 })
      })
      return sendBatchCsv(res, csv)
    } catch (err) {
      if (isInvalidAdminToken(err)) return res.status(401).json({ error: 'Sign in again to continue.' })
      if (err.message === 'BATCH_EXISTS' && batchId && decoded?.admin === true) {
        try {
          const batchRef = db.collection('qrAdminBatches').doc(batchId)
          const existingBatch = await batchRef.get()
          if (existingBatch.exists) {
            const saved = existingBatch.data()
            if (saved.createdBy !== decoded.uid) return res.status(404).json({ error: 'This batch request was not found.' })
            if (saved.count !== Number(req.body?.count)) return res.status(409).json({ error: 'This batch request belongs to a different size.' })
            await db.collection('qrAdminAudit').doc(randomUUID()).create({ action: 'recover-batch', count: saved.count, adminUid: decoded.uid, createdAt: FieldValue.serverTimestamp() })
            return sendBatchCsv(res, decryptBatchCsv(saved))
          }
        } catch {
          return res.status(503).json({ error: 'The batch is being prepared. Retry this same request in a moment.' })
        }
      }
      console.error('QR batch generation failed')
      return res.status(err.message === 'PRODUCT_COLLISION' ? 503 : 403).json({ error: 'Unable to generate this batch. Please check administrator access and try again.' })
    }
  })
  return router
}
