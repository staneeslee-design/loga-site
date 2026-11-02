import { NextResponse } from 'next/server'
import { getClient } from '@/lib/site-data'

const TYPES = ['quick', 'part', 'sell', 'callback']
const hits = new Map<string, number[]>()
const clip = (v: unknown, n = 500) => (v === undefined || v === null ? undefined : String(v).slice(0, n).trim() || undefined)

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local'
  const now = Date.now()
  const recent = (hits.get(ip) || []).filter((t) => now - t < 60_000)
  if (recent.length >= 6) return NextResponse.json({ error: 'Per daug užklausų. Pabandykite po minutės.' }, { status: 429 })
  hits.set(ip, [...recent, now])

  let body: any
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  }
  if (body.website) return NextResponse.json({ ok: true }) // honeypot
  const type = String(body.type || '')
  const phone = clip(body.phone, 40)
  if (!TYPES.includes(type) || !phone || phone.replace(/[^\d]/g, '').length < 6) {
    return NextResponse.json({ error: 'Įrašykite telefono numerį.' }, { status: 400 })
  }
  const payload = await getClient()
  const details: Record<string, string> = {}
  for (const [k, v] of Object.entries(body.details || {})) details[k] = String(v).slice(0, 200)
  if (body.year) details.year = String(body.year).slice(0, 10)
  await payload.create({
    collection: 'inquiries',
    overrideAccess: true,
    data: {
      type: type as any,
      phone,
      name: clip(body.name, 120),
      subject: clip(body.subject, 200),
      part: clip(body.part, 300),
      message: clip(body.message, 2000),
      vin: clip(body.vin, 40),
      details,
      locale: clip(body.locale, 5),
      page: clip(body.page, 300),
      status: 'new',
    },
  })
  return NextResponse.json({ ok: true })
}
