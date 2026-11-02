import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { lt } from '@payloadcms/translations/languages/lt'
import { ru } from '@payloadcms/translations/languages/ru'
import { en } from '@payloadcms/translations/languages/en'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Cars } from './collections/Cars'
import { Engines } from './collections/Engines'
import { Faq } from './collections/Faq'
import { Inquiries } from './collections/Inquiries'
import { UiStrings } from './collections/UiStrings'
import { Settings } from './globals/Settings'
import { Legal } from './globals/Legal'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || '',
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: {
      titleSuffix: ' — Loga group',
      icons: [{ rel: 'icon', type: 'image/svg+xml', url: '/site/icon.svg' }],
    },
    components: {
      graphics: { Logo: '@/components/admin/Logo#Logo', Icon: '@/components/admin/Icon#Icon' },
      beforeDashboard: ['@/components/admin/Dashboard#Dashboard'],
      afterNavLinks: ['@/components/admin/ViewSite#ViewSite'],
    },
    avatar: 'default',
  },
  i18n: {
    supportedLanguages: { lt, en, ru },
    fallbackLanguage: 'lt',
  },
  localization: {
    locales: [
      { code: 'lt', label: 'Lietuvių' },
      { code: 'en', label: 'English' },
      { code: 'ru', label: 'Русский' },
    ],
    defaultLocale: 'lt',
    fallback: true,
  },
  collections: [Cars, Engines, Inquiries, Faq, UiStrings, Media, Users],
  globals: [Settings, Legal],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: sqliteAdapter({ client: { url: process.env.DATABASE_URL || 'file:./loga.db' } }),
  sharp,
  plugins: [],
})
