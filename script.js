const screens = [...document.querySelectorAll(".screen")];
const progress = document.getElementById("progressBar");
let current = 0;
let locked = false;

function goTo(id) {
  if (locked) return;
  const next = document.getElementById(id);
  if (!next) return;
  const index = screens.indexOf(next);
  if (index < 0 || index <= current) return;

  locked = true;
  screens[current].classList.remove("active");
  next.classList.add("active");
  current = index;
  progress.style.width = `${((current + 1) / screens.length) * 100}%`;

  setTimeout(() => locked = false, 1100);
}

document.querySelectorAll("[data-next]").forEach(btn => {
  btn.addEventListener("click", () => goTo(btn.dataset.next));
});

document.getElementById("reveal").addEventListener("click", () => {
  createBurst();
  setTimeout(() => goTo("s5"), 650);
});

const maybe = document.getElementById("maybe");
const maybeMsg = document.getElementById("maybeMsg");
let maybeCount = 0;

maybe.addEventListener("click", () => {
  maybeCount++;
  const messages = [
    "Está bien... no tienes que responder ahora. ❤️",
    "Tómate tu tiempo. Yo solo quería que supieras lo que siento.",
    "Aunque sea un poquito... ¿me dejas intentarlo otra vez?",
    "No voy a presionarte. Solo quería volver a elegirte."
  ];
  maybeMsg.textContent = messages[Math.min(maybeCount - 1, messages.length - 1)];

  if (maybeCount >= 3) {
    maybe.style.transform = `translateX(${Math.sin(maybeCount) * 7}px)`;
  }
});

document.getElementById("yes").addEventListener("click", () => {
  createBurst(95);
  document.querySelector(".question strong").textContent = "Entonces... volvamos a elegirnos. ❤️";
  document.querySelector(".actions").style.display = "none";
  maybeMsg.textContent = "Esta vez, juntos.";
});

function createBurst(count = 140) {
  const burst = document.getElementById("burst");
  burst.innerHTML = "";
  for (let i = 0; i < count; i++) {
    const p = document.createElement("i");
    p.className = "particle";
    const angle = Math.random() * Math.PI * 2;
    const distance = 90 + Math.random() * Math.max(innerWidth, innerHeight) * .75;
    p.style.setProperty("--x", `${Math.cos(angle) * distance}px`);
    p.style.setProperty("--y", `${Math.sin(angle) * distance}px`);
    p.style.animationDelay = `${Math.random() * .22}s`;
    const size = 1 + Math.random() * 4;
    p.style.width = `${size}px`;
    p.style.height = `${size}px`;
    burst.appendChild(p);
  }
}

// Starfield optimized for mobile.
const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d", { alpha: true });
let stars = [];
let w, h, dpr;

function resize() {
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  w = innerWidth;
  h = innerHeight;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  canvas.style.width = w + "px";
  canvas.style.height = h + "px";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const amount = Math.min(150, Math.floor((w * h) / 6500));
  stars = Array.from({length: amount}, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: Math.random() * 1.25 + .15,
    a: Math.random() * .75 + .15,
    tw: Math.random() * .018 + .006,
    phase: Math.random() * Math.PI * 2,
    drift: (Math.random() - .5) * .08
  }));
}
window.addEventListener("resize", resize);
resize();

let t = 0;
function animate() {
  t++;
  ctx.clearRect(0, 0, w, h);

  for (const s of stars) {
    s.phase += s.tw;
    s.x += s.drift;
    if (s.x < -5) s.x = w + 5;
    if (s.x > w + 5) s.x = -5;

    const alpha = Math.max(.05, s.a + Math.sin(s.phase) * .22);
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(245,225,255,${alpha})`;
    ctx.fill();

    if (s.r > 1.05 && Math.sin(s.phase) > .8) {
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r * 3.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,180,225,${alpha * .08})`;
      ctx.fill();
    }
  }
  requestAnimationFrame(animate);
}
animate();

// Swipe navigation for phones.
let touchStartX = 0, touchStartY = 0;
document.addEventListener("touchstart", e => {
  touchStartX = e.changedTouches[0].clientX;
  touchStartY = e.changedTouches[0].clientY;
}, {passive: true});

document.addEventListener("touchend", e => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  const dy = e.changedTouches[0].clientY - touchStartY;
  if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy)) {
    if (dx < 0 && current < screens.length - 1) {
      const target = screens[current + 1].id;
      if (target !== "s5") goTo(target);
    }
  }
}, {passive: true});
