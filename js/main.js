// Botón para volver al inicio: aparece al bajar
const toTop = document.querySelector(".to-top");
toTop.addEventListener("click", (e) => {
  e.preventDefault();
  window.scrollTo({ top: 0 });
});

// Columna roja: marca la sección que está en pantalla y muestra cuánto has bajado
const rail = document.querySelector(".rail");
const nav = document.getElementById("nav");
const indicator = nav.querySelector(".rail__indicator");
const navLinks = [...nav.querySelectorAll("a")];
const sections = navLinks.map((a) => document.querySelector(a.hash));
let activeLink = null;

// Mueve el recuadro blanco al link activo (vertical en computadora, horizontal en celular)
function placeIndicator(link, animate = true) {
  if (!link) return indicator.classList.remove("is-visible");
  // Si estaba oculto, aparece directo en su lugar en vez de deslizarse desde la orilla
  if (!animate || !indicator.classList.contains("is-visible")) indicator.style.transition = "none";
  indicator.style.width = link.offsetWidth + "px";
  indicator.style.height = link.offsetHeight + "px";
  indicator.style.transform = `translate(${link.offsetLeft}px, ${link.offsetTop}px)`;
  indicator.offsetWidth;
  indicator.style.transition = "";
  indicator.classList.add("is-visible");
}

function setActive(link) {
  if (link === activeLink) return;
  activeLink = link;
  navLinks.forEach((a) => a.setAttribute("aria-current", String(a === link)));
  placeIndicator(link);
}

function onScroll() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  rail.style.setProperty("--progress", max > 0 ? Math.min(window.scrollY / max, 1) : 0);
  toTop.classList.toggle("is-visible", window.scrollY > 500);

  // Activa la sección que cruza el 40% de la pantalla; al llegar al final, la última
  const line = window.innerHeight * 0.4;
  let current = null;
  sections.forEach((s, i) => {
    const r = s.getBoundingClientRect();
    if (r.top <= line && r.bottom > line) current = navLinks[i];
  });
  if (window.scrollY >= max - 2 && max > 0) current = navLinks[navLinks.length - 1];
  setActive(current);
}

let ticking = false;
window.addEventListener("scroll", () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => { onScroll(); ticking = false; });
}, { passive: true });
window.addEventListener("resize", () => { placeIndicator(activeLink, false); onScroll(); });
onScroll();

// Tarjetas de proyectos generadas desde data/projects.js
const grid = document.getElementById("projects-grid");
const escape = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const ICONS = {
  web: '<path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 0c2.5 2.7 3.8 6 3.8 10s-1.3 7.3-3.8 10M12 2C9.5 4.7 8.2 8 8.2 12s1.3 7.3 3.8 10M2.5 9h19M2.5 15h19"/>',
  app: '<rect x="6" y="2" width="12" height="20" rx="3"/><path d="M10.5 18.5h3"/>'
};
const domainOf = (url) => {
  const u = new URL(url);
  return u.hostname === "play.google.com" ? "Google Play" : u.hostname.replace(/^www\./, "");
};

// Cada tarjeta tiene dos caras: el frente (resumen) y el reverso (información completa)
grid.innerHTML = (window.PROJECTS || []).map((p) => `
  <article class="project" data-category="${escape(p.category)}">
    <div class="project__inner">
      <button class="project__face project__front" type="button" aria-expanded="false" aria-label="Ver más sobre ${escape(p.title)}">
        <span class="project__bar">
          <span class="project__lights" aria-hidden="true"><i></i><i></i><i></i></span>
          <span class="project__url">
            <svg class="project__icon" viewBox="0 0 24 24" aria-hidden="true">${ICONS[p.type] || ICONS.web}</svg>
            <span class="project__domain">${escape(domainOf(p.url))}</span>
          </span>
        </span>
        <span class="project__shot${p.banner ? " project__shot--banner" : ""}"${p.banner ? ` style="--banner: ${escape(p.banner)}; --icon: url('${escape(new URL(p.image, location.href).href)}')"` : ""}>
          ${p.image ? `<img src="${escape(p.image)}" alt="" loading="lazy">` : ""}
          <span class="project__peek" aria-hidden="true">Ver detalles <svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg></span>
        </span>
        <span class="project__body">
          <span class="project__title">${escape(p.title)}</span>
          <span class="project__role">${escape(p.role)}</span>
          <span class="project__desc">${escape(p.description)}</span>
          <span class="project__hint">Ver más <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg></span>
        </span>
      </button>

      <div class="project__face project__back" inert>
        <div class="project__back-head">
          <h3 class="project__title">${escape(p.title)}</h3>
          <button class="project__close" type="button" aria-label="Volver">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>
          </button>
        </div>
        <span class="project__role">${escape(p.role)}</span>
        <p class="project__about">${escape(p.description)}</p>
        ${p.tasks && p.tasks.length ? `
        <h4 class="project__label">Qué hice</h4>
        <ul class="project__tasks">${p.tasks.map((t) => `<li>${escape(t)}</li>`).join("")}</ul>` : ""}
        ${p.stack && p.stack.length ? `
        <h4 class="project__label">Tecnologías</h4>
        <ul class="project__stack">${p.stack.map((t) => `<li>${escape(t)}</li>`).join("")}</ul>` : ""}
        <a class="project__link" href="${escape(p.url)}" target="_blank" rel="noopener">
          ${p.type === "app" ? "Ver en Google Play" : "Visitar sitio"}
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8"/></svg>
        </a>
      </div>
    </div>
  </article>`).join("");

