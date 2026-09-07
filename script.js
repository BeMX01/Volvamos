
// Música: se inicia con el primer toque en "entrar" para cumplir las
// restricciones de reproducción automática de los navegadores móviles.
const musica = document.getElementById("musica");
if (musica) {
  musica.volume = 0.35;
  musica.loop = true;
}
function iniciarMusica() {
  if (!musica) return;
  musica.play().catch(() => {});
}

const screens=[...document.querySelectorAll(".screen")];
const bar=document.getElementById("progressBar");
let current=0,locked=false;

function go(n){
 if(locked||n<=current||n>=screens.length)return;
 locked=true;
 screens[current].classList.remove("active");
 screens[n].classList.add("active");
 current=n;
 bar.style.width=((n+1)/screens.length*100)+"%";
 setTimeout(()=>locked=false,900);
}
document.querySelectorAll("[data-next]").forEach((b,i)=>b.addEventListener("click",()=>{
 if(i===0) iniciarMusica();
 go(+b.dataset.next);
}));

const maybe=document.getElementById("maybe");
const msg=document.getElementById("maybeMsg");
let tries=0;

function escapeButton(){
 if(current!==5)return;
 tries++;
 const texts=[
  "¿Pensarlo? Está bien... pero primero intenta alcanzarme. 😌❤️",
  "Casi... pero todavía no me rindo. ✨",
  "Creo que ese botón tiene otros planes... 👀",
  "Puedes pensarlo, pero yo seguiré eligiéndote. ❤️",
  "Bueno... oficialmente ese botón ya no quiere que lo pulses. 😂❤️"
 ];
 msg.textContent=texts[Math.min(tries-1,texts.length-1)];
 maybe.classList.add("running");
 const pad=18;
 const maxX=Math.max(pad,innerWidth-maybe.offsetWidth-pad);
 const maxY=Math.max(90,innerHeight-maybe.offsetHeight-55);
 maybe.style.left=(pad+Math.random()*(maxX-pad))+"px";
 maybe.style.top=(70+Math.random()*Math.max(1,maxY-70))+"px";
 maybe.style.transform="rotate("+(Math.random()*12-6)+"deg)";
}
maybe.addEventListener("mouseenter",escapeButton);
maybe.addEventListener("touchstart",e=>{e.preventDefault();escapeButton()},{passive:false});
maybe.addEventListener("click",e=>{e.preventDefault();escapeButton()});

document.getElementById("yes").addEventListener("click",()=>{
 createBurst(110);
 document.querySelector(".question strong").textContent="Entonces... volvamos a elegirnos. ❤️";
 document.querySelector(".actions").style.display="none";
 msg.textContent="Esta vez, juntos.";
});

function createBurst(count){
 const box=document.getElementById("burst");
 box.innerHTML="";
 for(let i=0;i<count;i++){
  const p=document.createElement("i");
  p.className="particle";
  const a=Math.random()*Math.PI*2;
  const d=100+Math.random()*Math.max(innerWidth,innerHeight)*.85;
  p.style.setProperty("--x",Math.cos(a)*d+"px");
  p.style.setProperty("--y",Math.sin(a)*d+"px");
  p.style.animationDelay=Math.random()*.2+"s";
  box.appendChild(p);
 }
}

const canvas=document.getElementById("stars"),ctx=canvas.getContext("2d");
let w,h,stars=[];
function resize(){
 w=innerWidth;h=innerHeight;
 const d=Math.min(devicePixelRatio||1,2);
 canvas.width=w*d;canvas.height=h*d;canvas.style.width=w+"px";canvas.style.height=h+"px";
 ctx.setTransform(d,0,0,d,0,0);
 stars=Array.from({length:Math.min(155,Math.floor(w*h/6400))},()=>({
  x:Math.random()*w,y:Math.random()*h,r:.15+Math.random()*1.15,
  a:.18+Math.random()*.7,p:Math.random()*6.28
 }));
}
resize();addEventListener("resize",resize);
function animate(){
 ctx.clearRect(0,0,w,h);
 stars.forEach(s=>{
  s.p+=.01;
  ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
  ctx.fillStyle=`rgba(245,225,255,${Math.max(.03,s.a+Math.sin(s.p)*.18)})`;ctx.fill();
 });
 requestAnimationFrame(animate);
}
animate();
