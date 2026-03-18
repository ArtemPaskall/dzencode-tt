'use client'
import '@/app/styles/globals.scss'
import st from './orders.module.scss'
import { Link } from '@/i18n/navigation'
import { Order } from '@/types'
import { getTranslations } from 'next-intl/server'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/redux/store'
import { setOrders } from '@/redux/orderSlice'
import { useLocale, useTranslations } from 'next-intl'
import Image from 'next/image'

export async function generateMetadata() {
  const t = await getTranslations('Orders')

  return {
    title: t('title'),
  }
}

interface Props {
  initialOrders: Order[]
}

export default function OrdersClient({ initialOrders }: Props) {
  const t = useTranslations('Orders')
  const locale = useLocale()
  const dispatch = useDispatch<AppDispatch>()
  const { items: orders, loading } = useSelector(
    (state: RootState) => state.orders
  )

  useEffect(() => {
    dispatch(setOrders(initialOrders))
  }, [dispatch, initialOrders])

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString(`${locale}`, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  return (
    <div className={st.order}>
      <Link href="/orders/add-order" className={st.order__addWrapp}>
        <Image
          src={'/add-plus.png'}
          width={20}
          height={20}
          alt={'add order'}
        ></Image>
        <div className={st.product__add}>{t('addOrder')}</div>
      </Link>

      {loading ? (
        <div>Loading...</div>
      ) : orders.length > 0 ? (
        <div className={st.order__orderList}>
          {orders.map((order) => (
            <Link
              href={`orders/${order.id} `}
              key={order.id}
              className={st.order__item}
            >
              <div className={st.order__title}> {order.title}</div>
              <div className={st.order__itemInner}>
                <div className={st.order__linkList}>
                  <Image
                    src={'/list.png'}
                    width={30}
                    height={30}
                    alt={'list'}
                    className={st.order__listImg}
                  ></Image>
                  <div>
                    <div className={st.order__prodNumber}>
                      {order.products.length}
                    </div>
                    <div className={st.order__prodTitle}>Products</div>
                  </div>
                </div>
                <div className={st.order__date}>{formatDate(order.date)}</div>
                <div className={st.item__deleteWrapp}>
                  <Image
                    src={'/delete.png'}
                    width={20}
                    height={20}
                    alt={'delete'}
                    // onClick={(e) => handleDelete(product.id, e)}
                    className={st.item__delete}
                  ></Image>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        // <div className={st.emptyMessage}>{t('productsEmpty')}</div>
        <div className={st.emptyMessage}>empty</div>
      )}
    </div>
  )
}
