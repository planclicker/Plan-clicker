const socket = io();
let clicks = 0;
let multiplier = 1;
let autos = 0;
let adminCode = "";

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
        btn.innerHTML = `<b>${p.name}</b><br>${isUnlocked ? 'Base: ' + p.power : 'Cost: ' + p.cost.toLocaleString()}`;
        
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

function buy(item, cost) {
    if (clicks >= cost) {
        clicks -= cost;
        if (item === 'm1') multiplier += 1;
        if (item === 'm2') multiplier += 10;
        if (item === 'm3') multiplier += 100;
        if (item === 'm4') multiplier += 1000;
        if (item === 'm5') multiplier += 50000;
        if (item === 'm6') multiplier += 1000000;
        
        if (item === 'a1') autos += 1;
        if (item === 'a2') autos += 500;
        if (item === 'a3') autos += 100000;
        updateUI();
    }
}

// ADMIN POWER LOGIC
function loginAdmin() {
    adminCode = prompt("Enter 4-Digit Security Key:");
    if (adminCode === "4998") {
        document.getElementById('admin-modal').classList.remove('hidden');
    }
}

function adminAction(type) {
    if (type === 'giveClicks') {
        let val = parseInt(document.getElementById('adm-clicks').value) || 0;
        clicks += val;
        socket.emit('adminMessage', { code: adminCode, message: `Admin injected ${val.toLocaleString()} clicks into the system!` });
    } else if (type === 'giveMulti') {
        let val = parseInt(document.getElementById('adm-multi').value) || 0;
        multiplier += val;
        socket.emit('adminMessage', { code: adminCode, message: `Global Multiplier boosted by ${val.toLocaleString()}!` });
    }
    updateUI();
}

function sendGlobalMsg() {
    const msg = document.getElementById('admin-chat-input').value;
    socket.emit('adminMessage', { code: adminCode, message: msg });
}

socket.on('newMessage', (msg) => {
    const chat = document.getElementById('chat-display');
    chat.innerHTML += `<div><span style="color:red;">[SYSTEM]:</span> ${msg.text}</div>`;
    chat.scrollTop = chat.scrollHeight;
});

setInterval(() => {
    if (autos > 0) {
        clicks += (autos * multiplier);
        updateUI();
    }
}, 1000);

renderPlanets();