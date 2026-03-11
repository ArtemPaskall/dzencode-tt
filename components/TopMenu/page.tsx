import st from './top-menu.module.scss'
import '@/app/styles/globals.scss'
import { Link } from '@/i18n/navigation'
import Image from 'next/image'
import TimeBlock from '@/components/TimeBlock/page'
import ClientOnly from '../ClientOnly/page'
import LangSwitcher from '../LangSwitcher/page'

export default function TopMenu() {
  return (
    <header className={st.topMenu}>
      <div className="container">
        <div className={st.topMenu__wrapp}>
          <Link href={'/'} className={st.topMenu__logoWrapp}>
            <Image
              src="/fox.jpg"
              height={40}
              width={40}
              alt={'main logo'}
              className={st.topMenu__logoImg}
            ></Image>
            <div className={st.topMenu__logoName}>dZENcode</div>
          </Link>
          <div className={st.topMenu__sideNav}>
            <LangSwitcher />
            <ClientOnly>
              <TimeBlock />
            </ClientOnly>
          </div>
        </div>
      </div>
    </header>
  )
}
