const socket = io();
let clicks = 0;
let multiplier = 1;
let autos = 0;
let adminCode = "";

const planets = [
    { name: "Mercury", cost: 0, power: 1 },
    { name: "Venus", cost: 250, power: 10 },
    { name: "Earth", cost: 1000, power: 50 },
    { name: "Mars", cost: 5000, power: 250 },
    { name: "Jupiter", cost: 25000, power: 1000 }
];

function updateUI() {
    document.getElementById('clicks').innerText = Math.floor(clicks);
    document.getElementById('multi').innerText = multiplier;
    document.getElementById('autos').innerText = autos;
}

function renderPlanets() {
    const container = document.getElementById('planets');
    container.innerHTML = '';
    planets.forEach(p => {
        const btn = document.createElement('button');
        btn.innerHTML = `${p.name}<br>Power: ${p.power}`;
        btn.onclick = () => {
            clicks += (p.power * multiplier);
            updateUI();
        };
        container.appendChild(btn);
    });
}

// Admin Logic
function loginAdmin() {
    adminCode = prompt("Enter Admin Code:");
    if (adminCode === "4998") {
        document.getElementById('admin-modal').classList.remove('hidden');
    }
}

function sendGlobalMsg() {
    const msg = document.getElementById('admin-chat-input').value;
    socket.emit('adminMessage', { code: adminCode, message: msg });
}

socket.on('newMessage', (msg) => {
    const chat = document.getElementById('chat-display');
    chat.innerHTML += `<div>[${msg.user}]: ${msg.text}</div>`;
});

// Loop for Auto-Clickers
setInterval(() => {
    if (autos > 0) {
        clicks += (autos * multiplier);
        updateUI();
    }
}, 1000);

renderPlanets();