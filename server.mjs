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
  users++
  io.emit('users', users)

  socket.on('disconnect', () => {
    users--
    io.emit('users', users)
  })

  socket.on('request-users', () => {
    socket.emit('users', users)
  })
})

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000')
})
