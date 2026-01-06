const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');

app.use(express.static('public'));

let globalMessages = [];

io.on('connection', (socket) => {
    console.log('A player connected');

    socket.emit('chatHistory', globalMessages);

    socket.on('adminMessage', (data) => {
        if (data.code === "4998") {
            const msg = { user: "ADMIN", text: data.message };
            globalMessages.push(msg);
            io.emit('newMessage', msg);
        }
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`PlanClicker running on port ${PORT}`);
});