import NavigationMenu from '@/components/NavigationMenu/page'
import TopMenu from '@/components/TopMenu/page'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { Suspense } from 'react'
import LoadingBar from '@/components/LoadingBar/page'

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const messages = await getMessages({ locale })

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Suspense fallback={<LoadingBar />}>
        <TopMenu />

        <main className={'main-wrapp'}>
          <NavigationMenu />
          <div className={'page-content'}>{children}</div>
        </main>
      </Suspense>
    </NextIntlClientProvider>
  )
}
