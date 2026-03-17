import { notFound } from 'next/navigation'
import { Product } from '@/types'
import db from '@/libs/db'
import { RowDataPacket } from 'mysql2'
import Image from 'next/image'
import st from './productID.module.scss'

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
      <h3>Product Details {product.id}</h3>
      <div className={st.productsPage__photoWrapp}>
        {product.photo ? (
          <Image
            src={product.photo}
            width={100}
            height={100}
            alt={product.title || 'Product Image'}
            className={st.productsPage__photo}
          />
        ) : (
          <Image
            src={'/logo.svg'}
            width={100}
            height={100}
            alt={product.title || 'Product Image'}
            className={st.productsPage__photo}
          />
        )}
        <div>
          <h1>{product.title}</h1>
        </div>
      </div>
    </div>
  )
}
