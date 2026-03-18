import { configureStore } from '@reduxjs/toolkit'
import productsReducer from './productSlice'
import ordersReducer from './orderSlice'

export const store = configureStore({
  reducer: {
    products: productsReducer,
    orders: ordersReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
