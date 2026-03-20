'use client'
import st from '../orders.module.scss'
import Image from 'next/image'
import { Order } from '@/types'
import { MouseEvent } from 'react'

interface Props {
  order: Order
  onOpen: (id: number) => void
  onDelete: (id: number, e: MouseEvent) => void
  formatDate: (date: string) => string
  getUAH: (order: Order) => number | string
  getUSD: (order: Order) => number | string
  t: (key: string) => string
}

export default function OrderItem({
  order,
  onOpen,
  onDelete,
  formatDate,
  getUAH,
  getUSD,
  t,
}: Props) {
  return (
    <div className={st.order__item} onClick={() => onOpen(order.id)}>
      <div className={st.order__itemWrapp}>
        <div className={st.order__title}>{order.title}</div>

        <div className={st.order__itemInner}>
          <div className={st.order__linkList}>
            <Image
              src="/list.png"
              width={30}
              height={30}
              alt="list"
              className={st.order__listImg}
            />
            <div>
              <div className={st.order__prodNumber}>
                {order.products?.length ?? 0}
              </div>
              <div className={st.order__prodTitle}>{t('products')}</div>
            </div>
          </div>

          <div className={st.order__date}>{formatDate(order.date)}</div>

          <div className={st.order__priceWrapp}>
            <div>
              {getUAH(order)} <span className={st.order__Currency}>UAH</span>
            </div>
            <div>
              {getUSD(order)} <span className={st.order__Currency}>USD</span>
            </div>
          </div>

          <div
            className={st.item__deleteWrapp}
            onClick={(e) => onDelete(order.id, e)}
          >
            <Image
              src="/delete.png"
              width={20}
              height={20}
              alt="delete"
              className={st.item__delete}
            />
          </div>
        </div>
      </div>

      <div className={st.order__arrowOpen}>
        <Image src="/arrow.png" width={30} height={30} alt="arrow" />
      </div>
    </div>
  )
}
