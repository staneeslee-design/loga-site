// Compiles src/site/templates/*.html (page markup) into JSON used by the runtime.
// Runs automatically before dev/build (npm run templates).
const fs = require('fs')
const path = require('path')
let parse5
try {
  parse5 = require('parse5')
} catch {
  console.log('parse5 not installed – using the compiled templates already in src/site/templates')
  process.exit(0)
}
const dir = process.argv[2] || path.join(__dirname, '../src/site/templates')
const DROP_WS = new Set(['select', 'ul', 'ol', 'dl', 'table', 'thead', 'tbody', 'tr', 'svg', 'g', 'defs', 'linearGradient', 'radialGradient', 'clipPath'])
function conv(node, parentTag) {
  if (node.nodeName === '#text') {
    if (/^\s*$/.test(node.value)) {
      if (DROP_WS.has(parentTag)) return null
      return node.value.includes('\n') ? '\n' : ' '
    }
    return node.value
  }
  if (node.nodeName === '#comment') return null
  if (!node.tagName) return null
  const attrs = {}
  for (const a of node.attrs || []) {
    if (a.name.startsWith('hint-')) continue
    attrs[a.name] = a.value
  }
  const kids = []
  const src = node.tagName === 'template' ? node.content.childNodes : node.childNodes || []
  for (const c of src) {
    const r = conv(c, node.tagName)
    if (r !== null) kids.push(r)
  }
  return [node.tagName, attrs, kids]
}
for (const f of fs.readdirSync(dir).filter((f) => f.endsWith('.html'))) {
  const html = fs.readFileSync(path.join(dir, f), 'utf8')
  const frag = parse5.parseFragment(html)
  const out = []
  for (const c of frag.childNodes) {
    const r = conv(c, 'root')
    if (r !== null) out.push(r)
  }
  fs.writeFileSync(path.join(dir, f.replace('.html', '.json')), JSON.stringify(out))
  console.log(f, (JSON.stringify(out).length / 1024) | 0, 'KB ast')
}
