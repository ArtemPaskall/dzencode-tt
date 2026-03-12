'use client'

import { useEffect, useState } from 'react'
import { getSocket } from '@/libs/socket'
import st from './activeConnections.module.scss'
import { useTranslations } from 'next-intl'

export default function ActiveConnections() {
  const t = useTranslations('ActiveConnections')
  const [users, setUsers] = useState<number | null>(null)

  useEffect(() => {
    const socket = getSocket()

    const handler = (count: number) => setUsers(count)

    socket.on('users', handler)

    socket.emit('request-users')

    return () => {
      socket.off('users', handler)
    }
  }, [])

  return (
    <div className={st.activeConnections}>
      <div className={st.activeConnections__users}> {users ?? '...'}</div>
      <div className={st.activeConnections__connections}>
        {t('Connections')}
      </div>
    </div>
  )
}
