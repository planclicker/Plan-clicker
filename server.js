const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');

app.use(express.static(__dirname));

io.on('connection', (socket) => {
    // When the admin sends a global gift
    socket.on('adminGlobalGift', (data) => {
        if (data.code === "4998") {
            // This sends the gift to EVERY connected socket (player)
            io.emit('receiveGlobalGift', {
                type: data.type,
                amount: data.amount
            });
        }
    });

    socket.on('adminMessage', (data) => {
        if (data.code === "4998") {
            io.emit('newMessage', { user: "SYSTEM", text: data.message });
        }
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`PlanClicker running on port ${PORT}`);
});