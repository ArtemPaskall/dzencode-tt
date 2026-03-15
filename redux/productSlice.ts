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

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async () => {
    const res = await fetch('/api/products')
    return await res.json()
  }
)

export const addProduct = createAsyncThunk(
  'products/addProduct',
  async (product: Omit<Product, 'id'>) => {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    })

    return await res.json()
  }
)

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id: number) => {
    await fetch(`/api/products/${id}`, {
      method: 'DELETE',
    })

    return id
  }
)

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder

      // fetch
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true
      })

      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })

      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Error'
      })

      // add
      .addCase(addProduct.fulfilled, (state, action) => {
        state.items.push(action.payload)
      })

      // delete
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p.id !== action.payload)
      })
  },
})

export default productsSlice.reducer
