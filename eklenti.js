// Poppy Oyunu eklentisi: atmosfer, ses, hedef ve bitiş ekranı
(function(){
const $=i=>document.getElementById(i);
let ac,hb=0,doors=0,fx=[],on=false;

function beep(f,d,v,t){if(!ac)return;const o=ac.createOscillator(),g=ac.createGain();o.type=t||'square';o.frequency.value=f;g.gain.setValueAtTime(v||.15,ac.currentTime);g.gain.exponentialRampToValueAtTime(.001,ac.currentTime+d);o.connect(g);g.connect(ac.destination);o.start();o.stop(ac.currentTime+d)}
function drone(){const o=ac.createOscillator(),g=ac.createGain();o.type='sawtooth';o.frequency.value=44;g.gain.value=.035;o.connect(g);g.connect(ac.destination);o.start()}

// Menü
const h=document.querySelector('#overlay h1');h.textContent='PLAYTIME';
h.insertAdjacentHTML('afterend','<div style="color:#ffcc00;letter-spacing:4px;font-size:14px">BÖLÜM 1 - TERK EDİLMİŞ FABRİKA</div>');
$('dead-screen').querySelector('p').textContent='Huggy seni yakaladı...';

// HUD: hedef ve yaklaşan tehlike efekti
document.body.insertAdjacentHTML('beforeend','<div id="vig" style="position:fixed;inset:0;pointer-events:none;z-index:9;opacity:0;background:radial-gradient(transparent 40%,rgba(120,0,0,.75))"></div><div id="obj" style="position:fixed;top:124px;left:50%;transform:translateX(-50%);z-index:10;pointer-events:none;color:#ffcc44;font-size:12px;font-weight:700;text-shadow:0 1px 4px #000;text-align:center;width:90%">Kapılar: 0/3 (mavi ve renkli tarayıcıya iki eli de bağla)</div>');

function setup(){
  // Daha karanlık sis ve el feneri
  scene.fog.near=14;scene.fog.far=72;
  const fl=new THREE.SpotLight(0xfff2d0,1.5,45,.55,.5);fl.target.position.set(0,0,-1);camera.add(fl,fl.target);
  // Titreyecek ışıklar (sadece büyük ortam ışıkları)
  scene.children.forEach(o=>{if(o.isPointLight&&o.distance>=30)fx.push({l:o,b:o.intensity})});
  // Fabrika tabelası
  const c=document.createElement('canvas');c.width=1024;c.height=256;const g=c.getContext('2d');
  g.fillStyle='#000';g.fillRect(0,0,1024,256);g.strokeStyle='#ffcc00';g.lineWidth=10;g.strokeRect(10,10,1004,236);
  g.fillStyle='#ffcc00';g.font='bold 120px Arial Black,Arial';g.textAlign='center';g.textBaseline='middle';g.fillText('PLAYTIME CO.',512,134);
  const s=new THREE.Mesh(new THREE.PlaneGeometry(20,5),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(c)}));
  s.position.set(0,8,-40.9);scene.add(s);
}

function win(){
  const d=$('dead-screen');d.style.background='rgba(0,50,15,.9)';
  const t=d.querySelector('h2');t.textContent='🏆 KAÇTIN!';t.style.color='#44ff77';
  d.querySelector('p').textContent='Üç kapıyı da açtın. Bölüm 1 tamamlandı.';
  const b=d.querySelector('button');b.textContent='TEKRAR OYNA';b.style.background='#118833';b.onclick=()=>location.reload();
  playerDead=true;d.style.display='flex';document.exitPointerLock&&document.exitPointerLock();
}

function loop(){
  requestAnimationFrame(loop);
  if(!started||playerDead||!monster)return;
  const d=Math.hypot(playerPos.x-monster.position.x,playerPos.z-monster.position.z),r=d<25?.12:.03;
  fx.forEach(o=>{o.l.intensity=o.b*(Math.random()<r?.1:1)});
  $('vig').style.opacity=Math.max(0,Math.min(1,1-d/30));
  hb-=1/60;if(hb<0&&d<45){hb=Math.max(.3,d/40);beep(55,.14,.5,'sine')}
}

// Oyun fonksiyonlarına kanca
const sg=startGame;
window.startGame=function(){
  sg();if(on)return;on=true;
  ac=new (window.AudioContext||window.webkitAudioContext)();drone();setup();loop();
};
const od=openDoor;
window.openDoor=function(s){
  od(s);doors++;$('obj').textContent='Kapılar: '+doors+'/3';beep(180,.6,.3,'sawtooth');
  if(doors>=3)setTimeout(win,2500);
};
const fh=fireHand;
window.fireHand=function(s){fh(s);beep(320,.1,.12)};
const ap=activatePole;
window.activatePole=function(i){ap(i);beep(900,.25,.15,'sine')};
})();
