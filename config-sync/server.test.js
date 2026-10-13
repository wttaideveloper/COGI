const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('fs')
const os = require('os')
const path = require('path')

const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cogi-sync-'))
process.env.DATA_DIR = dataDir
process.env.SEED_FILE = path.join(dataDir, 'no-seed.json')
const { createServer } = require('./server')

async function withServer(verify, fn) {
  const server = createServer(verify)
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
  const base = `http://127.0.0.1:${server.address().port}`
  try { await fn(base) } finally { await new Promise((resolve) => server.close(resolve)) }
}

const accept = async (token) => token === 'good'
const post = (base, body, headers = {}) => fetch(`${base}/__site-config`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body })

test('rejects writes without a bearer token', async () => {
  await withServer(accept, async (base) => {
    const res = await post(base, '{"theme":{}}')
    assert.equal(res.status, 401)
    assert.equal(fs.existsSync(path.join(dataDir, 'site-config.json')), false)
  })
})

test('rejects writes when Strapi does not accept the token', async () => {
  await withServer(accept, async (base) => {
    const res = await post(base, '{"theme":{}}', { Authorization: 'Bearer bad' })
    assert.equal(res.status, 401)
    assert.equal(fs.existsSync(path.join(dataDir, 'site-config.json')), false)
  })
})

test('rejects non-object JSON and malformed JSON', async () => {
  await withServer(accept, async (base) => {
    assert.equal((await post(base, '[1]', { Authorization: 'Bearer good' })).status, 400)
    assert.equal((await post(base, '{nope', { Authorization: 'Bearer good' })).status, 400)
  })
})

test('authorised write persists and is served publicly without auth', async () => {
  await withServer(accept, async (base) => {
    const config = { header: { logoUrl: '/uploads/logo.png' }, updatedAt: '2026-01-01T00:00:00.000Z' }
    const res = await post(base, JSON.stringify(config), { Authorization: 'Bearer good' })
    assert.equal(res.status, 200)
    const read = await fetch(`${base}/site-config.json`)
    assert.equal(read.status, 200)
    assert.deepEqual(await read.json(), config)
  })
})
