// 'use client'

// import { useEffect, useState } from 'react'
// import { getSocket } from '@/libs/socket'
// import st from './activeConnections.module.scss'
// import { useTranslations } from 'next-intl'

// export default function ActiveConnections() {
//   const t = useTranslations('ActiveConnections')
//   const [users, setUsers] = useState<number | null>(null)

//   useEffect(() => {
//     const socket = getSocket()

//     const handler = (count: number) => setUsers(count)

//     socket.on('users', handler)

//     socket.emit('request-users')

//     return () => {
//       socket.off('users', handler)
//     }
//   }, [])

//   return (
//     <div className={st.activeConnections}>
//       <div className={st.activeConnections__users}> {users ?? '...'}</div>
//       <div className={st.activeConnections__connections}>
//         {t('Connections')}
//       </div>
//     </div>
//   )
// }
'use client'

import { useEffect, useState } from 'react'
import { getSocket } from '@/libs/socket'
import st from './activeConnections.module.scss'
import { useTranslations } from 'next-intl'

export default function ActiveConnections() {
  const t = useTranslations('ActiveConnections')
  const [users, setUsers] = useState<number | null>(null)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    const socket = getSocket()

    const handler = (count: number) => {
      if (!initialized) setInitialized(true) // перше реальне повідомлення
      setUsers(count)
    }

    socket.on('users', handler)

    socket.emit('request-users') // запитати кількість

    return () => {
      socket.off('users', handler)
    }
  }, [initialized])

  return (
    <div className={st.activeConnections}>
      <div className={st.activeConnections__users}>
        {initialized ? users : '...'}
      </div>
      <div className={st.activeConnections__connections}>
        {t('Connections')}
      </div>
    </div>
  )
}
