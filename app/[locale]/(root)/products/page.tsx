import { getTranslations } from 'next-intl/server'
import '@/app/styles/globals.scss'
import st from './products.module.scss'
import { Link } from '@/i18n/navigation'
import { Product } from '@/types'
import db from '@/libs/db'
import { RowDataPacket } from 'mysql2'

export async function generateMetadata() {
  const t = await getTranslations('Products')
  return { title: t('title') }
}

export default async function Products() {
  const t = await getTranslations('Products')
  let products: Product[] = []

  try {
    const [rows] = await db.query<RowDataPacket[]>('SELECT * FROM products')
    products = rows as Product[]
  } catch (error: unknown) {
    throw error
  }

  return (
    <div className={st.productsPage}>
      <Link href="/products/add-product">Add Product</Link>

      <div className={st.productsList}>
        {products.length === 0 ? (
          <div className={st.emptyMessage}>{t('productsEmpty')}</div>
        ) : (
          products.map((product) => (
            <div key={product.serial_number} className={st.productItem}>
              <div>{product.title}</div>
              <div>{product.guarantee_start.toString()}</div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
