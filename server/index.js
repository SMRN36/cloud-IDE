const http = require('http')
const express = require('express')
const { Server: SocketServer } = require('socket.io')
const cors = require('cors')
var pty = require('node-pty');

var shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';

var ptyProcess = pty.spawn(shell, [], {
  name: 'xterm-color',
  cols: 80,
  rows: 30,
  cwd: process.env.INIT_CWD + './user',
  env: process.env
});


const app = express()
const server = http.createServer(app);
const io = new SocketServer({
    cors: '*'
})

app.use(cors())

io.attach(server);

ptyProcess.onData(data => {
    io.emit('terminal:data', data)
})


io.on('connection', (socket) => {
    console.log(`Socket connected`, socket.id)

    socket.on('terminal:write', (data) => {
        console.log('Term', data)
        ptyProcess.write(data);
    })
})

server.listen(9000, () => console.log(`🐳 Docker server running on port 9000`))

