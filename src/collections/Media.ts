import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Nuotrauka', plural: 'Nuotraukos' },
  admin: { group: 'Turinys', description: 'Visos įkeltos nuotraukos. Automobilių ir variklių nuotraukas patogiausia tvarkyti pačioje kortelėje.' },
  access: { read: () => true },
  fields: [{ name: 'alt', label: 'Alternatyvus tekstas', type: 'text' }],
  upload: {
    // keep uploads outside the app folder in production (Hostinger replaces the app folder on every deploy)
    staticDir: process.env.MEDIA_DIR || 'media',
    mimeTypes: ['image/*'],
    focalPoint: true,
    imageSizes: [
      { name: 'thumb', width: 400, height: 300, position: 'centre' },
      { name: 'card', width: 900, height: 675, position: 'centre' },
      { name: 'large', width: 1600, withoutEnlargement: true },
    ],
    adminThumbnail: 'thumb',
    resizeOptions: { width: 2400, height: 2400, fit: 'inside', withoutEnlargement: true },
    formatOptions: { format: 'jpeg', options: { quality: 82, progressive: true } },
  },
}
