import '@/app/styles/globals.scss'
import { Order } from '@/types'
import { getTranslations } from 'next-intl/server'
import OrdersClient from './OrdersClient'
import { RowDataPacket } from 'mysql2'
import db from '@/libs/db'

export async function generateMetadata() {
  const t = await getTranslations('Orders')

  return {
    title: t('title'),
  }
}

export default async function OrdersPage() {
  let orders: Order[] = []

  try {
    const [rows] = await db.query<RowDataPacket[]>('SELECT * FROM orders')

    orders = (rows as Order[]).map((order) => ({
      ...order,
      date: new Date(order.date).toISOString(),
    }))

    console.log('orders', orders)
  } catch (error: unknown) {
    throw error
  }

  return (
    <>
      <OrdersClient initialOrders={orders} />
    </>
  )
}
