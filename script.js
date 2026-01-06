const socket = io();
let clicks = 0;
let multiplier = 1;
let currentPlanetIndex = 0;
let adminCode = "";

const planets = [
    { name: "Mercury", cost: 0, power: 1, img: "https://t4.ftcdn.net/jpg/02/90/19/23/360_F_290192329_S7N8vS7y7jO5l0P0l0Y7vS7y7jO5l0P0.jpg" },
    { name: "Venus", cost: 1000000, power: 150, img: "https://upload.wikimedia.org/wikipedia/commons/e/e5/Venus-real_color.jpg" },
    { name: "Earth", cost: 50000000, power: 2500, img: "https://upload.wikimedia.org/wikipedia/commons/c/cb/The_Blue_Marble_%28remastered%29.jpg" }
];

// ... (keep the same shopItems and other functions from before)

function updateUI() {
    document.getElementById('click-display').innerText = "💰 " + Math.floor(clicks).toLocaleString();
    document.getElementById('multi-display').innerText = "x" + multiplier.toLocaleString();
    
    const p = planets[currentPlanetIndex];
    document.getElementById('planet-name').innerText = p.name;
    
    // Set image and fallback
    const planetEl = document.getElementById('main-planet');
    planetEl.style.backgroundImage = `url('${p.img}')`;
    
    const isUnlocked = unlockedPlanets.includes(currentPlanetIndex);
    planetEl.style.filter = isUnlocked ? "none" : "brightness(0.1) grayscale(1)";
    document.getElementById('unlock-btn').style.display = isUnlocked ? "none" : "block";
    document.getElementById('unlock-btn').innerText = `UNLOCK ${p.name}: ${p.cost.toLocaleString()}`;
    
    renderShop();
}

// Ensure UI runs as soon as script loads
updateUI();