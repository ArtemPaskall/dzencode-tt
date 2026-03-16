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
  order_id: number | null
  date: string
}

export interface Order {
  id: number
  title: string
  description: string
  date: string
}
