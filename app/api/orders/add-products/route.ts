import { NextResponse } from 'next/server'
import db from '@/libs/db'
import { RowDataPacket } from 'mysql2'

type OrderProductRow = RowDataPacket & {
  product_id: number
}

export async function POST(req: Request) {
  try {
    const data = await req.json()

    const { orderId, productIds } = data as {
      orderId: number
      productIds: number[]
    }

    if (!orderId || !Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    const [existingRows] = await db.query<OrderProductRow[]>(
      `SELECT product_id FROM order_products WHERE order_id = ?`,
      [orderId]
    )

    const existingProductIds = existingRows.map((row) => row.product_id)

    const newProductIds = productIds.filter(
      (id) => !existingProductIds.includes(id)
    )

    if (newProductIds.length === 0) {
      return NextResponse.json(
        { message: 'No new products to add' },
        { status: 200 }
      )
    }

    const values = newProductIds.map((id) => [orderId, id])

    await db.query(
      `INSERT INTO order_products (order_id, product_id) VALUES ?`,
      [values]
    )

    return NextResponse.json(
      { message: 'Products added to order' },
      { status: 200 }
    )
  } catch (err: unknown) {
    return NextResponse.json(
      { message: err instanceof Error ? err.message : 'Database error' },
      { status: 500 }
    )
  }
}
