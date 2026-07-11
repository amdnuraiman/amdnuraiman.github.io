// Mobile nav toggle
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.querySelector('.nav-links');
navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

// Animated node-link "transaction network" background
const canvas = document.getElementById('net-bg');
const ctx = canvas.getContext('2d');
let w, h, nodes;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function resize(){
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

const NODE_COUNT = Math.min(60, Math.floor((window.innerWidth * window.innerHeight) / 26000));
nodes = Array.from({ length: NODE_COUNT }, () => ({
  x: Math.random() * w,
  y: Math.random() * h,
  vx: (Math.random() - 0.5) * 0.18,
  vy: (Math.random() - 0.5) * 0.18,
}));

function draw(){
  ctx.clearRect(0, 0, w, h);
  for (const n of nodes){
    if (!reduceMotion){
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > w) n.vx *= -1;
      if (n.y < 0 || n.y > h) n.vy *= -1;
    }
  }
  for (let i = 0; i < nodes.length; i++){
    for (let j = i + 1; j < nodes.length; j++){
      const a = nodes[i], b = nodes[j];
      const dx = a.x - b.x, dy = a.y - b.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 150){
        ctx.strokeStyle = `rgba(52,87,232,${0.12 * (1 - dist/150)})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
  }
  for (const n of nodes){
    ctx.fillStyle = 'rgba(20,199,180,0.55)';
    ctx.beginPath();
    ctx.arc(n.x, n.y, 1.6, 0, Math.PI * 2);
    ctx.fill();
  }
  if (!reduceMotion) requestAnimationFrame(draw);
}
draw();

// Fade-in sections on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting){
      e.target.style.opacity = 1;
      e.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.section').forEach(sec => {
  sec.style.opacity = 0;
  sec.style.transform = 'translateY(24px)';
  sec.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
  observer.observe(sec);
});

// Case history horizontal slider
(function(){
  const track = document.getElementById('case-track');
  const viewport = document.getElementById('case-viewport');
  const prevBtn = document.getElementById('case-prev');
  const nextBtn = document.getElementById('case-next');
  const dotsWrap = document.getElementById('case-dots');
  if (!track) return;

  const slides = Array.from(track.children);
  let index = 0;

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Go to case ' + (i + 1));
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.children);

  function update(){
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === slides.length - 1;
  }

  function goTo(i){
    index = Math.max(0, Math.min(slides.length - 1, i));
    update();
  }

  prevBtn.addEventListener('click', () => goTo(index - 1));
  nextBtn.addEventListener('click', () => goTo(index + 1));

  // swipe support
  let startX = 0, deltaX = 0, dragging = false;
  viewport.addEventListener('touchstart', e => { startX = e.touches[0].clientX; dragging = true; }, {passive:true});
  viewport.addEventListener('touchmove', e => { if(dragging) deltaX = e.touches[0].clientX - startX; }, {passive:true});
  viewport.addEventListener('touchend', () => {
    if (Math.abs(deltaX) > 50) goTo(index + (deltaX < 0 ? 1 : -1));
    deltaX = 0; dragging = false;
  });

  // keyboard nav when viewport focused
  viewport.setAttribute('tabindex', '0');
  viewport.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') goTo(index + 1);
    if (e.key === 'ArrowLeft') goTo(index - 1);
  });

  update();
})();

// Cert flip cards — tap-to-flip on touch devices
document.querySelectorAll('.cert-flip').forEach(card => {
  card.addEventListener('click', () => {
    if (window.matchMedia('(hover: none)').matches){
      card.classList.toggle('flipped');
    }
  });
});
