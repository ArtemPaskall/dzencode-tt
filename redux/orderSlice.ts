import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { Order, Product } from '@/types'

interface OrdersState {
  items: Order[]
  loading: boolean
  error: string | null
}

const initialState: OrdersState = {
  items: [],
  loading: false,
  error: null,
}

type RemovePayload = {
  orderId: number
  productId: number
}

type AddProductsPayload = {
  orderId: number
  products: Product[]
}

export const fetchOrders = createAsyncThunk<Order[]>(
  'orders/fetchOrders',
  async () => {
    const res = await fetch('/api/orders')
    if (!res.ok) throw new Error('Failed to fetch orders')
    return await res.json()
  }
)

export const deleteOrder = createAsyncThunk<number, number>(
  'orders/deleteOrder',
  async (id, { rejectWithValue }) => {
    const res = await fetch(`/api/orders/${id}`, {
      method: 'DELETE',
    })

    if (!res.ok) {
      const data = await res.json()
      return rejectWithValue(data.error || 'Delete failed')
    }

    return id
  }
)

export const removeProductFromOrder = createAsyncThunk<
  RemovePayload,
  RemovePayload
>(
  'orders/removeProductFromOrder',
  async ({ orderId, productId }, { rejectWithValue }) => {
    const res = await fetch('/api/orders/remove-prod', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, productId }),
    })

    if (!res.ok) {
      const data = await res.json()
      return rejectWithValue(data.error || 'Delete failed')
    }

    return { orderId, productId }
  }
)

export const addProductsToOrderAsync = createAsyncThunk<
  AddProductsPayload,
  { orderId: number; productIds: number[]; allProducts: Product[] }
>(
  'orders/addProductsToOrderAsync',
  async ({ orderId, productIds, allProducts }, { rejectWithValue }) => {
    const res = await fetch('/api/orders/add-products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, productIds }),
    })

    if (!res.ok) {
      const data = await res.json()
      return rejectWithValue(data.error || 'Add failed')
    }

    const products = allProducts.filter((p) => productIds.includes(p.id))

    return { orderId, products }
  }
)

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setOrders(state, action: PayloadAction<Order[]>) {
      state.items = action.payload
    },
  },

  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Error'
      })

      // DELETE ORDER
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.items = state.items.filter((o) => o.id !== action.payload)
      })

      // REMOVE PRODUCT
      .addCase(removeProductFromOrder.fulfilled, (state, action) => {
        const { orderId, productId } = action.payload

        const order = state.items.find((o) => o.id === orderId)

        if (order) {
          order.products = (order.products || []).filter(
            (p) => p.id !== productId
          )
        }
      })

      //  ADD PRODUCTS
      .addCase(addProductsToOrderAsync.fulfilled, (state, action) => {
        const { orderId, products } = action.payload

        const order = state.items.find((o) => o.id === orderId)

        if (order) {
          order.products = [...(order.products || []), ...products]
        }
      })
  },
})

export const { setOrders } = ordersSlice.actions
export default ordersSlice.reducer
