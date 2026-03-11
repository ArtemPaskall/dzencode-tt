'use client'

import { useEffect, useState } from 'react'
import { socket } from '@/libs/socket'

export default function ActiveUsers() {
  const [users, setUsers] = useState(0)

  useEffect(() => {
    socket.on('users', (count) => {
      setUsers(count)
    })

    return () => {
      socket.off('users')
    }
  }, [])

  return <span>{users}</span>
}
