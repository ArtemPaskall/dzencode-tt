import { Link } from '@/i18n/navigation'
import st from './navigationMenu.module.scss'
import { getTranslations } from 'next-intl/server'

export default async function NavigationMenu() {
  const t = await getTranslations('NavMenu')
  return (
    <div className={st.navMenu}>
      <Link href={'/products'} className={st.navMenu__link}>
        {t('Products')}
      </Link>
      <Link href={'/orders'} className={st.navMenu__link}>
        {t('Orders')}
      </Link>
      <div></div>
    </div>
  )
}
