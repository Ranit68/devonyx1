import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowRight, Check, ChevronDown, CircleHelp, ExternalLink, QrCode, ShieldCheck, Smartphone, Store } from 'lucide-react'

const market = {
  amazon: import.meta.env.VITE_QR_AMAZON_URL || '',
  flipkart: import.meta.env.VITE_QR_FLIPKART_URL || '',
  meesho: import.meta.env.VITE_QR_MEESHO_URL || '',
}
const api = '/api/qr'

function Meta({ title, description, noindex = false }) {
  useEffect(() => {
    document.title = title
    let meta = document.querySelector('meta[name="description"]')
    if (!meta) { meta = document.createElement('meta'); meta.name = 'description'; document.head.append(meta) }
    meta.content = description
    let robots = document.querySelector('meta[name="robots"]')
    if (!robots) { robots = document.createElement('meta'); robots.name = 'robots'; document.head.append(robots) }
    robots.content = noindex ? 'noindex, nofollow' : 'index, follow'
    const canonical = document.querySelector('link[rel="canonical"]') || document.createElement('link')
    canonical.rel = 'canonical'
    canonical.href = `https://devonyx.in${window.location.pathname}`
    if (!canonical.parentNode) document.head.append(canonical)
    const ogTitle = document.querySelector('meta[property="og:title"]') || document.createElement('meta')
    ogTitle.setAttribute('property', 'og:title'); ogTitle.content = title
    if (!ogTitle.parentNode) document.head.append(ogTitle)
    const ogDescription = document.querySelector('meta[property="og:description"]') || document.createElement('meta')
    ogDescription.setAttribute('property', 'og:description'); ogDescription.content = description
    if (!ogDescription.parentNode) document.head.append(ogDescription)
    return () => { robots.content = 'index, follow' }
  }, [title, description, noindex])
  return null
}

function Mark() {
  return <Link to="/" className="flex items-center gap-2.5 font-semibold tracking-tight text-[#171720]" aria-label="DevonyX home"><span className="grid h-9 w-9 place-items-center rounded-xl bg-[#3448d8] text-white"><QrCode size={19}/></span><span>DevonyX<span className="text-[#3448d8]">.</span></span></Link>
}

function ProductNav() {
  return <header className="qr-nav"><div className="qr-wrap qr-nav-inner"><Mark/><nav aria-label="Main navigation"><a href="/#services">Services</a><a href="/#about">About</a><a href="/#contact">Contact</a><Link to="/google-review-qr">Review QR</Link><Link className="qr-nav-setup" to="/setup">Setup</Link><Link className="qr-nav-admin" to="/admin">Admin panel</Link><Link className="qr-nav-cta" to="/setup">Activate a product <ArrowRight size={15}/></Link></nav></div></header>
}

function PageFrame({ children, title, description, noindex = false }) {
  return <div className="qr-app"><Meta title={title} description={description} noindex={noindex}/><ProductNav/>{children}<footer className="qr-footer"><div className="qr-wrap"><Mark/><p>DevonyX · Independent product by DevonyX. Not affiliated with or endorsed by Google.</p><Link to="/">Visit devonyx.in <ArrowRight size={14}/></Link></div></footer></div>
}

