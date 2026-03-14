import { NextResponse } from 'next/server'
import db from '@/libs/db'

export async function GET() {
  try {
    const [orders] = await db.query('SELECT * FROM orders')
    return NextResponse.json(orders, { status: 200 })
  } catch (err: unknown) {
    console.error(err)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}
