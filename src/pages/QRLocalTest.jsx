import { useState } from 'react'
import { Link } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { ArrowLeft, Check, ExternalLink, LogIn, LogOut, QrCode, RefreshCw, ShieldCheck } from 'lucide-react'

const apiKey = import.meta.env.VITE_FIREBASE_API_KEY

export default function QRLocalTestPage() {
  const [batchId] = useState(() => {
    try {
      const pending = sessionStorage.getItem('qrLocalTestBatchId')
      if (pending) return pending
      const created = crypto.randomUUID()
      sessionStorage.setItem('qrLocalTestBatchId', created)
      return created
    } catch { return crypto.randomUUID() }
  })
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [idToken, setIdToken] = useState('')
  const [product, setProduct] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function signIn(event) {
    event.preventDefault()
    setBusy(true); setError('')
    try {
      if (!apiKey) throw new Error('Local Firebase web config is missing. Set VITE_FIREBASE_API_KEY in .env.local and restart Vite.')
      const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${encodeURIComponent(apiKey)}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, returnSecureToken: true }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error('Firebase sign-in failed. Check the account and password, then try again.')
      setIdToken(data.idToken)
      setPassword('')
    } catch (err) { setError(err.message || 'Could not sign in.') }
    finally { setBusy(false) }
  }

  async function generate() {
    setBusy(true); setError('')
    try {
      const response = await fetch('/api/qr/admin/generate', {
        method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${idToken}` },
        body: JSON.stringify({ count: 1, batchId }),
      })
      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.error || 'Could not generate a test QR. Confirm this account has the Firebase admin claim.')
      }
      const csv = (await response.text()).trim().split(/\r?\n/)
      const [slug, permanentUrl, activationCode] = csv[1].split(',')
      if (!slug || !permanentUrl || !activationCode) throw new Error('The server returned an invalid product export.')
      sessionStorage.removeItem('qrLocalTestBatchId')
      setProduct({ slug, permanentUrl, activationCode, localUrl: `${window.location.origin}/r/${slug}` })
    } catch (err) { setError(err.message || 'Could not generate a test QR.') }
    finally { setBusy(false) }
  }

  function signOut() { setIdToken(''); setProduct(null); setError('') }

  return <main className="qr-local-test"><div className="qr-local-test-wrap"><Link to="/google-review-qr" className="qr-back"><ArrowLeft size={14}/> Product page</Link><section className="qr-local-card"><span className="qr-setup-icon"><QrCode size={22}/></span><span className="qr-eyebrow"><span/> LOCAL TEST TOOL</span><h1>Make a test QR</h1><p className="qr-local-warning"><ShieldCheck size={16}/> This tool calls the deployed Firebase Function and creates one product in project <b>luxxglow</b>. Use it only for a test; the generated product remains in Firestore.</p>
      {!idToken ? <form onSubmit={signIn} className="qr-local-form"><label htmlFor="qr-admin-email">Firebase admin email</label><input id="qr-admin-email" type="email" autoComplete="username" value={email} onChange={e=>setEmail(e.target.value)} required/><label htmlFor="qr-admin-password">Password</label><input id="qr-admin-password" type="password" autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} required/><button className="qr-button qr-button-primary qr-full" disabled={busy}>{busy?'Signing in…':'Sign in to Firebase'} <LogIn size={15}/></button><small>Your password is sent directly to Firebase Authentication and is not stored by this site.</small></form> : <div className="qr-local-auth"><p><Check size={15}/> Signed in. Your ID token stays in this browser tab and is sent only to the Firebase Function.</p>{!product&&<button className="qr-button qr-button-primary qr-full" onClick={generate} disabled={busy}>{busy?'Generating…':'Generate one test product'} <QrCode size={16}/></button>}<button className="qr-local-signout" onClick={signOut}><LogOut size={14}/> Sign out and clear session</button></div>}
      {error&&<p className="qr-error" role="alert">{error}</p>}
      {product&&<div className="qr-local-result"><div className="qr-local-qr"><QRCodeSVG value={product.localUrl} size={220} level="M" includeMargin/><p>Local scan URL</p></div><div className="qr-local-data"><h2>Test product created</h2><p>Scan this QR while your local site is running. It looks up the slug in the deployed Firestore through the live Function.</p><label>Activation code</label><code>{product.activationCode}</code><label>Local QR destination</label><a href={product.localUrl} target="_blank" rel="noreferrer">{product.localUrl} <ExternalLink size={13}/></a><label>Permanent printed destination</label><a href={product.permanentUrl} target="_blank" rel="noreferrer">{product.permanentUrl} <ExternalLink size={13}/></a><Link className="qr-button qr-button-light" to="/setup">Continue to activation <ArrowLeft size={14}/></Link><button className="qr-local-signout" onClick={()=>{setProduct(null);setError('')}}><RefreshCw size={14}/> Generate another test product</button></div></div>}
      <p className="qr-local-help">This local utility is available only in Vite development mode. Product records created here are not automatically removed.</p>
    </section></div></main>
}
