'use client'
import '@/app/styles/globals.scss'
import st from './orders.module.scss'
import { useMemo } from 'react'
import { Link } from '@/i18n/navigation'
import { Order, Product } from '@/types'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/redux/store'
import {
  setOrders,
  deleteOrder,
  removeProductFromOrder,
  addProductsToOrderAsync,
} from '@/redux/orderSlice'
import { useLocale, useTranslations } from 'next-intl'
import type { MouseEvent } from 'react'
import Image from 'next/image'
import ProductItem from './(components)/ProductItem'
import DeleteOrderModal from './(components)/DeleteOrderModal'
import OrderItem from './(components)/OrderItem'

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
  const [activeOrderId, setActiveOrderId] = useState<number | null>(null)
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [selectedProducts, setSelectedProducts] = useState<number[]>([])
  const [isProdListOpen, setIsProdListOpen] = useState<boolean>(false)

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products')
        const data = await res.json()
        setAllProducts(data)
      } catch (err) {
        console.log(err)
      }
    }

    fetchProducts()
  }, [])

  const availableProducts = useMemo(() => {
    const order = orders.find((o) => o.id === activeOrderId)

    if (!order) return []

    return allProducts.filter(
      (product) => !order.products?.some((p) => p.id === product.id)
    )
  }, [allProducts, orders, activeOrderId])

  useEffect(() => {
    setSelectedProducts([])
  }, [activeOrderId])

  const handleAddProductsToOrder = async () => {
    if (!activeOrderId || selectedProducts.length === 0) return

    try {
      dispatch(
        addProductsToOrderAsync({
          orderId: activeOrderId,
          productIds: selectedProducts,
          allProducts,
        })
      )

      setSelectedProducts([])
    } catch (err) {
      console.log(err)
    }
  }

  const toggleProduct = (id: number) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    )
  }

  const deletingOrder = orders.find((order) => order.id === deletingId)

  const getOrderTotalInUAH = (order: Order) => {
    const totalSum =
      order.products?.reduce((sum, product) => {
        const uahPrice = product.price?.find((p) => p.symbol === 'UAH')
        return sum + (uahPrice?.value ?? 0)
      }, 0) ?? 0
    return totalSum !== 0 ? totalSum : '-'
  }

  const getOrderTotalInUSD = (order: Order) => {
    const totalSum =
      order.products?.reduce((sum, product) => {
        const usdPrice = product.price?.find((p) => p.symbol === 'USD')
        return sum + (usdPrice?.value ?? 0)
      }, 0) ?? 0
    return totalSum !== 0 ? totalSum : '-'
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
      console.log(err)
      setError(t('deleteOrderError'))
    } finally {
      setIsDeleting(false)
    }
  }

  useEffect(() => {
    dispatch(setOrders(initialOrders))
  }, [])

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

  const openProductList = (id: number) => {
    if (activeOrderId !== id) {
      setActiveOrderId(id)
    } else {
      setActiveOrderId(null)
    }
  }

  const activeOrder = orders.find((o) => o.id === activeOrderId)

  const removeProductFromOrderHandler = async (
    productId: number,
    e: MouseEvent
  ) => {
    e.preventDefault()
    e.stopPropagation()

    if (!activeOrderId) return

    try {
      await dispatch(
        removeProductFromOrder({
          orderId: activeOrderId,
          productId,
        })
      ).unwrap()
    } catch (err) {
      console.log(err)
    }
  }

  const toggelProdListOpen = () => {
    setIsProdListOpen((prev) => !prev)
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
        <div className={st.container}>
          <div
            className={`${st.order__orderList} ${activeOrderId ? st.shrink : ''}`}
          >
            {orders.map((order) => (
              <OrderItem
                key={order.id}
                order={order}
                onOpen={openProductList}
                onDelete={openDeleteModal}
                formatDate={formatDate}
                getUAH={getOrderTotalInUAH}
                getUSD={getOrderTotalInUSD}
                t={t}
                isActive={activeOrderId === order.id}
              />
            ))}
          </div>

          {activeOrder && (
            <div className={st.sideList}>
              <Image
                src={'/close.png'}
                width={25}
                height={25}
                alt={'close'}
                className={st.sideList__close}
                onClick={() => setActiveOrderId(null)}
              ></Image>

              <h3 className={st.sideList__title}>{activeOrder.title}</h3>

              <div
                className={st.addProd__openButton}
                onClick={() => toggelProdListOpen()}
              >
                {t('addProduct')}
                <Image
                  src={'/arrow.png'}
                  width={25}
                  height={25}
                  alt={'arrow'}
                  className={`${st.addProd__openButtonImg} ${
                    isProdListOpen ? st.rotate : ''
                  }`}
                ></Image>
              </div>

              {isProdListOpen && (
                <div className={st.addProd__prodList}>
                  {availableProducts.length === 0 ? (
                    <div className={st.addProd__empty}>{t('emptyList')}</div>
                  ) : (
                    <>
                      {availableProducts.map((product) => (
                        <div key={product.id}>
                          <label className={st.addProd__label}>
                            <input
                              className={st.addProd__checkbox}
                              type="checkbox"
                              checked={selectedProducts.includes(product.id)}
                              onChange={() => toggleProduct(product.id)}
                            />
                            {product.title}
                          </label>
                        </div>
                      ))}

                      <div
                        className={st.addProd__addProdButton}
                        onClick={handleAddProductsToOrder}
                      >
                        {t('add')}
                      </div>
                    </>
                  )}
                </div>
              )}

              {activeOrder.products?.length > 0 ? (
                <div className={st.sideList__itemsList}>
                  {activeOrder.products.map((product) => (
                    <ProductItem
                      key={product.id}
                      product={product}
                      onRemove={removeProductFromOrderHandler}
                    />
                  ))}
                </div>
              ) : (
                <div>{t('emptyList')}</div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className={st.emptyMessage}>{t('ordersEmpty')}</div>
      )}

      <DeleteOrderModal
        isOpen={isOrderModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
        message={message}
        error={error}
        orderTitle={deletingOrder?.title}
        t={t}
      />
    </div>
  )
}
