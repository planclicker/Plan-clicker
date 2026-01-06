const socket = io();
let clicks = 0;
let multiplier = 1;
let currentPlanetIndex = 0;
let adminCode = "";

const planets = [
    { name: "Mercury", cost: 0, power: 1, img: "https://upload.wikimedia.org/wikipedia/commons/4/4a/Mercury_in_true_color.jpg" },
    { name: "Venus", cost: 500, power: 10, img: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Venus_from_Mariner_10.jpg" },
    { name: "Earth", cost: 5000, power: 50, img: "https://upload.wikimedia.org/wikipedia/commons/9/97/The_Earth_seen_from_Apollo_17.jpg" },
    { name: "Mars", cost: 50000, power: 200, img: "https://upload.wikimedia.org/wikipedia/commons/0/02/OSIRIS_Mars_true_color.jpg" }
];

const upgrades = [
    { id: 'm1', name: "Slight Boost", multi: 1, cost: 50 },
    { id: 'm2', name: "Super Boost", multi: 10, cost: 1000 },
    { id: 'm3', name: "Mega Boost", multi: 100, cost: 25000 },
    { id: 'm4', name: "God Boost", multi: 1000, cost: 1000000 }
];

let unlockedPlanets = [0];

// ADMIN LOGIN WITH PASSWORD
function openAdmin() {
    let pass = prompt("Enter Admin Code:");
    if (pass === "4998") {
        adminCode = pass;
        document.getElementById('admin-panel').classList.remove('hidden');
    } else {
        alert("Access Denied");
    }
}

function clickPlanet() {
    clicks += (planets[currentPlanetIndex].power * multiplier);
    updateUI();
}

// GLOBAL GIFT LISTENER
socket.on('receiveGlobalGift', (data) => {
    if (data.type === 'clicks') clicks += data.amount;
    if (data.type === 'multi') multiplier += data.amount;
    updateUI();
});

function adminAction(target, type) {
    const amt = parseInt(document.getElementById('adm-amt').value) || 0;
    if (target === 'self') {
        if (type === 'clicks') clicks += amt;
        if (type === 'multi') multiplier += amt;
    } else {
        socket.emit('adminGlobalGift', { code: adminCode, type: type, amount: amt });
    }
    updateUI();
}

function updateUI() {
    document.getElementById('click-display').innerText = "💰 " + Math.floor(clicks).toLocaleString();
    document.getElementById('multi-display').innerText = "x" + multiplier.toLocaleString();
    
    // Update active planet
    const p = planets[currentPlanetIndex];
    document.getElementById('planet-name').innerText = p.name;
    document.getElementById('main-planet').style.backgroundImage = `url(${p.img})`;
}

function closeAdmin() { document.getElementById('admin-panel').classList.add('hidden'); }

// Initialize
updateUI();