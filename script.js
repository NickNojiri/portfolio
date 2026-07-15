/* Portfolio v2 — zero dependencies.
   theme · chrome (progress/to-top/scrollspy/reveal/aura)
   · Relay · SpotBot · Resume demos · motion effects · easter egg */
(() => {
  "use strict";

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------- theme ---------- */
  const root = document.documentElement;
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) root.setAttribute("data-theme", savedTheme);
  $("#theme").addEventListener("click", () => {
    const cur = root.getAttribute("data-theme")
      || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const next = cur === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  });
  $("#year").textContent = new Date().getFullYear();

  /* ---------- scroll chrome ---------- */
  const progress = $("#progress");
  const toTop = $("#to-top");
  const onScroll = () => {
    const d = document.documentElement;
    const max = d.scrollHeight - d.clientHeight;
    progress.style.transform = `scaleX(${max > 0 ? d.scrollTop / max : 0})`;
    toTop.classList.toggle("show", d.scrollTop > 600);
  };
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  toTop.addEventListener("click", () => scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }));

  /* ---------- reveal + per-act aura (with no-IO / no-motion fallback) ---------- */
  const revealAll = () => $$(".reveal, .act").forEach((el) => el.classList.add("in"));
  if (!("IntersectionObserver" in window) || reduceMotion) {
    revealAll();
  } else {
    const revealIO = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("in")),
      { threshold: 0.12 }
    );
    $$(".reveal").forEach((el) => revealIO.observe(el));

    const auraIO = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) { e.target.classList.add("in"); auraIO.unobserve(e.target); }
        }),
      { threshold: 0.18 }
    );
    $$(".act").forEach((el) => auraIO.observe(el));
    /* failsafe: if nothing has revealed shortly after load, show everything */
    addEventListener("load", () =>
      setTimeout(() => { if (!document.querySelector(".reveal.in")) revealAll(); }, 1200)
    );
  }

  /* ---------- scrollspy ---------- */
  const navLinks = $$(".nav-links a");
  const spyIO = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          navLinks.forEach((a) =>
            a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id)
          );
        }
      }),
    { rootMargin: "-32% 0px -60% 0px" }
  );
  $$("section[id]").forEach((s) => spyIO.observe(s));

  /* ================= Relay ================= */
  const relaySwitch = $("#relay-switch");
  let relayOn = false;

  function pulsePipe() {
    const nodes = $$("#relay-pipe .node");
    nodes.forEach((n, i) => {
      setTimeout(() => {
        nodes.forEach((x) => x.classList.remove("active"));
        n.classList.add("active");
        if (i === nodes.length - 1) setTimeout(() => n.classList.remove("active"), 500);
      }, i * 280);
    });
  }

  function relayFlip() {
    relayOn = !relayOn;
    relaySwitch.classList.toggle("on", relayOn);
    relaySwitch.setAttribute("aria-checked", String(relayOn));
    pulsePipe();
    const a = $("#split-a"), b = $("#split-b"), cost = $("#m-cost"), lat = $("#m-lat");
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
  $("#relay-run").addEventListener("click", relayFlip);
  addEventListener("load", () => setTimeout(pulsePipe, 700));

  /* ================= SpotBot ================= */
  const reelInput = $("#reel-url");
  let spotRunning = false;

  function venueFromUrl(value) {
    const path = value.trim().replace(/[?#].*$/, "").replace(/\/+$/, "");
    const seg = path.split("/").filter(Boolean).pop() || "";
    const words = seg.replace(/[-_]+/g, " ").replace(/[^\w ]/g, "").trim();
    if (!words || /^reels?$/i.test(words)) return null;
    return words.split(/\s+/).map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
  }

  function spotRun() {
    if (spotRunning) return;
    spotRunning = true;
    $("#sc-title").textContent = venueFromUrl(reelInput.value) || "Tacos El Gordo";
    const stages = $$("#stages .stage");
    const card = $("#spot-card");
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
  $$(".js-spot-run").forEach((b) => b.addEventListener("click", spotRun));
  reelInput.addEventListener("keydown", (e) => { if (e.key === "Enter") spotRun(); });
  $$(".vote").forEach((btn) =>
    btn.addEventListener("click", () => {
      const c = $(".c", btn);
      c.textContent = parseInt(c.textContent, 10) + 1;
      btn.style.borderColor = "var(--teal)";
      btn.style.color = "var(--teal)";
    })
  );

  /* ================= Resume ================= */
  let rewriteRunning = false;
  function resumeRewrite() {
    if (rewriteRunning) return;
    rewriteRunning = true;
    const target = $("#rewrite");
    const text =
      "Shipped 4 backend features for the payments service, cutting checkout latency 28% and unblocking a $1.2M enterprise launch. (sample output)";
    const caret = '<span class="cursor"></span>';
    let i = 0;
    const type = () => {
      if (i <= text.length) {
        target.innerHTML = text.slice(0, i) + caret;
        i++;
        setTimeout(type, 18 + Math.random() * 30);
      } else {
        target.innerHTML = text;
        rewriteRunning = false;
      }
    };
    type();

    const arc = $("#gauge-arc"), num = $("#gauge-num"), total = 207;
    let score = 41;
    const tick = () => {
      if (score <= 88) {
        num.textContent = score;
        arc.style.strokeDashoffset = total - (total * score) / 100;
        score++;
        setTimeout(tick, 22);
      }
    };
    tick();
  }
  $("#resume-run").addEventListener("click", resumeRewrite);

  /* ================= motion effects ================= */

  /* typewriter eyebrow */
  const PHRASES = ["full-stack engineer", "rust · typescript · python · c++", "pipelines that ship", "systems, end to end"];
  const typeEl = $("#type");
  if (typeEl && !reduceMotion) {
    let pi = 0, ci = PHRASES[0].length, del = true;
    const loop = () => {
      if (del) {
        ci--; typeEl.textContent = PHRASES[pi].slice(0, ci);
        if (ci === 0) { del = false; pi = (pi + 1) % PHRASES.length; setTimeout(loop, 350); }
        else setTimeout(loop, 28);
      } else {
        ci++; typeEl.textContent = PHRASES[pi].slice(0, ci);
        if (ci === PHRASES[pi].length) { del = true; setTimeout(loop, 2600); }
        else setTimeout(loop, 55 + Math.random() * 45);
      }
    };
    setTimeout(loop, 2800);
  }

  /* scramble-decode headings */
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
      el.textContent = orig.split("").map((c, i) => (c === " " || i < revealed ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0])).join("");
      if (revealed < orig.length) requestAnimationFrame(tick);
      else { el.textContent = orig; delete el.dataset.busy; }
    };
    tick();
  }
  const headings = $$(".act h2");
  headings.forEach((h) => h.addEventListener("mouseenter", () => scramble(h)));
  if (!reduceMotion) {
    const scrambleIO = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { scramble(e.target); scrambleIO.unobserve(e.target); } }),
      { threshold: 0.6 }
    );
    headings.forEach((h) => scrambleIO.observe(h));
  }

  /* count-up stats */
  if (!reduceMotion) {
    $$("[data-target]").forEach((el) => {
      const target = parseInt(el.dataset.target, 10);
      el.textContent = "0";
      let t0 = null;
      const step = (t) => {
        if (!t0) t0 = t;
        const p = Math.min((t - t0) / 1600, 1);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(step);
      };
      setTimeout(() => requestAnimationFrame(step), 500);
    });
  }

  /* demo panels: tilt + spotlight */
  if (finePointer && !reduceMotion) {
    $$(".demo").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        const x = e.clientX - r.left, y = e.clientY - r.top;
        card.style.setProperty("--mx", x + "px");
        card.style.setProperty("--my", y + "px");
        card.style.transform = `perspective(900px) rotateX(${(y / r.height - 0.5) * -3.5}deg) rotateY(${(x / r.width - 0.5) * 3.5}deg)`;
      });
      card.addEventListener("mouseleave", () => { card.style.transform = ""; });
    });
  }

  /* ambient glow drifts toward the mouse */
  if (finePointer && !reduceMotion) {
    let queued = false;
    addEventListener("mousemove", (e) => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        document.body.style.setProperty("--gx", (e.clientX / innerWidth - 0.5) * 150 + "px");
        document.body.style.setProperty("--gy", (e.clientY / innerHeight - 0.5) * 75 + "px");
        queued = false;
      });
    }, { passive: true });
  }

  /* copy email */
  const copyBtn = $("#copy-email");
  copyBtn.addEventListener("click", async () => {
    const email = "nickthe20@gmail.com";
    try { await navigator.clipboard.writeText(email); }
    catch {
      const ta = document.createElement("textarea");
      ta.value = email; document.body.appendChild(ta); ta.select();
      document.execCommand("copy"); ta.remove();
    }
    copyBtn.textContent = "Copied ✓";
    copyBtn.classList.add("copied");
    setTimeout(() => { copyBtn.textContent = "Copy email"; copyBtn.classList.remove("copied"); }, 1600);
  });

  /* for the devs who open the console */
  console.log(
    "%c// nick nojiri" + "%c  pipelines that ship",
    "font-family:monospace;font-size:15px;color:#8b83f0;font-weight:bold",
    "font-family:monospace;font-size:13px;color:#2fbf93"
  );
  console.log("%cSource: https://github.com/NickNojiri/portfolio", "font-family:monospace;color:#a2a3ad");
})();
