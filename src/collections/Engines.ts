import type { CollectionConfig } from 'payload'
import { slugField } from '../fields/slug'
import { galleryField } from '../fields/gallery'
import { revalidateSite } from '../lib/revalidate'

export const Engines: CollectionConfig = {
  slug: 'engines',
  labels: { singular: 'Variklis', plural: 'Varikliai' },
  admin: {
    group: 'Katalogas',
    useAsTitle: 'code',
    defaultColumns: ['code', 'cover', 'fits', 'price', 'published'],
    listSearchableFields: ['code', 'fits', 'make', 'vin'],
  },
  access: { read: () => true },
  defaultSort: '-createdAt',
  hooks: { afterChange: [revalidateSite], afterDelete: [revalidateSite] },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'code', label: 'Variklio kodas', type: 'text', required: true, admin: { width: '35%' } },
        { name: 'fits', label: 'Tinka (automobilis)', type: 'text', required: true, admin: { width: '45%', placeholder: 'Volkswagen Golf VI 2012' } },
        { name: 'make', label: 'Markė', type: 'text', required: true, admin: { width: '20%' } },
      ],
    },
    galleryField,
    {
      type: 'row',
      fields: [
        { name: 'volume', label: 'Tūris', type: 'text', admin: { width: '20%', placeholder: '2.0 L' } },
        { name: 'fuel', label: 'Kuras', type: 'select', options: ['Benzinas', 'Dyzelinas', 'Hibridas', 'Dujos'].map((x) => ({ label: x, value: x })), admin: { width: '20%' } },
        { name: 'power', label: 'Galia', type: 'text', admin: { width: '20%', placeholder: '110 kW' } },
        { name: 'mileage', label: 'Rida, km', type: 'number', min: 0, admin: { width: '20%' } },
        { name: 'warranty', label: 'Garantija', type: 'select', options: ['1 metai', '6 mėnesiai', '90 dienų', '30 dienų', 'Be garantijos'].map((x) => ({ label: x, value: x })), admin: { width: '20%' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'price', label: 'Kaina, €', type: 'number', min: 0, admin: { width: '30%' } },
        { name: 'vin', label: 'Donoro VIN', type: 'text', admin: { width: '70%' } },
      ],
    },
    { name: 'description', label: 'Aprašymas', type: 'textarea', localized: true },
    slugField('code'),
    { name: 'published', label: 'Rodyti svetainėje', type: 'checkbox', defaultValue: true, admin: { position: 'sidebar' } },
    { name: 'cover', type: 'ui', label: 'Foto', admin: { components: { Cell: '@/components/admin/CoverCell#CoverCell' } } },
  ],
}
