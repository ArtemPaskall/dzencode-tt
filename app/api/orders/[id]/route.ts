import { NextRequest, NextResponse } from 'next/server'
import db from '@/libs/db'
import { ResultSetHeader } from 'mysql2'

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params

    const [result] = await db.query<ResultSetHeader>(
      'DELETE FROM orders WHERE id = ?',
      [id]
    )

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json(
      { message: 'Order deleted successfully' },
      { status: 200 }
    )
  } catch (err) {
    console.error(err)

    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}
