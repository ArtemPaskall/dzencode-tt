import { notFound } from 'next/navigation'
import { Order } from '@/types'
import db from '@/libs/db'
import st from '../orders.module.scss'
import { RowDataPacket } from 'mysql2'

interface Props {
  params: { id: string }
}

export default async function OrderPage({ params }: Props) {
  console.log('params', params)
  const { id } = await params
  // const id = parseInt(id, 10)

  // Отримуємо замовлення з бази
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
