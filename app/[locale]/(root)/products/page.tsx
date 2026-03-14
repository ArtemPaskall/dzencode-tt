import { getTranslations } from 'next-intl/server'
import '@/app/styles/globals.scss'
import st from './products.module.scss'
import { Link } from '@/i18n/navigation'
import { Product } from '@/types'

export async function generateMetadata() {
  const t = await getTranslations('Products')
  return { title: t('title') }
}

export default async function Products() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/products`, {
    cache: 'no-store',
  })

  if (!res.ok) return <div>Failed to load products ({res.status})</div>

  const products: Product[] = await res.json()

  return (
    <div className={st.productsPage}>
      <Link href="/products/add-product">Add Product</Link>
      <div className={st.productsList}>
        {products.map((product) => (
          <div key={product.serial_number} className={st.productItem}>
            {product.title}
          </div>
        ))}
      </div>
    </div>
  )
}