export function GoogleReviewLanding() {
  const faqs = [
    ['Do I need to contact DevonyX after buying?', 'No. Enter the one-time activation code included inside your package and follow the setup steps.'],
    ['Where do I find my Google review link?', 'Open your Google Business Profile, choose “Ask for reviews” or “Get more reviews”, and copy the link Google provides. You do not need to share your Google password.'],
    ['Can I change the destination later?', 'Contact DevonyX support with your order details. A QR destination can be updated by an administrator after verifying ownership.'],
    ['Does the stand include NFC?', 'This page describes the QR product only. NFC support depends on the specific marketplace listing; check that listing before ordering.'],
    ['Does this guarantee more reviews?', 'No. The QR makes your review link easy to reach. Customers choose whether to leave an honest review.'],
  ]
  return <PageFrame title="Google Review QR Stand for Local Businesses | DevonyX" description="Help customers reach your Google review page with a permanent, easy-to-scan QR stand. Buy, activate in minutes, and invite every customer to share honest feedback.">
    <main>
      <section className="qr-hero"><div className="qr-wrap qr-hero-grid"><div><span className="qr-eyebrow"><span/> SIMPLE SETUP FOR LOCAL BUSINESS</span><h1>Make it easier for customers to <em>find you on Google.</em></h1><p className="qr-lead">A ready-to-use review QR stand for your counter. Buy it, activate it with the code in your package, and let customers scan to reach your Google review page.</p><div className="qr-actions"><a className="qr-button qr-button-primary" href="#buy">Shop the QR stand <ArrowRight size={17}/></a><Link className="qr-button qr-button-light" to="/setup">Already have one? Activate <ArrowRight size={17}/></Link></div><div className="qr-proof"><span><ShieldCheck size={16}/> One-time self-service activation</span><span><Smartphone size={16}/> Works with any smartphone camera</span></div></div><div className="qr-product-scene" aria-label="Illustration of a QR review stand on a counter"><div className="qr-scene-glow"/><div className="qr-counter"/><div className="qr-stand"><div className="qr-stand-top"><span>THANK YOU</span><QrCode size={105} strokeWidth={1.3}/><b>Share your experience</b><small>Scan to leave a Google review</small></div><div className="qr-stand-foot"/></div><div className="qr-float-note"><span className="qr-float-dot"/><span>Ready in minutes<br/><b>No app required</b></span></div><span className="qr-scene-label">DEVONYX REVIEW STAND · QR EDITION</span></div></div></section>
      <section className="qr-trust"><div className="qr-wrap qr-trust-inner"><span>MADE FOR THE MOMENTS AFTER GREAT SERVICE</span><div>{['Shops & salons','Restaurants','Clinics','Hotels','Photographers'].map(x => <span key={x}><Store size={15}/>{x}</span>)}</div></div></section>
      <section className="qr-section"><div className="qr-wrap"><div className="qr-section-head"><span className="qr-eyebrow"><span/> THREE SIMPLE STEPS</span><h2>From package to <em>review-ready.</em></h2><p>Your permanent QR is already set up. Just connect it to your business.</p></div><div className="qr-steps">{[['01','Buy your stand','Choose a listing from your preferred marketplace. Your setup code is packed inside.'],['02','Activate it','Enter the code and your Google review link. Setup takes only a few minutes.'],['03','Invite every customer','Place the stand where customers can scan it and share an honest review.']].map(([num,title,copy])=><article className="qr-step" key={num}><span>{num}</span><div><h3>{title}</h3><p>{copy}</p></div><ArrowRight size={19}/></article>)}</div></div></section>
      <section className="qr-benefits"><div className="qr-wrap qr-benefit-grid"><div><span className="qr-eyebrow"><span/> BUILT FOR YOUR COUNTER</span><h2>A small prompt that makes the next step <em>clear.</em></h2><p>Keep your review link visible at the point of service. Customers scan with their camera and land on the destination you choose during activation.</p><Link className="qr-text-link" to="/setup">Activate your QR stand <ArrowRight size={16}/></Link></div><div className="qr-benefit-list"><div><span><QrCode/></span><div><h3>Permanent QR destination</h3><p>Your printed code stays the same if your review link needs an authorized update.</p></div></div><div><span><Smartphone/></span><div><h3>No customer app needed</h3><p>Most phone cameras can open the link directly. Customers choose whether to leave a review.</p></div></div><div><span><ShieldCheck/></span><div><h3>Private self-service setup</h3><p>Your activation code is used once. We never ask for a Google password or profile access.</p></div></div></div></div></section>
      <section className="qr-market" id="buy"><div className="qr-wrap qr-market-inner"><div><span className="qr-eyebrow"><span/> GET YOUR DEVONYX QR STAND</span><h2>Choose where you <em>shop.</em></h2><p>Marketplace listings will appear here as they become available. Verify product details on the listing before ordering.</p></div><div className="qr-market-cards">{[['Amazon','amazon'],['Flipkart','flipkart'],['Meesho','meesho']].map(([name,key])=><div className={`qr-market-card ${market[key]?'':'is-disabled'}`} key={key}><span>{name}</span>{market[key]?<a href={market[key]} target="_blank" rel="noreferrer">Shop on {name}<ExternalLink size={15}/></a>:<span className="qr-coming">Listing coming soon</span>}</div>)}</div><p className="qr-market-note">Only official DevonyX marketplace links will be shown here. No listing URL is currently configured.</p></div></section>
      <section className="qr-section qr-faq"><div className="qr-wrap qr-faq-grid"><div><span className="qr-eyebrow"><span/> GOOD TO KNOW</span><h2>Questions, <em>answered.</em></h2><p>Need a hand? <a href="/#contact">Contact DevonyX</a>.</p></div><div>{faqs.map(([q,a])=><details key={q}><summary>{q}<ChevronDown size={17}/></summary><p>{a}</p></details>)}</div></div></section>
      <section className="qr-bottom-cta"><div className="qr-wrap"><div><h2>Have your stand already?</h2><p>Connect it to your business in a few simple steps.</p></div><Link className="qr-button qr-button-dark" to="/setup">Activate your product <ArrowRight size={17}/></Link></div></section>
    </main>
  </PageFrame>
}

