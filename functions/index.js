import express from 'express'
import { onRequest } from 'firebase-functions/v2/https'
import { defineSecret, defineString } from 'firebase-functions/params'
import { onInit } from 'firebase-functions/v2/core'
import { createQrRouter } from './qr/core.js'

const qrCodePepper = defineSecret('QR_CODE_PEPPER')
const publicBaseUrl = defineString('PUBLIC_BASE_URL', { default: 'https://devonyx.in' })
onInit(() => { process.env.PUBLIC_BASE_URL = publicBaseUrl.value() })

const app = express()
app.set('trust proxy', 1)
app.disable('x-powered-by')
app.use(express.json({ limit: '4kb' }))
const qrRouter = createQrRouter()
app.use('/api/qr', qrRouter)
app.get('/r/:slug', (req, res, next) => {
  req.url = `/redirect/${encodeURIComponent(req.params.slug)}`
  qrRouter.handle(req, res, next)
})

export const qrApi = onRequest({ region: 'asia-south1', memory: '256MiB', maxInstances: 10, secrets: [qrCodePepper] }, app)
