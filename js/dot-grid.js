// Fondo del inicio: cuadrícula de puntos tenue; los puntos cerca del cursor se vuelven rojos y crecen un poco.
// Solo se redibuja mientras el cursor se mueve; si no, se queda quieto.
(function () {
  const canvas = document.querySelector(".hero__dots");
  if (!canvas) return;
  const hero = canvas.parentElement;
  const ctx = canvas.getContext("2d");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const GAP = 28;          // distancia entre puntos
  const SIZE = 1.3;        // radio normal de cada punto
  const GROW = 0.7;        // cuánto crece un punto bajo el cursor
  const RADIUS = 130;      // alcance del cursor
  const PUSH = 2;          // cuánto se apartan los puntos del cursor
  const TINT = 0.6;        // qué tan rojo se vuelve un punto bajo el cursor (1 = rojo completo)
  const BASE = [201, 198, 192];  // --stone
  const RED = [217, 48, 37];     // --red

  let width = 0, height = 0, dpr = 1;
  let target = { x: -9999, y: -9999, on: 0 };
  let current = { x: -9999, y: -9999, on: 0 };
  let frame = 0;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = hero.clientWidth;
    height = hero.clientHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw();
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    const offX = (width % GAP) / 2;
    const offY = (height % GAP) / 2;
    const strength = current.on;
    for (let y = offY; y <= height; y += GAP) {
      for (let x = offX; x <= width; x += GAP) {
        const dx = x - current.x;
        const dy = y - current.y;
        const dist = Math.hypot(dx, dy);
        // t: 0 lejos del cursor, 1 justo debajo (con curva suave)
        let t = strength > 0 && dist < RADIUS ? 1 - dist / RADIUS : 0;
        t = t * t * (3 - 2 * t) * strength;
        const px = t ? x + (dx / (dist || 1)) * PUSH * t : x;
        const py = t ? y + (dy / (dist || 1)) * PUSH * t : y;
        const c = BASE.map((v, i) => Math.round(v + (RED[i] - v) * t * TINT));
        ctx.fillStyle = `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${0.55 + 0.25 * t})`;
        ctx.beginPath();
        ctx.arc(px, py, SIZE * (1 + GROW * t), 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // Sigue al cursor con un poco de retraso para que se sienta suave
  function tick() {
    current.x += (target.x - current.x) * 0.18;
    current.y += (target.y - current.y) * 0.18;
    current.on += (target.on - current.on) * 0.12;
    draw();
    const settled = Math.abs(target.x - current.x) < 0.5 && Math.abs(target.y - current.y) < 0.5 && Math.abs(target.on - current.on) < 0.01;
    if (settled) { current.on = target.on; draw(); frame = 0; return; }
    frame = requestAnimationFrame(tick);
  }
  const wake = () => { if (!frame) frame = requestAnimationFrame(tick); };

  new ResizeObserver(resize).observe(hero);
  if (reduce) return;

  window.addEventListener("pointermove", (e) => {
    if (e.pointerType !== "mouse") return;
    const r = hero.getBoundingClientRect();
    const inside = e.clientY >= r.top && e.clientY <= r.bottom;
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    // Al entrar, aparece donde está el cursor en vez de llegar desde lejos
    if (!target.on && inside) { current.x = x; current.y = y; }
    target = { x, y, on: inside ? 1 : 0 };
    wake();
  }, { passive: true });
  document.addEventListener("pointerleave", () => { target.on = 0; wake(); });
})();
