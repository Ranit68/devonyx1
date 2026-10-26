import { useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { ArrowLeft, Check, Download, LogIn, LogOut, QrCode, ShieldCheck, Trash2 } from 'lucide-react'

const apiKey = import.meta.env.VITE_FIREBASE_API_KEY
const allowedCode = /^[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{5}(?:-[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{5}){3}$/

function setMetaNoIndex() {
  document.title = 'QR Batch Admin | DevonyX'
  let robots = document.querySelector('meta[name="robots"]')
  if (!robots) { robots = document.createElement('meta'); robots.name = 'robots'; document.head.append(robots) }
  robots.content = 'noindex, nofollow'
  return () => { robots.content = 'index, follow' }
}

function readPendingBatch(uid) {
  if (!uid) return null
  try {
    const saved = JSON.parse(localStorage.getItem(`qrAdminPendingBatch:${uid}`) || 'null')
    return saved && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(saved.batchId) && Number.isInteger(saved.count) && saved.count >= 1 && saved.count <= 200 ? saved : null
  } catch { return null }
}

function parseCsv(text, expectedCount) {
  const lines = text.trim().split(/\r?\n/)
  if (lines[0] !== 'slug,redirect_url,activation_code' || lines.length !== expectedCount + 1) {
    throw new Error('The server returned an incomplete product batch. Do not retry automatically; check Firestore and contact support first.')
  }
  const products = lines.slice(1).map(line => {
    const [slug, redirectUrl, activationCode, ...extra] = line.split(',')
    if (extra.length || !/^[A-Za-z0-9_-]{16,40}$/.test(slug || '') || !/^https:\/\/devonyx\.in\/r\/[A-Za-z0-9_-]{16,40}$/.test(redirectUrl || '') || !allowedCode.test(activationCode || '')) {
      throw new Error('The server returned an invalid batch. Do not retry automatically; contact support before generating another batch.')
    }
    return { slug, redirectUrl, activationCode }
  })
  if (new Set(products.map(product => product.slug)).size !== expectedCount || new Set(products.map(product => product.activationCode)).size !== expectedCount) {
    throw new Error('The batch contains a duplicate product. Do not print it; contact support.')
  }
  return products
}

function downloadText(name, type, value) {
  const url = URL.createObjectURL(new Blob([value], { type }))
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = name
  document.body.append(anchor)
  anchor.click()
  anchor.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export default function QRBatchAdminPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [idToken, setIdToken] = useState('')
  const [adminUid, setAdminUid] = useState('')
  const [pendingBatch, setPendingBatch] = useState(null)
  const [count, setCount] = useState('25')
  const [products, setProducts] = useState([])
  const [csvContent, setCsvContent] = useState('')
  const [selectedSlug, setSelectedSlug] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [printMode, setPrintMode] = useState('')
  const selected = useMemo(() => products.find(product => product.slug === selectedSlug) || null, [products, selectedSlug])

  useEffect(setMetaNoIndex, [])
  useEffect(() => {
    const finishPrint = () => { document.body.classList.remove('qr-print-mode'); setPrintMode('') }
    window.addEventListener('afterprint', finishPrint)
    return () => window.removeEventListener('afterprint', finishPrint)
  }, [])
  useLayoutEffect(() => {
    if (printMode) {
      document.body.classList.add('qr-print-mode')
      requestAnimationFrame(() => window.print())
    }
  }, [printMode])

  async function signIn(event) {
    event.preventDefault()
    setBusy(true); setError(''); setNotice('')
    try {
      if (!apiKey) throw new Error('Firebase web API key is missing. Add VITE_FIREBASE_API_KEY to the Vercel Production environment and rebuild.')
      const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${encodeURIComponent(apiKey)}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, returnSecureToken: true }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error('Firebase sign-in failed. Check the account and password, then try again.')
      setIdToken(data.idToken)
      setAdminUid(data.localId)
      const pending = readPendingBatch(data.localId)
      setPendingBatch(pending)
      if (pending) setCount(String(pending.count))
      setPassword('')
      setNotice('Signed in. Product generation is available only to an account with the admin claim.')
    } catch (err) { setError(err.message || 'Could not sign in.') }
    finally { setPassword(''); setBusy(false) }
  }

  async function generateBatch(event) {
    event.preventDefault()
    if (products.length && !pendingBatch && !window.confirm('The currently displayed codes will be replaced. Confirm their CSV is saved before continuing. Generate another live product batch?')) return
    const batchSize = pendingBatch?.count || Number(count)
    if (!Number.isInteger(batchSize) || batchSize < 1 || batchSize > 200) {
      setError('Choose a whole number from 1 to 200.')
      return
    }
    if (!pendingBatch && !window.confirm(`Generate ${batchSize} permanent products in the live DevonyX database? An encrypted recovery copy will be accessible only to the creating admin. Save the CSV securely and keep each printed QR paired with its code.`)) return
    const request = pendingBatch || { batchId: crypto.randomUUID(), count: batchSize }
    try { localStorage.setItem(`qrAdminPendingBatch:${adminUid}`, JSON.stringify(request)) } catch {}
    setPendingBatch(request)
    setBusy(true); setError(''); setNotice('')
    try {
      const response = await fetch('/api/qr/admin/generate', {
        method: 'POST', cache: 'no-store', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${idToken}` },
        body: JSON.stringify({ count: batchSize, batchId: request.batchId }),
      })
      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.error || 'Could not generate this batch. Sign in again or check administrator access.')
      }
      const batch = parseCsv(await response.text(), batchSize)
      const csv = `\uFEFFslug,redirect_url,activation_code\r\n${batch.map(item => `${item.slug},${item.redirectUrl},${item.activationCode}`).join('\r\n')}`
      setProducts(batch)
      setCsvContent(csv)
      setSelectedSlug(batch[0]?.slug || '')
      const date = new Date().toISOString().slice(0, 10)
      downloadText(`devonyx-qr-products-${date}.csv`, 'text/csv;charset=utf-8', csv)
      setNotice(`Batch ready: ${batch.length} products. The request ID is saved on this device so you can recover the same CSV later. Store it securely before packing.`)
    } catch (err) {
      setError(`${err.message || 'Could not generate this batch.'} Retry with the same batch request; do not start a new one.`)
    } finally { setBusy(false) }
  }

  function downloadSelectedQr() {
    if (!selected) return
    const svg = document.getElementById(`batch-qr-${selected.slug}`)
    if (!svg) { setError('The QR image is not ready yet. Please try again.'); return }
    const serialized = new XMLSerializer().serializeToString(svg)
    downloadText(`devonyx-${selected.slug}.svg`, 'image/svg+xml;charset=utf-8', serialized)
  }

  function clearBatch() {
    if (!window.confirm('Clear the displayed activation codes? This does not delete the products from Firestore. Continue only after the CSV is saved securely.')) return
    setProducts([]); setCsvContent(''); setSelectedSlug(''); setError(''); setNotice('The codes were cleared from this screen. The batch remains recoverable using its saved request ID.')
  }

  function startNewBatch() {
    if (!window.confirm('Start a different batch? Save the current CSV first. The existing products stay in Firestore and the old batch will no longer be preselected for recovery.')) return
    try { localStorage.removeItem(`qrAdminPendingBatch:${adminUid}`) } catch {}
    setPendingBatch(null); setProducts([]); setCsvContent(''); setSelectedSlug(''); setCount('25'); setError(''); setNotice('Ready to generate a new batch.')
  }

  function signOut() {
    setIdToken(''); setAdminUid(''); setPendingBatch(null); setPassword(''); setProducts([]); setCsvContent(''); setSelectedSlug(''); setError(''); setNotice('Signed out. Batch codes were cleared from this browser tab.')
  }

  return <main className="qr-local-test"><div className="qr-local-test-wrap"><Link to="/google-review-qr" className="qr-back"><ArrowLeft size={14}/> Google Review QR</Link><section className="qr-local-card qr-batch-card">
    <span className="qr-setup-icon"><QrCode size={22}/></span><span className="qr-eyebrow"><span/> DEVONYX ADMIN</span><h1>Prepare product QR codes</h1>
    <p className="qr-local-warning"><ShieldCheck size={16}/> Each generation creates permanent records in the live <b>luxxglow</b> database. The server keeps an encrypted recovery copy accessible only to the creating admin. Download and securely store the CSV before printing.</p>
    {!idToken ? <form onSubmit={signIn} className="qr-local-form"><label htmlFor="batch-admin-email">Administrator email</label><input id="batch-admin-email" type="email" autoComplete="username" value={email} onChange={event => setEmail(event.target.value)} required/><label htmlFor="batch-admin-password">Password</label><input id="batch-admin-password" type="password" autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)} required/><button className="qr-button qr-button-primary qr-full" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'} <LogIn size={15}/></button><small>Your password is sent to Firebase Authentication and is not stored by this page.</small></form> : <>
      <div className="qr-local-auth"><p><Check size={15}/> Signed in. Your ID token stays in this browser tab and is sent to the Firebase Function for admin verification.</p><button className="qr-local-signout" onClick={signOut}><LogOut size={14}/> Sign out and clear this tab</button></div>
      <form className="qr-batch-form" onSubmit={generateBatch}><label htmlFor="batch-count">Number of product pairs</label><input id="batch-count" type="number" min="1" max="200" step="1" value={pendingBatch ? String(pendingBatch.count) : count} onChange={event => setCount(event.target.value)} disabled={busy || Boolean(pendingBatch)} required/><small>{pendingBatch ? 'This request ID is saved on this device. Retry recovers these exact products and codes.' : 'Generate between 1 and 200 unique redirect URLs and activation codes.'}</small><button className="qr-button qr-button-primary" disabled={busy}>{busy ? 'Generating batch…' : pendingBatch ? products.length ? 'Download this batch again' : 'Retry / recover this batch' : 'Generate batch and download CSV'} <Download size={15}/></button></form>
    </>}
    {error && <p className="qr-error" role="alert">{error}</p>}{notice && <p className="qr-batch-notice" role="status">{notice}</p>}
    {selected && <div className="qr-batch-selected"><div className="qr-batch-qr"><QRCodeSVG id={`batch-qr-${selected.slug}`} value={selected.redirectUrl} size={208} level="M" includeMargin/><span>PRINT THIS QR ON THE STAND</span></div><div className="qr-batch-details"><h2>Product {products.findIndex(item => item.slug === selected.slug) + 1} of {products.length}</h2><p>Keep the one-time code separate from the public QR. Put it inside the matching package.</p><label>Activation code for inside the package</label><code>{selected.activationCode}</code><label>Permanent QR destination</label><a href={selected.redirectUrl} target="_blank" rel="noreferrer">{selected.redirectUrl}</a><button className="qr-button qr-button-light" onClick={downloadSelectedQr}><Download size={15}/> Download this QR as SVG</button></div></div>}
    {products.length > 0 && <div className="qr-batch-table-wrap"><div className="qr-batch-table-head"><h2>Generated product pairs ({products.length})</h2><button className="qr-local-signout" onClick={clearBatch}><Trash2 size={14}/> Clear codes from screen</button></div><p className="qr-batch-print-note">Print QR labels and activation-code inserts separately, then pair them in the same product order. Test a print before packing the batch. Securely store the CSV before moving to another batch.</p><div className="qr-batch-actions"><button className="qr-button qr-button-light" onClick={() => downloadText(`devonyx-qr-products-${new Date().toISOString().slice(0, 10)}.csv`, 'text/csv;charset=utf-8', csvContent)}><Download size={15}/> Download CSV again</button><button className="qr-button qr-button-light" onClick={() => setPrintMode('qrs')}><QrCode size={15}/> Print QR labels only</button><button className="qr-button qr-button-light" onClick={() => setPrintMode('codes')}><Download size={15}/> Print activation inserts only</button><button className="qr-button qr-button-light" onClick={startNewBatch}>Start another batch</button></div><div className="qr-batch-table-scroll"><table className="qr-batch-table"><thead><tr><th>Product</th><th>QR URL</th><th>Activation code</th><th>QR file</th></tr></thead><tbody>{products.map((item, index) => <tr key={item.slug} className={item.slug === selectedSlug ? 'selected' : ''}><td>{index + 1}</td><td><code>{item.redirectUrl}</code></td><td><code>{item.activationCode}</code></td><td><button onClick={() => setSelectedSlug(item.slug)}>View / download</button></td></tr>)}</tbody></table></div></div>}
    {printMode && createPortal(<div className={`qr-batch-print qr-batch-print-${printMode}`}>{products.map((item, index) => <article className="qr-batch-print-card" key={item.slug}><span>DEVONYX REVIEW QR</span>{printMode === 'qrs' ? <><QRCodeSVG value={item.redirectUrl} size={190} level="M" includeMargin/><small>Scan to connect this stand to your business</small></> : <><b>ONE-TIME ACTIVATION CODE</b><code>{item.activationCode}</code><small>Go to devonyx.in/setup to activate your stand</small></>}<em>Product {index + 1} of {products.length}</em></article>)}</div>, document.body)}
    <p className="qr-local-help">Admin access is checked by the server for every batch. If a request times out after generation began, inspect the database and securely retain any downloaded CSV before trying again; the server may already have created the products.</p>
  </section></div></main>
}
