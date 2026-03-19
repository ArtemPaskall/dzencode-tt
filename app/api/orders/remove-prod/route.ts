import { NextRequest, NextResponse } from 'next/server'
import db from '@/libs/db'

export async function DELETE(req: NextRequest) {
  try {
    const { orderId, productId } = await req.json()

    await db.query(
      'DELETE FROM order_products WHERE order_id = ? AND product_id = ?',
      [orderId, productId]
    )

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}
