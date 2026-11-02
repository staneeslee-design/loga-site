import type { Metadata } from 'next'
import LegalPage from '@/site/pages/legal'
import '@/site/css/legal.css'
import { isLocale, langUrls, loadCommon, loadLegal, type Locale } from '@/lib/site-data'

type P = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  return { title: 'Privatumo politika — Loga group', alternates: { languages: langUrls('/privatumas') } }
}

export default async function Page({ params }: P) {
  const { locale } = (await params) as { locale: Locale }
  const c = await loadCommon(locale)
  const legal = await loadLegal(locale, c.fill)
  return <LegalPage locale={locale} base={c.base} dict={c.dict} settings={c.settings} langUrls={langUrls('/privatumas')} legal={legal} />
}
