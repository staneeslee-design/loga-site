import type { Metadata } from 'next'
import EnginesPage from '@/site/pages/engines'
import '@/site/css/engines.css'
import { isLocale, langUrls, loadEngines, loadCommon, type Locale } from '@/lib/site-data'

type P = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const c = await loadCommon(locale)
  return { title: c.seo.enginesTitle || 'Naudoti varikliai — Loga group', alternates: { languages: langUrls('/varikliai') } }
}

export default async function Page({ params }: P) {
  const { locale } = (await params) as { locale: Locale }
  const [c, items] = await Promise.all([loadCommon(locale), loadEngines(locale)])
  return <EnginesPage locale={locale} base={c.base} dict={c.dict} settings={c.settings} langUrls={langUrls('/varikliai')} items={items} />
}
