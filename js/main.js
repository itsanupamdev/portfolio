const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");
const links = document.querySelectorAll(".nav-link");
const backToTop = document.getElementById("backToTop");
const typed = document.getElementById("typed");
const yearEl = document.getElementById("year");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

hamburger.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  hamburger.classList.toggle("open", isOpen);
  hamburger.setAttribute("aria-expanded", String(isOpen));
});

links.forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    hamburger.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
  });
});

const sections = document.querySelectorAll("section[id]");

function highlightNav() {
  const scrollY = window.scrollY + 120;
  sections.forEach((section) => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute("id");
    if (scrollY >= top && scrollY < top + height) {
      links.forEach((link) =>
        link.classList.toggle(
          "active",
          link.getAttribute("href") === `#${id}`
        )
      );
    }
  });
}

function toggleOnScroll() {
  const navbar = document.querySelector(".navbar");
  navbar.classList.toggle("scrolled", window.scrollY > 40);
  backToTop.classList.toggle("show", window.scrollY > 500);
}

const progressBar = document.getElementById("progressBar");
const heroInner = document.querySelector(".hero-inner");
const orb1 = document.querySelector(".orb-1");
const orb2 = document.querySelector(".orb-2");

window.addEventListener("scroll", () => {
  toggleOnScroll();
  highlightNav();
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = (window.scrollY / max) * 100 + "%";
  if (!reduceMotion && window.scrollY < window.innerHeight) {
    const y = window.scrollY;
    heroInner.style.transform = `translateY(${y * 0.22}px)`;
    heroInner.style.opacity = Math.max(0, 1 - y / (window.innerHeight * 0.85));
    if (orb1 && orb2) {
      orb1.style.translate = `0 ${y * 0.14}px`;
      orb2.style.translate = `0 ${-y * 0.1}px`;
    }
  }
}, { passive: true });

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document
  .querySelectorAll(".skills-grid, .projects-stack, .stats, .socials")
  .forEach((grid) => {
    grid.querySelectorAll(".reveal, .reveal-scale").forEach((el, i) => {
      el.style.transitionDelay = i * 110 + "ms";
    });
  });

const heroNameLines = document.querySelectorAll(".hero-name .line");

if (heroNameLines.length && !reduceMotion) {
  let globalIndex = 0;
  heroNameLines.forEach((line) => {
    const text = line.textContent;
    line.textContent = "";
    [...text].forEach((ch) => {
      const span = document.createElement("span");
      span.className = "char";
      span.style.setProperty("--i", globalIndex++);
      span.textContent = ch === " " ? "\u00A0" : ch;
      line.appendChild(span);
    });
  });
}

document.querySelectorAll(".reveal, .reveal-left, .reveal-right, .reveal-scale")
  .forEach((el) => observer.observe(el));

const roles = [
  "Full Stack Developer",
  "Frontend Enthusiast",
  "UI Builder",
  "Problem Solver"
];

let roleIndex = 0;
let charIndex = 0;
let deleting = false;

function type() {
  const current = roles[roleIndex];

  if (!deleting && charIndex <= current.length) {
    typed.textContent = current.slice(0, charIndex);
    charIndex++;
    setTimeout(type, 80);
  } else if (deleting && charIndex >= 0) {
    typed.textContent = current.slice(0, charIndex);
    charIndex--;
    setTimeout(type, 40);
  } else {
    deleting = !deleting;
    if (!deleting) roleIndex = (roleIndex + 1) % roles.length;
    setTimeout(type, deleting ? 1400 : 300);
  }
}

yearEl.textContent = new Date().getFullYear();
type();

const statNums = document.querySelectorAll(".stat-num");

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      counterObserver.unobserve(el);
      const target = parseInt(el.textContent, 10);
      const suffix = el.textContent.replace(/[0-9]/g, "");
      let current = 0;
      const step = Math.max(1, Math.ceil(target / 40));
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        el.textContent = current + suffix;
      }, 30);
    });
  },
  { threshold: 0.5 }
);

statNums.forEach((el) => counterObserver.observe(el));

const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");
let particles = [];
let cw = 0;
let ch = 0;

