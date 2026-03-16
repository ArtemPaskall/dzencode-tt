'use client'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/redux/store'
import { setProducts, fetchProducts, deleteProduct } from '@/redux/productSlice'
import st from './products.module.scss'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { Product } from '@/types'
import Image from 'next/image'

interface Props {
  initialProducts: Product[]
}

export default function ProductsClient({ initialProducts }: Props) {
  const t = useTranslations('Products')
  const dispatch = useDispatch<AppDispatch>()
  const { items: products, loading } = useSelector(
    (state: RootState) => state.products
  )

  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    dispatch(setProducts(initialProducts))
  }, [dispatch, initialProducts])

  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  const handleDelete = async (id: number) => {
    try {
      await dispatch(deleteProduct(id)).unwrap() // unwrap дозволяє ловити помилки
      setMessage('Product was deleted successfully')
      setTimeout(() => setMessage(null), 3000) // приховати через 3 сек
    } catch (err) {
      setError('Failed to delete product')
      setTimeout(() => setError(null), 3000)
    }
  }

  return (
    <>
      <Link href="/products/add-product" className={st.product__add}>
        {t('addProduct')}
      </Link>

      {loading ? (
        <div>Loading...</div>
      ) : products.length > 0 ? (
        <div className={st.product__list}>
          {products.map((product) => (
            <div key={product.serial_number} className={st.product__item}>
              <Link href={`/products/${product.id}`}>{product.id}</Link>
              <div className={st.item__marker}></div>
              <div className={st.item__titleWrapp}>
                <div className={st.item__title}>{product.title}</div>
                <div className={st.item__serial}>{product.serial_number}</div>
              </div>
              <div>{product.is_new ? 'новий' : 'б/у'}</div>
              <div className={st.item__titleWrapp}>
                <div className={st.item__title}>{product.guarantee_start}</div>
                <div className={st.item__serial}>{product.guarantee_end}</div>
              </div>
              <div>{product.price.USD}</div>
              <div>{product.price.EUR}</div>
              <Image
                src={'/delete.png'}
                width={20}
                height={20}
                alt={'delete'}
                onClick={() => handleDelete(product.id)}
              ></Image>
            </div>
          ))}
        </div>
      ) : (
        <div className={st.emptyMessage}>{t('productsEmpty')}</div>
      )}

      {message && (
        <div className={st.deleteMessage}>
          <Image src={'/success.png'} width={20} height={20} alt={'success'} />
          {message}
        </div>
      )}
      {error && (
        <div
          className={st.deleteMessage}
          style={{ backgroundColor: '#f8d7da' }}
        >
          <Image src={'/cross.png'} width={20} height={20} alt={'success'} />
          {error}
        </div>
      )}
    </>
  )
}
