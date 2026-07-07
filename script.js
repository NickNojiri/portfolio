/* ---------- theme ---------- */
const root = document.documentElement;
const saved = localStorage.getItem("theme");
if (saved) root.setAttribute("data-theme", saved);
document.getElementById("theme").addEventListener("click", () => {
  const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  root.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
});
document.getElementById("year").textContent = new Date().getFullYear();

/* ---------- scroll reveal ---------- */
const io = new IntersectionObserver(
  (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("in")),
  { threshold: 0.12 }
);
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

/* ---------- Relay: pipeline pulse + flag flip ---------- */
const pipeNodes = () => [...document.querySelectorAll("#relay-pipe .node")];
function pulsePipe() {
  const nodes = pipeNodes();
  nodes.forEach((n, i) => {
    setTimeout(() => {
      nodes.forEach((x) => x.classList.remove("active"));
      n.classList.add("active");
      if (i === nodes.length - 1) setTimeout(() => n.classList.remove("active"), 500);
    }, i * 280);
  });
}

let relayOn = false;
const relaySwitch = document.getElementById("relay-switch");
function relayFlip() {
  relayOn = !relayOn;
  relaySwitch.classList.toggle("on", relayOn);
  relaySwitch.setAttribute("aria-checked", String(relayOn));
  pulsePipe();

  const a = document.getElementById("split-a");
  const b = document.getElementById("split-b");
  const cost = document.getElementById("m-cost");
  const lat = document.getElementById("m-lat");

  if (relayOn) {
    a.style.width = "15%"; a.textContent = "A · 15%";
    b.style.width = "85%"; b.textContent = "B · 85%";
    cost.textContent = "$3.10"; cost.classList.add("win");
    lat.textContent = "610ms"; lat.classList.add("win");
  } else {
    a.style.width = "90%"; a.textContent = "A · 90%";
    b.style.width = "10%"; b.textContent = "B · 10%";
    cost.textContent = "$4.20"; cost.classList.remove("win");
    lat.textContent = "840ms"; lat.classList.remove("win");
  }
}
relaySwitch.addEventListener("click", relayFlip);
relaySwitch.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") { e.preventDefault(); relayFlip(); }
});

/* ---------- SpotBot: staged pipeline + card ---------- */
let spotRunning = false;
function spotRun() {
  if (spotRunning) return;
  spotRunning = true;
  const stages = [...document.querySelectorAll("#stages .stage")];
  const card = document.getElementById("spot-card");
  card.classList.remove("show");
  stages.forEach((s) => s.classList.remove("done", "run"));

  let i = 0;
  const step = () => {
    if (i > 0) stages[i - 1].classList.replace("run", "done");
    if (i < stages.length) {
      stages[i].classList.add("run");
      i++;
      setTimeout(step, 620);
    } else {
      card.classList.add("show");
      spotRunning = false;
    }
  };
  step();
}
function vote(btn) {
  const c = btn.querySelector(".c");
  c.textContent = parseInt(c.textContent, 10) + 1;
  btn.style.borderColor = "var(--spot)";
  btn.style.color = "var(--spot)";
}

/* ---------- Resume Improver: streaming rewrite + gauge ---------- */
let rewriteRunning = false;
function resumeRewrite() {
  if (rewriteRunning) return;
  rewriteRunning = true;
  const target = document.getElementById("rewrite");
  const text =
    "Shipped 4 backend features for the payments service, cutting checkout latency 28% and unblocking a $1.2M enterprise launch.";
  target.innerHTML = '<span class="cursor"></span>';
  let i = 0;
  const cursor = '<span class="cursor"></span>';

  const type = () => {
    if (i <= text.length) {
      target.innerHTML = text.slice(0, i) + cursor;
      i++;
      setTimeout(type, 18 + Math.random() * 30);
    } else {
      target.innerHTML = text;
      rewriteRunning = false;
    }
  };
  type();

  // animate score gauge 41 -> 88
  const arc = document.getElementById("gauge-arc");
  const num = document.getElementById("gauge-num");
  const total = 207;
  let score = 41;
  const targetScore = 88;
  const tick = () => {
    if (score <= targetScore) {
      num.textContent = score;
      arc.style.strokeDashoffset = total - (total * score) / 100;
      score++;
      setTimeout(tick, 22);
    }
  };
  tick();
}

