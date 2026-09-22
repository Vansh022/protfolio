/* =====================================================
   RONI SEN PORTFOLIO — FIXED SCRIPT
   Black + Purple / responsive / single music system
===================================================== */

window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  if (loader) setTimeout(() => loader.classList.add("hidden"), 1800);
});

// Custom cursor
const cursor = document.querySelector(".cursor");
const cursorRing = document.querySelector(".cursor-ring");
if (cursor && cursorRing && window.innerWidth > 800) {
  let mx=0,my=0,rx=0,ry=0;
  document.addEventListener("mousemove", e => { mx=e.clientX; my=e.clientY; cursor.style.left=mx+"px"; cursor.style.top=my+"px"; });
  const animate=()=>{ rx+=(mx-rx)*.12; ry+=(my-ry)*.12; cursorRing.style.left=rx+"px"; cursorRing.style.top=ry+"px"; requestAnimationFrame(animate); };
  animate();
  document.querySelectorAll("a, button, .tilt-card, .certificate-card").forEach(el=>{
    el.addEventListener("mouseenter",()=>document.body.classList.add("cursor-hover"));
    el.addEventListener("mouseleave",()=>document.body.classList.remove("cursor-hover"));
  });
}

// Mobile menu — matches the actual HTML: .menu-btn + .nav-menu
const menuBtn=document.getElementById("menuBtn");
const navMenu=document.querySelector(".nav-menu");
if(menuBtn && navMenu){
  menuBtn.addEventListener("click",()=>{
    navMenu.classList.toggle("active");
    menuBtn.classList.toggle("active");
    document.body.classList.toggle("menu-open");
  });
  navMenu.querySelectorAll("a").forEach(link=>link.addEventListener("click",()=>{
    navMenu.classList.remove("active");
    menuBtn.classList.remove("active");
    document.body.classList.remove("menu-open");
  }));
}

// Navbar + scroll progress
const navbar=document.querySelector(".navbar");
const progress=document.getElementById("scrollProgress");
window.addEventListener("scroll",()=>{
  if(navbar) navbar.classList.toggle("scrolled",window.scrollY>50);
  if(progress){
    const h=document.documentElement.scrollHeight-window.innerHeight;
    progress.style.width=(h>0?(window.scrollY/h)*100:0)+"%";
  }
},{passive:true});

// Reveal animations
const revealObserver=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{ if(entry.isIntersecting){ entry.target.classList.add("visible"); revealObserver.unobserve(entry.target); }});
},{threshold:.12});
document.querySelectorAll(".reveal").forEach(el=>revealObserver.observe(el));

// Tilt cards
if(window.innerWidth>900){
  document.querySelectorAll(".tilt-card").forEach(card=>{
    card.addEventListener("mousemove",e=>{
      const r=card.getBoundingClientRect(), x=e.clientX-r.left, y=e.clientY-r.top;
      const rx=((y-r.height/2)/(r.height/2))*-3, ry=((x-r.width/2)/(r.width/2))*3;
      card.style.transform=`perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
    });
    card.addEventListener("mouseleave",()=>card.style.transform="perspective(1000px) rotateX(0deg) rotateY(0deg)");
  });
}

// Magnetic buttons
if(window.innerWidth>900){
  document.querySelectorAll(".magnetic").forEach(el=>{
    el.addEventListener("mousemove",e=>{ const r=el.getBoundingClientRect(); el.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.12}px, ${(e.clientY-r.top-r.height/2)*.12}px)`; });
    el.addEventListener("mouseleave",()=>el.style.transform="translate(0,0)");
  });
}

// Certificate lightbox
const lightbox=document.getElementById("lightbox");
const lightboxImage=document.getElementById("lightboxImage");
const lightboxClose=document.getElementById("lightboxClose");
function closeLightbox(){ if(!lightbox)return; lightbox.classList.remove("active"); document.body.style.overflow=""; if(lightboxImage)setTimeout(()=>lightboxImage.src="",250); }
document.querySelectorAll(".certificate-card").forEach(card=>card.addEventListener("click",()=>{
  const image=card.dataset.image;
  if(lightbox && lightboxImage && image){ lightboxImage.src=image; lightbox.classList.add("active"); document.body.style.overflow="hidden"; }
}));
if(lightboxClose) lightboxClose.addEventListener("click",closeLightbox);
if(lightbox) lightbox.addEventListener("click",e=>{if(e.target===lightbox)closeLightbox();});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeLightbox();});

// Profile parallax
const profileOrbit=document.querySelector(".profile-orbit");
if(profileOrbit && window.innerWidth>900){
  window.addEventListener("mousemove",e=>{
    const x=(innerWidth/2-e.clientX)/90, y=(innerHeight/2-e.clientY)/90;
    profileOrbit.style.transform=`translate(${x}px,${y}px)`;
  });
}

// Active navigation
const sections=document.querySelectorAll("section[id]");
const navLinks=document.querySelectorAll(".nav-menu a");
const sectionObserver=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{ if(entry.isIntersecting){
    navLinks.forEach(a=>a.classList.remove("active"));
    const active=document.querySelector(`.nav-menu a[href="#${entry.target.id}"]`);
    if(active)active.classList.add("active");
  }});
},{threshold:.35});
sections.forEach(s=>sectionObserver.observe(s));

// Smooth internal links
document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener("click",function(e){
  const target=document.querySelector(this.getAttribute("href"));
  if(target){e.preventDefault();target.scrollIntoView({behavior:"smooth",block:"start"});}
}));

// External project links: let the browser navigate normally.

// Single music system. Browsers may block autoplay until the first user interaction.
const portfolioMusic=document.getElementById("portfolioMusic");
let musicStarted=false;
if(portfolioMusic){
  portfolioMusic.volume=.35;
  portfolioMusic.loop=true;
  const startMusic=async()=>{
    if(musicStarted)return;
    try{ await portfolioMusic.play(); musicStarted=true; cleanupMusicListeners(); }
    catch(err){ /* autoplay policy: wait for another interaction */ }
  };
  const cleanupMusicListeners=()=>{
    ["click","touchstart","keydown","pointerdown"].forEach(ev=>document.removeEventListener(ev,startMusic));
  };
  ["click","touchstart","keydown","pointerdown"].forEach(ev=>document.addEventListener(ev,startMusic,{passive:true}));
  document.addEventListener("visibilitychange",()=>{
    if(document.visibilityState==="visible" && musicStarted) portfolioMusic.play().catch(()=>{});
  });
}

// Fade broken images instead of throwing visible errors.
document.querySelectorAll("img").forEach(img=>img.addEventListener("error",()=>img.style.opacity=".25"));
