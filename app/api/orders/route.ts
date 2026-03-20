import { NextResponse } from 'next/server'
import db from '@/libs/db'
import { Order, OrderWithProductRow, Product } from '@/types'

export async function GET() {
  try {
    const [rows] = await db.query<OrderWithProductRow[]>(`
      SELECT 
        o.id as order_id,
        o.title as order_title,
        o.description as order_description,
        o.date as order_date,

        p.id as product_id,
        p.serial_number,
        p.is_new,
        p.photo,
        p.title as product_title,
        p.type,
        p.specification,
        p.guarantee_start,
        p.guarantee_end,
        p.price,
        p.date as product_date

      FROM orders o
      LEFT JOIN order_products op ON op.order_id = o.id
      LEFT JOIN products p ON p.id = op.product_id
    `)

    const ordersMap = new Map<number, Order>()

    for (const row of rows) {
      if (!ordersMap.has(row.order_id)) {
        ordersMap.set(row.order_id, {
          id: row.order_id,
          title: row.order_title,
          description: row.order_description,
          date:
            row.order_date instanceof Date
              ? row.order_date.toISOString()
              : row.order_date,
          products: [],
        })
      }

      if (row.product_id) {
        const product: Product = {
          id: row.product_id,
          serial_number: row.serial_number!,
          is_new: Boolean(row.is_new),
          photo: row.photo!,
          title: row.product_title!,
          type: row.type!,
          specification: row.specification!,
          guarantee_start: row.guarantee_start
            ? new Date(row.guarantee_start).toISOString()
            : '',
          guarantee_end: row.guarantee_end
            ? new Date(row.guarantee_end).toISOString()
            : '',
          price: row.price ? JSON.parse(row.price) : [],
          date: row.product_date
            ? new Date(row.product_date).toISOString()
            : '',
        }

        ordersMap.get(row.order_id)!.products.push(product)
      }
    }

    return NextResponse.json(Array.from(ordersMap.values()))
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}
