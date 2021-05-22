const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);
const session = require('express-session')({
    secret: "secret-key",
    resave: true,
    saveUninitialized: true
});
// const sharedsession = require('express-socket.io-session');

// Routes
// app.use('/', require('./routes/index.js'));
// app.use('/room', require('./routes/room.js'));
app.use(session);
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    // res.sendFile(__dirname + '/views/index.html');
    res.render('index');
});

app.get('/rooms/:room', (req, res) => {
    // res.sendFile(__dirname + '/views/room.html');
    res.render('room', {data : {room: req.params.room} });
});

var rooms = ["room1", "room2"];

var roomForSocket = {};

io.on('connection', (socket) => {
    console.log(roomForSocket);

    console.log(`socket connected with id ${socket.id}`);
    io.to(socket.id).emit('get rooms', rooms);

    socket.on('add room', (room_name) => {
        rooms.push(room_name);
        console.log(rooms);
        io.emit('room added', room_name);
    });

    socket.on('join room', (room_name) => {
        console.log(room_name);
        socket.join(room_name);
        roomForSocket[socket.id] = room_name;
        console.log(roomForSocket);
        // io.to(socket.id).emit('redirect', `/rooms/${room_name}`);
    });

    socket.on('chat message', (msg) => {
        const room = roomForSocket[socket.id];
        io.to(room).emit('chat message', msg);
    });

    socket.on('disconnect', () => {
        const room = roomForSocket[socket.id];
        socket.leave(room);
        delete roomForSocket[socket.id];
        // io.to(socket.id).emit('redirect', '/');
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, console.log(`Server started on port ${PORT}`));