const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const ts = require('typescript')

function loadModule(file, overrides = {}) {
  const exports = {}
  const source = fs.readFileSync(path.join(__dirname, '..', file), 'utf8')
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  })
  vm.runInNewContext(outputText, { exports, ...overrides })
  return exports
}

test('CMS JSON-LD cannot terminate the enclosing script and preserves text', () => {
  const { serializeJsonLd } = loadModule('lib/seo.ts')
  const data = { name: '</script><script>alert("test")</script>', text: 'A < B & C' }
  const encoded = serializeJsonLd(data)
  assert.equal(encoded.includes('<'), false)
  assert.deepEqual(JSON.parse(encoded), data)
})

test('webhook values remain text inside HTML emails', () => {
  const { escapeHtml } = loadModule('lib/escapeHtml.ts')
  assert.equal(escapeHtml('<img src=x onerror="test"> & \'name\''),
    '&lt;img src=x onerror=&quot;test&quot;&gt; &amp; &#39;name&#39;')
  assert.equal(escapeHtml('Remus & Team'), 'Remus &amp; Team')
  assert.equal(escapeHtml(null), '')
})

test('analytics recovers from failed initialisation and shares successful setup', async () => {
  let schemaQueries = 0
  let inserts = 0
  const sql = async () => { inserts += 1; return [] }
  sql.query = async () => {
    schemaQueries += 1
    if (schemaQueries === 1) throw new Error('Temporary database outage')
    return []
  }
  const { insertInsightEvent } = loadModule('lib/insights/server.ts', {
    process: { env: { DATABASE_URL: 'mock-only' } },
    require: (name) => {
      assert.equal(name, '@neondatabase/serverless')
      return { neon: () => sql }
    },
  })
  const event = {
    eventName: 'page_view', sessionId: 'test-session', visitorId: 'test-visitor',
    path: '/', referrer: null, campaign: {}, properties: {}, deviceType: 'mobile', viewportWidth: 390,
  }
  await assert.rejects(insertInsightEvent(event), /Temporary database outage/)
  assert.equal(inserts, 0)
  await Promise.all([insertInsightEvent(event), insertInsightEvent(event)])
  assert.equal(schemaQueries, 4, 'one failed query then one shared table/two-index setup')
  assert.equal(inserts, 2)
  await insertInsightEvent(event)
  assert.equal(schemaQueries, 4, 'successful schema setup remains cached')
  assert.equal(inserts, 3)
})
