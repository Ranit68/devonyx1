import test from 'node:test'
import assert from 'node:assert/strict'
import { decryptBatchCsv, encryptBatchCsv, normalizeActivationCode, validateReviewUrl } from '../functions/qr/core.js'

test('activation codes normalize case, spaces, and separators consistently', () => {
  assert.equal(normalizeActivationCode('abcde-fghij klmno-pqrst'), 'ABCDEFGHIJKLMNOPQRST')
})

test('accepts supported Google review URL formats', () => {
  for (const url of [
    'https://g.page/r/AbCdEf/review',
    'https://search.google.com/local/writereview?placeid=abc',
    'https://www.google.com/maps/place/example/reviews',
    'https://maps.app.goo.gl/aBc123',
  ]) assert.equal(validateReviewUrl(url), true, url)
})

test('rejects external, unsafe, malformed, and non-review Google URLs', () => {
  for (const url of [
    'http://google.com/maps/place/a',
    'https://google.com.evil.test/maps/place/a',
    'https://example.com/review',
    'javascript:alert(1)',
    'data:text/html,hello',
    'https://google.com/search?q=business',
    'https://user:pass@google.com/maps/place/a',
    'not a URL',
  ]) assert.equal(validateReviewUrl(url), false, url)
})

test('batch CSV recovery encryption round-trips and rejects tampering', () => {
  process.env.QR_CODE_PEPPER = 'test-pepper-with-at-least-32-characters-long'
  const csv = 'slug,redirect_url,activation_code\r\nabcdefghijklmnop,https://devonyx.in/r/abcdefghijklmnop,ABCDE-FGHIJ-KLMNP-QRSTU'
  const encrypted = encryptBatchCsv(csv)
  assert.notEqual(encrypted.encryptedCsv, Buffer.from(csv).toString('base64'))
  assert.equal(decryptBatchCsv(encrypted), csv)
  assert.throws(() => decryptBatchCsv({ ...encrypted, csvTag: Buffer.alloc(16).toString('base64') }))
})
