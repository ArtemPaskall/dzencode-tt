'use client'

import { useState, useEffect } from 'react'
import { useLocale } from 'next-intl'
import st from './timeBlock.module.scss'
import Image from 'next/image'

export default function TimeBlock() {
  const [time, setTime] = useState(new Date())
  const locale = useLocale()

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const day = new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(time)

  const formattedDate = `${time.getDate()} ${day} ${time.getFullYear()}`

  return (
    <div>
      <div className={st.date}>
        <Image
          src={'/calendar.jpg'}
          width={20}
          height={20}
          alt={'calendar'}
        ></Image>
        <div> {formattedDate}</div>
      </div>
      <div className={st.time}>
        <Image src={'/clock.png'} width={20} height={20} alt={'clock'}></Image>
        <div> {time.toLocaleTimeString(locale)}</div>
      </div>
    </div>
  )
}
