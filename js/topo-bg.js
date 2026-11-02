// Fondo del inicio: curvas de nivel (como un mapa topográfico) que se deforman despacio.
// Las líneas cercanas al cursor se pintan de rojo. Solo se anima mientras el inicio está en pantalla;
// si la persona prefiere menos movimiento, se dibuja una sola vez y se queda quieto.
(function () {
  const canvas = document.querySelector(".hero__bg");
  if (!canvas) return;
  const hero = canvas.parentElement;
  const ctx = canvas.getContext("2d");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const ZOOM = 260;        // tamaño de las "montañas" (más grande = curvas más abiertas)
  const SPEED = 0.05;      // qué tan rápido se deforman
  const STEP = 0.1;        // separación entre curvas de nivel
  const LINE = "rgba(201, 198, 192, 0.75)";   // --stone
  const RED = "217, 48, 37";                  // --red
  const GLOW = 220;        // alcance del rojo alrededor del cursor
  const FPS = 30;

  // Ruido Perlin 3D: da valores suaves que cambian poco a poco (x, y = posición, z = tiempo)
  const perm = new Uint8Array(512);
  const p = [...Array(256).keys()];
  for (let i = 255; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [p[i], p[j]] = [p[j], p[i]]; }
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255];
  const fade = (t) => t * t * t * (t * (t * 6 - 15) + 10);
  const lerp = (a, b, t) => a + t * (b - a);
  const grad = (h, x, y, z) => {
    h &= 15;
    const u = h < 8 ? x : y, v = h < 4 ? y : (h === 12 || h === 14 ? x : z);
    return ((h & 1) ? -u : u) + ((h & 2) ? -v : v);
  };
  function noise(x, y, z) {
    const X = Math.floor(x) & 255, Y = Math.floor(y) & 255, Z = Math.floor(z) & 255;
    x -= Math.floor(x); y -= Math.floor(y); z -= Math.floor(z);
    const u = fade(x), v = fade(y), w = fade(z);
    const A = perm[X] + Y, AA = perm[A] + Z, AB = perm[A + 1] + Z;
    const B = perm[X + 1] + Y, BA = perm[B] + Z, BB = perm[B + 1] + Z;
    return lerp(
      lerp(lerp(grad(perm[AA], x, y, z), grad(perm[BA], x - 1, y, z), u),
           lerp(grad(perm[AB], x, y - 1, z), grad(perm[BB], x - 1, y - 1, z), u), v),
      lerp(lerp(grad(perm[AA + 1], x, y, z - 1), grad(perm[BA + 1], x - 1, y, z - 1), u),
           lerp(grad(perm[AB + 1], x, y - 1, z - 1), grad(perm[BB + 1], x - 1, y - 1, z - 1), u), v), w);
  }

  let width = 0, height = 0, cell = 14;
  let mouse = { x: 0, y: 0, tx: 0, ty: 0, on: 0, target: 0 };

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = hero.clientWidth;
    height = hero.clientHeight;
    cell = width < 700 ? 18 : 14;   // en celular, menos cálculo
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw(performance.now() / 1000);
  }

  // Marching squares: en cada cuadrito de la malla busca por dónde cruza cada curva de nivel
  function draw(t) {
    ctx.clearRect(0, 0, width, height);
    const S = cell;
    const cols = Math.ceil(width / S) + 1, rows = Math.ceil(height / S) + 1;
    const f = new Float32Array(cols * rows);
    const z = t * SPEED;
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        const x = (i * S) / ZOOM, y = (j * S) / ZOOM;
        f[j * cols + i] = noise(x, y, z) + 0.5 * noise(x * 2.1, y * 2.1, z + 9);
      }
    }

    const path = new Path2D();
    for (let L = -0.6; L <= 0.6; L += STEP) {
      for (let j = 0; j < rows - 1; j++) {
        for (let i = 0; i < cols - 1; i++) {
          const a = f[j * cols + i], b = f[j * cols + i + 1];
          const c = f[(j + 1) * cols + i + 1], d = f[(j + 1) * cols + i];
          const code = (a > L) << 3 | (b > L) << 2 | (c > L) << 1 | (d > L);
          if (code === 0 || code === 15) continue;
          const x0 = i * S, y0 = j * S;
          // Punto donde la curva cruza cada lado del cuadrito
          const top = () => [x0 + ((L - a) / (b - a)) * S, y0];
          const right = () => [x0 + S, y0 + ((L - b) / (c - b)) * S];
          const bottom = () => [x0 + ((L - d) / (c - d)) * S, y0 + S];
          const left = () => [x0, y0 + ((L - a) / (d - a)) * S];
          const seg = (p1, p2) => { path.moveTo(p1[0], p1[1]); path.lineTo(p2[0], p2[1]); };
          switch (code) {
            case 1: case 14: seg(left(), bottom()); break;
            case 2: case 13: seg(bottom(), right()); break;
            case 3: case 12: seg(left(), right()); break;
            case 4: case 11: seg(top(), right()); break;
            case 6: case 9: seg(top(), bottom()); break;
            case 7: case 8: seg(left(), top()); break;
            case 5: seg(left(), top()); seg(bottom(), right()); break;
            case 10: seg(top(), right()); seg(left(), bottom()); break;
          }
        }
      }
    }
    ctx.strokeStyle = LINE;
    ctx.lineWidth = 1;
    ctx.stroke(path);

    // Pinta de rojo las líneas que ya están dibujadas alrededor del cursor
    if (mouse.on > 0.01) {
      ctx.save();
      ctx.globalCompositeOperation = "source-atop";
      const g = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, GLOW);
      g.addColorStop(0, `rgba(${RED}, ${0.9 * mouse.on})`);
      g.addColorStop(1, `rgba(${RED}, 0)`);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();
    }
  }

  new ResizeObserver(resize).observe(hero);
  if (reduce) return;

  // El rojo sigue al cursor con un poco de retraso para que se sienta suave
  window.addEventListener("pointermove", (e) => {
    if (e.pointerType !== "mouse") return;
    const r = hero.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    // Al entrar, aparece donde está el cursor en vez de llegar desde lejos
    if (!mouse.target && mouse.on < 0.01) { mouse.x = x; mouse.y = y; }
    mouse.tx = x; mouse.ty = y;
    mouse.target = e.clientY >= r.top && e.clientY <= r.bottom ? 1 : 0;
  }, { passive: true });
  document.addEventListener("pointerleave", () => { mouse.target = 0; });

  let running = false, last = 0;
  function tick(now) {
    if (!running) return;
    requestAnimationFrame(tick);
    if (now - last < 1000 / FPS) return;
    last = now;
    mouse.x += (mouse.tx - mouse.x) * 0.15;
    mouse.y += (mouse.ty - mouse.y) * 0.15;
    mouse.on += (mouse.target - mouse.on) * 0.12;
    draw(now / 1000);
  }

  // Solo se anima mientras el inicio está en pantalla (y la pestaña visible)
  new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && !running) { running = true; requestAnimationFrame(tick); }
    else if (!entry.isIntersecting) running = false;
  }).observe(hero);
})();
