const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');

// This tells the server to look in the main folder for your files
app.use(express.static(__dirname));

// This forces the server to send index.html when someone visits the site
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

let globalMessages = [];

io.on('connection', (socket) => {
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