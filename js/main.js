const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");
const links = document.querySelectorAll(".nav-link");
const backToTop = document.getElementById("backToTop");
const typed = document.getElementById("typed");
const yearEl = document.getElementById("year");

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
  .querySelectorAll(".skills-grid, .projects-grid, .stats, .socials")
  .forEach((grid) => {
    grid.querySelectorAll(".reveal, .reveal-scale").forEach((el, i) => {
      el.style.transitionDelay = i * 110 + "ms";
    });
  });

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
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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

if (window.matchMedia("(hover: hover)").matches) {
  document.querySelectorAll(".project-card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-4px)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
}
