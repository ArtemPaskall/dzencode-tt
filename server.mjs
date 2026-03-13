import { createServer } from 'http'
import next from 'next'
import { Server } from 'socket.io'

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

let users = 0

await app.prepare()

const server = createServer((req, res) => {
  handle(req, res)
})

const io = new Server(server)

io.on('connection', (socket) => {
  if (!socket.connectedBefore) {
    users++
    socket.connectedBefore = true
  }
  io.emit('users', users)

  socket.on('disconnect', () => {
    if (socket.connectedBefore) {
      users--
      io.emit('users', users)
    }
  })

  socket.on('request-users', () => {
    socket.emit('users', users)
  })
})

const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
