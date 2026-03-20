import { NextResponse } from 'next/server'
import db from '@/libs/db'

export async function GET() {
  try {
    const [rows] = await db.query(`
      SELECT 
        o.id as orderId,
        o.title as orderTitle,
        p.id as productId,
        p.title as productTitle
      FROM orders o
      LEFT JOIN order_products op ON op.order_id = o.id
      LEFT JOIN products p ON p.id = op.product_id
    `)

    const ordersMap = new Map()

    for (const row of rows as any[]) {
      if (!ordersMap.has(row.orderId)) {
        ordersMap.set(row.orderId, {
          id: row.orderId,
          title: row.orderTitle,
          products: [],
        })
      }

      if (row.productId) {
        ordersMap.get(row.orderId).products.push({
          id: row.productId,
          title: row.productTitle,
        })
      }
    }

    return NextResponse.json(Array.from(ordersMap.values()))
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}
