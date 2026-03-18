import AddOrderForm from './addOrderForm/page'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata() {
  const t = await getTranslations('AddOrder')
  return { title: t('header') }
}

export default function AddProductPage() {
  return <AddOrderForm />
}
