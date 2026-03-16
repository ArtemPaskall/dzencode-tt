import '@/app/styles/globals.scss'
import st from './orders.module.scss'
import { Link } from '@/i18n/navigation'
import { Order } from '@/types'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata() {
  const t = await getTranslations('Orders')

  return {
    title: t('title'),
  }
}

export default async function Orders() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/orders`, {
    cache: 'no-store',
  })

  if (!res.ok) return <div>Failed to load orders ({res.status})</div>

  const orders: Order[] = await res.json()

  return (
    <div className={st.orderList}>
      {orders.map((order) => (
        <Link
          key={order.id}
          href={`/orders/${order.id}`}
          className={st.productItem}
        >
          {order.title}
        </Link>
      ))}
    </div>
  )
}
