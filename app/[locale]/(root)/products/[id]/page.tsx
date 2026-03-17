import { notFound } from 'next/navigation'
import { Product } from '@/types'
import db from '@/libs/db'
import { RowDataPacket } from 'mysql2'
import Image from 'next/image'
import st from './productID.module.scss'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata({ params }: Props) {
  const t = await getTranslations('ProductPage')
  const { id } = await params

  return {
    title: `${t('title')} ${id}`,
  }
}

interface Props {
  params: { id: string }
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params
  const t = await getTranslations('ProductPage')

  const [rows] = await db.query<RowDataPacket[]>(
    'SELECT * FROM products WHERE id = ?',
    [id]
  )

  const product = rows[0] as Product | undefined

  if (!product) return notFound()

  return (
    <div className={st.productsPage}>
      <h3>
        {t('productDetails')} ID: {product.id}
      </h3>
      <div className={st.productsPage__photoWrapp}>
        {product.photo ? (
          <Image
            src={product.photo}
            width={100}
            height={100}
            alt={product.title || t('productImage')}
            className={st.productsPage__photo}
          />
        ) : (
          <Image
            src={'/logo.svg'}
            width={100}
            height={100}
            alt={product.title || t('productImage')}
            className={st.productsPage__photo}
          />
        )}
        <div className={st.infoProduct}>
          <div>
            <h1>{product.title}</h1>
            <div className={st.infoProduct__serialNum}>
              S/N: {product.serial_number}
            </div>
          </div>
          <div className={st.infoProduct__wrapp}>
            <div>
              <div>{t('type')}: </div>
              <div className={st.infoProduct__type}>{product.type}</div>
            </div>
            <div>
              <div>{t('condition')}: </div>
              <div
                className={
                  product.is_new
                    ? st.infoProduct__newProduct
                    : st.infoProduct__usedProduct
                }
              >
                {product.is_new ? t('new') : t('used')}
              </div>
            </div>
            <div className={st.infoProduct__priceWrapp}>
              <div>{t('price')}:</div>
              <div className={st.infoProduct__priceWrappInner}>
                <div className={st.infoProduct__priceTitle}>
                  {product.price[0].value}{' '}
                  <span className={st.infoProduct__priceCurrency}>UAH</span>
                </div>
                <div className={st.infoProduct__priceTitle}>
                  {product.price[1].value}{' '}
                  <span className={st.infoProduct__priceCurrency}>USD</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={st.productsPage__specTitle}>{t('specification')}:</div>
      <div className={st.productsPage__spec}>{product.specification}</div>
    </div>
  )
}
