import type { CollectionConfig } from 'payload'
import { notifyInquiry } from '../lib/notify'

export const INQUIRY_TYPES = [
  { label: 'Greita užklausa (automobilis)', value: 'quick' },
  { label: 'Rasti detalę', value: 'part' },
  { label: 'Pasiūlyti automobilį', value: 'sell' },
  { label: 'Perskambinti', value: 'callback' },
]

export const Inquiries: CollectionConfig = {
  slug: 'inquiries',
  labels: { singular: 'Užklausa', plural: 'Užklausos' },
  admin: {
    group: 'Užklausos',
    useAsTitle: 'phone',
    defaultColumns: ['createdAt', 'type', 'subject', 'part', 'phone', 'status'],
    listSearchableFields: ['phone', 'subject', 'part', 'name'],
    description: 'Visos užklausos iš svetainės formų. Pranešimai siunčiami pagal „Nustatymai → Pranešimai“.',
  },
  access: {
    create: () => false, // created only through /inquiry endpoint (server side)
    read: ({ req }) => !!req.user,
    update: ({ req }) => !!req.user,
    delete: ({ req }) => !!req.user,
  },
  defaultSort: '-createdAt',
  hooks: {
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation === 'create') {
          // fire and forget: never block the visitor
          notifyInquiry(req.payload, doc).catch((e) => req.payload.logger.error({ err: e }, 'notify failed'))
        }
        return doc
      },
    ],
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'type', label: 'Tipas', type: 'select', options: INQUIRY_TYPES, required: true, admin: { width: '40%' } },
        {
          name: 'status',
          label: 'Būsena',
          type: 'select',
          defaultValue: 'new',
          options: [
            { label: '🔴 Nauja', value: 'new' },
            { label: '🟡 Vykdoma', value: 'progress' },
            { label: '🟢 Atlikta', value: 'done' },
          ],
          admin: { width: '30%' },
        },
        { name: 'locale', label: 'Kalba', type: 'text', admin: { width: '30%', readOnly: true } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'name', label: 'Vardas', type: 'text', admin: { width: '33%' } },
        { name: 'phone', label: 'Telefonas', type: 'text', required: true, admin: { width: '33%' } },
        { name: 'vin', label: 'VIN', type: 'text', admin: { width: '34%' } },
      ],
    },
    { name: 'subject', label: 'Automobilis / tema', type: 'text' },
    { name: 'part', label: 'Detalė', type: 'text' },
    { name: 'message', label: 'Komentaras', type: 'textarea' },
    { name: 'details', label: 'Papildomai', type: 'json', admin: { readOnly: true } },
    { name: 'page', label: 'Puslapis', type: 'text', admin: { readOnly: true } },
    { name: 'notes', label: 'Vidinės pastabos', type: 'textarea', admin: { position: 'sidebar' } },
  ],
}
