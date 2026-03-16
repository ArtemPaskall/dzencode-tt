// export interface ProductPriceItem {
//   value: number
//   symbol: string
//   isDefault: 0 | 1
// }

export interface ProductPriceItem {
  USD: string
  EUR: string
}

export interface Product {
  id: number
  serial_number: number
  is_new: boolean
  photo: string
  title: string
  type: string
  specification: string
  guarantee_start: string
  guarantee_end: string
  price: ProductPriceItem
  order_id: number
  date: string
}

export interface Order {
  id: number
  title: string
  description: string
  date: string
}
