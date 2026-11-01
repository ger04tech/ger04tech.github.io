// Gafete que cuelga de un listón: se balancea solo, se puede arrastrar y se inclina hacia el cursor.
(function () {
  const photo = document.querySelector(".hero__photo");
  const badge = photo && photo.querySelector(".badge");
  if (!badge) return;
  const card = badge.querySelector(".badge__card");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduce) return;

  // Inclinación 3D leve según dónde esté el cursor sobre la tarjeta
  card.addEventListener("pointermove", (e) => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    card.style.setProperty("--ry", `${(x - 0.5) * 6}deg`);
    card.style.setProperty("--rx", `${(0.5 - y) * 4}deg`);
  });
  card.addEventListener("pointerleave", () => {
    card.style.setProperty("--rx", "0deg");
    card.style.setProperty("--ry", "0deg");
  });

  // Péndulo: el resorte lo regresa al centro y la fricción lo va frenando
  const STIFFNESS = 30;
  const DAMPING = 4;
  const MAX = 15;
  let angle = 7;          // grados; empieza ladeado para que entre balanceándose
  let velocity = 0;
  let dragging = false;
  let grabOffset = 0;
  let running = false;
  let last = 0;

  const clamp = (v) => Math.max(-MAX, Math.min(MAX, v));
  // Ángulo del cursor respecto al punto donde cuelga el listón (arriba de la tarjeta)
  const pointerAngle = (e) => {
    const r = photo.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - r.top;
    return (-Math.atan2(dx, Math.max(dy, 1)) * 180) / Math.PI;
  };

  badge.addEventListener("pointerdown", (e) => {
    if (e.button !== 0) return;
    dragging = true;
    grabOffset = pointerAngle(e) - angle;
    badge.setPointerCapture(e.pointerId);
    badge.classList.add("is-dragging");
  });
  badge.addEventListener("pointermove", (e) => {
    if (dragging) {
      const next = clamp(pointerAngle(e) - grabOffset);
      velocity = (next - angle) * 60;
      angle = next;
    } else if (e.pointerType === "mouse") {
      // Pasar el cursor por encima le da un empujoncito
      velocity -= e.movementX * 0.04;
    }
  });
  const release = () => {
    dragging = false;
    velocity = Math.max(-60, Math.min(60, velocity));
    badge.classList.remove("is-dragging");
  };
  badge.addEventListener("pointerup", release);
  badge.addEventListener("pointercancel", release);

  function tick(now) {
    if (!running) return;
    const dt = Math.min((now - last) / 1000, 0.032);
    last = now;
    if (!dragging) {
      const rest = 0.6 * Math.sin(now / 1300);   // vaivén suave mientras está quieto
      velocity += (-STIFFNESS * (angle - rest) - DAMPING * velocity) * dt;
      angle = clamp(angle + velocity * dt);
    }
    badge.style.transform = `rotate(${angle.toFixed(3)}deg)`;
    requestAnimationFrame(tick);
  }

  // Solo se anima mientras el inicio está en pantalla
  new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && !running) {
      running = true;
      last = performance.now();
      requestAnimationFrame(tick);
    } else if (!entry.isIntersecting) {
      running = false;
    }
  }).observe(photo);
})();
