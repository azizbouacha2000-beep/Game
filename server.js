const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static('public'));

const players = {};

io.on('connection', (socket) => {
    console.log('لاعب جديد انضم:', socket.id);

    // إضافة اللاعب الجديد
    players[socket.id] = {
        x: (Math.random() - 0.5) * 6,
        y: 0,
        z: 0,
        score: 0
    };

    // إرسال بيانات اللاعبين الحاليين
    socket.emit('currentPlayers', players);
    socket.broadcast.emit('newPlayer', { id: socket.id, player: players[socket.id] });

    // استقبال إطلاق النار وتحديث النقاط
    socket.autoreload = true;
    socket.on('shootTarget', () => {
        if (players[socket.id]) {
            players[socket.id].score += 10;
            io.emit('updateScore', { id: socket.id, score: players[socket.id].score });
        }
    });

    // عند خروج اللاعب
    socket.on('disconnect', () => {
        console.log('غادر اللاعب:', socket.id);
        delete players[socket.id];
        io.emit('removePlayer', socket.id);
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`السيرفر يعمل على البورت ${PORT}`);
});
