import { RowDataPacket } from 'mysql2'

export interface ProductPriceItem {
  value: number
  symbol: string
  isDefault: 0 | 1
}

export type ProductType = 'monitor' | 'tv' | 'smartphone' | 'laptop' | 'tablet'

export interface Product {
  id: number
  serial_number: string
  is_new: boolean
  photo: string
  title: string
  type: ProductType
  specification: string
  guarantee_start: string
  guarantee_end: string
  price: ProductPriceItem[]
  date: string
}

export interface Order {
  id: number
  title: string
  description: string
  date: string
  products: Product[]
}

export interface OrderWithProductRow extends RowDataPacket {
  order_id: number
  order_title: string
  order_description: string
  order_date: string | Date

  product_id?: number
  serial_number?: string
  is_new?: number
  photo?: string
  product_title?: string
  type?: ProductType
  specification?: string
  guarantee_start?: string | Date | null
  guarantee_end?: string | Date | null
  price?: string | null
  product_date?: string | Date | null
}