export function SetupPage() {
  const [code, setCode] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [reviewUrl, setReviewUrl] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [stage, setStage] = useState(1)
  const [confirmed, setConfirmed] = useState(false)
  const validGoogle = useMemo(() => {
    try {
      const u = new URL(reviewUrl)
      if (u.protocol !== 'https:' || u.username || u.password || u.port) return false
      const host = u.hostname.toLowerCase()
      if (host === 'g.page') return /^\/r\/[A-Za-z0-9_-]+\/review\/?$/.test(u.pathname)
      if (host === 'maps.app.goo.gl') return /^\/[A-Za-z0-9_-]+\/?$/.test(u.pathname)
      return (host === 'google.com' || host.endsWith('.google.com')) && /(?:\/maps(?:\/|$)|\/local\/writereview(?:\/|$)|\/review(?:\/|$)|\/reviews(?:\/|$))/i.test(u.pathname)
    } catch { return false }
  }, [reviewUrl])
  async function submit(event) {
    event.preventDefault(); setError(''); setBusy(true)
    try {
      const response = await fetch(`${api}/activate`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ activationCode: code, businessName, reviewUrl }) })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'We could not activate that code. Please check it and try again.')
      sessionStorage.setItem('qrSuccessBusiness', businessName.trim())
      sessionStorage.setItem('qrSuccessUrl', data.redirectUrl)
      setConfirmed(true)
    } catch (err) { setError(err.message || 'Connection problem. Please try again.') }
    finally { setBusy(false) }
  }
  return <PageFrame title="Activate Your Google Review QR Stand | DevonyX" description="Connect your DevonyX QR stand to your business's Google review link." noindex>
    <main className="qr-setup"><div className="qr-wrap qr-setup-wrap"><Link to="/google-review-qr" className="qr-back">← Google Review QR</Link><div className="qr-setup-card"><div className="qr-setup-icon"><QrCode size={23}/></div><span className="qr-eyebrow"><span/> PRODUCT ACTIVATION</span><h1>{confirmed ? 'Your stand is ready.' : 'Let’s connect your stand.'}</h1><p className="qr-setup-intro">{confirmed ? 'Your QR code now opens your Google review page.' : 'Follow these steps to connect your permanent QR code to your business.'}</p>{confirmed ? <div className="qr-success-box" role="status"><span className="qr-success-icon"><Check/></span><h2>{businessName.trim()} is connected</h2><p>Place your stand near checkout or another easy-to-see spot. Invite every customer to share an honest review.</p><a className="qr-button qr-button-primary" href={sessionStorage.getItem('qrSuccessUrl') || '#'} target="_blank" rel="noreferrer">Test your QR destination <ExternalLink size={16}/></a><Link className="qr-text-link" to="/qr-success">See placement tips <ArrowRight size={15}/></Link></div> : <><div className="qr-progress" aria-label={`Step ${stage} of 2`}><span className={stage >= 1?'active':''}>1</span><i/><span className={stage >= 2?'active':''}>2</span><small>{stage===1?'Activation code':'Business details'}</small></div>{stage === 1 ? <form onSubmit={e=>{e.preventDefault();setError(''); if(code.replace(/[\s-]/g,'').length!==20){setError('Enter all 20 characters of the activation code inside your package.');return}setStage(2)}}><label htmlFor="activation-code">Activation code</label><input id="activation-code" autoComplete="one-time-code" value={code} onChange={e=>setCode(e.target.value.toUpperCase())} placeholder="ABCDE-FGHIJ-KLMNO-PQRST" maxLength={27} required/><small>Find the one-time code on the card inside your package. It is not the QR code on the stand.</small><button className="qr-button qr-button-primary qr-full" type="submit">Continue <ArrowRight size={16}/></button></form> : <form onSubmit={submit}><div className="qr-edit-code"><span>Activation code entered</span><button type="button" onClick={()=>setStage(1)}>Change code</button></div><label htmlFor="business-name">Business name</label><input id="business-name" value={businessName} onChange={e=>setBusinessName(e.target.value)} maxLength={100} placeholder="e.g. Meera Hair Studio" required/><label htmlFor="review-link">Google review link</label><input id="review-link" type="url" inputMode="url" value={reviewUrl} onChange={e=>setReviewUrl(e.target.value)} maxLength={2048} placeholder="https://g.page/r/.../review" required aria-describedby="review-hint"/><small id="review-hint">In your Google Business Profile, choose “Ask for reviews” and copy the link. Never enter your Google password.</small>{reviewUrl&&validGoogle&&<a className="qr-preview-link" href={reviewUrl} target="_blank" rel="noreferrer">Preview this link <ExternalLink size={14}/></a>}{reviewUrl&&!validGoogle&&<small className="qr-field-error">Use a Google review link from your Business Profile.</small>}<div className="qr-consent"><ShieldCheck size={18}/><span>This will connect your stand to the business and review link above. Customers will all see the same destination.</span></div><button className="qr-button qr-button-primary qr-full" type="submit" disabled={busy||!validGoogle||!businessName.trim()}>{busy?'Activating…':'Activate my QR stand'} {!busy&&<ArrowRight size={16}/>}</button></form>}{error&&<p className="qr-error" role="alert">{error}</p>}<p className="qr-help"><CircleHelp size={16}/> Having trouble? <a href="/#contact">Contact DevonyX support</a></p></>}</div></div></main>
  </PageFrame>
}

