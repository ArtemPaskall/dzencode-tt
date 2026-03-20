import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { Product } from '@/types'

interface ProductsState {
  items: Product[]
  loading: boolean
  error: string | null
}

const initialState: ProductsState = {
  items: [],
  loading: false,
  error: null,
}

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id: number, { rejectWithValue }) => {
    const res = await fetch(`/api/products/${id}`, {
      method: 'DELETE',
    })

    if (!res.ok) {
      const data = await res.json()
      return rejectWithValue(data.error || 'Delete failed')
    }

    return id
  }
)

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts(state, action: { payload: Product[] }) {
      state.items = action.payload
    },
  },

  extraReducers: (builder) => {
    builder.addCase(deleteProduct.fulfilled, (state, action) => {
      state.items = state.items.filter((p) => p.id !== action.payload)
    })
  },
})

export const { setProducts } = productsSlice.actions
export default productsSlice.reducer
