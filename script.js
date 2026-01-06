const socket = io();
let clicks = 0;
let multiplier = 1;
let currentPlanetIndex = 0;
let adminCode = "";

const planets = [
    { name: "Mercury", cost: 0, power: 1, img: "https://upload.wikimedia.org/wikipedia/commons/4/4a/Mercury_in_true_color.jpg" },
    { name: "Venus", cost: 1000000, power: 150, img: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Venus_from_Mariner_10.jpg" },
    { name: "Earth", cost: 50000000, power: 2500, img: "https://upload.wikimedia.org/wikipedia/commons/9/97/The_Earth_seen_from_Apollo_17.jpg" },
    { name: "Mars", cost: 1000000000, power: 80000, img: "https://upload.wikimedia.org/wikipedia/commons/0/02/OSIRIS_Mars_true_color.jpg" }
];

let shopItems = [
    { id: 'm1', name: "Rusty Drill", multi: 1, baseCost: 50, count: 0 },
    { id: 'm2', name: "Steam Pump", multi: 10, baseCost: 1500, count: 0 },
    { id: 'm3', name: "Fusion Core", multi: 150, baseCost: 75000, count: 0 },
    { id: 'm4', name: "Dark Matter", multi: 2000, baseCost: 5000000, count: 0 },
    { id: 'm5', name: "God Engine", multi: 50000, baseCost: 100000000, count: 0 }
];

let unlockedPlanets = [0];

function clickPlanet() {
    if (unlockedPlanets.includes(currentPlanetIndex)) {
        clicks += (planets[currentPlanetIndex].power * multiplier);
        document.getElementById('click-sound').play();
        updateUI();
    }
}

function buyMultiplier(index, cost) {
    if (clicks >= cost) {
        clicks -= cost;
        multiplier += shopItems[index].multi;
        shopItems[index].count++;
        updateUI();
    }
}

function updateUI() {
    document.getElementById('click-display').innerText = "💰 " + Math.floor(clicks).toLocaleString();
    document.getElementById('multi-display').innerText = "x" + multiplier.toLocaleString();
    
    const p = planets[currentPlanetIndex];
    document.getElementById('planet-name').innerText = p.name;
    document.getElementById('main-planet').style.backgroundImage = `url(${p.img})`;
    
    // Check if planet is locked
    const isUnlocked = unlockedPlanets.includes(currentPlanetIndex);
    document.getElementById('main-planet').style.filter = isUnlocked ? "none" : "brightness(0.1) grayscale(1)";
    document.getElementById('unlock-btn').style.display = isUnlocked ? "none" : "block";
    document.getElementById('unlock-btn').innerText = `UNLOCK: ${p.cost.toLocaleString()}`;
    
    renderShop();
}

function renderShop() {
    const list = document.getElementById('multiplier-list');
    list.innerHTML = '';
    shopItems.forEach((item, idx) => {
        const cost = Math.floor(item.baseCost * Math.pow(1.5, item.count));
        const btn = document.createElement('button');
        btn.className = 'shop-item';
        btn.innerHTML = `<b>${item.name}</b> (+${item.multi})<br>Price: ${cost.toLocaleString()}`;
        btn.onclick = () => buyMultiplier(idx, cost);
        if (clicks < cost) btn.style.opacity = "0.5";
        list.appendChild(btn);
    });
}

function changePlanet(dir) {
    currentPlanetIndex = Math.max(0, Math.min(planets.length - 1, currentPlanetIndex + dir));
    updateUI();
}

function tryUnlock() {
    const p = planets[currentPlanetIndex];
    if (clicks >= p.cost) {
        clicks -= p.cost;
        unlockedPlanets.push(currentPlanetIndex);
        updateUI();
    }
}

function openAdmin() {
    let pass = prompt("Enter Password:");
    if (pass === "4998") {
        adminCode = pass;
        document.getElementById('admin-panel').classList.remove('hidden');
    }
}

function broadcast() {
    const msg = document.getElementById('adm-msg').value;
    socket.emit('adminMessage', { code: adminCode, message: msg });
}

socket.on('newMessage', (data) => {
    const msgBox = document.getElementById('messages');
    msgBox.innerHTML += `<div style="color:#00ffcc; border-bottom:1px solid #222; padding:5px;"><b>[SERVER]:</b> ${data.text}</div>`;
    msgBox.scrollTop = msgBox.scrollHeight;
});

updateUI();