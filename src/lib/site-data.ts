import 'server-only'
import { getPayload } from 'payload'
import config from '@payload-config'
import { cache } from 'react'

export const LOCALES = ['lt', 'en', 'ru'] as const
export type Locale = (typeof LOCALES)[number]
export const isLocale = (l: string): l is Locale => (LOCALES as readonly string[]).includes(l)

export const getClient = cache(async () => getPayload({ config }))

const digits = (s: string) => String(s || '').replace(/[^\d]/g, '')
const fmtKm = (n?: number | null) => (n && n > 0 ? n.toLocaleString('lt-LT').replace(/ |\s/g, ' ') + ' km' : '')

export function basePath(locale: Locale) {
  return locale === 'lt' ? '' : '/' + locale
}
export function langUrls(path: string) {
  // path without locale prefix, e.g. '' | '/automobiliai' | '/automobiliai/bmw-x5'
  return { lt: path || '/', en: '/en' + path, ru: '/ru' + path }
}

type MediaLike = any
function urls(m: MediaLike) {
  if (!m || typeof m !== 'object') return null
  const s = m.sizes || {}
  return { t: s.thumb?.url || m.url, m: s.card?.url || m.url, l: s.large?.url || m.url }
}

export const loadCommon = cache(async (locale: Locale) => {
  const payload = await getClient()
  const [settings, strings] = await Promise.all([
    payload.findGlobal({ slug: 'settings', locale, depth: 0 }),
    payload.find({ collection: 'ui-strings', locale, limit: 2000, depth: 0, pagination: false }),
  ])
  const st: any = settings || {}
  const phone = st.phone || '+370 641 23788'
  const email = st.email || 'dalys@loga.lt'
  const address = st.address || 'Fabriko g. 12, Lentvaris'
  const S = {
    phone,
    email,
    address,
    telHref: 'tel:+' + digits(phone),
    viberHref: 'viber://chat?number=%2B' + digits(st.viber || phone),
    waHref: 'https://wa.me/' + digits(st.whatsapp || phone),
    mailHref: 'mailto:' + email,
    mapsHref: st.mapsUrl || 'https://maps.google.com/?q=' + encodeURIComponent(address),
  }
  const company = st.companyName || '[ĮMONĖS PAVADINIMAS]'
  const code = st.companyCode || '[KODAS]'
  const fill = (t: string) =>
    String(t ?? '')
      .split('+370 641 23788').join(phone)
      .split('dalys@loga.lt').join(email)
      .split('Fabriko g. 12, Lentvaris').join(address)
      .split('[ĮMONĖS PAVADINIMAS]').join(company)
      .split('[COMPANY NAME]').join(company)
      .split('[НАЗВАНИЕ КОМПАНИИ]').join(company)
      .split('[KODAS]').join(code)
      .split('[CODE]').join(code)
      .split('[КОД]').join(code)
  const dict: Record<string, string> = {}
  for (const d of strings.docs as any[]) dict[d.source] = fill(d.text ?? d.source)
  return { locale, base: basePath(locale), settings: S, dict, fill, seo: st }
})

export function mapCar(c: any) {
  const photos = (c.photos || []).map(urls).filter(Boolean)
  return {
    id: String(c.id),
    slug: c.slug,
    t: c.title,
    make: c.make,
    y: c.year || '',
    fuel: c.fuel || '',
    gear: c.gearbox || '',
    eng: c.engine || '',
    body: c.body || '',
    vin: c.vin || '',
    km: fmtKm(c.mileage),
    color: c.color || '',
    drive: c.drive || '',
    origin: c.origin || '',
    tag: c.status && c.status !== 'Ardomas' ? c.status : '',
    desc: c.description || '',
    pc: photos.length,
    n: photos.length,
    photos,
    cover: photos[0]?.m || '',
    featured: !!c.featured,
    market: c.market || '',
  }
}

export function mapEngine(e: any) {
  const photos = (e.photos || []).map(urls).filter(Boolean)
  return {
    id: String(e.id),
    slug: e.slug,
    code: e.code,
    fits: e.fits,
    make: e.make,
    vol: e.volume || '',
    fuel: e.fuel || '',
    kw: e.power || '',
    km: fmtKm(e.mileage),
    war: e.warranty || '',
    price: e.price ? `${e.price} €` : '',
    p: e.price || 0,
    vin: e.vin || '',
    desc: e.description || '',
    pc: photos.length,
    n: photos.length,
    photos,
    cover: photos[0]?.m || '',
  }
}

export const loadCars = cache(async (locale: Locale) => {
  const payload = await getClient()
  const r = await payload.find({ collection: 'cars', locale, depth: 1, limit: 1000, pagination: false, where: { published: { equals: true } }, sort: '-createdAt' })
  return r.docs.map(mapCar)
})
export const loadEngines = cache(async (locale: Locale) => {
  const payload = await getClient()
  const r = await payload.find({ collection: 'engines', locale, depth: 1, limit: 1000, pagination: false, where: { published: { equals: true } }, sort: '-createdAt' })
  return r.docs.map(mapEngine)
})
export const loadFaq = cache(async (locale: Locale) => {
  const payload = await getClient()
  const r = await payload.find({ collection: 'faq', locale, depth: 0, limit: 100, pagination: false, where: { published: { equals: true } }, sort: '_order' })
  return r.docs.map((d: any) => ({ q: d.question, a: d.answer }))
})
export const loadLegal = cache(async (locale: Locale, fill: (s: string) => string) => {
  const payload = await getClient()
  const g: any = await payload.findGlobal({ slug: 'legal', locale, depth: 0 })
  const m = (xs: any[]) => (xs || []).map((x) => ({ title: fill(x.title), body: fill(x.body) }))
  return { privacy: m(g?.privacy), cookies: m(g?.cookies), updated: g?.updated || '' }
})
