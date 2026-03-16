import { notFound } from 'next/navigation'
import { Product } from '@/types'
import db from '@/libs/db'
import st from '../products.module.scss'
import { RowDataPacket } from 'mysql2'
import Image from 'next/image'

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

  return (
    <div className={st.productsPage}>
      <h1>Product Details</h1>
      <p>
        <strong>ID:</strong> {product.id}
      </p>
      <p>
        <strong>Title:</strong> {product.title}
      </p>
      {product.photo ? (
        <Image
          src={product.photo}
          width={100}
          height={100}
          alt={product.title || 'Product Image'}
        />
      ) : (
        <Image
          src={'/logo.svg'}
          width={100}
          height={100}
          alt={product.title || 'Product Image'}
        />
      )}
    </div>
  )
}
