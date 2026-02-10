const canvas = document.getElementById("sky");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// ---------- State ----------
let clickedCount = 0;
let showName = false;
let nameAlpha = 0;
let shootingStar = null;

// ---------- Intro Logic ----------
const introOverlay = document.getElementById('intro-overlay');
const startBtn = document.getElementById('start-btn');

startBtn.addEventListener('click', () => {
    introOverlay.style.opacity = '0';
    setTimeout(() => { introOverlay.style.display = 'none'; }, 1500);
});

// ---------- Objects ----------
const bgStars = [];
for (let i = 0; i < 150; i++) {
    bgStars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.2 + 0.5,
        twinkle: Math.random() * Math.PI
    });
}

const hearts = [];
for (let i = 0; i < 20; i++) {
    hearts.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 10 + 10,
        speed: Math.random() * 0.4 + 0.2,
        opacity: Math.random() * 0.5 + 0.1
    });
}

const constellationData = [
    { px: 0.15, py: 0.45, day: "Rose Day", text: "I promise to keep choosing you every day." },
    { px: 0.30, py: 0.60, day: "Propose Day", text: "I promise my heart will always belong to you." },
    { px: 0.45, py: 0.40, day: "Chocolate Day", text: "I promise to fill your life with sweetness." },
    { px: 0.60, py: 0.65, day: "Teddy Day", text: "I promise to be your forever comfort." },
    { px: 0.75, py: 0.45, day: "Promise Day", text: "I promise to stand beside you always." },
    { px: 0.60, py: 0.25, day: "Hug Day", text: "I promise emotional hugs across distance." },
    { px: 0.35, py: 0.20, day: "Kiss Day", text: "I promise soft and true love forever." }
];

let mainStars = constellationData.map(star => ({
    ...star,
    x: star.px * canvas.width,
    y: star.py * canvas.height,
    radius: 6,
    twinkle: Math.random() * Math.PI,
    clicked: false
}));

const reeyaStars = [
    // R
    {x: 0.35, y: 0.82}, {x: 0.35, y: 0.85}, {x: 0.35, y: 0.88}, {x: 0.36, y: 0.82}, {x: 0.37, y: 0.83}, {x: 0.36, y: 0.85}, {x: 0.37, y: 0.88},
    // E
    {x: 0.42, y: 0.82}, {x: 0.42, y: 0.85}, {x: 0.42, y: 0.88}, {x: 0.44, y: 0.82}, {x: 0.44, y: 0.85}, {x: 0.44, y: 0.88},
    // E
    {x: 0.48, y: 0.82}, {x: 0.48, y: 0.85}, {x: 0.48, y: 0.88}, {x: 0.50, y: 0.82}, {x: 0.50, y: 0.85}, {x: 0.50, y: 0.88},
    // Y
    {x: 0.55, y: 0.82}, {x: 0.57, y: 0.82}, {x: 0.56, y: 0.84}, {x: 0.56, y: 0.88},
    // A
    {x: 0.62, y: 0.88}, {x: 0.63, y: 0.84}, {x: 0.64, y: 0.82}, {x: 0.65, y: 0.84}, {x: 0.66, y: 0.88}, {x: 0.635, y: 0.86}, {x: 0.655, y: 0.86}
];

class ShootingStar {
    constructor() { this.reset(); }
    reset() {
        this.x = Math.random() * canvas.width * 0.4;
        this.y = 0;
        this.vx = 12; this.vy = 6;
        this.active = true;
    }
    draw() {
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x - 100, this.y - 50);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
        ctx.lineWidth = 2;
        ctx.stroke();
        this.x += this.vx; this.y += this.vy;
        if (this.y > canvas.height || this.x > canvas.width) this.active = false;
    }
}

// ---------- UI Creation ----------
const popup = document.createElement("div");
popup.id = "popup";
popup.style.display = "none";
const popupText = document.createElement("p");
const closeBtn = document.createElement("button");
closeBtn.innerText = "Close";
closeBtn.onclick = () => popup.style.display = "none";
popup.append(popupText, closeBtn);
document.body.appendChild(popup);

