import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { Order } from '@/types'

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

type Payload = {
  orderId: number
  productId: number
}

// export const fetchOrders = createAsyncThunk(
//   'orders/fetchOrders',
//   async () => {
//     const res = await fetch('/api/orders')
//     return await res.json()
//   }
// )

export const deleteOrder = createAsyncThunk(
  'orders/deleteOrder',
  async (id: number, { rejectWithValue }) => {
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

export const removeProductFromOrder = createAsyncThunk(
  'orders/removeProductFromOrder',
  async ({ orderId, productId }: Payload, { rejectWithValue }) => {
    const res = await fetch('/api/orders/remove-prod', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ orderId, productId }),
    })

    if (!res.ok) {
      const data = await res.json()
      return rejectWithValue(data.error || 'Delete failed')
    }

    return { orderId, productId }
  }
)

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setOrders(state, action: { payload: Order[] }) {
      state.items = action.payload
    },
  },

  extraReducers: (builder) => {
    builder

      // fetch
      // .addCase(fetchOrders.pending, (state) => {
      //   state.loading = true
      // })

      // .addCase(fetchOrders.fulfilled, (state, action) => {
      //   state.loading = false
      //   state.items = action.payload
      // })

      // .addCase(fetchOrders.rejected, (state, action) => {
      //   state.loading = false
      //   state.error = action.error.message || 'Error'
      // })

      // delete
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.items = state.items.filter((o) => o.id !== action.payload)
      })

      .addCase(removeProductFromOrder.fulfilled, (state, action) => {
        const { orderId, productId } = action.payload

        const order = state.items.find((o) => o.id === orderId)

        if (order) {
          order.products = order.products.filter((p) => p.id !== productId)
        }
      })
  },
})

export const { setOrders } = ordersSlice.actions
export default ordersSlice.reducer
