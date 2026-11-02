import type { CollectionConfig } from 'payload'
import { slugField } from '../fields/slug'
import { galleryField } from '../fields/gallery'
import { revalidateSite } from '../lib/revalidate'

const opts = (xs: string[]) => xs.map((x) => ({ label: x, value: x }))

export const Cars: CollectionConfig = {
  slug: 'cars',
  labels: { singular: 'Automobilis', plural: 'Automobiliai' },
  admin: {
    group: 'Katalogas',
    useAsTitle: 'title',
    defaultColumns: ['title', 'cover', 'make', 'year', 'market', 'status', 'published'],
    listSearchableFields: ['title', 'make', 'vin'],
    description: 'Ardomi automobiliai. Pirmoji nuotrauka — pagrindinė.',
  },
  access: { read: () => true },
  defaultSort: '-createdAt',
  hooks: { afterChange: [revalidateSite], afterDelete: [revalidateSite] },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'title', label: 'Pavadinimas', type: 'text', required: true, admin: { width: '60%' } },
        { name: 'make', label: 'Markė', type: 'text', required: true, index: true, admin: { width: '40%' } },
      ],
    },
    galleryField,
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Duomenys',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'year', label: 'Metai', type: 'number', min: 1950, max: 2100, admin: { width: '25%' } },
                { name: 'engine', label: 'Variklis', type: 'text', admin: { width: '25%', placeholder: '2.0 · 140 kW' } },
                { name: 'fuel', label: 'Kuras', type: 'select', options: opts(['Benzinas', 'Dyzelinas', 'Hibridas', 'Elektra', 'Dujos']), admin: { width: '25%' } },
                { name: 'gearbox', label: 'Pavarų dėžė', type: 'select', options: opts(['Automatinė', 'Mechaninė']), admin: { width: '25%' } },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'body', label: 'Kėbulas', type: 'select', options: opts(['Sedanas', 'Hečbekas', 'Universalas', 'Visureigis', 'Kupė', 'Vienatūris', 'Kabrioletas', 'Pikapas', 'Krovininis']), admin: { width: '25%' } },
                { name: 'mileage', label: 'Rida, km', type: 'number', min: 0, admin: { width: '25%', description: 'Jei nežinoma — palikite tuščią (rodomas „—“).' } },
                { name: 'drive', label: 'Varomieji ratai', type: 'select', options: opts(['Priekiniai', 'Galiniai', 'Pilna']), admin: { width: '25%' } },
                { name: 'origin', label: 'Kilmė', type: 'text', admin: { width: '25%', placeholder: 'Europa, JAV…' } },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'color', label: 'Spalva', type: 'text', admin: { width: '50%' } },
                { name: 'vin', label: 'VIN kodas', type: 'text', admin: { width: '50%' } },
              ],
            },
          ],
        },
        {
          label: 'Aprašymas',
          fields: [{ name: 'description', label: 'Aprašymas', type: 'textarea', localized: true, admin: { rows: 10 } }],
        },
      ],
    },
    slugField('title'),
    { name: 'published', label: 'Rodyti svetainėje', type: 'checkbox', defaultValue: true, admin: { position: 'sidebar' } },
    {
      name: 'status',
      label: 'Žymė',
      type: 'select',
      defaultValue: 'Ardomas',
      options: opts(['Naujai ardomas', 'Ardomas', 'Naujas']),
      admin: { position: 'sidebar' },
    },
    {
      name: 'market',
      label: 'Versija',
      type: 'select',
      options: [
        { label: 'EU Version', value: 'EU' },
        { label: 'US Version', value: 'US' },
      ],
      admin: { position: 'sidebar', description: 'Ženkliukas ant automobilio nuotraukos.' },
    },
    { name: 'featured', label: 'Rodyti pagrindiniame puslapyje', type: 'checkbox', admin: { position: 'sidebar', description: 'Blokas „Naujai ardomi automobiliai“ (iki 4).' } },
    {
      name: 'cover',
      type: 'ui',
      admin: { components: { Cell: '@/components/admin/CoverCell#CoverCell' }, disableListColumn: false },
      label: 'Foto',
    },
  ],
}
