import { getTranslations } from 'next-intl/server'
import st from './styles/not-found.module.scss'

export async function generateMetadata() {
  const t = await getTranslations('NotFoundPage')
  return {
    title: t('title'),
  }
}

export default async function NotFound() {
  const t = await getTranslations('NotFoundPage')

  return (
    <div className={st.notFound}>
      <h1 className={st.notFound__title}>{t('title')}</h1>
      <p className={st.notFound__description}>{t('description')}</p>
    </div>
  )
}
