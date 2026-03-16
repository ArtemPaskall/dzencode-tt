import { NextResponse } from 'next/server'
import db from '@/libs/db'
import { ResultSetHeader } from 'mysql2'

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const {
      serial_number,
      title,
      specification,
      type,
      isNew,
      guaranteeStart,
      guaranteeEnd,
      photo,
    } = data

    const [result] = await db.query<ResultSetHeader>(
      'INSERT INTO products (serial_number, title, specification, type, is_new, guarantee_start, guarantee_end, photo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        serial_number,
        title,
        specification,
        type,
        isNew,
        guaranteeStart,
        guaranteeEnd,
        photo || null,
      ]
    )

    return NextResponse.json(
      { message: 'Product added', id: result.insertId },
      { status: 201 }
    )
  } catch (err: unknown) {
    console.error('DB error:', err)
    return NextResponse.json(
      { message: err instanceof Error ? err.message : 'Database error' },
      { status: 500 }
    )
  }
}
