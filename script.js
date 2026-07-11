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
