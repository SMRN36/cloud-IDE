const http = require('http')
const express = require('express')
const { Server: SocketServer } = require('socket.io')
const cors = require('cors')

const app = express()
const server = http.createServer(app);
const io = new SocketServer({
    cors: '*'
})

app.use(cors())

io.attach(server);

io.on('connection', (socket) => {
    console.log(`Socket connected`, socket.id)
})

server.listen(9000, () => console.log(`🐳 Docker server running on port 9000`))