const finalMessage = document.createElement("div");
finalMessage.id = "finalMessage";
finalMessage.innerHTML = "<h2>✨ My Valentine ✨</h2><p>Every promise I make leads back to you, Reeya.</p>";
finalMessage.style.display = "none";
finalMessage.style.opacity = "0";
document.body.appendChild(finalMessage);

// ---------- Drawing Functions ----------
function drawMoon() {
    const x = canvas.width * 0.85;
    const y = 100;
    ctx.save();
    ctx.shadowBlur = 40; ctx.shadowColor = "white";
    ctx.beginPath(); ctx.arc(x, y, 45, 0, Math.PI * 2);
    ctx.fillStyle = "#fffcf0"; ctx.fill();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath(); ctx.arc(x - 20, y - 10, 45, 0, Math.PI * 2);
    ctx.fill(); ctx.restore();
}

function animate() {
    // 1. Sky Gradient
    let grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, "#050515");
    grad.addColorStop(0.5, "#140a2e");
    grad.addColorStop(1, "#2e1a47");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawMoon();

    // 2. Floating Hearts
    hearts.forEach(h => {
        h.y -= h.speed;
        if (h.y < -20) h.y = canvas.height + 20;
        ctx.globalAlpha = h.opacity;
        ctx.font = `${h.size}px serif`;
        ctx.fillText("❤", h.x, h.y);
    });
    ctx.globalAlpha = 1;

    // 3. Background Stars
    bgStars.forEach(s => {
        s.twinkle += 0.02;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius + Math.sin(s.twinkle)*0.5, 0, Math.PI*2);
        ctx.fillStyle = "white"; ctx.fill();
    });

    // 4. Lines
    ctx.beginPath();
    ctx.strokeStyle = "rgba(255, 182, 255, 0.2)";
    for (let i = 0; i < mainStars.length - 1; i++) {
        ctx.moveTo(mainStars[i].x, mainStars[i].y);
        ctx.lineTo(mainStars[i+1].x, mainStars[i+1].y);
    }
    ctx.stroke();

    // 5. Main Stars
    mainStars.forEach(s => {
        s.twinkle += 0.05;
        ctx.shadowBlur = s.clicked ? 20 : 10;
        ctx.shadowColor = s.clicked ? "#ffb6ff" : "white";
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius + Math.sin(s.twinkle)*2, 0, Math.PI*2);
        ctx.fillStyle = s.clicked ? "#ffb6ff" : "white";
        ctx.fill();
        ctx.shadowBlur = 0;
    });

    if (shootingStar && shootingStar.active) shootingStar.draw();

    if (showName) {
        if (nameAlpha < 1) nameAlpha += 0.005;
        reeyaStars.forEach(s => {
            ctx.beginPath();
            ctx.arc(s.x * canvas.width, s.y * canvas.height, 2.5, 0, Math.PI*2);
            ctx.fillStyle = `rgba(255, 182, 255, ${nameAlpha})`;
            ctx.shadowBlur = 10; ctx.shadowColor = "white";
            ctx.fill();
        });
    }

    requestAnimationFrame(animate);
}

// ---------- Interaction ----------
canvas.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    mainStars.forEach(star => {
        const dist = Math.sqrt((mx - star.x)**2 + (my - star.y)**2);
        if (dist < 30 && !star.clicked) {
            star.clicked = true;
            clickedCount++;
            popupText.innerHTML = `<strong style='color:#ffb6ff; font-size:1.4em;'>${star.day}</strong><br><br>${star.text}`;
            popup.style.display = "block";

            if (clickedCount === mainStars.length) {
                setTimeout(() => {
                    popup.style.display = "none";
                    shootingStar = new ShootingStar();
                    setTimeout(() => {
                        showName = true;
                        finalMessage.style.display = "block";
                        finalMessage.style.transition = "opacity 2s";
                        setTimeout(() => { finalMessage.style.opacity = "1"; }, 100);
                    }, 1200);
                }, 3500);
            }
        }
    });
});

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    mainStars.forEach(s => { s.x = s.px * canvas.width; s.y = s.py * canvas.height; });
});

animate();