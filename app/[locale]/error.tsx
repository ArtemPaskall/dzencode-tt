'use client'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import st from '../styles/error.module.scss'

export default function RootError({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  const t = useTranslations('ErrorPage')

  return (
    <div className={st.Error}>
      <h1>{t('title')}</h1>
      <p>{error.message}</p>
      <button onClick={() => reset()} className={st.Error__resetButton}>
        {t('tryAgain')}
      </button>
      <Link href={'/'} className={st.Error__homeButton}>
        {t('goHome')}
      </Link>
    </div>
  )
}
