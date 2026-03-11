'use client'

import { useRouter, usePathname } from '@/i18n/navigation'
import { useLocale } from 'next-intl'
import { routing } from '@/i18n/routing'
import Image from 'next/image'
import st from './langSwitcher.module.scss'
import { useState, useEffect, useRef } from 'react'

export default function LangSwitcher() {
  const router = useRouter()
  const pathname = usePathname()
  const locale = useLocale()

  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const changeLocale = (nextLocale: string) => {
    if (nextLocale === locale) return
    router.replace(pathname, { locale: nextLocale })
    setOpen(false)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div
      ref={ref}
      className={st['lang-switcher']}
      onClick={() => setOpen(!open)}
    >
      <Image src={'/globe.png'} width={20} height={20} alt="Lang" />
      <div className={`${st['lang-wrapp']} ${open ? st['open'] : ''}`}>
        {!open ? (
          <div>{locale.toUpperCase()}</div>
        ) : (
          <>
            {routing.locales.map((l) => (
              <div
                key={l}
                onClick={(e) => {
                  e.stopPropagation()
                  changeLocale(l)
                }}
              >
                {l.toUpperCase()}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}