// Voltear tarjetas: clic en el frente abre, clic en la X (o Escape) cierra
function flipCard(card, open) {
  const front = card.querySelector(".project__front");
  const back = card.querySelector(".project__back");
  card.classList.toggle("is-flipped", open);
  front.inert = open;
  back.inert = !open;
  front.setAttribute("aria-expanded", String(open));
  (open ? back.querySelector(".project__close") : front).focus({ preventScroll: true });
}

grid.addEventListener("click", (e) => {
  const card = e.target.closest(".project");
  if (!card) return;
  if (e.target.closest(".project__front")) flipCard(card, true);
  else if (e.target.closest(".project__close")) flipCard(card, false);
});

document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  const card = document.activeElement && document.activeElement.closest(".project.is-flipped");
  if (card) flipCard(card, false);
});

// Carrusel de proyectos: flechas y puntos avanzan de página en página
const controls = document.querySelector(".carousel__controls");
const dots = controls.querySelector(".carousel__dots");
const [prevBtn, nextBtn] = controls.querySelectorAll(".carousel__btn");

function carouselPages() {
  const cards = [...grid.querySelectorAll(".project:not([hidden])")];
  if (!cards.length) return { cards, perView: 1, pages: 0 };
  const step = cards[0].offsetWidth + parseFloat(getComputedStyle(grid).columnGap);
  const perView = Math.max(1, Math.round(grid.clientWidth / step));
  return { cards, perView, pages: Math.ceil(cards.length / perView) };
}
function pageLeft(page) {
  const { cards, perView } = carouselPages();
  const card = cards[Math.min(page * perView, cards.length - 1)];
  return card ? card.offsetLeft - parseFloat(getComputedStyle(grid).scrollPaddingLeft) : 0;
}
function currentPage() {
  const { pages } = carouselPages();
  const max = grid.scrollWidth - grid.clientWidth;
  if (grid.scrollLeft >= max - 2) return pages - 1;
  let page = 0;
  for (let i = 0; i < pages; i++) if (pageLeft(i) <= grid.scrollLeft + 2) page = i;
  return page;
}
function updateControls() {
  const max = grid.scrollWidth - grid.clientWidth;
  controls.hidden = max <= 2;
  prevBtn.disabled = grid.scrollLeft <= 2;
  nextBtn.disabled = grid.scrollLeft >= max - 2;
  grid.classList.toggle("is-end", nextBtn.disabled);
  const page = currentPage();
  dots.querySelectorAll(".carousel__dot").forEach((dot, i) => {
    dot.classList.toggle("is-active", i === page);
    dot.setAttribute("aria-current", String(i === page));
  });
}
function buildDots() {
  const { pages } = carouselPages();
  dots.innerHTML = Array.from({ length: pages }, (_, i) =>
    `<button class="carousel__dot" type="button" aria-label="Página ${i + 1} de ${pages}"></button>`).join("");
  updateControls();
}
const goToPage = (page) => grid.scrollTo({ left: pageLeft(page) });

dots.addEventListener("click", (e) => {
  const dot = e.target.closest(".carousel__dot");
  if (dot) goToPage([...dots.children].indexOf(dot));
});
prevBtn.addEventListener("click", () => goToPage(Math.max(currentPage() - 1, 0)));
nextBtn.addEventListener("click", () => goToPage(currentPage() + 1));
grid.addEventListener("scroll", updateControls, { passive: true });
new ResizeObserver(buildDots).observe(grid);

// Filtros de proyectos (cada uno muestra cuántos proyectos tiene)
const filters = document.querySelectorAll(".filter");
filters.forEach((btn) => {
  const value = btn.dataset.filter;
  const count = (window.PROJECTS || []).filter((p) => value === "all" || p.category === value).length;
  btn.insertAdjacentHTML("beforeend", ` <span class="filter__count">${count}</span>`);
});
filters.forEach((btn) => {
  btn.addEventListener("click", () => {
    const value = btn.dataset.filter;
    filters.forEach((b) => {
      const active = b === btn;
      b.classList.toggle("is-active", active);
      b.setAttribute("aria-pressed", String(active));
    });
    grid.querySelectorAll(".project").forEach((card) => {
      card.hidden = value !== "all" && card.dataset.category !== value;
    });
    grid.scrollTo({ left: 0, behavior: "instant" });
    buildDots();
  });
});

// Animación de contenido al hacer scroll (GSAP + ScrollTrigger, ver js/animated-content.js)
// data-reveal: anima el elemento · data-reveal-stagger: anima sus hijos uno tras otro
// data-reveal-trigger="mount": se anima al cargar en lugar de al hacer scroll
if (window.gsap && window.ScrollTrigger && window.AnimatedContent) {
  gsap.registerPlugin(ScrollTrigger);
  document.querySelectorAll("[data-reveal]").forEach((el) => {
    AnimatedContent(el, {
      distance: 100,
      duration: 1,
      ease: "power3.out",
      scale: 0.95,
      blur: 8,
      threshold: 0.2,
      stagger: parseFloat(el.dataset.revealStagger) || 0,
      delay: parseFloat(el.dataset.revealDelay) || 0,
      trigger: el.dataset.revealTrigger || "scroll"
    });
  });
} else {
  // Si GSAP no cargó (sin internet, por ejemplo), se muestra todo sin animación
  document.documentElement.classList.remove("js-anim");
}
