import { NextResponse } from 'next/server'
import db from '@/libs/db'
import { ResultSetHeader } from 'mysql2'

export async function DELETE(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const { id } = await context.params

    const [result] = await db.query<ResultSetHeader>(
      'DELETE FROM products WHERE id = ?',
      [id]
    )

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json(
      { message: 'Product deleted successfully' },
      { status: 200 }
    )
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}
