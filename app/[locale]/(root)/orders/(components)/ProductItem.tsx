'use client'
import st from '../orders.module.scss'
import Image from 'next/image'
import { MouseEvent } from 'react'

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
  return (
    <div className={st.sideList__item}>
      <div className={st.sideList__itemTitle}>{product.title}</div>

      <div className={st.sideList__itemPrice}>
        {product.price?.[0]?.value ?? '-'}
        <span className={st.order__Currency}>UAH</span>
      </div>

      <div onClick={(e) => onRemove(product.id, e)}>
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
