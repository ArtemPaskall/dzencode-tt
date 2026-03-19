'use client'
import '@/app/styles/globals.scss'
import st from './orders.module.scss'
import { Link } from '@/i18n/navigation'
import { Order } from '@/types'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/redux/store'
import { setOrders, deleteOrder } from '@/redux/orderSlice'
import { useLocale, useTranslations } from 'next-intl'
import type { MouseEvent } from 'react'
import Image from 'next/image'

interface Props {
  initialOrders: Order[]
}

export default function OrdersClient({ initialOrders }: Props) {
  const t = useTranslations('Orders')
  const locale = useLocale()
  const dispatch = useDispatch<AppDispatch>()
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { items: orders, loading } = useSelector(
    (state: RootState) => state.orders
  )

  const deletingOrder = orders.find((order) => order.id === deletingId)

  const getOrderTotalInUAH = (order: Order) => {
    return (
      order.products?.reduce((sum, product) => {
        const uahPrice = product.price.find((p) => p.symbol === 'UAH')
        return sum + (uahPrice?.value ?? 0)
      }, 0) ?? 0
    )
  }

  const getOrderTotalInUSD = (order: Order) => {
    return (
      order.products?.reduce((sum, product) => {
        const usdPrice = product.price.find((p) => p.symbol === 'USD')
        return sum + (usdPrice?.value ?? 0)
      }, 0) ?? 0
    )
  }

  function openDeleteModal(id: number, event?: MouseEvent) {
    if (event) {
      event.preventDefault()
      event.stopPropagation()
    }

    setIsOrderModalOpen(true)
    setDeletingId(id)
  }

  function closeDeleteModal() {
    setIsOrderModalOpen(false)
    setDeletingId(null)
  }

  async function confirmDelete() {
    if (deletingId === null) return

    setIsDeleting(true)
    setError(null)

    try {
      await dispatch(deleteOrder(deletingId)).unwrap()
      setMessage(t('orderDeletedSuccess'))

      setTimeout(() => {
        closeDeleteModal()
        setMessage(null)
      }, 2000)
    } catch (err) {
      setError(t('deleteOrderError'))
    } finally {
      setIsDeleting(false)
    }
  }

  useEffect(() => {
    dispatch(setOrders(initialOrders))
  }, [dispatch, initialOrders])

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [message])

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [error])

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
            <div key={order.id} className={st.order__item}>
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
                      {order.products?.length ?? 0}
                    </div>
                    <div className={st.order__prodTitle}>{t('products')}</div>
                  </div>
                </div>
                <div className={st.order__date}>{formatDate(order.date)}</div>
                <div>
                  <div>{getOrderTotalInUAH(order)} UAH</div>
                  <div>{getOrderTotalInUSD(order)} USD</div>
                </div>
                <div
                  className={st.item__deleteWrapp}
                  onClick={(e) => openDeleteModal(order.id, e)}
                >
                  <Image
                    src={'/delete.png'}
                    width={20}
                    height={20}
                    alt={'delete'}
                    className={st.item__delete}
                  ></Image>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={st.emptyMessage}>{t('ordersEmpty')}</div>
      )}

      {isOrderModalOpen && (
        <div className={st.modalWrapp}>
          <div className={st.modal}>
            <Image
              src={'/close.png'}
              width={30}
              height={30}
              alt={'delete'}
              onClick={() => closeDeleteModal()}
              className={st.modal__close}
            ></Image>
            <div className={st.modal__top}>
              <div>{t('confirmDeleteOrder')}</div>
              <div className={st.modal__item}>{deletingOrder?.title}</div>
              {message && (
                <div className={st.success}>
                  <Image
                    src={'/success.png'}
                    width={20}
                    height={20}
                    alt={'success'}
                  ></Image>
                  {message}
                </div>
              )}
              {error && (
                <div className={st.error}>
                  <Image
                    src={'/cross.png'}
                    width={20}
                    height={20}
                    alt={'success'}
                  ></Image>
                  {error}
                </div>
              )}
            </div>

            <div className={st.modal__bottom}>
              <button
                type="button"
                className={st.modal__cancel}
                onClick={() => closeDeleteModal()}
              >
                {t('cancel')}
              </button>

              <button
                type="button"
                onClick={confirmDelete}
                disabled={isDeleting}
                className={st.modal__delete}
              >
                {isDeleting ? t('deleting') : t('delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
