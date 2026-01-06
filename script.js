const socket = io();
let clicks = 0;
let multiplier = 1;
let autos = 0;
let adminCode = "";

// High-scaling costs for that "Cool Math Games" feel
const planets = [
    { name: "Mercury", cost: 0, power: 1 },
    { name: "Venus", cost: 500, power: 15 },
    { name: "Earth", cost: 10000, power: 120 },
    { name: "Mars", cost: 250000, power: 800 },
    { name: "Jupiter", cost: 5000000, power: 4500 },
    { name: "Saturn", cost: 100000000, power: 25000 },
    { name: "Uranus", cost: 2000000000, power: 150000 },
    { name: "Neptune", cost: 50000000000, power: 1000000 }
];

let unlocked = ["Mercury"];

function updateUI() {
    document.getElementById('clicks').innerText = Math.floor(clicks).toLocaleString();
    document.getElementById('multi').innerText = multiplier.toLocaleString();
    document.getElementById('autos').innerText = autos.toLocaleString();
}

function renderPlanets() {
    const container = document.getElementById('planets');
    container.innerHTML = '';
    planets.forEach(p => {
        const isUnlocked = unlocked.includes(p.name);
        const btn = document.createElement('button');
        btn.className = isUnlocked ? 'planet-btn' : 'planet-btn locked';
        btn.innerHTML = `<b>${p.name}</b><br>${isUnlocked ? 'Power: ' + p.power : 'Unlock: ' + p.cost.toLocaleString()}`;
        
        btn.onclick = () => {
            if (isUnlocked) {
                clicks += (p.power * multiplier);
            } else if (clicks >= p.cost) {
                clicks -= p.cost;
                unlocked.push(p.name);
                renderPlanets();
            }
            updateUI();
        };
        container.appendChild(btn);
    });
}

function buy(type, cost) {
    if (clicks >= cost) {
        clicks -= cost;
        if (type.includes('multi')) multiplier += (type === 'multi' ? 1 : type === 'multi_mega' ? 50 : 1000);
        if (type.includes('auto')) autos += (type === 'auto' ? 1 : 500);
        updateUI();
    }
}

// ADMIN FUNCTIONS
function loginAdmin() {
    adminCode = prompt("Enter Code:");
    if (adminCode === "4998") {
        document.getElementById('admin-modal').classList.remove('hidden');
    }
}

function adminAction(action) {
    if (action === 'addClicks') {
        const val = parseInt(document.getElementById('gift-amount').value);
        clicks += val;
    } else if (action === 'maxMulti') {
        multiplier *= 100;
    }
    updateUI();
}

function sendGlobalMsg() {
    const msg = document.getElementById('admin-chat-input').value;
    socket.emit('adminMessage', { code: adminCode, message: msg });
}

socket.on('newMessage', (msg) => {
    const chat = document.getElementById('chat-display');
    chat.innerHTML += `<div style="color:#00ffcc"><b>[${msg.user}]:</b> ${msg.text}</div>`;
    chat.scrollTop = chat.scrollHeight;
});

setInterval(() => {
    if (autos > 0) {
        clicks += (autos * multiplier);
        updateUI();
    }
}, 1000);

function closeAdmin() { document.getElementById('admin-modal').classList.add('hidden'); }
renderPlanets();