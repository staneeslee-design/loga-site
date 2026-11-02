import type { Field, FieldHook } from 'payload'

const MAP: Record<string, string> = { ą: 'a', č: 'c', ę: 'e', ė: 'e', į: 'i', š: 's', ų: 'u', ū: 'u', ž: 'z' }
export const slugify = (s: string) =>
  String(s || '')
    .toLowerCase()
    .replace(/[ąčęėįšųūž]/g, (c) => MAP[c])
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)

export const slugField = (from: string): Field => {
  const hook: FieldHook = async ({ value, data, originalDoc, req, collection }) => {
    const src = data?.[from] ?? originalDoc?.[from]
    let base = value ? slugify(value) : src ? slugify(String(src)) : ''
    if (!base) return value
    if (!collection) return base
    // make it unique inside the collection
    let candidate = base
    for (let i = 2; i < 200; i++) {
      const found = await req.payload.find({
        collection: collection.slug as any,
        where: { and: [{ slug: { equals: candidate } }, ...(originalDoc?.id ? [{ id: { not_equals: originalDoc.id } }] : [])] },
        limit: 1,
        depth: 0,
        req,
      })
      if (!found.docs.length) return candidate
      candidate = `${base}-${i}`
    }
    return candidate
  }
  return {
    name: 'slug',
    label: 'Nuoroda (slug)',
    type: 'text',
    unique: true,
    index: true,
    admin: { position: 'sidebar', description: 'Sugeneruojama automatiškai iš pavadinimo. Naudojama puslapio adrese.' },
    hooks: { beforeValidate: [hook] },
  }
}