/* kick the featured pipeline once on load so it feels alive */
window.addEventListener("load", () => setTimeout(pulsePipe, 700));

/* ================= reactive text & motion effects ================= */
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

/* ---------- typewriter eyebrow ---------- */
const PHRASES = [
  "full-stack engineer",
  "rust · typescript · python",
  "pipelines that ship",
  "systems, end to end",
];
const typeEl = document.getElementById("type");
if (typeEl && !reduceMotion) {
  let pi = 0;
  let ci = PHRASES[0].length;
  let del = true;
  const loop = () => {
    if (del) {
      ci--;
      typeEl.textContent = PHRASES[pi].slice(0, ci);
      if (ci === 0) {
        del = false;
        pi = (pi + 1) % PHRASES.length;
        setTimeout(loop, 350);
      } else setTimeout(loop, 28);
    } else {
      ci++;
      typeEl.textContent = PHRASES[pi].slice(0, ci);
      if (ci === PHRASES[pi].length) {
        del = true;
        setTimeout(loop, 2600);
      } else setTimeout(loop, 55 + Math.random() * 45);
    }
  };
  setTimeout(loop, 2800);
}

/* ---------- scramble-decode headings ---------- */
const GLYPHS = "!<>-_\\/[]{}=+*^?#";
function scramble(el) {
  if (reduceMotion || el.dataset.busy) return;
  el.dataset.busy = "1";
  const orig = el.dataset.text || (el.dataset.text = el.textContent);
  const total = orig.length * 3 + 12;
  let frame = 0;
  const tick = () => {
    frame++;
    const revealed = Math.floor((frame / total) * orig.length * 1.5);
    el.textContent = orig
      .split("")
      .map((c, i) => {
        if (c === " " || i < revealed) return c;
        return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      })
      .join("");
    if (revealed < orig.length) requestAnimationFrame(tick);
    else {
      el.textContent = orig;
      delete el.dataset.busy;
    }
  };
  tick();
}
const headings = document.querySelectorAll(".proj h2");
headings.forEach((h) => h.addEventListener("mouseenter", () => scramble(h)));
if (!reduceMotion) {
  const scrambleIO = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          scramble(e.target);
          scrambleIO.unobserve(e.target);
        }
      }),
    { threshold: 0.6 }
  );
  headings.forEach((h) => scrambleIO.observe(h));
}

/* ---------- count-up stat ---------- */
const countEl = document.getElementById("count-tests");
if (countEl && !reduceMotion) {
  const target = parseInt(countEl.dataset.target, 10);
  countEl.textContent = "0";
  const dur = 1600;
  let t0 = null;
  const step = (t) => {
    if (!t0) t0 = t;
    const p = Math.min((t - t0) / dur, 1);
    countEl.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(step);
  };
  setTimeout(() => requestAnimationFrame(step), 500);
}

/* ---------- demo panels: 3d tilt + cursor spotlight ---------- */
if (finePointer && !reduceMotion) {
  document.querySelectorAll(".demo").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      card.style.setProperty("--mx", x + "px");
      card.style.setProperty("--my", y + "px");
      const rx = (y / r.height - 0.5) * -3.5;
      const ry = (x / r.width - 0.5) * 3.5;
      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
}

/* ---------- ambient glow drifts toward the mouse ---------- */
if (finePointer && !reduceMotion) {
  let glowTick = false;
  window.addEventListener(
    "mousemove",
    (e) => {
      if (glowTick) return;
      glowTick = true;
      requestAnimationFrame(() => {
        document.body.style.setProperty("--gx", (e.clientX / innerWidth - 0.5) * 140 + "px");
        document.body.style.setProperty("--gy", (e.clientY / innerHeight - 0.5) * 70 + "px");
        glowTick = false;
      });
    },
    { passive: true }
  );
}

/* ---------- scrollspy: nav underline tracks the section ---------- */
const navLinks = [...document.querySelectorAll(".nav-links a")];
const spy = new IntersectionObserver(
  (entries) =>
    entries.forEach((e) => {
      if (e.isIntersecting) {
        navLinks.forEach((a) =>
          a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id)
        );
      }
    }),
  { rootMargin: "-30% 0px -60% 0px" }
);
document.querySelectorAll("section[id]").forEach((s) => spy.observe(s));
