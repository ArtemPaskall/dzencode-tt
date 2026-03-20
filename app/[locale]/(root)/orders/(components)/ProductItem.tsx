'use client'
import st from '../orders.module.scss'
import Image from 'next/image'
import { MouseEvent, useState } from 'react'

interface Product {
  id: number
  title: string
  price: { value: number; symbol: string }[]
}

interface Props {
  product: Product
  onRemove: (productId: number, e: MouseEvent) => void
}

export default function ProductItem({ product, onRemove }: Props) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = (e: MouseEvent) => {
    setIsDeleting(true)

    setTimeout(() => {
      onRemove(product.id, e)
    }, 300)
  }

  return (
    <div
      className={`${st.sideList__item} ${
        isDeleting ? st.sideList__itemDeleting : ''
      }`}
    >
      <div className={st.sideList__itemTitle}>{product.title}</div>

      <div className={st.sideList__itemPrice}>
        {product.price?.[0]?.value ?? '-'}
        <span className={st.order__Currency}>UAH</span>
      </div>

      <div onClick={handleDelete}>
        <Image
          src="/delete.png"
          width={25}
          height={25}
          alt="delete"
          className={st.sideList__itemDelete}
        />
      </div>
    </div>
  )
}
