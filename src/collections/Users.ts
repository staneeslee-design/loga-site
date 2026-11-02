import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Administratorius', plural: 'Administratoriai' },
  admin: { useAsTitle: 'email', group: 'Nustatymai' },
  auth: true,
  fields: [{ name: 'name', label: 'Vardas', type: 'text' }],
}
