import { notFound } from 'next/navigation'
import { Product } from '@/types'
import db from '@/libs/db'
import st from '../products.module.scss' // створити або взяти свій scss
import { RowDataPacket } from 'mysql2'

interface Props {
  params: { id: string }
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params

  const [rows] = await db.query<RowDataPacket[]>(
    'SELECT * FROM products WHERE id = ?',
    [id]
  )

  const product = rows[0] as Product | undefined

  if (!product) return notFound()

  const formattedProduct = {
    ...product,
    guarantee_start: new Date(product.guarantee_start).toISOString(),
    guarantee_end: new Date(product.guarantee_end).toISOString(),
    date: new Date(product.date).toISOString(),
  }

  return (
    <div className={st.productsPage}>
      <h1>Product Details</h1>
      <p>
        <strong>ID:</strong> {formattedProduct.id}
      </p>
      <p>
        <strong>Title:</strong> {formattedProduct.title}
      </p>
    </div>
  )
}
