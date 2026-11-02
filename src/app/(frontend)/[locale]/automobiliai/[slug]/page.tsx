import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import CarsPage from '@/site/pages/cars'
import '@/site/css/cars.css'
import { isLocale, langUrls, loadCars, loadCommon, type Locale } from '@/lib/site-data'

type P = { params: Promise<{ locale: string; slug: string }> }

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale, slug } = await params
  if (!isLocale(locale)) return {}
  const items = await loadCars(locale)
  const car: any = items.find((x: any) => x.slug === slug)
  if (!car) return {}
  return {
    title: `${car.t} — dalys | Loga group`,
    description: [car.y, car.eng, car.fuel, car.gear, car.body].filter(Boolean).join(' · '),
    openGraph: car.cover ? { images: [car.cover] } : undefined,
    alternates: { languages: langUrls('/automobiliai/' + slug) },
  }
}

export default async function Page({ params }: P) {
  const { locale, slug } = (await params) as { locale: Locale; slug: string }
  const [c, items] = await Promise.all([loadCommon(locale), loadCars(locale)])
  const car: any = items.find((x: any) => x.slug === slug)
  if (!car) notFound()
  return <CarsPage locale={locale} base={c.base} dict={c.dict} settings={c.settings} langUrls={langUrls('/automobiliai/' + slug)} items={items} selId={car.id} />
}
