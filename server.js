const express = require('express');
const app = express();
const path = require('path');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3000

server.listen(port, () => {
    console.log(`Server listening at port: ${port}`)
})
// routing
app.use(express.static(path.join(__dirname, 'public')));

//Dashboard
let numUsers = 0;

io.on('connection', (socket) => {
    var addedUser = false;
})