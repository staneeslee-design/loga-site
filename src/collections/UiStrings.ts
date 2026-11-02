import type { CollectionConfig } from 'payload'
import { revalidateSite } from '../lib/revalidate'

export const STRING_GROUPS = ['Bendri', 'Pagrindinis', 'Automobiliai', 'Varikliai', 'Teisinė informacija', 'Duomenys ir formos']

export const UiStrings: CollectionConfig = {
  slug: 'ui-strings',
  labels: { singular: 'Tekstas', plural: 'Svetainės tekstai' },
  admin: {
    group: 'Turinys',
    useAsTitle: 'source',
    defaultColumns: ['text', 'group', 'source'],
    listSearchableFields: ['source', 'text'],
    pagination: { defaultLimit: 50 },
    description: 'Visi svetainės užrašai: antraštės, mygtukai, formos, poraštė. Pasirinkite kalbą viršuje (LT / EN / RU) ir redaguokite tekstą.',
  },
  access: { read: () => true },
  defaultSort: 'group',
  hooks: { afterChange: [revalidateSite] },
  fields: [
    { name: 'text', label: 'Tekstas', type: 'textarea', localized: true, required: true, admin: { rows: 3 } },
    { name: 'group', label: 'Skiltis', type: 'select', options: STRING_GROUPS.map((g) => ({ label: g, value: g })), index: true, admin: { position: 'sidebar' } },
    {
      name: 'source',
      label: 'Originalus tekstas (raktas)',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { position: 'sidebar', readOnly: true, description: 'Pagal šį raktą tekstas randamas svetainėje. Nekeiskite.' },
    },
  ],
}
