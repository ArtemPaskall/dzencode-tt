import { NextResponse } from 'next/server'
import db from '@/libs/db'
import { ResultSetHeader } from 'mysql2'

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const { title, description, productIds } = data as {
      title: string
      description: string
      productIds?: number[]
    }

    if (!title || !description) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    const [orderResult] = await db.query<ResultSetHeader>(
      `INSERT INTO orders (title, description, date) VALUES (?, ?, NOW())`,
      [title, description]
    )

    const orderId = orderResult.insertId

    if (Array.isArray(productIds) && productIds.length > 0) {
      const values = productIds.map((pid) => `(${orderId}, ${pid})`).join(',')
      await db.query(
        `INSERT INTO order_products (order_id, product_id) VALUES ${values}`
      )
    }

    return NextResponse.json(
      { message: 'Order added', id: orderId },
      { status: 201 }
    )
  } catch (err: unknown) {
    return NextResponse.json(
      { message: err instanceof Error ? err.message : 'Database error' },
      { status: 500 }
    )
  }
}
