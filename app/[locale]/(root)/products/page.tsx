import ProductsClient from './ProductsClient'
import { Product } from '@/types'
import db from '@/libs/db'
import { RowDataPacket } from 'mysql2'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata() {
  const t = await getTranslations('Products')

  return {
    title: t('title'),
  }
}

export default async function ProductsPage() {
  let products: Product[] = []

  try {
    const [rows] = await db.query<RowDataPacket[]>('SELECT * FROM products')

    products = (rows as Product[]).map((product) => ({
      ...product,
      guarantee_start: new Date(product.guarantee_start).toISOString(),
      guarantee_end: new Date(product.guarantee_end).toISOString(),
      date: new Date(product.date).toISOString(),
    }))
  } catch (error: unknown) {
    throw error
  }

  return (
    <>
      <ProductsClient initialProducts={products} />
    </>
  )
}
