import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import EnginesPage from '@/site/pages/engines'
import '@/site/css/engines.css'
import { isLocale, langUrls, loadEngines, loadCommon, type Locale } from '@/lib/site-data'

type P = { params: Promise<{ locale: string; slug: string }> }

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale, slug } = await params
  if (!isLocale(locale)) return {}
  const items = await loadEngines(locale)
  const e: any = items.find((x: any) => x.slug === slug)
  if (!e) return {}
  return {
    title: `${e.code} variklis — ${e.fits} | Loga group`,
    description: [e.vol, e.fuel, e.kw, e.price].filter(Boolean).join(' · '),
    openGraph: e.cover ? { images: [e.cover] } : undefined,
    alternates: { languages: langUrls('/varikliai/' + slug) },
  }
}

export default async function Page({ params }: P) {
  const { locale, slug } = (await params) as { locale: Locale; slug: string }
  const [c, items] = await Promise.all([loadCommon(locale), loadEngines(locale)])
  const e: any = items.find((x: any) => x.slug === slug)
  if (!e) notFound()
  return <EnginesPage locale={locale} base={c.base} dict={c.dict} settings={c.settings} langUrls={langUrls('/varikliai/' + slug)} items={items} selId={e.id} />
}
