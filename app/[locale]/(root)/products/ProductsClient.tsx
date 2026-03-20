'use client'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/redux/store'
import { setProducts, deleteProduct } from '@/redux/productSlice'
import st from './products.module.scss'
import { Link } from '@/i18n/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { Product, ProductType } from '@/types'
import Image from 'next/image'

interface Props {
  initialProducts: Product[]
}

const productTypes: ProductType[] = [
  'monitor',
  'tv',
  'smartphone',
  'laptop',
  'tablet',
]

export default function ProductsClient({ initialProducts }: Props) {
  const t = useTranslations('Products')
  const locale = useLocale()
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const dispatch = useDispatch<AppDispatch>()
  const { items: products, loading } = useSelector(
    (state: RootState) => state.products
  )
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<ProductType | 'all'>('all')

  useEffect(() => {
    dispatch(setProducts(initialProducts))
  }, [dispatch, initialProducts])

  const handleDelete = async (id: number, event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault()
      event.stopPropagation()
    }

    setDeletingId(id)

    try {
      await dispatch(deleteProduct(id)).unwrap()
      setMessage('Product was deleted successfully')
      setTimeout(() => setMessage(null), 3000)
    } catch (err) {
      setError('Failed to delete product')
      setTimeout(() => setError(null), 3000)
    }
    setDeletingId(null)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString(`${locale}`, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  const filteredProducts = products.filter((product) => {
    if (selectedType === 'all') return true
    return product.type === selectedType
  })

  return (
    <>
      <div className={st.product__topMenu}>
        <Link href="/products/add-product" className={st.product__addWrapp}>
          <Image
            src={'/add-plus.png'}
            width={20}
            height={20}
            alt={'add product'}
          ></Image>
          <div className={st.product__add}>{t('addProduct')}</div>
        </Link>

        <select
          value={selectedType}
          onChange={(e) =>
            setSelectedType(e.target.value as ProductType | 'all')
          }
          className={st.filter}
        >
          <option value="all">All</option>
          {productTypes.map((type) => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : filteredProducts.length > 0 ? (
        <div className={st.product__list}>
          {filteredProducts.map((product) => (
            <Link
              href={`/products/${product.id}`}
              key={product.id}
              className={`${st.product__item} ${deletingId === product.id ? st.deleting : ''}`}
            >
              <div className={st.item__marker}></div>

              {product.photo ? (
                <Image
                  src={product.photo}
                  width={40}
                  height={40}
                  alt={'delete'}
                  className={st.item__photo}
                ></Image>
              ) : (
                <Image
                  src={`${'/logo.svg'}`}
                  width={40}
                  height={40}
                  alt={'delete'}
                  className={st.item__photo}
                ></Image>
              )}
              <div className={st.item__titleWrapp}>
                <div className={st.item__title}>{product.title}</div>
                <div className={st.item__serial}>{product.serial_number}</div>
              </div>
              <div className={st.item__type}>{product.type}</div>
              <div className={st.item__guaranteeWrapp}>
                <div className={st['item__guaranteeWrapp--inner']}>
                  <div className={st.item__dateTitle}>{t('from')}</div>
                  <div className={st.item__date}>
                    {formatDate(product.guarantee_start)}
                  </div>
                </div>
                <div className={st['item__guaranteeWrapp--inner']}>
                  <div className={st.item__dateTitle}>{t('to')}</div>
                  <div className={st.item__date}>
                    {formatDate(product.guarantee_end)}
                  </div>
                </div>
              </div>
              <div
                className={`${st.item__condition} ${product.is_new ? st['item__condition--new'] : ''}`}
              >
                {product.is_new ? t('new') : t('used')}
              </div>
              <div className={st.item__priceWrapp}>
                <div className={st['item__guaranteeWrapp--inner']}>
                  <div className={st.item__date}>
                    {product.price?.[1]?.value ?? '-'}
                  </div>
                  <div className={st.item__dateTitle}>$</div>
                </div>
                <div className={st['item__guaranteeWrapp--inner']}>
                  <div className={st.item__date}>
                    {product.price?.[0]?.value ?? '-'}
                  </div>
                  <div className={st.item__dateTitle}>UAH</div>
                </div>
              </div>
              <div className={st.item__deleteWrapp}>
                <Image
                  src={'/delete.png'}
                  width={20}
                  height={20}
                  alt={'delete'}
                  onClick={(e) => handleDelete(product.id, e)}
                  className={st.item__delete}
                ></Image>
              </div>
            </Link>
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
