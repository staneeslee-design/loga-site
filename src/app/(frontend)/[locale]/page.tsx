import type { Metadata } from 'next'
import HomePage from '@/site/pages/home'
import '@/site/css/home.css'
import { isLocale, langUrls, loadCars, loadCommon, loadEngines, loadFaq, type Locale } from '@/lib/site-data'

type P = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const c = await loadCommon(locale)
  return {
    title: c.seo.homeTitle || 'Loga group — naudotos originalios automobilių dalys',
    description: c.seo.homeDescription || undefined,
    alternates: { languages: langUrls('') },
  }
}

export default async function Page({ params }: P) {
  const { locale } = (await params) as { locale: Locale }
  const [c, cars, engines, faq] = await Promise.all([loadCommon(locale), loadCars(locale), loadEngines(locale), loadFaq(locale)])
  const feat = (cars as any[]).filter((x) => x.featured)
  const list = (feat.length ? feat : cars).slice(0, 4).map((x: any) => ({
    id: x.id,
    slug: x.slug,
    img: x.cover,
    type: [x.origin, x.body].filter(Boolean).join(' · '),
    title: x.t,
    year: String(x.y || ''),
    engine: x.eng,
    fuel: x.fuel,
    gear: x.gear,
    market: x.market,
  }))
  return (
    <HomePage
      locale={locale}
      base={c.base}
      dict={c.dict}
      settings={c.settings}
      langUrls={langUrls('')}
      featured={list}
      counts={{ cars: cars.length, engines: engines.length }}
      faq={faq}
    />
  )
}
