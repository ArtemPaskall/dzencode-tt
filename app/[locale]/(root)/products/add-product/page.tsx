import AddProductForm from './addProductForm/page'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata() {
  const t = await getTranslations('AddProduct')
  return { title: t('header') }
}

export default function AddProductPage() {
  return <AddProductForm />
}
