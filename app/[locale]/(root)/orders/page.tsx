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

  // ✅ Консоль з типом
  orders.forEach((order) => {
    console.log('Order:', order)
    // Приклад перевірки типу
    if (typeof order.id !== 'number') console.warn('ID is not number!', order)
    if (typeof order.title !== 'string')
      console.warn('Title is not string!', order)
    if (order.description && typeof order.description !== 'string')
      console.warn('Description is not string!', order)
    if (order.date && isNaN(Date.parse(order.date)))
      console.warn('Date is invalid!', order)
  })

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
