import { notFound } from 'next/navigation'
import { Order } from '@/types'
import db from '@/libs/db'
import st from '../orders.module.scss'
import { RowDataPacket } from 'mysql2'

interface Props {
  params: { id: string }
}

export default async function OrderPage({ params }: Props) {
  const { id } = await params

  const [rows] = await db.query<RowDataPacket[]>(
    'SELECT * FROM orders WHERE id = ?',
    [id]
  )

  const order = rows[0] as Order | undefined

  if (!order) return notFound()

  return (
    <div className={st.productsPage}>
      <h1>Order Details</h1>
      <p>
        <strong>ID:</strong> {order.id}
      </p>
      <p>
        <strong>Title:</strong> {order.title}
      </p>
    </div>
  )
}