function resizeCanvas() {
  cw = canvas.width = canvas.offsetWidth;
  ch = canvas.height = canvas.offsetHeight;
}

function initParticles() {
  resizeCanvas();
  particles = Array.from({ length: Math.min(70, Math.floor((cw * ch) / 18000)) }, () => ({
    x: Math.random() * cw,
    y: Math.random() * ch,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    r: Math.random() * 1.6 + 0.6,
    accent: Math.random() > 0.5
  }));
}

function drawParticles() {
  ctx.clearRect(0, 0, cw, ch);
  for (const p of particles) {
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0 || p.x > cw) p.vx *= -1;
    if (p.y < 0 || p.y > ch) p.vy *= -1;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = p.accent ? "rgba(100,255,218,0.7)" : "rgba(124,108,255,0.6)";
    ctx.fill();
  }
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.hypot(dx, dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(124,108,255,${(1 - dist / 120) * 0.18})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(drawParticles);
}

if (!reduceMotion && canvas) {
  window.addEventListener("resize", initParticles);
  initParticles();
  requestAnimationFrame(drawParticles);

  const heroSection = document.getElementById("home");
  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      canvas.style.display = entry.isIntersecting ? "block" : "none";
    });
  });
  heroObserver.observe(heroSection);
}

const zoomSections = document.querySelectorAll(".zoom-section");
let zoomTicking = false;

function updateZoom() {
  const vh = window.innerHeight;
  zoomSections.forEach((el) => {
    const rect = el.getBoundingClientRect();
    const progress = Math.min(1, Math.max(0, (vh - rect.top) / (vh * 0.55)));
    if (progress >= 0.999) {
      el.style.transform = "";
      el.style.opacity = "";
      el.style.filter = "";
      return;
    }
    const scale = 0.88 + progress * 0.12;
    el.style.transform = `scale(${scale})`;
    el.style.opacity = (0.25 + progress * 0.75).toFixed(3);
    el.style.filter = `blur(${((1 - progress) * 5).toFixed(2)}px)`;
  });
  zoomTicking = false;
}

function requestZoom() {
  if (!zoomTicking) {
    zoomTicking = true;
    requestAnimationFrame(updateZoom);
  }
}

if (!reduceMotion) {
  window.addEventListener("scroll", requestZoom, { passive: true });
  window.addEventListener("resize", requestZoom);
  updateZoom();
}

const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const cursorDot = document.getElementById("cursorDot");
const cursorRing = document.getElementById("cursorRing");

if (canHover) {
  let mx = window.innerWidth / 2;
  let my = window.innerHeight / 2;
  let ringX = mx;
  let ringY = my;
  let shown = false;

  window.addEventListener("mousemove", (e) => {
    mx = e.clientX;
    my = e.clientY;
    cursorDot.style.left = mx + "px";
    cursorDot.style.top = my + "px";
    if (!shown) {
      shown = true;
      cursorDot.style.opacity = 1;
      cursorRing.style.opacity = 1;
    }
    const target = e.target.closest("a, button, .skill-card, .project-card");
    cursorRing.classList.toggle("hovering", !!target);
  });

  document.documentElement.addEventListener("mouseleave", () => {
    cursorDot.style.opacity = 0;
    cursorRing.style.opacity = 0;
  });

  document.documentElement.addEventListener("mouseenter", () => {
    if (shown) {
      cursorDot.style.opacity = 1;
      cursorRing.style.opacity = 1;
    }
  });

  (function ringLoop() {
    ringX += (mx - ringX) * 0.16;
    ringY += (my - ringY) * 0.16;
    cursorRing.style.left = ringX + "px";
    cursorRing.style.top = ringY + "px";
    requestAnimationFrame(ringLoop);
  })();

  document.querySelectorAll(".hero-actions .btn, .back-to-top").forEach((el) => {
    el.addEventListener("mousemove", (e) => {
      const r = el.getBoundingClientRect();
      el.style.transform =
        `translate(${((e.clientX - r.left - r.width / 2) * 0.25).toFixed(1)}px, ` +
        `${((e.clientY - r.top - r.height / 2) * 0.25).toFixed(1)}px)`;
    });
    el.addEventListener("mouseleave", () => {
      el.style.transform = "";
    });
  });
}

