const socket = io();
let clicks = 0;
let multiplier = 1;
let autos = 0;
let adminCode = "";

// Planet Data based on CoolMathGames scaling
const planets = [
    { name: "Mercury", cost: 0, power: 1 },
    { name: "Venus", cost: 1000, power: 25 },
    { name: "Earth", cost: 50000, power: 500 },
    { name: "Mars", cost: 1000000, power: 8000 },
    { name: "Jupiter", cost: 100000000, power: 150000 },
    { name: "Saturn", cost: 5000000000, power: 2000000 },
    { name: "Uranus", cost: 100000000000, power: 50000000 },
    { name: "Neptune", cost: 1000000000000, power: 1000000000 }
];

let unlocked = ["Mercury"];

// LISTEN FOR GLOBAL GIFTS FROM ADMIN
socket.on('receiveGlobalGift', (data) => {
    if (data.type === 'clicks') {
        clicks += data.amount;
    } else if (data.type === 'multi') {
        multiplier += data.amount;
    }
    updateUI();
});

function updateUI() {
    document.getElementById('clicks').innerText = Math.floor(clicks).toLocaleString();
    document.getElementById('multi').innerText = multiplier.toLocaleString();
    document.getElementById('autos').innerText = autos.toLocaleString();
}

// ADMIN ACTIONS
function adminAction(target, type) {
    const amount = parseInt(document.getElementById('adm-amount').value) || 0;
    
    if (target === 'self') {
        if (type === 'clicks') clicks += amount;
        if (type === 'multi') multiplier += amount;
        updateUI();
    } else if (target === 'everyone') {
        // Send to server to broadcast to all players
        socket.emit('adminGlobalGift', {
            code: adminCode,
            type: type,
            amount: amount
        });
        socket.emit('adminMessage', {
            code: adminCode,
            message: `ADMIN GIFTED ${amount.toLocaleString()} ${type.toUpperCase()} TO EVERYONE!`
        });
    }
}

// ... rest of game logic (renderPlanets, buy, etc. from previous version) ...