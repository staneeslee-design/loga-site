/**
 * Fill an empty database with the current site content:
 *   texts (LT/EN/RU), FAQ, privacy & cookie texts, settings, 51 cars, 25 engines and their photos.
 *
 *   npm run seed
 *
 * Env:
 *   PHOTOS_DIR          folder with photos/cars/<id>/01.jpg… (default: ../Loga-site-handoff/photos)
 *   SEED_ADMIN_EMAIL    first admin e-mail     (default: admin@loga.lt)
 *   SEED_ADMIN_PASSWORD first admin password  (default: random, printed once)
 */
import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import { getPayload } from 'payload'
import config from '../payload.config'

const here = path.dirname(new URL(import.meta.url).pathname)
const read = (f: string) => JSON.parse(fs.readFileSync(path.join(here, f), 'utf8'))
const PHOTOS = path.resolve(process.env.PHOTOS_DIR || path.join(process.cwd(), '../Loga-site-handoff/photos'))
const FEATURED = ['c03', 'c01', 'c09', 'c34']
const km = (s?: string | null) => {
  const n = parseInt(String(s || '').replace(/[^\d]/g, ''), 10)
  return Number.isFinite(n) && n > 0 ? n : null
}

async function main() {
  const payload = await getPayload({ config })
  const log = (...a: any[]) => console.log('›', ...a)

  // ---- admin
  const users = await payload.count({ collection: 'users' })
  if (!users.totalDocs) {
    const email = process.env.SEED_ADMIN_EMAIL || 'admin@loga.lt'
    const password = process.env.SEED_ADMIN_PASSWORD || crypto.randomBytes(9).toString('base64url')
    await payload.create({ collection: 'users', data: { email, password, name: 'Administratorius' } })
    log(`Administratorius: ${email} / ${password}   (pakeiskite slaptažodį po prisijungimo)`)
  }

  // ---- texts
  const strings: any[] = read('strings.json')
  const existing = await payload.find({ collection: 'ui-strings', limit: 5000, pagination: false, depth: 0 })
  const have = new Set(existing.docs.map((d: any) => d.source))
  let n = 0
  for (const s of strings) {
    if (have.has(s.source)) continue
    const doc = await payload.create({ collection: 'ui-strings', locale: 'lt', data: { source: s.source, text: s.lt, group: s.group } })
    await payload.update({ collection: 'ui-strings', id: doc.id, locale: 'en', data: { text: s.en } })
    await payload.update({ collection: 'ui-strings', id: doc.id, locale: 'ru', data: { text: s.ru } })
    n++
  }
  log('Tekstai:', n, 'nauji')

  // ---- faq
  if (!(await payload.count({ collection: 'faq' })).totalDocs) {
    for (const f of read('faq.json')) {
      const doc = await payload.create({ collection: 'faq', locale: 'lt', data: { question: f.lt.q, answer: f.lt.a } })
      for (const l of ['en', 'ru'] as const) await payload.update({ collection: 'faq', id: doc.id, locale: l, data: { question: f[l].q, answer: f[l].a } })
    }
    log('DUK: 5')
  }

  // ---- legal
  const legal = read('legal.json')
  for (const l of ['lt', 'en', 'ru'] as const) {
    await payload.updateGlobal({ slug: 'legal', locale: l, data: legal[l] })
  }
  log('Privatumas ir slapukai: OK')

  // ---- settings
  await payload.updateGlobal({
    slug: 'settings',
    data: {
      phone: '+370 641 23788',
      email: 'dalys@loga.lt',
      viber: '+37064123788',
      whatsapp: '+37064123788',
      address: 'Fabriko g. 12, Lentvaris',
      mapsUrl: 'https://maps.google.com/?q=Fabriko+g.+12,+Lentvaris',
      mail: { enabled: true, recipients: [{ email: 'dalys@loga.lt' }], port: 465, secure: true, fromName: 'Loga group svetainė' },
      telegram: { enabled: false },
      siteName: 'Loga group',
    } as any,
  })
  for (const [l, t, d, c, e] of [
    ['lt', 'Loga group — naudotos originalios automobilių dalys', 'Originalios naudotos automobilių dalys ir patikrinti varikliai. Pristatymas Lietuvoje ir Europoje.', 'Ardomi automobiliai — Loga group', 'Naudoti varikliai — Loga group'],
    ['en', 'Loga group — used original car parts', 'Original used car parts and tested engines. Delivery across Lithuania and Europe.', 'Cars for parts — Loga group', 'Used engines — Loga group'],
    ['ru', 'Loga group — б/у оригинальные автозапчасти', 'Оригинальные б/у автозапчасти и проверенные двигатели. Доставка по Литве и Европе.', 'Авто на разборке — Loga group', 'Б/у двигатели — Loga group'],
  ] as const) {
    await payload.updateGlobal({ slug: 'settings', locale: l, data: { homeTitle: t, homeDescription: d, carsTitle: c, enginesTitle: e } as any })
  }
  log('Nustatymai: OK')

  // ---- media helper
  const upload = async (file: string, alt: string) => {
    const doc = await payload.create({ collection: 'media', data: { alt }, filePath: file })
    return doc.id
  }
  const photosFor = async (kind: 'cars' | 'engines', id: string, alt: string) => {
    const dir = path.join(PHOTOS, kind, id)
    if (!fs.existsSync(dir)) return []
    const files = fs.readdirSync(dir).filter((f) => /\.(jpe?g|png|webp)$/i.test(f)).sort()
    const ids: (number | string)[] = []
    for (const f of files) ids.push(await upload(path.join(dir, f), alt))
    return ids
  }
  if (!fs.existsSync(PHOTOS)) log('! Nuotraukų aplankas nerastas:', PHOTOS, '— automobiliai bus be nuotraukų')

  // ---- cars
  if (!(await payload.count({ collection: 'cars' })).totalDocs) {
    const cars: any[] = read('cars.json')
    for (const c of cars) {
      const photos = await photosFor('cars', c.id, c.title)
      const status = c.status === 'Naujai ardomas' || c.status === 'Naujas' ? c.status : 'Ardomas'
      await payload.create({
        collection: 'cars',
        locale: 'lt',
        data: {
          title: c.title,
          make: c.make,
          year: c.year || undefined,
          engine: c.engine || undefined,
          fuel: c.fuel || undefined,
          gearbox: c.gearbox || undefined,
          body: c.body || undefined,
          mileage: km(c.mileage),
          drive: c.drive || undefined,
          origin: c.origin || undefined,
          color: c.color || undefined,
          vin: c.vin || undefined,
          description: c.description || undefined,
          photos,
          status,
          market: /^(Europa|DE|EU)/i.test(c.origin || '') ? 'EU' : /^(JAV|USA|US)/i.test(c.origin || '') ? 'US' : undefined,
          featured: FEATURED.includes(c.id),
          published: true,
        } as any,
      })
      process.stdout.write('.')
    }
    console.log('')
    log('Automobiliai:', cars.length)
  }

  // ---- engines
  if (!(await payload.count({ collection: 'engines' })).totalDocs) {
    const engines: any[] = read('engines.json')
    for (const e of engines) {
      const photos = await photosFor('engines', e.id, `${e.code} ${e.fits}`)
      await payload.create({
        collection: 'engines',
        locale: 'lt',
        data: {
          code: e.code,
          fits: e.fits,
          make: e.make,
          volume: e.volume || undefined,
          fuel: e.fuel || undefined,
          power: e.power || undefined,
          mileage: km(e.mileage),
          warranty: e.warranty || undefined,
          price: e.priceEur || undefined,
          vin: e.vin || undefined,
          photos,
          published: true,
        } as any,
      })
      process.stdout.write('.')
    }
    console.log('')
    log('Varikliai:', engines.length)
  }
  log('Baigta ✔')
  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
