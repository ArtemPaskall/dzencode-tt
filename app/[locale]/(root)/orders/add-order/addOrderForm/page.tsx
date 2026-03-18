'use client'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import st from './addOrderForm.module.scss'
import { Product } from '@/types'

export default function AddOrderForm() {
  const t = useTranslations('AddOrder')
  const [message, setMessage] = useState<{
    text: string
    type: 'success' | 'error'
  } | null>(null)
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [isProdModalOpen, setIsProdModalOpen] = useState(false)
  const [selectedProducts, setSelectedProducts] = useState<number[]>([])

  const orderSchema = z.object({
    title: z
      .string()
      .trim()
      .min(3, { message: t('min_3_characters') })
      .max(100, { message: t('max_100_characters') }),
    description: z
      .string()
      .trim()
      .min(5, { message: t('min_5_characters') })
      .max(2000, { message: t('max_2000_characters') }),
    selectedProducts: z.array(z.number()),
  })

  type OrderFormData = z.infer<typeof orderSchema>

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      title: '',
      description: '',
      selectedProducts: [],
    },
  })

  const onSubmit = async (data: OrderFormData) => {
    setLoading(true)
    setMessage(null)

    const finalData = {
      ...data,
      productIds: selectedProducts,
    }

    try {
      const response = await fetch('/api/orders/addOrder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        setMessage({
          text: errorData?.message || t('something_went_wrong'),
          type: 'error',
        })
      } else {
        setMessage({
          text: t('order_added_successfully'),
          type: 'success',
        })
        reset()
        setSelectedProducts([])
      }
    } catch (error) {
      setMessage({
        text: t('network_error'),
        type: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [message])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products')
        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }
        const data = await response.json()
        setProducts(data)
      } catch (error) {
        console.error('Error fetching products:', error)
      }
    }

    fetchProducts()
  }, [])

  useEffect(() => {
    setValue('selectedProducts', selectedProducts)
  }, [selectedProducts])

  const toggleProduct = (id: number) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  // console.log(products)
  console.log(selectedProducts)
  return (
    <div className={st['form-wrapper']}>
      <h2 className={st['form-header']}>{t('addOrder')}</h2>
      <form onSubmit={handleSubmit(onSubmit)} className={st['product-form']}>
        <div className={st['product-form__group']}>
          <label className={st['product-form__label']}>{t('title')}</label>
          {errors.title && (
            <p className={st['error']}>{errors.title.message}</p>
          )}
          <input className={st['product-form__input']} {...register('title')} />
        </div>

        <div className={st['product-form__group']}>
          <label className={st['product-form__label']}>
            {t('description')}
          </label>
          {errors.description && (
            <p className={st['error']}>{errors.description.message}</p>
          )}
          <textarea
            className={st['product-form__textarea']}
            {...register('description')}
          />
        </div>

        <div
          className={st.order__addProdWrapp}
          onClick={() => setIsProdModalOpen(true)}
        >
          <Image
            src={'/add-plus.png'}
            width={20}
            height={20}
            alt={'add order'}
          ></Image>
          <div className={st.product__add}>{t('addProduct')}</div>
        </div>

        {selectedProducts.length > 0 && (
          <div className={st.products__add}>
            <Image
              src={'/success.png'}
              width={20}
              height={20}
              alt={'add products'}
            ></Image>
            <strong> {selectedProducts.length}</strong>
            {t('itemAdd')}
          </div>
        )}

        {message && (
          <div
            className={`${st.message} ${message.type === 'success' ? st.success : st.errorMessage}`}
          >
            <Image
              src={`${message.type === 'success' ? '/success.png' : '/cross.png'}`}
              width={20}
              height={20}
              alt={message.type}
            />
            {message.text}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={st['product-form__submit']}
        >
          {loading ? <span className={st.spinner}></span> : t('submit')}
        </button>
      </form>
      {isProdModalOpen && (
        <div className={st.prodModalWrapp}>
          <div className={st.prodModal}>
            <div className={st.prodModal__header}>{t('canAddProducts')}</div>
            <div className={st.prodList}>
              {products.map((product) => {
                const isSelected = selectedProducts.includes(product.id)

                return (
                  <div
                    key={product.id}
                    className={`${st.prodItem} ${isSelected ? st.active : ''}`}
                    onClick={() => toggleProduct(product.id)}
                  >
                    <div className={st.checkbox}>
                      {isSelected && <span className={st.checkmark}>✓</span>}
                    </div>

                    <div>{product.title}</div>
                    <div>{`${product.price[1].value} $`}</div>
                  </div>
                )
              })}
            </div>

            <div
              onClick={() => {
                setIsProdModalOpen(false)
              }}
              className={st.addButton}
            >
              {t('add')}
            </div>

            <Image
              src={'/close.png'}
              width={30}
              height={30}
              alt={'close'}
              className={st.prodModalClose}
              onClick={() => {
                setIsProdModalOpen(false)
              }}
            ></Image>
          </div>
        </div>
      )}
    </div>
  )
}
