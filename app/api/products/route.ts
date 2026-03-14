import { NextResponse } from 'next/server'
import db from '@/libs/db'

export async function GET() {
  try {
    const [products] = await db.query('SELECT * FROM products')
    return NextResponse.json(products, { status: 200 })
  } catch (err: unknown) {
    console.error(err)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}