document.querySelectorAll(".skill-card, .project-card").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", e.clientX - r.left + "px");
    card.style.setProperty("--my", e.clientY - r.top + "px");
  });
});

document.querySelectorAll(".btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const ripple = document.createElement("span");
    ripple.className = "ripple";
    ripple.style.width = ripple.style.height = size + "px";
    ripple.style.left = e.clientX - rect.left - size / 2 + "px";
    ripple.style.top = e.clientY - rect.top - size / 2 + "px";
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 650);
  });
});

const fxCanvas = document.getElementById("fxCanvas");
const fxCtx = fxCanvas.getContext("2d");
const FX_COLORS = ["#64ffda", "#7c6cff", "#4cc9f0", "#d6deeb", "#ffffff"];
let fxParticles = [];
let fxBursts = [];
let fxRunning = false;

function resizeFx() {
  fxCanvas.width = window.innerWidth;
  fxCanvas.height = window.innerHeight;
}

window.addEventListener(
  "pointerdown",
  (e) => {
    if (reduceMotion) return;
    const x = e.clientX;
    const y = e.clientY;
    const count = 16 + Math.floor(Math.random() * 6);
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
      const speed = 2 + Math.random() * 2.8;
      fxParticles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1,
        size: 1.8 + Math.random() * 1.8,
        life: 1,
        decay: 0.016 + Math.random() * 0.02,
        color: FX_COLORS[Math.floor(Math.random() * FX_COLORS.length)]
      });
    }
    fxBursts.push({ x, y, radius: 2, life: 1 });
    for (let k = 0; k < 3; k++) {
      fxParticles.push({
        x,
        y,
        vx: 0,
        vy: 0,
        size: 3.2,
        life: 1,
        decay: 0.06,
        color: "#ffffff"
      });
    }
    startFx();
  },
  true
);

function startFx() {
  if (!fxRunning) {
    fxRunning = true;
    requestAnimationFrame(fxLoop);
  }
}

function fxLoop() {
  fxCtx.clearRect(0, 0, fxCanvas.width, fxCanvas.height);

  fxParticles = fxParticles.filter((p) => p.life > 0);
  for (const p of fxParticles) {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.06;
    p.vx *= 0.985;
    p.life -= p.decay;
    fxCtx.globalAlpha = Math.max(0, p.life);
    fxCtx.beginPath();
    fxCtx.arc(p.x, p.y, Math.max(0.3, p.size * p.life), 0, Math.PI * 2);
    fxCtx.fillStyle = p.color;
    fxCtx.fill();
  }

  fxBursts = fxBursts.filter((b) => b.life > 0);
  for (const b of fxBursts) {
    b.radius += 2.6;
    b.life -= 0.06;
    fxCtx.globalAlpha = Math.max(0, b.life) * 0.5;
    fxCtx.beginPath();
    fxCtx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
    fxCtx.strokeStyle = "rgba(100,255,218,1)";
    fxCtx.lineWidth = 1.2;
    fxCtx.stroke();
  }

  fxCtx.globalAlpha = 1;

  if (fxParticles.length || fxBursts.length) {
    requestAnimationFrame(fxLoop);
  } else {
    fxRunning = false;
    fxCtx.clearRect(0, 0, fxCanvas.width, fxCanvas.height);
  }
}

resizeFx();
window.addEventListener("resize", resizeFx);

