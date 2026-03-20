import '@/app/styles/globals.scss'
import { Order, OrderWithProductRow } from '@/types'
import { getTranslations } from 'next-intl/server'
import OrdersClient from './OrdersClient'
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
    const [rows] = await db.query<OrderWithProductRow[]>(`
      SELECT 
        o.id AS order_id,
        o.title AS order_title,
        o.description AS order_description,
        o.date AS order_date,

        p.id AS product_id,
        p.serial_number,
        p.is_new,
        p.photo,
        p.title AS product_title,
        p.type,
        p.specification,
        p.guarantee_start,
        p.guarantee_end,
        p.price,
        p.date AS product_date

      FROM orders o
      LEFT JOIN order_products op ON o.id = op.order_id
      LEFT JOIN products p ON op.product_id = p.id
      ORDER BY o.id;
    `)

    const ordersMap = new Map<number, Order>()

    rows.forEach((row) => {
      if (!ordersMap.has(row.order_id)) {
        ordersMap.set(row.order_id, {
          id: row.order_id,
          title: row.order_title,
          description: row.order_description,
          date: new Date(row.order_date).toISOString(),
          products: [],
        })
      }

      if (row.product_id) {
        ordersMap.get(row.order_id)?.products.push({
          id: row.product_id,
          serial_number: row.serial_number ?? '',
          is_new: !!row.is_new,
          photo: row.photo ?? '',
          title: row.product_title ?? '',
          type: row.type ?? 'laptop',
          specification: row.specification ?? '',
          guarantee_start: row.guarantee_start
            ? new Date(row.guarantee_start).toISOString()
            : '',
          guarantee_end: row.guarantee_end
            ? new Date(row.guarantee_end).toISOString()
            : '',
          price: row.price
            ? typeof row.price === 'string'
              ? JSON.parse(row.price)
              : row.price
            : [],
          date: row.product_date
            ? new Date(row.product_date).toISOString()
            : '',
        })
      }
    })

    orders = Array.from(ordersMap.values())
  } catch (error: unknown) {
    console.error(error)
  }

  return <OrdersClient initialOrders={orders} />
}
