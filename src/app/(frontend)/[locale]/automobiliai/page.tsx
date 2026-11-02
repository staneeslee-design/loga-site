import type { Metadata } from 'next'
import CarsPage from '@/site/pages/cars'
import '@/site/css/cars.css'
import { isLocale, langUrls, loadCars, loadCommon, type Locale } from '@/lib/site-data'

type P = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}
  const c = await loadCommon(locale)
  return { title: c.seo.carsTitle || 'Ardomi automobiliai — Loga group', alternates: { languages: langUrls('/automobiliai') } }
}

export default async function Page({ params }: P) {
  const { locale } = (await params) as { locale: Locale }
  const [c, items] = await Promise.all([loadCommon(locale), loadCars(locale)])
  return <CarsPage locale={locale} base={c.base} dict={c.dict} settings={c.settings} langUrls={langUrls('/automobiliai')} items={items} />
}