const PROJECTS = [
  {
    num: "01",
    title: "Autonomous Multi-Agent Orchestrator",
    desc: "A production-grade distributed agentic mesh featuring DAG-based task decomposition, real-time code synthesis, automated AST security audits, virtualized sandbox testing, and an autonomous self-healing feedback loop.",
    tags: ["Autonomous Agents", "DAG Engine", "Self-Healing", "TypeScript", "Sandboxing"],
    github: "https://github.com/itsanupamdev/autonomous-agent-orchestrator",
    live: "https://itsanupamdev.github.io/autonomous-agent-orchestrator/",
    variant: "v1"
  },
  {
    num: "02",
    title: "DevFlow Tech Blog",
    desc: "A high-performance developer blogging platform built with Next.js 15, React, TypeScript, and Tailwind CSS. Features curated technical essays, reading time estimates, category filters, and an interactive article reader modal.",
    tags: ["Next.js 15", "React", "TypeScript", "Tailwind CSS"],
    github: "https://github.com/itsanupamdev/-Development-project-2",
    live: "https://itsanupamdev.github.io/-Development-project-2/",
    variant: "v2"
  },
  {
    num: "03",
    title: "LearnHub Learning Platform",
    desc: "An interactive, feature-packed online learning platform featuring curated engineering courses, category filter tabs, in-browser search, student testimonials, and seamless instant enrollment modals.",
    tags: ["JavaScript", "HTML5", "CSS3", "Design Systems"],
    github: "https://github.com/itsanupamdev/online-learning-platform",
    live: "https://itsanupamdev.github.io/online-learning-platform/",
    variant: "v3"
  },
  {
    num: "04",
    title: "PulseCommerce PWA",
    desc: "A mobile-first Progressive Web App store with service worker caching, instant offline browsing, an interactive sliding shopping cart drawer, and native add-to-homescreen installation.",
    tags: ["PWA", "Service Worker", "JavaScript", "E-Commerce"],
    github: "https://github.com/itsanupamdev/codtech-task-4-progressive-web-application-pwa-",
    live: "https://itsanupamdev.github.io/codtech-task-4-progressive-web-application-pwa-/",
    variant: "v4"
  }
];

const projectModal = document.getElementById("projectModal");
const modalArt = document.getElementById("modalArt");
const modalNum = document.getElementById("modalNum");
const modalTitle = document.getElementById("modalTitle");
const modalDesc = document.getElementById("modalDesc");
const modalTags = document.getElementById("modalTags");
const modalLive = document.getElementById("modalLive");
const modalGithub = document.getElementById("modalGithub");
const modalCount = document.getElementById("modalCount");
let currentProject = 0;

function renderModal(i) {
  const p = PROJECTS[i];
  modalArt.className = "project-visual modal-art " + p.variant;
  modalNum.textContent = p.num;
  modalTitle.textContent = p.title;
  modalDesc.textContent = p.desc;
  modalTags.innerHTML = p.tags.map((t) => "<li>" + t + "</li>").join("");
  modalLive.href = p.live || p.github;
  modalGithub.href = p.github;
  modalCount.textContent = i + 1 + " / " + PROJECTS.length;

  if (p.live && p.live.includes("github.io")) {
    modalLive.innerHTML = 'Live Demo <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>';
  } else {
    modalLive.innerHTML = 'View Project <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17 17 7"/><path d="M7 7h10v10"/></svg>';
  }
}

function openModal(i) {
  currentProject = i;
  renderModal(i);
  projectModal.classList.add("open");
  projectModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeModal() {
  projectModal.classList.remove("open");
  projectModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

function switchProject(dir) {
  const info = document.getElementById("modalInfo");
  const art = modalArt;
  [info, art].forEach((el) => (el.style.opacity = "0"));
  setTimeout(() => {
    currentProject = (currentProject + dir + PROJECTS.length) % PROJECTS.length;
    renderModal(currentProject);
    [info, art].forEach((el) => (el.style.opacity = "1"));
  }, 180);
}

document.querySelectorAll(".projects-grid .project-card").forEach((card) => {
  card.addEventListener("click", (e) => {
    if (e.target.closest("a")) return;
    openModal(parseInt(card.dataset.index, 10));
  });
});

document.getElementById("modalClose").addEventListener("click", closeModal);
document.getElementById("modalBackdrop").addEventListener("click", closeModal);
document.getElementById("modalPrev").addEventListener("click", () => switchProject(-1));
document.getElementById("modalNext").addEventListener("click", () => switchProject(1));

window.addEventListener("keydown", (e) => {
  if (!projectModal.classList.contains("open")) return;
  if (e.key === "Escape") closeModal();
  if (e.key === "ArrowLeft") switchProject(-1);
  if (e.key === "ArrowRight") switchProject(1);
});
