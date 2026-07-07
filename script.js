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
