// app/[locale]/products/[id]/page.tsx
import { notFound } from 'next/navigation'
import db from '@/libs/db'
import { Product } from '@/types'
import Image from 'next/image'
import { RowDataPacket } from 'mysql2'

interface Props {
  params: { locale: string; id: string } // <--- має бути string
}

export default async function ProductPage({ params }: Props) {
  const id = parseInt(params.id, 10)

  if (isNaN(id)) return notFound() // <--- перевірка на NaN

  const [rows] = await db.query<RowDataPacket[]>(
    'SELECT * FROM products WHERE id = ?',
    [id]
  )

  const product = rows[0] as Product | undefined

  if (!product) return notFound()

  return (
    <div style={{ padding: '20px' }}>
      <h1>{product.title}</h1>
      <p>
        <strong>Serial Number:</strong> {product.serial_number}
      </p>
      <p>
        <strong>Condition:</strong> {product.is_new ? 'New' : 'Used'}
      </p>
      <p>
        <strong>Guarantee:</strong> {product.guarantee_start} –{' '}
        {product.guarantee_end}
      </p>
      <p>
        <strong>USD:</strong> {product.price.USD} | <strong>EUR:</strong>{' '}
        {product.price.EUR}
      </p>
      <Image
        src={`/products/${product.id}.jpg`}
        width={300}
        height={200}
        alt={product.title}
      />
    </div>
  )
}
