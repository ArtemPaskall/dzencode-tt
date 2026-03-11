import { getTranslations } from 'next-intl/server'
import '@/app/styles/globals.scss'

export async function generateMetadata() {
  const t = await getTranslations('Orders')

  return {
    title: t('title'),
  }
}

export default async function Products() {
  const t = await getTranslations('Orders')

  return (
    <>
      <div>Orders</div>
    </>
  )
}
