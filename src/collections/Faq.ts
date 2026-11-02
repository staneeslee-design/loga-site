import type { CollectionConfig } from 'payload'
import { revalidateSite } from '../lib/revalidate'

export const Faq: CollectionConfig = {
  slug: 'faq',
  labels: { singular: 'Klausimas', plural: 'DUK' },
  orderable: true,
  admin: {
    group: 'Turinys',
    useAsTitle: 'question',
    defaultColumns: ['question', 'published'],
    description: 'Dažnai užduodami klausimai pagrindiniame puslapyje. Tvarką keiskite tempdami eilutes.',
  },
  access: { read: () => true },
  hooks: { afterChange: [revalidateSite], afterDelete: [revalidateSite] },
  fields: [
    { name: 'question', label: 'Klausimas', type: 'text', required: true, localized: true },
    { name: 'answer', label: 'Atsakymas', type: 'textarea', required: true, localized: true, admin: { rows: 5 } },
    { name: 'published', label: 'Rodyti', type: 'checkbox', defaultValue: true, admin: { position: 'sidebar' } },
  ],
}
