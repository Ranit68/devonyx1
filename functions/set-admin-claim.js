import { applicationDefault, cert, getApps, initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'

const credentials = process.env.FIREBASE_SERVICE_ACCOUNT
const app = getApps()[0] || initializeApp({ credential: credentials ? cert(JSON.parse(credentials)) : applicationDefault() })
const uid = process.argv[2]
if (!uid) {
  console.error('Usage: node functions/set-admin-claim.js FIREBASE_AUTH_UID [--revoke]')
  process.exit(1)
}
const auth = getAuth(app)
const user = await auth.getUser(uid)
const claims = { ...user.customClaims }
const revoke = process.argv[3] === '--revoke'
if (revoke) delete claims.admin
else claims.admin = true
await auth.setCustomUserClaims(uid, claims)
await auth.revokeRefreshTokens(uid)
console.log(`Administrator access ${revoke ? 'revoked for' : 'granted to'} Firebase Auth UID ${uid}. Existing tokens were revoked.`)
