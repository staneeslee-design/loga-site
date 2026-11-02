import type { GlobalConfig } from 'payload'
import { revalidateSiteGlobal } from '../lib/revalidate'

const sections = (name: string, label: string) => ({
  name,
  label,
  type: 'array' as const,
  localized: true,
  labels: { singular: 'Skyrius', plural: 'Skyriai' },
  admin: { initCollapsed: true, components: { RowLabel: '@/components/admin/SectionRowLabel#SectionRowLabel' } },
  fields: [
    { name: 'title', label: 'Antraštė', type: 'text' as const, required: true },
    { name: 'body', label: 'Tekstas', type: 'textarea' as const, required: true, admin: { rows: 6 } },
  ],
})

export const Legal: GlobalConfig = {
  slug: 'legal',
  label: 'Privatumas ir slapukai',
  admin: { group: 'Turinys', description: '[ĮMONĖS PAVADINIMAS] ir [KODAS] automatiškai pakeičiami reikšmėmis iš Nustatymų.' },
  access: { read: () => true },
  hooks: { afterChange: [revalidateSiteGlobal] },
  fields: [
    { name: 'updated', label: 'Atnaujinimo data (tekstas)', type: 'text', localized: true },
    { type: 'tabs', tabs: [{ label: 'Privatumo politika', fields: [sections('privacy', 'Skyriai')] }, { label: 'Slapukų politika', fields: [sections('cookies', 'Skyriai')] }] },
  ],
}
