'use client'

import { Montserrat, Inter } from 'next/font/google'
import './styles/globals.scss'
import { Provider } from 'react-redux'
import { store } from '@/redux/store'

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  weight: ['300', '400', '500', '600'],
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['300', '400', '500', '600'],
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body className={`${montserrat.variable} ${inter.variable}`}>
        <Provider store={store}>{children}</Provider>
      </body>
    </html>
  )
}
