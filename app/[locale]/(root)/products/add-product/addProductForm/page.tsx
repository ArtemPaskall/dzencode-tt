'use client'

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import st from './add-product.module.scss'
import { useTranslations } from 'next-intl'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

export default function AddProductForm() {
  const t = useTranslations('AddProduct')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return
    setFile(selectedFile)

    const reader = new FileReader()
    reader.onloadend = () => setImageSrc(reader.result as string)
    reader.readAsDataURL(selectedFile)
  }

  function closeImagePreload() {
    setImageSrc(null)
    setFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function uploadToCloudinary(file: File): Promise<string> {
    const formData = new FormData()
    formData.append('file', file)

    const res = await fetch('/api/uploadFile', {
      method: 'POST',
      body: formData,
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data?.message || 'Upload failed')
    return data.url
  }

  const productSchema = z.object({
    title: z
      .string()
      .trim()
      .min(3, { message: t('min_3_characters') })
      .max(100, { message: t('max_100_characters') }),

    specification: z
      .string()
      .trim()
      .min(5, { message: t('min_5_characters') })
      .max(2000, { message: t('max_2000_characters') }),

    type: z.enum(['monitor', 'tv', 'smartphone', 'laptop', 'tablet'], {
      message: t('invalid_type'),
    }),

    isNew: z.enum(['0', '1'], { message: t('required') }),

    guaranteeStart: z
      .string()
      .min(1, { message: t('required') })
      .refine((val) => !isNaN(Date.parse(val)), { message: t('invalid_date') }),

    guaranteeEnd: z
      .string()
      .min(1, { message: t('required') })
      .refine((val) => !isNaN(Date.parse(val)), { message: t('invalid_date') }),

    priceValue: z
      .number()
      .refine((val) => !isNaN(val), { message: t('must_be_number') })
      .refine((val) => val > 0, { message: t('greater_than_0') })
      .refine((val) => val <= 1000000, { message: t('too_large') }),

    photo: z
      .string()
      .optional()
      .refine(
        (val) => !val || /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/i.test(val),
        {
          message: t('invalid_photo_url'),
        }
      ),
  })

  type ProductFormData = z.infer<typeof productSchema>

  const today = new Date()
  const formattedToday = today.toISOString().split('T')[0] // "YYYY-MM-DD"

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: '',
      specification: '',
      type: 'monitor',
      isNew: '1',
      guaranteeStart: formattedToday,
      guaranteeEnd: '',
      priceValue: 0,
      photo: '',
    },
  })

  const generateSerialNumber = () => {
    return `SN-${Date.now()}-${Math.floor(Math.random() * 1000)}`
  }

  const onSubmit = async (data: ProductFormData) => {
    setLoading(true)
    try {
      let photoUrl = data.photo
      if (file) {
        photoUrl = await uploadToCloudinary(file)
      }

      const USD_RATE = 45
      const priceConverted = [
        {
          value: Number(data.priceValue),
          symbol: 'UAH',
          isDefault: 1,
        },
        {
          value: Math.round(Number(data.priceValue) / USD_RATE),
          symbol: 'USD',
          isDefault: 0,
        },
      ]

      const payload = {
        ...data,
        photo: photoUrl || null,
        serial_number: generateSerialNumber(),
        price: priceConverted,
      }

      const response = await fetch('/api/products/addProduct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        setMessage({ type: 'success', text: t('product_added') })
        reset()
        setImageSrc(null)
        setFile(null)
      } else {
        const errorData = await response.json().catch(() => null)
        setMessage({
          type: 'error',
          text: errorData?.message || t('error_occurred'),
        })
      }
    } catch (err) {
      console.error(err)
      setMessage({ type: 'error', text: t('error_occurred') })
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

  return (
    <div>
      <div className={st['form-wrapper']}>
        <h2 className={st['form-header']}>{t('header')}</h2>
        <form onSubmit={handleSubmit(onSubmit)} className={st['product-form']}>
          <div className={st['product-form__group']}>
            <label className={st['product-form__label']}>{t('title')}</label>
            {errors.title && (
              <p className={st['error']}>{errors.title.message}</p>
            )}
            <input
              className={st['product-form__input']}
              {...register('title')}
            />
          </div>

          <div className={st['product-form__group']}>
            <label className={st['product-form__label']}>
              {t('specification')}
            </label>
            {errors.specification && (
              <p className={st['error']}>{errors.specification.message}</p>
            )}
            <textarea
              className={st['product-form__textarea']}
              {...register('specification')}
            />
          </div>

          <div className={st['product-form__group']}>
            <label className={st['product-form__label']}>{t('type')}</label>
            {errors.type && (
              <p className={st['error']}>{errors.type.message}</p>
            )}
            <select
              className={st['product-form__select']}
              {...register('type')}
            >
              <option value="monitor">Monitor</option>
              <option value="tv">TV</option>
              <option value="smartphone">Smartphone</option>
              <option value="laptop">Laptop</option>
              <option value="tablet">Tablet</option>
            </select>
          </div>

          <div className={st['product-form__group']}>
            <label className={st['product-form__label']}>
              {t('condition')}
            </label>
            {errors.isNew && (
              <p className={st['error']}>{errors.isNew.message}</p>
            )}
            <select
              className={st['product-form__select']}
              {...register('isNew')}
            >
              <option value="1">{t('new')}</option>
              <option value="0">{t('used')}</option>
            </select>
          </div>

          <div className={st['product-form__group']}>
            <label className={st['product-form__label']}>
              {t('guaranteeStart')}
            </label>
            {errors.guaranteeStart && (
              <p className={st['error']}>{errors.guaranteeStart.message}</p>
            )}
            <input
              type="date"
              className={st['product-form__input']}
              {...register('guaranteeStart')}
            />
          </div>

          <div className={st['product-form__group']}>
            <label className={st['product-form__label']}>
              {t('guaranteeEnd')}
            </label>
            {errors.guaranteeEnd && (
              <p className={st['error']}>{errors.guaranteeEnd.message}</p>
            )}
            <input
              type="date"
              className={st['product-form__input']}
              {...register('guaranteeEnd')}
            />
          </div>

          <div className={st['product-form__group']}>
            <label className={st['product-form__label']}>{t('price')}</label>
            {errors.priceValue && (
              <p className={st['error']}>{errors.priceValue.message}</p>
            )}
            <input
              type="number"
              className={st['product-form__input']}
              {...register('priceValue', { valueAsNumber: true })}
              onFocus={(e) => {
                if (e.currentTarget.value === '0') e.currentTarget.value = ''
              }}
            />
          </div>

          <label className={st.uploadButton}>
            {t('uploadPhoto')}
            {errors.photo && (
              <p className={st['error']}>{errors.photo.message}</p>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className={st.hiddenInput}
            />
          </label>

          {imageSrc && (
            <div className={st['image-preload-wrapp']}>
              <Image
                src={imageSrc}
                alt="preview"
                width={200}
                height={200}
                className={st['image-preload']}
              />
              <Image
                src="/cross.png"
                alt="close"
                width={20}
                height={20}
                onClick={closeImagePreload}
                className={st['image-preload-close']}
              />
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
                alt={'success'}
              ></Image>
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
      </div>
    </div>
  )
}