export function QRSuccessPage() {
  return <PageFrame title="Your QR Stand Is Ready | DevonyX" description="Your Google review QR stand is activated. See simple placement tips." noindex><main className="qr-setup"><div className="qr-wrap qr-setup-wrap"><div className="qr-setup-card qr-success-page"><span className="qr-success-icon"><Check/></span><span className="qr-eyebrow"><span/> ALL SET</span><h1>Your QR stand is ready.</h1><p>Place it somewhere visible where customers finish their visit, such as a checkout counter, reception desk, or table.</p><div className="qr-tip-list"><p><Check size={16}/> Keep the QR code facing customers.</p><p><Check size={16}/> Invite all customers to leave an honest review.</p><p><Check size={16}/> Scan it yourself once to test the destination.</p></div>{sessionStorage.getItem('qrSuccessUrl')&&<a className="qr-button qr-button-primary" href={sessionStorage.getItem('qrSuccessUrl')} target="_blank" rel="noreferrer">Test your QR destination <ExternalLink size={16}/></a>}<Link to="/google-review-qr" className="qr-text-link">Back to the product page <ArrowRight size={15}/></Link></div></div></main></PageFrame>
}

export function QRRedirectPage() {
  const { slug } = useParams()
  const [state, setState] = useState('loading')
  useEffect(() => {
    let mounted = true
    fetch(`${api}/resolve/${encodeURIComponent(slug)}`).then(async response => ({ response, data: await response.json() })).then(({data}) => {
      if (!mounted) return
      if (data.status === 'activated' && data.reviewUrl) window.location.replace(data.reviewUrl)
      else setState(data.status || 'unavailable')
    }).catch(() => mounted && setState('unavailable'))
    return () => { mounted = false }
  }, [slug])
  if (state === 'unactivated') return <Navigate to="/setup" replace />
  return <PageFrame title="Open Your Google Review Link | DevonyX" description="This DevonyX QR stand links to a business's Google review page." noindex><main className="qr-setup"><div className="qr-wrap qr-setup-wrap"><div className="qr-setup-card qr-redirect-card"><span className="qr-setup-icon"><QrCode size={23}/></span>{state === 'loading' ? <><h1>Opening the review page…</h1><p>Please wait a moment.</p></> : state==='disabled'||state==='revoked' ? <><h1>This QR is unavailable.</h1><p>Please contact the business that provided this stand.</p></> : <><h1>QR not found.</h1><p>Check that you scanned the QR printed on your DevonyX product.</p><Link to="/google-review-qr">Learn about DevonyX QR stands <ArrowRight size={15}/></Link></>}</div></div></main></PageFrame>
}
