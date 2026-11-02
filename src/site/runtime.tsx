'use client'
/**
 * Template runtime: renders the design's page templates (compiled to a JSON AST)
 * with values from the page logic class (renderVals). Works on the server (SSR)
 * and in the browser (hydration + interactivity).
 *
 * AST node: string | [tag, attrs, children]
 *   {{path}}                      – value lookup in text and attributes
 *   ['sc-if', {value}, kids]      – conditional
 *   ['sc-for', {list, as}, kids]  – loop
 */
import React from 'react'

export type AstNode = string | [string, Record<string, string>, AstNode[]]
type Ctx = Record<string, any>

const WHOLE = /^\{\{\s*([\w.$]+)\s*\}\}$/
const HOLE = /\{\{\s*([\w.$]+)\s*\}\}/g

function get(ctx: Ctx, path: string): any {
  let v: any = ctx
  for (const p of path.split('.')) {
    if (v == null) return undefined
    v = v[p]
  }
  return v
}
function interp(str: string, ctx: Ctx): any {
  const m = str.match(WHOLE)
  if (m) return get(ctx, m[1])
  if (str.indexOf('{{') < 0) return str
  return str.replace(HOLE, (_, p) => {
    const v = get(ctx, p)
    return v == null ? '' : String(v)
  })
}

const EVENTS: Record<string, string> = {
  onclick: 'onClick', oninput: 'onChange', onchange: 'onChange', onkeydown: 'onKeyDown', onkeyup: 'onKeyUp',
  onsubmit: 'onSubmit', onfocus: 'onFocus', onblur: 'onBlur', onmousemove: 'onMouseMove', onmouseleave: 'onMouseLeave',
  onmouseenter: 'onMouseEnter', ontouchstart: 'onTouchStart', ontouchend: 'onTouchEnd', ontouchmove: 'onTouchMove',
  onscroll: 'onScroll', onpointerdown: 'onPointerDown', onpointerup: 'onPointerUp',
}
const ATTRS: Record<string, string> = {
  class: 'className', for: 'htmlFor', tabindex: 'tabIndex', maxlength: 'maxLength', minlength: 'minLength',
  autocomplete: 'autoComplete', inputmode: 'inputMode', readonly: 'readOnly', autofocus: 'autoFocus',
  enterkeyhint: 'enterKeyHint', spellcheck: 'spellCheck', colspan: 'colSpan', rowspan: 'rowSpan',
  crossorigin: 'crossOrigin', referrerpolicy: 'referrerPolicy', srcset: 'srcSet', fetchpriority: 'fetchPriority',
  frameborder: 'frameBorder', allowfullscreen: 'allowFullScreen', playsinline: 'playsInline', 'xlink:href': 'xlinkHref',
  'xml:space': 'xmlSpace', 'xmlns:xlink': 'xmlnsXlink', datetime: 'dateTime', contenteditable: 'contentEditable',
}
const BOOL = new Set(['open', 'disabled', 'checked', 'selected', 'required', 'multiple', 'hidden', 'autoplay', 'muted', 'loop', 'playsinline', 'readonly', 'autofocus', 'novalidate'])

const styleCache = new Map<string, Record<string, string>>()
function parseStyle(css: string): Record<string, string> {
  const hit = styleCache.get(css)
  if (hit) return hit
  const out: Record<string, string> = {}
  // split on ; not inside parentheses
  let depth = 0, cur = ''
  const parts: string[] = []
  for (const ch of css) {
    if (ch === '(') depth++
    else if (ch === ')') depth--
    if (ch === ';' && depth === 0) { parts.push(cur); cur = '' } else cur += ch
  }
  parts.push(cur)
  for (const p of parts) {
    const i = p.indexOf(':')
    if (i < 0) continue
    const k = p.slice(0, i).trim()
    const v = p.slice(i + 1).trim()
    if (!k || v === '') continue
    const key = k.startsWith('--') ? k : k.replace(/^-(webkit|moz|ms)-/, (_, pre) => (pre === 'ms' ? 'ms-' : pre[0].toUpperCase() + pre.slice(1) + '-')).replace(/-([a-z])/g, (_, c) => c.toUpperCase())
    out[key] = v
  }
  if (styleCache.size > 5000) styleCache.clear()
  styleCache.set(css, out)
  return out
}

function attrName(name: string): string {
  if (ATTRS[name]) return ATTRS[name]
  if (name.startsWith('aria-') || name.startsWith('data-')) return name
  if (name.includes('-')) return name.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
  return name
}

function build(node: AstNode, ctx: Ctx, key?: number | string): React.ReactNode {
  if (typeof node === 'string') {
    if (node.indexOf('{{') < 0) return node
    const v = interp(node, ctx)
    return v == null || v === false ? null : String(v)
  }
  const [tag, attrs, kids] = node
  if (tag === 'sc-if') {
    return interp(attrs.value || '', ctx) ? children(kids, ctx) : null
  }
  if (tag === 'sc-for') {
    const list = interp(attrs.list || '', ctx) || []
    const as = attrs.as || 'item'
    return (list as any[]).map((item, i) => {
      const c2 = Object.create(ctx)
      c2[as] = item
      c2.$index = i
      return React.createElement(React.Fragment, { key: i }, ...children(kids, c2))
    })
  }
  const props: Record<string, any> = {}
  if (key !== undefined) props.key = key
  const isField = tag === 'input' || tag === 'textarea' || tag === 'select'
  for (const name in attrs) {
    const val = attrs[name]
    const lname = name.toLowerCase()
    if (EVENTS[lname] && val.indexOf('{{') === 0) {
      const fn = interp(val, ctx)
      if (typeof fn === 'function') {
        let ev = EVENTS[lname]
        if (lname === 'oninput' && !isField) ev = 'onInput'
        props[ev] = fn
      }
      continue
    }
    let v = interp(val, ctx)
    if (v == null || v === false) continue
    if (BOOL.has(lname)) {
      if (v === '' || v === true || v === 'true' || v === lname) props[attrName(lname)] = true
      else if (typeof v === 'string' && v !== 'false') props[attrName(lname)] = true
      continue
    }
    if (lname === 'style') { props.style = parseStyle(String(v)); continue }
    if (isField && lname === 'value') {
      props.value = String(v)
      continue
    }
    props[attrName(name)] = v === true ? '' : typeof v === 'string' ? v : String(v)
  }
  if (isField && 'value' in props && !props.onChange) props.onChange = noop
  if (tag === 'details' && !props.open) delete props.open
  return React.createElement(tag, props, ...children(kids, ctx))
}
function noop() {}

function children(kids: AstNode[], ctx: Ctx): React.ReactNode[] {
  const out: React.ReactNode[] = []
  for (const k of kids) {
    const r = build(k, ctx)
    if (r == null) continue
    if (Array.isArray(r)) for (const x of r) { if (x != null) out.push(x) }
    else out.push(r)
  }
  return out
}

export function renderAst(ast: AstNode[], vals: Ctx) {
  return React.createElement(React.Fragment, null, ...children(ast, vals))
}

/** Build a page component: a class extending DCLogic whose render() fills the template. */
export function makePage(ast: AstNode[], factory: (Base: any) => any) {
  class DCLogic<P = any, S = any> extends React.Component<P, S> {
    renderVals(): Ctx { return {} }
    render() {
      return renderAst(ast, (this as any).renderVals())
    }
  }
  return factory(DCLogic) as React.ComponentType<any>
}
