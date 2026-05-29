import JSZip from 'jszip';
import domtoimage from 'dom-to-image-more';
import './style.css';

// ── Audio ──
const audioCtx = new (window.AudioContext||window.webkitAudioContext)();
function playTone(type){
  const now=audioCtx.currentTime;
  if(type==='in'){
    [880,1109].forEach((f,i)=>{
      const o=audioCtx.createOscillator(),g=audioCtx.createGain();
      o.connect(g);g.connect(audioCtx.destination);o.type='sine';
      o.frequency.setValueAtTime(f,now+i*.12);
      g.gain.setValueAtTime(0,now+i*.12);
      g.gain.linearRampToValueAtTime(.08,now+i*.12+.02);
      g.gain.exponentialRampToValueAtTime(.001,now+i*.12+.32);
      o.start(now+i*.12);o.stop(now+i*.12+.38);
    });
  }else{
    const o=audioCtx.createOscillator(),g=audioCtx.createGain();
    o.connect(g);g.connect(audioCtx.destination);o.type='sine';
    o.frequency.setValueAtTime(600,now);o.frequency.exponentialRampToValueAtTime(300,now+.18);
    g.gain.setValueAtTime(.07,now);g.gain.exponentialRampToValueAtTime(.001,now+.22);
    o.start(now);o.stop(now+.25);
  }
}

// ──────────────────────────────────
// TEMPLATE 1 — TEXT CHAT
// ──────────────────────────────────
let t1conv=[
  {dir:'in', text:"Wait — is this actually worth it? 👀",delay:600},
  {dir:'out',text:"100%. Completely changed how I operate.",delay:2400},
  {dir:'in', text:"But where do you even start?",delay:4600},
  {dir:'out',text:"You pick one thing. You commit. You start before you feel ready.",delay:7000},
  {dir:'in', text:"That sounds too simple 😅",delay:10500},
  {dir:'out',text:"Most things that work are.",delay:12800},
  {dir:'in', text:"I never thought of it that way 👁️",delay:15200},
  {dir:'out',text:"The gap between knowing and doing is just a decision.",delay:17500},
  {dir:'in', text:"Okay I'm starting RIGHT NOW",delay:21500},
  {dir:'out',text:"That's the whole game. 🖤",delay:24000},
];
let t1timers=[];
function t1restart(){
  if(window._t1conv && window._t1conv.length){
    t1conv = window._t1conv;
  }
  t1start();
}
function t1start(){
  const conv=t1conv;
  t1timers.forEach(clearTimeout);t1timers=[];
  const el=document.getElementById('t1msgs');el.innerHTML='';
  const ts=document.createElement('div');ts.className='t1-ts';ts.textContent='Today';el.appendChild(ts);
  conv.forEach(item=>{
    const td=item.delay-(item.dir==='in'?1200:700);
    if(item.dir==='in'&&td>200){
      t1timers.push(setTimeout(()=>t1showTyping(),td));
    }
    t1timers.push(setTimeout(()=>t1addBubble(item),item.delay));
  });
}
function t1showTyping(){
  const el=document.getElementById('t1msgs');
  let t=document.getElementById('t1typing');if(t)t.remove();
  const row=document.createElement('div');row.className='t1-typing';row.id='t1typing';
  row.innerHTML='<div class="t1-tbubble"><div class="t1-dot"></div><div class="t1-dot"></div><div class="t1-dot"></div></div>';
  el.appendChild(row);requestAnimationFrame(()=>row.classList.add('show'));
  el.scrollTop=el.scrollHeight;
}
function t1addBubble(item){
  const t=document.getElementById('t1typing');if(t)t.remove();
  const el=document.getElementById('t1msgs');
  const row=document.createElement('div');
  row.className=`t1-row ${item.dir==='in'?'in pi':'out so'}`;
  row.innerHTML=`<div class="t1-bubble">${item.text}</div>`;
  el.appendChild(row);playTone(item.dir);
  setTimeout(()=>el.scrollTop=el.scrollHeight,60);
}
t1start();

// ──────────────────────────────────
// TEMPLATE 2 — BOLD QUOTE
// ──────────────────────────────────
let t2quotes=[
  {quote:`The gap between where you are<br>and where you want to be<br><em>is just a decision.</em>`,attr:`On starting`},
  {quote:`Most people wait for the right moment.<br><em>The right moment is now.</em>`,attr:`On momentum`},
  {quote:`You don't need more information.<br><em>You need to begin.</em>`,attr:`On action`},
];
let t2idx=0,t2timer=null;
function t2show(i){
  const q=t2quotes[i];
  document.getElementById('t2quote').innerHTML=q.quote;
  document.getElementById('t2attr').textContent=q.attr;
}
function t2restart(){if(window._t2quotes&&window._t2quotes.length)t2quotes=window._t2quotes;t2idx=0;if(t2timer)clearInterval(t2timer);t2show(0);t2start();}
function t2start(){
  if(t2timer)clearInterval(t2timer);
  t2idx=0;t2show(0);
  t2timer=setInterval(()=>{t2idx=(t2idx+1)%t2quotes.length;t2show(t2idx);},4000);
}
t2show(0);

// ──────────────────────────────────
// TEMPLATE 3 — MYTH vs FACT
// ──────────────────────────────────
let t3data=[
  {
    title:`Hustle harder = better results?`,
    pairs:[
      {type:'myth',text:`"Working longer hours is the key to getting ahead."`},
      {type:'fact',text:`Research consistently shows that focused 4–5 hour deep work sessions outperform unfocused 10-hour days. Rest isn't laziness — it's strategy.`},
      {type:'myth',text:`"If you're not busy, you're falling behind."`},
      {type:'fact',text:`The most effective people protect their time fiercely. Saying no to the right things is how you say yes to what actually matters.`},
    ]
  },
];
let t3timers=[];
function t3restart(){
  if(window._mythData){
    const d = window._mythData;
    const pairs = [{type:'myth',text:d.myth||''},{type:'fact',text:d.fact||''}];
    if(d.extra){
      const p=d.extra.split('|');
      if(p.length>=2){pairs.push({type:'myth',text:p[0].replace(/MYTH:\s*/i,'').trim()});pairs.push({type:'fact',text:p[1].replace(/FACT:\s*/i,'').trim()});}
    }
    t3data = [{title:'Myth vs Fact', pairs}];
  }
  t3start();
}
function t3start(){
  t3timers.forEach(clearTimeout);t3timers=[];
  const d=t3data[0];
  document.getElementById('t3title').textContent=d.title;
  const el=document.getElementById('t3cards');el.innerHTML='';
  d.pairs.forEach((p,i)=>{
    const card=document.createElement('div');
    card.className=`t3-card ${p.type}`;
    card.innerHTML=`<div class="t3-card-badge">${p.type==='myth'?'✕ Myth':'✓ Fact'}</div><div class="t3-card-text">${p.text}</div>`;
    el.appendChild(card);
    t3timers.push(setTimeout(()=>card.classList.add('show'),400+i*500));
  });
}
t3start();

// ──────────────────────────────────
// TEMPLATE 4 — STAT CARDS
// ──────────────────────────────────
let t4stats=[
  {num:'73%',label:'of people wish they had started their goal sooner',highlight:false},
  {num:'21 days',label:'is all it takes to build a habit that actually sticks',highlight:false},
  {num:'5x',label:'more likely to succeed when you write your goals down',highlight:false},
  {num:'1%',label:'better every day — that is 37x better in a year',highlight:false},
];
let t4timers=[];
function t4restart(){
  if(window._statsData){
    const d=window._statsData;
    const ns=[];
    ['stat1','stat2','stat3','stat4'].forEach(k=>{ if(d[k]) ns.push({num:d[k].num||'—',label:d[k].label||'',highlight:false}); });
    if(ns.length) t4stats=ns;
  }
  t4start();
}
function t4start(){
  t4timers.forEach(clearTimeout);t4timers=[];
  const el=document.getElementById('t4grid');el.innerHTML='';
  t4stats.forEach((s,i)=>{
    const card=document.createElement('div');
    card.className=`t4-stat${s.highlight?' highlight':''}`;
    card.innerHTML=`<div class="t4-stat-num">${s.num}</div><div class="t4-stat-label">${s.label}</div>`;
    el.appendChild(card);
    t4timers.push(setTimeout(()=>card.classList.add('show'),300+i*300));
  });
}
t4start();

// ──────────────────────────────────
// TEMPLATE 5 — POV STORY
// ──────────────────────────────────
let t5slides=[
  {pov:`POV: You've been putting off the thing you know will change everything.`,tags:['#growth','#mindset']},
  {pov:`You open your laptop.<br>You just start.<br><em>No plan. No perfect moment.</em>`,tags:['#juststart','#momentum']},
  {pov:`Three hours in and you're further than six months of thinking about it.`,tags:['#action','#progress']},
  {pov:`You realise the fear wasn't about failing.<br><em>It was about succeeding.</em>`,tags:['#selfawareness','#breakthrough']},
  {pov:`You kept going anyway.<br><em>That's the whole thing.</em>`,tags:['#consistency','#results']},
];
let t5current=0,t5interval=null,t5fillTimers=[];
function t5restart(){
  if(window._povLines && window._povLines.length){
    const lines = window._povLines;
    t5slides = lines.map((line,i) => ({
      pov: line,
      tags: []
    }));
  }
  t5start();
}
function t5start(){
  if(t5interval)clearInterval(t5interval);
  t5fillTimers.forEach(clearTimeout);t5fillTimers=[];
  t5current=0;

  // build progress bars
  const prog=document.getElementById('t5progress');
  prog.innerHTML='';
  t5slides.forEach((_,i)=>{
    const bar=document.createElement('div');bar.className='t5-prog-bar';
    const fill=document.createElement('div');fill.className='t5-prog-fill';fill.id='t5fill'+i;
    bar.appendChild(fill);prog.appendChild(bar);
  });

  // build slide container
  const body=document.getElementById('t5body');
  body.innerHTML='';
  t5slides.forEach((s,i)=>{
    const slide=document.createElement('div');
    slide.className='t5-slide'+(i===0?' active':'');
    slide.id='t5slide'+i;
    slide.innerHTML=`
      <div class="t5-pov-label">POV 👁</div>
      <div class="t5-pov-text">${s.pov}</div>
      <div class="t5-tags">${s.tags.map(t=>`<span class="t5-tag">${t}</span>`).join('')}</div>
    `;
    body.appendChild(slide);
  });

  t5showSlide(0);
  t5interval=setInterval(()=>{
    const next=(t5current+1)%t5slides.length;
    t5showSlide(next);
  },3500);
}
function t5showSlide(i){
  // hide all
  t5slides.forEach((_,j)=>{
    document.getElementById('t5slide'+j).classList.remove('active');
  });
  // show current
  const sl=document.getElementById('t5slide'+i);
  sl.style.display='block';
  requestAnimationFrame(()=>sl.classList.add('active'));
  // fill progress bar for current
  const fill=document.getElementById('t5fill'+i);
  if(fill){fill.style.transition='none';fill.style.width='0%';
    setTimeout(()=>{fill.style.transition='width 3.5s linear';fill.style.width='100%';},50);
  }
  // complete previous bars
  for(let j=0;j<i;j++){
    const pf=document.getElementById('t5fill'+j);
    if(pf){pf.style.transition='none';pf.style.width='100%';}
  }
  t5current=i;
}
t5start();

// ──────────────────────────────────
// NAV SWITCHING
// ──────────────────────────────────
const meta={
  1:{label:'Text Chat',desc:'Animated conversation bubbles. Great for Reels & TikTok — feels like a real DM thread.',dims:'1080 × 1920',ratio:'9:16 vertical',platforms:['Instagram Reels','TikTok','YouTube Shorts'],theme:'A relatable back-and-forth that draws viewers in.'},
  2:{label:'Bold Quote',desc:'Full-bleed image with powerful typographic overlay. Scroll-stopping statement format.',dims:'1080 × 1080',ratio:'1:1 square',platforms:['Instagram Feed','Pinterest','Facebook'],theme:'One striking line that makes people stop and save.'},
  3:{label:'Myth vs Fact',desc:'Side-by-side debunking cards. Highest save & share rate for educational content.',dims:'1080 × 1350',ratio:'4:5 portrait',platforms:['Instagram Feed','Facebook','Threads'],theme:'Bust a common misconception in your niche.'},
  4:{label:'Stat Cards',desc:'Data-driven content builds authority and credibility fast.',dims:'1080 × 1350',ratio:'4:5 portrait',platforms:['Instagram Feed','LinkedIn','Facebook'],theme:'Numbers that make your audience stop and screenshot.'},
  5:{label:'POV Story',desc:'Sequential storytelling — the most shared format on TikTok & Reels.',dims:'1080 × 1920',ratio:'9:16 vertical',platforms:['TikTok','Instagram Reels','YouTube Shorts'],theme:'Walk your audience through a moment or transformation.'},
  6:{label:'Before / After',desc:'Transformation reveal. High engagement from contrast and relatability.',dims:'1080 × 1080',ratio:'1:1 square',platforms:['Instagram Feed','Facebook','LinkedIn'],theme:'Show the gap between the old way and the new way.'},
  7:{label:'Hot Take',desc:'Bold opinion card. Drives comments and shares through controversy.',dims:'1080 × 1080',ratio:'1:1 square',platforms:['Instagram Feed','Twitter/X','LinkedIn'],theme:'Say the thing everyone is thinking but no one is posting.'},
  8:{label:'Tips List',desc:'Numbered tips — highest saved format on Instagram. Great for authority building.',dims:'1080 × 1080',ratio:'1:1 square',platforms:['Instagram Feed','Pinterest','LinkedIn'],theme:'Give genuine value in a scannable format.'},
};

const titles=[null,'Text Chat — Conversation Format','Bold Quote — Statement Poster','Myth vs Fact — Debunk Format','Stat Cards — Data Storytelling','POV Story — Reel Format','Before / After — Transformation','Hot Take — Bold Opinion','Tips List — Authority Format'];

function switchTemplate(n,el){
  document.querySelectorAll('.nav-item').forEach(i=>i.classList.remove('active'));
  el.classList.add('active');
  document.querySelectorAll('.template-frame').forEach(f=>f.classList.remove('active'));
  document.getElementById('frame'+n).classList.add('active');
  document.getElementById('topbarTitle').textContent=titles[n];
  const m=meta[n];
  if(m){
    document.getElementById('spLabel').textContent=m.label;
    document.getElementById('spDesc').textContent=m.desc;
    document.getElementById('spDims').textContent=m.dims;
    document.getElementById('spRatio').textContent=m.ratio;
    document.getElementById('spPlatforms').innerHTML=m.platforms.map(p=>`<span class="sp-tag">${p}</span>`).join('');
    document.getElementById('spTheme').textContent=m.theme;
    // Update genbar info strip
    var gn=document.getElementById('gbiName');
    var gr=document.getElementById('gbiRatio');
    var gp=document.getElementById('gbiPlatforms');
    if(gn) gn.textContent=m.label;
    if(gr) gr.textContent=m.ratio.split(' ')[0];
    if(gp) gp.innerHTML=m.platforms.map(p=>`<span class="gbi-plat">${p}</span>`).join('<span class="gbi-sep"> · </span>');
  }
}

function replayActive(){
  const active=document.querySelector('.template-frame.active');
  if(!active)return;
  const id=active.id;
  if(id==='frame1')t1start();
  else if(id==='frame2')t2start();
  else if(id==='frame3')t3start();
  else if(id==='frame4')t4start();
  else if(id==='frame5')t5start();
  else if(id==='frame6')t6start();
  else if(id==='frame7')t7start();
  else if(id==='frame8')t8start();

}

// ── T6: BEFORE/AFTER ─────────────────────────────────────
let t6data = {before:'You used to do things the hard way.',after:'Now everything clicks into place.',caption:''};
function t6start(){
  document.getElementById('t6beforeText').textContent = t6data.before;
  document.getElementById('t6afterText').textContent  = t6data.after;
  document.getElementById('t6caption').textContent    = t6data.caption||'';
}
function t6restart(){
  if(window._t6data) t6data = window._t6data;
  t6start();
}

// ── T7: HOT TAKE ─────────────────────────────────────────
let t7data = {eyebrow:'HOT TAKE 🔥',statement:'Most people are doing it wrong.',sub:"Here's what actually works.",cta:'Agree or disagree? ↓'};
function t7start(){
  document.getElementById('t7eyebrow').textContent   = t7data.eyebrow||'HOT TAKE 🔥';
  document.getElementById('t7statement').textContent = t7data.statement;
  document.getElementById('t7sub').textContent       = t7data.sub||'';
  document.getElementById('t7cta').textContent       = t7data.cta||'Agree or disagree? ↓';
}
function t7restart(){
  if(window._t7data) t7data = window._t7data;
  t7start();
}

// ── T8: TIPS LIST ─────────────────────────────────────────
let t8data = {heading:'Things worth knowing',tips:['Start before you feel ready.','Done beats perfect every time.','The best system is one you use.','Rest is part of the work.','Just begin.']};
function t8start(){
  document.getElementById('t8heading').textContent = t8data.heading;
  const ul = document.getElementById('t8list');
  ul.innerHTML = t8data.tips.map((tip,i)=>
    '<div class="t8-item"><div class="t8-num">'+(i+1)+'</div><div class="t8-tip">'+tip+'</div></div>'
  ).join('');
}
function t8restart(){
  if(window._t8data) t8data = window._t8data;
  t8start();
}

t6start(); t7start(); t8start();

// ── EXPORT ──
// The base64 image used across all templates
const IMG_SRC = document.querySelector('.t1-bg, .t2-bg, .t3-bg, .t4-bg, .t5-bg')
  ? getComputedStyle(document.querySelector('.t1-bg')).backgroundImage.slice(5,-2)
  : null;

function loadImg(src) {
  return new Promise((res, rej) => {
    const img = new Image();
    img.onload = () => res(img);
    img.onerror = rej;
    img.src = src;
  });
}

// Draw a blurred/dimmed background image onto a canvas context
function drawBg(ctx, img, W, H, opts={}) {
  const { blur=0, brightness=0.45, saturate=0.7, posY=0.5 } = opts;

  // draw to offscreen canvas so we can apply pixel-level filter
  const off = document.createElement('canvas');
  // scale up slightly to mimic CSS scale(1.06)
  const scale = 1.06;
  off.width  = Math.round(W * scale);
  off.height = Math.round(H * scale);
  const octx = off.getContext('2d');

  // cover-fit the image
  const imgAR = img.width / img.height;
  const canAR = off.width / off.height;
  let sw, sh, sx, sy;
  if (imgAR > canAR) { sh = img.height; sw = sh * canAR; sx = (img.width-sw)*0.5; sy = 0; }
  else               { sw = img.width;  sh = sw / canAR; sx = 0; sy = (img.height-sh)*posY; }
  octx.drawImage(img, sx, sy, sw, sh, 0, 0, off.width, off.height);

  // brightness + saturation via pixel manipulation
  const id = octx.getImageData(0, 0, off.width, off.height);
  const d = id.data;
  for (let i = 0; i < d.length; i += 4) {
    // desaturate
    const avg = d[i]*0.299 + d[i+1]*0.587 + d[i+2]*0.114;
    d[i]   = avg + (d[i]   - avg) * saturate;
    d[i+1] = avg + (d[i+1] - avg) * saturate;
    d[i+2] = avg + (d[i+2] - avg) * saturate;
    // brightness
    d[i]   = Math.round(d[i]   * brightness);
    d[i+1] = Math.round(d[i+1] * brightness);
    d[i+2] = Math.round(d[i+2] * brightness);
  }
  octx.putImageData(id, 0, 0);

  // blur via repeated small draws (approx box blur)
  if (blur > 0) {
    const blurCanvas = document.createElement('canvas');
    blurCanvas.width = off.width; blurCanvas.height = off.height;
    const bctx = blurCanvas.getContext('2d');
    bctx.filter = `blur(${blur}px)`;
    bctx.drawImage(off, 0, 0);
    // centre-crop back to W×H
    const ox = (off.width  - W) / 2;
    const oy = (off.height - H) / 2;
    ctx.drawImage(blurCanvas, ox, oy, W, H, 0, 0, W, H);
  } else {
    const ox = (off.width  - W) / 2;
    const oy = (off.height - H) / 2;
    ctx.drawImage(off, ox, oy, W, H, 0, 0, W, H);
  }
}

// Overlay a dark tint
function drawOverlay(ctx, W, H, color='rgba(10,7,5,0.32)') {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, W, H);
}

// Capture the content layer (everything except *-bg divs) via dom-to-image
function captureContent(shell, W, H, scale) {
  // Temporarily hide all *-bg and *-glass divs so we get transparent PNG of content
  const bgEls = shell.querySelectorAll('[class*="-bg"],[class*="-glass"],[class*="-gradient"],[class*="-quotes-icon"]');
  bgEls.forEach(el => el.style.visibility = 'hidden');

  const origOvf = shell.style.overflow;
  shell.style.overflow = 'hidden';

  return domtoimage.toPng(shell, {
    width:  W,
    height: H,
    style: {
      transform: 'scale(1)',
      transformOrigin: 'top left',
      borderRadius: '0',
    },
    filter: node => {
      // skip hidden bg layers
      if (node.style && node.style.visibility === 'hidden') return false;
      return true;
    }
  }).then(dataUrl => {
    bgEls.forEach(el => el.style.visibility = '');
    shell.style.overflow = origOvf;
    return dataUrl;
  }).catch(err => {
    bgEls.forEach(el => el.style.visibility = '');
    shell.style.overflow = origOvf;
    throw err;
  });
}

async function exportTemplate() {
  const active = document.querySelector('.template-frame.active');
  if (!active) return;
  const shell = active.querySelector('.phone-shell,.story-shell,.square-shell,.wide-shell');
  if (!shell) return;

  const btn = document.getElementById('exportBtn');
  btn.disabled = true;
  btn.innerHTML = '<span class="spin">⏳</span> Rendering…';

  const names = {frame1:'text-chat',frame2:'bold-quote',frame3:'myth-vs-fact',frame4:'stat-cards',frame5:'pov-story',frame6:'before-after',frame7:'hot-take',frame8:'tips-list'};
  const filename = 'orbitt-' + (names[active.id]||'template') + '.png';

  try {
    const SCALE  = 3;
    const rect   = shell.getBoundingClientRect();
    const W = Math.round(rect.width);
    const H = Math.round(rect.height);
    const EW = W * SCALE;
    const EH = H * SCALE;

    // bg config per template
    const bgCfg = {
      frame1: { blur:2, brightness:0.45, saturate:0.7, overlay:'rgba(10,7,5,0.30)', posY:0.5 },
      frame2: { blur:0, brightness:0.38, saturate:0.6, overlay:null,                posY:0.2 },
      frame3: { blur:10,brightness:0.25, saturate:0.4, overlay:'rgba(8,5,3,0.35)',  posY:0.5 },
      frame4: { blur:12,brightness:0.20, saturate:0.3, overlay:'rgba(8,5,3,0.40)',  posY:0.5 },
      frame5: { blur:0, brightness:0.55, saturate:0.75,overlay:null,                posY:0.5 },
    };
    const cfg = bgCfg[active.id] || bgCfg.frame1;

    // 1. Load base image
    const bgEl = document.getElementById('bgSource');
    const imgSrc = bgEl.style.backgroundImage || getComputedStyle(bgEl).backgroundImage;
    const rawSrc = imgSrc.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
    const img = await loadImg(rawSrc);

    // 2. Final composite canvas
    const final = document.createElement('canvas');
    final.width  = EW;
    final.height = EH;
    const fctx = final.getContext('2d');
    fctx.scale(SCALE, SCALE);

    // 3. Draw background
    drawBg(fctx, img, W, H, cfg);

    // 4. Draw gradient overlay for t2/t5
    if (active.id === 'frame2') {
      const grad = fctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0,   'rgba(0,0,0,0.10)');
      grad.addColorStop(0.5, 'rgba(0,0,0,0.30)');
      grad.addColorStop(1,   'rgba(0,0,0,0.92)');
      fctx.fillStyle = grad; fctx.fillRect(0,0,W,H);
    } else if (active.id === 'frame5') {
      const grad = fctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0,   'rgba(0,0,0,0.55)');
      grad.addColorStop(0.3, 'rgba(0,0,0,0.0)');
      grad.addColorStop(0.6, 'rgba(0,0,0,0.0)');
      grad.addColorStop(1,   'rgba(0,0,0,0.85)');
      fctx.fillStyle = grad; fctx.fillRect(0,0,W,H);
    } else if (cfg.overlay) {
      drawOverlay(fctx, W, H, cfg.overlay);
    }

    // 5. Capture content layer (transparent)
    btn.innerHTML = '<span class="spin">⏳</span> Compositing…';
    const contentDataUrl = await captureContent(shell, W, H, SCALE);
    const contentImg = await loadImg(contentDataUrl);

    // 6. Reset scale and draw content at full res
    fctx.setTransform(1,0,0,1,0,0);
    fctx.drawImage(contentImg, 0, 0, EW, EH);

    // 7. Round corners
    fctx.globalCompositeOperation = 'destination-in';
    const r = parseInt(getComputedStyle(shell).borderRadius) * SCALE || 0;
    roundRect(fctx, 0, 0, EW, EH, r);
    fctx.globalCompositeOperation = 'source-over';

    // 8. Download
    const a = document.createElement('a');
    a.download = filename;
    a.href = final.toDataURL('image/png');
    a.click();

    btn.disabled = false;
    btn.innerHTML = '⬇ Export PNG';
    showToast('✓ Saved as ' + filename);

  } catch(err) {
    console.error('Export error:', err);
    btn.disabled = false;
    btn.innerHTML = '⬇ Export PNG';
    showToast('⚠ Export failed — see console');
  }
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x+r, y);
  ctx.lineTo(x+w-r, y); ctx.arcTo(x+w,y, x+w,y+r, r);
  ctx.lineTo(x+w, y+h-r); ctx.arcTo(x+w,y+h, x+w-r,y+h, r);
  ctx.lineTo(x+r, y+h); ctx.arcTo(x,y+h, x,y+h-r, r);
  ctx.lineTo(x, y+r); ctx.arcTo(x,y, x+r,y, r);
  ctx.closePath();
  ctx.fill();
}

function showToast(msg) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  const t = document.createElement('div');
  t.className = 'toast';
  t.innerHTML = msg;
  document.body.appendChild(t);
  setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 320); }, 2800);
}


function switchRTab(el, paneId){
  document.querySelectorAll('.dt-rtab').forEach(t=>t.classList.remove('on'));
  document.querySelectorAll('.dt-rpane').forEach(p=>p.classList.remove('on'));
  el.classList.add('on');
  document.getElementById(paneId).classList.add('on');
}





// ══════════════════════════════════════════════════════════
// STATE
// ══════════════════════════════════════════════════════════
const S = {
  bg: null,
  idea: '',
  tone: 'confident',
  handle: '@yourbrand',
  caption: ''
};

function updateHandle() {
  const v = (document.getElementById('brandHandle')||{}).value || '@yourbrand';
  S.handle = v;
  document.querySelectorAll('.t1-handle,.t2-handle,.t3-handle,.t4-handle,.t5-handle,.t6-handle,.t7-handle,.t8-handle')
    .forEach(el => el.textContent = v);
}

function copyCaption() {
  const txt = document.getElementById('captionBox').textContent;
  navigator.clipboard.writeText(txt).then(() => showToast('Caption copied ✓'));
}

// ══════════════════════════════════════════════════════════
// BACKGROUND IMAGE
// ══════════════════════════════════════════════════════════
function applyBg(src) {
  S.bg = src;
  document.querySelectorAll('.t1-bg,.t2-bg,.t3-bg,.t4-bg,.t5-bg,.t6-bg,.t7-bg,.t8-bg')
    .forEach(el => {
      el.style.backgroundImage = 'url(' + src + ')';
      el.style.backgroundSize  = 'cover';
      el.style.backgroundPosition = 'center';
    });
  // Show thumbnail in right panel
  const thumb = document.getElementById('bgThumb');
  if (thumb) {
    thumb.style.display = 'block';
    thumb.style.backgroundImage = 'url(' + src + ')';
  }
  if (typeof ImgPlacement !== 'undefined') ImgPlacement.runOnCurrentBg();
}

function clearBg() {
  S.bg = null;
  document.querySelectorAll('.t1-bg,.t2-bg,.t3-bg,.t4-bg,.t5-bg,.t6-bg,.t7-bg,.t8-bg')
    .forEach(el => {
      el.style.backgroundImage = '';
      el.style.backgroundSize  = '';
      el.style.backgroundPosition = '';
    });
  const thumb = document.getElementById('bgThumb');
  if (thumb) thumb.style.display = 'none';
}

function handleBgUpload(ev) {
  const file = ev.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    applyBg(e.target.result);
    showToast('Photo applied to all templates ✓');
  };
  reader.readAsDataURL(file);
}

// ── Unsplash helpers ─────────────────────────────────────────────────────────
function unsplashKey() {
  return localStorage.getItem('unsplash_key') ||
         ((document.getElementById('unsplashKey')||{}).value || '');
}

function saveUnsplashKey() {
  var el = document.getElementById('unsplashKey');
  var k = el ? el.value.trim() : '';
  if (!k) { showToast('Paste your Unsplash Access Key first'); return; }
  localStorage.setItem('unsplash_key', k);
  unsplashShowKeyStatus(true);
  showToast('Unsplash key saved ✓');
}

function unsplashShowKeyStatus(connected) {
  var st = document.getElementById('unsplashKeyStatus');
  var btn = document.getElementById('unsplashKeySaveBtn');
  if (!st) return;
  if (connected) {
    st.style.display = 'block';
    st.style.color = 'var(--green)';
    st.textContent = '✓ Connected';
    if (btn) { btn.textContent = '✓'; btn.style.background = 'rgba(52,232,160,0.15)'; btn.style.borderColor = 'rgba(52,232,160,0.3)'; btn.style.color = 'var(--green)'; }
  } else {
    st.style.display = 'none';
    if (btn) { btn.textContent = 'Save'; btn.style.background = ''; btn.style.borderColor = ''; btn.style.color = ''; }
  }
}

function unsplashTrackDownload(id) {
  var k = unsplashKey(); if (!k) return;
  fetch('https://api.unsplash.com/photos/' + id + '/download',
    { headers: { Authorization: 'Client-ID ' + k } }
  ).catch(function(){});
}

function unsplashApplyPhoto(photo) {
  applyBg(photo.urls.regular);
  unsplashTrackDownload(photo.id);
  // Show attribution (required by Unsplash guidelines)
  var attrib = document.getElementById('unsplashAttrib');
  if (attrib) {
    attrib.style.display = 'block';
    attrib.innerHTML = 'Photo by <a href="' + photo.user.links.html +
      '?utm_source=orbitt&utm_medium=referral" target="_blank" ' +
      'style="color:var(--accent2);text-decoration:none;">' + photo.user.name +
      '</a> on <a href="https://unsplash.com?utm_source=orbitt&utm_medium=referral" ' +
      'target="_blank" style="color:var(--accent2);text-decoration:none;">Unsplash</a>';
  }
  // mark selected
  document.querySelectorAll('#unsplashResults .dt-thumb').forEach(function(t){
    t.classList.toggle('selected', t.dataset.unsplashId === photo.id);
  });
  showToast('Photo by ' + photo.user.name + ' applied ✓');
}

async function searchUnsplash() {
  var q   = (document.getElementById('unsplashQ')  ||{}).value.trim() || '';
  var key = unsplashKey();
  if (!key) { showToast('Save your Unsplash Access Key first'); return; }
  if (!q)   { showToast('Enter a search term'); return; }
  var btn = document.querySelector('.dt-go-btn[onclick="searchUnsplash()"]');
  if (btn) btn.textContent = '…';
  try {
    var res  = await fetch(
      'https://api.unsplash.com/search/photos?query=' + encodeURIComponent(q) +
      '&per_page=9&orientation=portrait',
      { headers: { Authorization: 'Client-ID ' + key } }
    );
    var data = await res.json();
    if (data.errors) { showToast('Unsplash: ' + data.errors[0]); return; }
    var grid = document.getElementById('unsplashResults');
    if (!grid) return;
    grid.innerHTML = '';
    (data.results || []).forEach(function(photo) {
      var img = document.createElement('img');
      img.src = photo.urls.thumb;
      img.className = 'dt-thumb';
      img.dataset.unsplashId = photo.id;
      img.title = 'Photo by ' + photo.user.name;
      img.onclick = function() { unsplashApplyPhoto(photo); };
      grid.appendChild(img);
    });
    if (!(data.results||[]).length) showToast('No results for "' + q + '"');
  } catch(e) { showToast('Unsplash error: ' + e.message); }
  finally { if (btn) btn.textContent = 'Go'; }
}

async function autoFetchUnsplash(topic) {
  var key = unsplashKey(); if (!key) return;
  var words = topic.replace(/[^a-z0-9 ]/gi,'').split(/\s+/).slice(0,3).join(' ');
  try {
    var res  = await fetch(
      'https://api.unsplash.com/search/photos?query=' + encodeURIComponent(words) +
      '&per_page=1&orientation=portrait',
      { headers: { Authorization: 'Client-ID ' + key } }
    );
    var data = await res.json();
    var photo = (data.results||[])[0];
    if (photo) unsplashApplyPhoto(photo);
  } catch(e) { /* silent */ }
}

// ══════════════════════════════════════════════════════════
// IMAGE PLACEMENT + HERO DETECTION
// ══════════════════════════════════════════════════════════
const ImgPlacement = {
  analyse(img, cols, rows) {
    const W = 120, H = 120;
    const cw = Math.floor(W / cols), ch = Math.floor(H / rows);
    const cv = document.createElement('canvas');
    cv.width = W; cv.height = H;
    const ctx = cv.getContext('2d');
    ctx.drawImage(img, 0, 0, W, H);
    const px = ctx.getImageData(0, 0, W, H).data;
    const zones = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        let bright = 0, edge = 0, n = 0;
        for (let y = r * ch; y < (r+1) * ch; y++) {
          for (let x = c * cw; x < (c+1) * cw; x++) {
            const i4 = (y * W + x) * 4;
            const lum = 0.299*px[i4] + 0.587*px[i4+1] + 0.114*px[i4+2];
            bright += lum;
            if (x+1 < W && y+1 < H) {
              const ri = (y * W + x+1) * 4;
              const di = ((y+1) * W + x) * 4;
              const lumR = 0.299*px[ri] + 0.587*px[ri+1] + 0.114*px[ri+2];
              const lumD = 0.299*px[di] + 0.587*px[di+1] + 0.114*px[di+2];
              edge += Math.abs(lum - lumR) + Math.abs(lum - lumD);
            }
            n++;
          }
        }
        zones.push({ row: r, col: c, brightness: bright / n, edge: edge / n });
      }
    }
    return zones;
  },
  pickTextZone(zones, prefer) {
    const maxRow = Math.max(...zones.map(z => z.row));
    const midRow = Math.round(maxRow / 2);
    const scored = zones.map(z => {
      let posScore = 0;
      if (prefer === 'bottom' && z.row === maxRow) posScore = 30;
      if (prefer === 'top'    && z.row === 0)      posScore = 30;
      if (prefer === 'centre' && z.row === midRow) posScore = 30;
      const darkScore  = (255 - z.brightness) * 0.4;
      const clearScore = (100 - Math.min(z.edge, 100)) * 0.3;
      return Object.assign({}, z, { total: posScore + darkScore + clearScore });
    });
    scored.sort((a,b) => b.total - a.total);
    return scored[0];
  },
  cfg: {
    1:{cols:1,rows:3,prefer:'bottom'}, 2:{cols:1,rows:3,prefer:'bottom'},
    3:{cols:2,rows:2,prefer:'top'},    4:{cols:2,rows:2,prefer:'top'},
    5:{cols:1,rows:3,prefer:'bottom'}, 6:{cols:2,rows:1,prefer:'bottom'},
    7:{cols:1,rows:3,prefer:'centre'}, 8:{cols:1,rows:3,prefer:'top'}
  },
  applyToFrame(frameEl, img, frameNum) {
    const c = this.cfg[frameNum] || {cols:1,rows:3,prefer:'bottom'};
    const zones = this.analyse(img, c.cols, c.rows);
    const zone  = this.pickTextZone(zones, c.prefer);
    const totalRows = c.rows;
    const relPos = zone.row / Math.max(totalRows - 1, 1);
    let gradDir = relPos < 0.35 ? 'to bottom' : (relPos > 0.65 ? 'to top' : 'to bottom');
    const alpha = 0.25 + (zone.brightness / 255) * 0.45;
    frameEl.style.setProperty('--text-color-auto', zone.brightness < 128 ? '#fff' : '#111');
    frameEl.style.setProperty('--scrim-dir', gradDir);
    frameEl.style.setProperty('--scrim-alpha', alpha.toFixed(2));
  },
  applyAll(img) {
    for (let n = 1; n <= 8; n++) {
      const frame = document.getElementById('frame' + n);
      if (frame) this.applyToFrame(frame, img, n);
    }
  },
  runOnCurrentBg() {
    if (!S.bg) return;
    const img = new Image();
    img.onload = () => this.applyAll(img);
    img.src = S.bg;
  }
};

// ══════════════════════════════════════════════════════════
// BRAND PROFILE
// ══════════════════════════════════════════════════════════
const Brand = {
  key: 'orbittBrand',
  load() {
    try { return JSON.parse(localStorage.getItem(this.key) || 'null') || {}; }
    catch(e) { return {}; }
  },
  save(data) { localStorage.setItem(this.key, JSON.stringify(data)); },
  applyColors(b) {
    if (b.color1) document.documentElement.style.setProperty('--brand-c1', b.color1);
    if (b.color2) document.documentElement.style.setProperty('--brand-c2', b.color2);
  },
  renderProfileCard(b) {
    const card = document.getElementById('brandProfileCard');
    if (!card) return;
    if (!b || !b.name) {
      card.innerHTML = '<div style="font-size:11px;color:var(--muted);padding:6px 0">No profile yet</div>';
      return;
    }
    const traitHtml = (b.traits||[]).slice(0,4).map(function(t){
      return '<span style="display:inline-block;padding:2px 8px;background:rgba(30,136,229,0.15);border-radius:10px;font-size:10px;color:var(--accent2);margin:2px">' + t + '</span>';
    }).join('');
    card.innerHTML =
      '<div style="font-size:13px;font-weight:600;color:var(--text);margin-bottom:2px">' + (b.name||'') + '</div>' +
      (b.industry ? '<div style="font-size:10px;color:var(--muted);margin-bottom:4px">' + b.industry + '</div>' : '') +
      (traitHtml ? '<div style="margin-bottom:6px">' + traitHtml + '</div>' : '');
  },
  promptContext(b) {
    if (!b || !b.name) return '';
    var parts = [];
    if (b.name)     parts.push('Brand: ' + b.name);
    if (b.tagline)  parts.push('Tagline: ' + b.tagline);
    if (b.industry) parts.push('Industry: ' + b.industry);
    if (b.audience) parts.push('Audience: ' + b.audience);
    if (b.traits && b.traits.length) parts.push('Voice: ' + b.traits.join(', '));
    // Tone sliders
    var formal = b.slFormal||40, edgy = b.slEdgy||35, length = b.slLength||30;
    var toneDesc = (formal > 60 ? 'formal' : formal < 35 ? 'casual' : 'conversational') + ', ' +
                   (edgy > 60 ? 'edgy/provocative' : edgy < 30 ? 'safe/professional' : 'balanced') + ', ' +
                   (length > 60 ? 'detailed' : length < 30 ? 'punchy/short' : 'medium length');
    parts.push('Tone style: ' + toneDesc);
    if (b.doSay)    parts.push('We say things like: "' + b.doSay + '"');
    if (b.dontSay)  parts.push('We never say: "' + b.dontSay + '"');
    if (b.pillars)  parts.push('Content pillars: ' + b.pillars);
    if (b.ctaStyle) parts.push('CTA style: ' + b.ctaStyle);
    if (b.hashStyle) parts.push('Hashtags: ' + (b.hashStyle === 'none' ? 'none' : b.hashStyle === 'few' ? '3-5 targeted' : '8-10 broad'));
    if (b.example)  parts.push('Example post in our voice: "' + b.example + '"');
    return 'BRAND CONTEXT — apply to all content:\n' + parts.join('\n') + '\n\n';
  }
};

// ══════════════════════════════════════════════════════════
// API + GENERATION
// ══════════════════════════════════════════════════════════
async function apiAsk(prompt) {
  const r = await fetch('/api/ask', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: prompt })
  });
  if (!r.ok) throw new Error(await r.text());
  const d = await r.json();
  return d.content[0].text;
}

function buildMegaPrompt(idea, tone) {
  const toneMap = {
    confident: 'confident and direct',
    bold:      'bold and punchy',
    funny:     'funny and irreverent',
    casual:    'casual and conversational'
  };
  const td  = toneMap[tone] || 'confident and direct';
  const b   = Brand.load();
  const ctx = Brand.promptContext(b);
  return ctx + 'Create social media content for ALL 8 formats about: "' + idea + '". Tone: ' + td + '. Be specific, creative, and punchy. Do not use placeholder text. Make every line feel real and shareable.\n\nReturn ONLY valid JSON (no markdown, no code block):\n{\n  "chat": { "messages": [ {"dir":"in","text":"..."}, {"dir":"out","text":"..."} ] },\n  "quote": { "quotes": ["quote 1","quote 2","quote 3"] },\n  "myth": { "myth": "...", "fact": "...", "extra": "optional extra fact" },\n  "stats": { "stat1": {"num":"...","label":"..."}, "stat2": {"num":"...","label":"..."}, "stat3": {"num":"...","label":"..."}, "stat4": {"num":"...","label":"..."} },\n  "pov": { "lines": ["POV line 1","POV line 2","POV line 3","POV line 4","POV line 5"] },\n  "beforeafter": { "before": "...", "after": "...", "caption": "..." },\n  "hottake": { "eyebrow": "HOT TAKE 🔥", "statement": "...", "sub": "...", "cta": "Agree or disagree? ↓" },\n  "tips": { "heading": "...", "tips": ["tip 1","tip 2","tip 3","tip 4","tip 5"] },\n  "caption": "Instagram caption with hashtags"\n}';
}

function applyGenerated(data) {
  if (data.chat && data.chat.messages) {
    var d = 600;
    window._t1conv = data.chat.messages.map(function(m) {
      var item = { dir: m.dir === 'in' ? 'in' : 'out', text: m.text, delay: d };
      d += 1800 + m.text.length * 40;
      return item;
    });
    t1restart();
  }
  if (data.quote && data.quote.quotes) {
    window._t2quotes = data.quote.quotes;
    t2restart();
  }
  if (data.myth) { window._mythData = data.myth; t3restart(); }
  if (data.stats) { window._statsData = data.stats; t4restart(); }
  if (data.pov && data.pov.lines) { window._povLines = data.pov.lines; t5restart(); }
  if (data.beforeafter) {
    window._t6data = { before: data.beforeafter.before||'', after: data.beforeafter.after||'', caption: data.beforeafter.caption||'' };
    t6restart();
  }
  if (data.hottake) {
    window._t7data = { eyebrow: data.hottake.eyebrow||'HOT TAKE 🔥', statement: data.hottake.statement||'', sub: data.hottake.sub||'', cta: data.hottake.cta||'Agree or disagree? ↓' };
    t7restart();
  }
  if (data.tips) {
    window._t8data = { heading: data.tips.heading||'Things worth knowing', tips: data.tips.tips||[] };
    t8restart();
  }
  if (data.caption) {
    S.caption = data.caption;
    var cb = document.getElementById('captionBox');
    if (cb) cb.textContent = data.caption;
  }
}

// ── Tone selector ──────────────────────────────────────────
function setTone(el) {
  document.querySelectorAll('.dt-tone').forEach(function(t) { t.classList.remove('active'); });
  el.classList.add('active');
  S.tone = el.dataset.tone || 'confident';
}

// ── Iterate (refine) existing content ──────────────────────
async function iterateAll(direction) {
  const idea = S.idea || (document.getElementById('ideaInput')||{}).value || 'personal growth';
  const directMap = {
    shorter:  'Make all content significantly shorter and more punchy. Keep the core message but cut everything that is not essential.',
    punchier: 'Rewrite all content to be more impactful, direct, and scroll-stopping. Every line should hit harder.',
    funnier:  'Add wit, personality, and humour throughout. Keep the message but make it entertaining.'
  };
  const instruction = directMap[direction] || 'Improve the content.';
  const btn = document.querySelector('.dt-iter[onclick*="' + direction + '"]');
  if (btn) { btn.textContent = '...'; btn.disabled = true; }
  try {
    const prompt = instruction + ' Original topic: "' + idea + '". Tone: ' + (S.tone||'confident') + '. ' + Brand.promptContext(Brand.load()) + 'Return the same JSON structure with all 8 formats improved: {"chat":{...},"quote":{...},"myth":{...},"stats":{...},"pov":{...},"beforeafter":{...},"hottake":{...},"tips":{...},"caption":"..."}';
    const raw = await apiAsk(prompt);
    const cleaned = raw.replace(/```json\s*/gi,'').replace(/```\s*/gi,'').trim();
    let data;
    try { data = JSON.parse(cleaned); }
    catch(e) { const m = cleaned.match(/\{[\s\S]*\}/); if(m) data = JSON.parse(m[0]); else throw e; }
    applyGenerated(data);
    showToast('Content refined ✓');
  } catch(e) {
    showToast('Error: ' + e.message);
  } finally {
    const labels = { shorter: 'Shorter', punchier: 'Punchier', funnier: 'Funnier' };
    if (btn) { btn.textContent = labels[direction]||direction; btn.disabled = false; }
  }
}

async function generateAll() {
  const ideaEl = document.getElementById('ideaInput');
  const btn    = document.querySelector('.dt-gbtn');
  const idea   = (ideaEl ? ideaEl.value.trim() : '') || 'personal growth';
  const tone   = S.tone || 'confident';
  S.idea = idea;
  if (btn) { btn.textContent = '⟳ Generating…'; btn.disabled = true; }
  try {
    const [, raw] = await Promise.all([
      autoFetchUnsplash(idea),
      apiAsk(buildMegaPrompt(idea, tone))
    ]);
    const cleaned = raw.replace(/```json\s*/gi,'').replace(/```\s*/gi,'').trim();
    let data;
    try { data = JSON.parse(cleaned); }
    catch(e) {
      const m = cleaned.match(/\{[\s\S]*\}/);
      if (m) data = JSON.parse(m[0]);
      else throw new Error('Could not parse JSON from response');
    }
    applyGenerated(data);
    showToast('Content generated ✓');
  } catch(e) {
    showToast('Error: ' + e.message);
    console.error(e);
  } finally {
    if (btn) { btn.textContent = '✶ Generate All'; btn.disabled = false; }
  }
}

// ══════════════════════════════════════════════════════════
// BRAND MODAL UI
// ══════════════════════════════════════════════════════════
var _bmStep = 0;

function openBrandModal() {
  const m = document.getElementById('brandModal');
  if (m) { m.style.display = 'flex'; bmGoTo(0); }
  const b = Brand.load();
  if (b.name)     { const el = document.getElementById('bmName');     if(el) el.value = b.name; }
  if (b.tagline)  { const el = document.getElementById('bmTagline');  if(el) el.value = b.tagline; }
  if (b.industry) { const el = document.getElementById('bmIndustry'); if(el) el.value = b.industry; }
  if (b.audience) { const el = document.getElementById('bmAudience'); if(el) el.value = b.audience; }
  if (b.example)  { const el = document.getElementById('bmExample');  if(el) el.value = b.example; }
  if (b.doSay)    { const el = document.getElementById('bmDoSay');    if(el) el.value = b.doSay; }
  if (b.dontSay)  { const el = document.getElementById('bmDontSay'); if(el) el.value = b.dontSay; }
  if (b.pillars)  { const el = document.getElementById('bmPillars'); if(el) el.value = b.pillars; }
  if (b.color1)   { const el = document.getElementById('bmColor1');   if(el) el.value = b.color1; }
  if (b.color2)   { const el = document.getElementById('bmColor2');   if(el) el.value = b.color2; }
  if (typeof b.slFormal !== 'undefined') { const el = document.getElementById('slFormal'); if(el) el.value = b.slFormal; }
  if (typeof b.slEdgy   !== 'undefined') { const el = document.getElementById('slEdgy');   if(el) el.value = b.slEdgy; }
  if (typeof b.slLength !== 'undefined') { const el = document.getElementById('slLength'); if(el) el.value = b.slLength; }
  // CTA style radio
  if (b.ctaStyle) {
    document.querySelectorAll('input[name="ctaStyle"]').forEach(function(r) { r.checked = r.value === b.ctaStyle; });
  }
  if (b.hashStyle) {
    document.querySelectorAll('input[name="hashStyle"]').forEach(function(r) { r.checked = r.value === b.hashStyle; });
  }
  // Voice chips
  document.querySelectorAll('#bmVoiceChips .bm-chip').forEach(function(c) { c.classList.remove('on'); });
  if (b.traits) b.traits.forEach(function(t) {
    document.querySelectorAll('#bmVoiceChips .bm-chip').forEach(function(c) {
      if ((c.dataset.val||c.textContent.trim()) === t) c.classList.add('on');
    });
  });
}

function dismissBrandModal() {
  const m = document.getElementById('brandModal');
  if (m) m.style.display = 'none';
}

function bmGoTo(step) {
  _bmStep = step;
  // Steps are bmStep0, bmStep1, bmStep2
  ['bmStep0','bmStep1','bmStep2'].forEach(function(id, i) {
    const el = document.getElementById(id);
    if (el) el.style.display = (i === step) ? 'block' : 'none';
  });
  document.querySelectorAll('.bm-dot').forEach(function(d, i) {
    d.classList.toggle('active', i === step);
  });
  const back = document.getElementById('bmBack');
  const next = document.getElementById('bmNext');
  const save = document.getElementById('bmSave');
  if (back) back.style.display = step > 0 ? 'inline-flex' : 'none';
  if (next) next.style.display = step < 2 ? 'inline-flex' : 'none';
  if (save) save.style.display = step === 2 ? 'inline-flex' : 'none';
}

function bmNext() { if (_bmStep < 2) bmGoTo(_bmStep + 1); }
function bmPrev() { if (_bmStep > 0) bmGoTo(_bmStep - 1); }
function bmToggleChip(el) { el.classList.toggle('on'); }

function saveBrandProfile() {
  function val(id) { const el = document.getElementById(id); return el ? el.value : ''; }
  function radioVal(name) {
    const checked = document.querySelector('input[name="' + name + '"]:checked');
    return checked ? checked.value : '';
  }
  const b = {
    name:     val('bmName'),
    tagline:  val('bmTagline'),
    industry: val('bmIndustry'),
    audience: val('bmAudience'),
    example:  val('bmExample'),
    doSay:    val('bmDoSay'),
    dontSay:  val('bmDontSay'),
    pillars:  val('bmPillars'),
    color1:   val('bmColor1') || '#1E88E5',
    color2:   val('bmColor2') || '#42a5f5',
    slFormal: parseInt(val('slFormal')||'40'),
    slEdgy:   parseInt(val('slEdgy')  ||'35'),
    slLength: parseInt(val('slLength')||'30'),
    ctaStyle: radioVal('ctaStyle')  || 'question',
    hashStyle: radioVal('hashStyle') || 'few',
    traits: Array.from(document.querySelectorAll('#bmVoiceChips .bm-chip.on')).map(function(c){ return c.dataset.val||c.textContent.trim(); })
  };
  Brand.save(b);
  Brand.applyColors(b);
  Brand.renderProfileCard(b);
  dismissBrandModal();
  showToast('Brand profile saved ✓');
}

(function initBrand() {
  const b = Brand.load();
  Brand.applyColors(b);
  Brand.renderProfileCard(b);
  if (!b.name && !localStorage.getItem('orbittBrandSeen')) {
    localStorage.setItem('orbittBrandSeen', '1');
    setTimeout(function(){ openBrandModal(); }, 800);
  }
})();


// ══════════════════════════════════════════════════════════
// GENERATION HISTORY
// ══════════════════════════════════════════════════════════
var History = {
  key: 'orbittHistory',
  max: 20,

  load: function() {
    try { return JSON.parse(localStorage.getItem(this.key) || '[]'); }
    catch(e) { return []; }
  },

  save: function(entries) {
    localStorage.setItem(this.key, JSON.stringify(entries));
  },

  push: function(idea, tone, data) {
    var entries = this.load();
    var entry = {
      id: (Date.now().toString(36) + Math.random().toString(36).slice(2)),
      ts: Date.now(),
      idea: idea,
      tone: tone,
      brand: Brand.load(),
      data: data,
      status: 'draft'
    };
    entries.unshift(entry);
    if (entries.length > this.max) entries = entries.slice(0, this.max);
    this.save(entries);
    return entry;
  },

  updateStatus: function(id, status) {
    var entries = this.load();
    entries.forEach(function(e) { if (e.id === id) e.status = status; });
    this.save(entries);
  },

  remove: function(id) {
    var entries = this.load().filter(function(e) { return e.id !== id; });
    this.save(entries);
  }
};

function openHistoryDrawer() {
  var overlay = document.getElementById('histOverlay');
  if (overlay) { overlay.classList.add('open'); renderHistoryList(); }
}

function closeHistoryDrawer(e) {
  if (e && e.target !== document.getElementById('histOverlay')) return;
  var overlay = document.getElementById('histOverlay');
  if (overlay) overlay.classList.remove('open');
}

function renderHistoryList() {
  var list = document.getElementById('histList');
  if (!list) return;
  var entries = History.load();
  if (!entries.length) {
    list.innerHTML = '<div class="hist-empty">No generations yet.<br>Hit ✦ Generate All to create your first one.</div>';
    return;
  }
  list.innerHTML = entries.map(function(e) {
    var ago = formatAgo(e.ts);
    var statusHtml = '<span class="hist-status ' + (e.status||'draft') + '">' + (e.status||'draft') + '</span>';
    return '<div class="hist-item" id="hitem-' + e.id + '">' +
      '<div class="hist-item-idea">' + escHtml(e.idea) + '</div>' +
      '<div class="hist-item-meta">' +
        '<span>' + ago + '</span>' +
        '<span class="hist-item-tone">' + (e.tone||'confident') + '</span>' +
        statusHtml +
      '</div>' +
      '<div class="hist-actions">' +
        '<button class="hist-btn primary" onclick="restoreHistory(\'' + e.id + '\')">↩ Restore</button>' +
        (e.status === 'draft' ? '<button class="hist-btn" onclick="markHistStatus(\'' + e.id + '\',\'approved\')">✓ Approve</button>' : '') +
        '<button class="hist-btn" onclick="deleteHistory(\'' + e.id + '\')" style="flex:0;padding:5px 8px">✕</button>' +
      '</div>' +
    '</div>';
  }).join('');
}

function restoreHistory(id) {
  var entry = History.load().find(function(e) { return e.id === id; });
  if (!entry) return;
  S.idea = entry.idea; S.tone = entry.tone;
  var ideaEl = document.getElementById('ideaInput');
  if (ideaEl) ideaEl.value = entry.idea;
  // restore tone chip
  document.querySelectorAll('.dt-tone').forEach(function(t) {
    t.classList.toggle('active', t.dataset.tone === entry.tone);
  });
  applyGenerated(entry.data);
  closeHistoryDrawer();
  showToast('Restored: ' + entry.idea.slice(0,40) + (entry.idea.length>40?'…':''));
}

function markHistStatus(id, status) {
  History.updateStatus(id, status);
  renderHistoryList();
}

function deleteHistory(id) {
  History.remove(id);
  renderHistoryList();
}

function escHtml(s) {
  return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function formatAgo(ts) {
  var diff = Date.now() - ts;
  var m = Math.floor(diff/60000);
  if (m < 1) return 'just now';
  if (m < 60) return m + 'm ago';
  var h = Math.floor(m/60);
  if (h < 24) return h + 'h ago';
  return Math.floor(h/24) + 'd ago';
}

// ══════════════════════════════════════════════════════════
// CAPTION COUNTER
// ══════════════════════════════════════════════════════════
function updateCaptionCounter(text) {
  var counter = document.getElementById('captionCounter');
  var warn    = document.getElementById('captionWarn');
  if (!counter) return;
  var len = (text||'').length;
  counter.textContent = len + ' chars';
  counter.className = 'caption-counter' + (len > 200 ? ' over' : len > 125 ? ' warn' : '');
  if (warn) warn.style.display = len > 125 ? 'block' : 'none';
}

// Wire caption box observer on DOM ready
(function restoreUnsplashKey() {
  var k = localStorage.getItem('unsplash_key');
  if (!k) return;
  var el = document.getElementById('unsplashKey');
  if (el) el.value = k;
  unsplashShowKeyStatus(true);
})();

(function wireCaptionCounter() {
  var box = document.getElementById('captionBox');
  if (!box) return;
  var obs = new MutationObserver(function() { updateCaptionCounter(box.textContent); });
  obs.observe(box, { childList: true, characterData: true, subtree: true });
})();

// ══════════════════════════════════════════════════════════
// CREDIT COMPLIANCE — update Brand object methods
// ══════════════════════════════════════════════════════════
// Patch openBrandModal to handle regulated fields
var _origOpenBrandModal = openBrandModal;
openBrandModal = function() {
  _origOpenBrandModal();
  var b = Brand.load();
  if (b.regulated) {
    var el = document.getElementById('bmRegulated');
    if (el) { el.checked = true; }
    var row = document.getElementById('bmAclRow');
    if (row) row.classList.add('show');
  }
  if (b.acl) { var el2 = document.getElementById('bmAcl'); if(el2) el2.value = b.acl; }
  if (b.crn) { var el3 = document.getElementById('bmCrn'); if(el3) el3.value = b.crn; }
};

// Patch saveBrandProfile to capture regulated fields
var _origSaveBrandProfile = saveBrandProfile;
saveBrandProfile = function() {
  _origSaveBrandProfile();
  // Merge regulated fields into saved brand
  var b = Brand.load();
  var regEl = document.getElementById('bmRegulated');
  b.regulated = regEl ? regEl.checked : false;
  b.acl = (document.getElementById('bmAcl')||{}).value || '';
  b.crn = (document.getElementById('bmCrn')||{}).value || '';
  Brand.save(b);
};

// Patch buildMegaPrompt to inject compliance when regulated=true
var _origBuildMegaPrompt = buildMegaPrompt;
buildMegaPrompt = function(idea, tone) {
  var base = _origBuildMegaPrompt(idea, tone);
  var b = Brand.load();
  if (!b.regulated) return base;

  var BANNED = [
    'guaranteed approval', 'no credit check', 'everyone qualifies',
    'instant approval', '100% approval', 'bad credit welcome',
    'no questions asked', 'no income check', 'no fees', 'free money',
    'guaranteed finance', 'always approved'
  ];
  var disclaimer = 'Credit provided by ' + (b.name || 'the lender') +
    (b.acl ? ' (ACL ' + b.acl + ')' : '') +
    (b.crn ? ' (CRN ' + b.crn + ')' : '') +
    '. Terms and conditions apply.';

  var complianceBlock =
    'COMPLIANCE RULES (Australian CREDIT special ad category — mandatory):\n' +
    '- NEVER use these phrases or close variants: ' + BANNED.join(', ') + '\n' +
    '- Do not make any statements about guaranteed outcomes, eligibility, or approval certainty\n' +
    '- Keep all claims factual and substantiated\n' +
    '- Copy length: primary text must be 125 characters or under for Meta feed ads\n' +
    '- Append this disclaimer to the generated caption: "' + disclaimer + '"\n\n';

  return complianceBlock + base;
};

// ══════════════════════════════════════════════════════════
// PATCH generateAll TO SAVE HISTORY
// ══════════════════════════════════════════════════════════
var _origGenerateAll = generateAll;
generateAll = async function() {
  await _origGenerateAll();
  // Save to history after generation (data was applied to S.*)
  var ideaEl = document.getElementById('ideaInput');
  var idea = (ideaEl ? ideaEl.value.trim() : '') || S.idea || 'untitled';
  var tone = S.tone || 'confident';
  // Capture current template data snapshot
  var snapshot = {
    chat:        window._t1conv    ? { messages: window._t1conv }    : null,
    quote:       window._t2quotes  ? { quotes: window._t2quotes }    : null,
    myth:        window._mythData  || null,
    stats:       window._statsData || null,
    pov:         window._povLines  ? { lines: window._povLines }     : null,
    beforeafter: window._t6data    || null,
    hottake:     window._t7data    || null,
    tips:        window._t8data    || null,
    caption:     S.caption         || ''
  };
  // Only save if we actually got content
  if (Object.values(snapshot).some(function(v) { return v !== null && v !== ''; })) {
    History.push(idea, tone, snapshot);
  }
};

// ══════════════════════════════════════════════════════════
// MULTI-RATIO EXPORT (ZIP)
// ══════════════════════════════════════════════════════════
async function exportAllVariants() {
  if (typeof JSZip === 'undefined') {
    showToast('JSZip not loaded — try refreshing'); return;
  }
  var btn = document.querySelector('.tbtn-variants');
  if (btn) { btn.textContent = '⟳ Rendering…'; btn.disabled = true; }

  var zip = new JSZip();
  var idea = (S.idea || 'orbitt').replace(/[^a-z0-9]/gi, '-').slice(0,30).toLowerCase();

  // Map: frameId → target dimensions → zip filename
  var variants = [
    { id: 'frame1', W: 1080, H: 1920, label: '9x16-phone' },     // 9:16
    { id: 'frame2', W: 1080, H: 1080, label: '1x1-quote' },      // 1:1
    { id: 'frame4', W: 1080, H: 1080, label: '1x1-stats' },      // 1:1
    { id: 'frame6', W: 1080, H: 1080, label: '1x1-beforeafter' },// 1:1
    { id: 'frame7', W: 1080, H: 1080, label: '1x1-hottake' },    // 1:1
    { id: 'frame8', W: 1080, H: 1080, label: '1x1-tips' },       // 1:1
  ];

  var errors = [];
  for (var i = 0; i < variants.length; i++) {
    var v = variants[i];
    var frame = document.getElementById(v.id);
    if (!frame) continue;
    var shell = frame.querySelector('.phone-shell,.square-shell,.story-shell,.wide-shell');
    if (!shell) continue;
    try {
      var blob = await captureShellAsBlob(shell, v.W, v.H);
      zip.file(idea + '-' + v.label + '.png', blob);
    } catch(e) {
      errors.push(v.label + ': ' + e.message);
    }
  }

  if (errors.length) console.warn('Export errors:', errors);

  var content = await zip.generateAsync({ type: 'blob' });
  var url = URL.createObjectURL(content);
  var a = document.createElement('a');
  a.href = url; a.download = 'orbitt-' + idea + '-variants.zip';
  document.body.appendChild(a); a.click();
  document.body.removeChild(a);
  setTimeout(function() { URL.revokeObjectURL(url); }, 5000);

  if (btn) { btn.textContent = '⬇ All variants'; btn.disabled = false; }
  showToast('Exported ' + (variants.length - errors.length) + ' variants ✓');
}

async function captureShellAsBlob(shell, targetW, targetH) {
  // Get natural shell dimensions
  var rect = shell.getBoundingClientRect();
  var scaleX = targetW / rect.width;
  var scaleY = targetH / rect.height;
  var scale  = Math.min(scaleX, scaleY) * 2; // 2x for retina quality

  var dataUrl = await domtoimage.toPng(shell, {
    width:  rect.width  * scale,
    height: rect.height * scale,
    style:  { transform: 'scale(' + scale + ')', transformOrigin: 'top left' }
  });

  // Convert dataURL to blob
  var arr = dataUrl.split(',');
  var mime = arr[0].match(/:(.*?);/)[1];
  var bstr = atob(arr[1]);
  var n = bstr.length;
  var u8arr = new Uint8Array(n);
  for (var i = 0; i < n; i++) u8arr[i] = bstr.charCodeAt(i);
  return new Blob([u8arr], { type: mime });
}


// ══ 3-UP FORMAT SYSTEM ═══════════════════════════════════════════════════════

// Map: template number → which slot it lives in
var tplSlot = {1:'916',2:'11',3:'45',4:'45',5:'916',6:'11',7:'11',8:'11'};

// Which frame is "preferred" per slot when a template is selected
var slotPref = {
  1:  {916:1, 45:3, 11:2},
  2:  {916:1, 45:3, 11:2},
  3:  {916:5, 45:3, 11:2},
  4:  {916:1, 45:4, 11:8},
  5:  {916:5, 45:3, 11:7},
  6:  {916:1, 45:3, 11:6},
  7:  {916:5, 45:4, 11:7},
  8:  {916:1, 45:4, 11:8},
};

var _activeFmt = '916';
var _activeTpl = 1;

function setActiveFormat(fmt, chipEl) {
  _activeFmt = fmt;
  document.querySelectorAll('.fmt-chip').forEach(function(c){c.classList.toggle('active', c.dataset.fmt===fmt);});
  document.querySelectorAll('.canvas-slot').forEach(function(s){s.classList.toggle('active-slot', s.dataset.fmt===fmt);});
  // Update Info tab to reflect active slot's active frame
  var activeFrameN = getActiveFrameForSlot(fmt);
  if (activeFrameN && meta[activeFrameN]) {
    var m = meta[activeFrameN];
    var gn=document.getElementById('gbiName'), gr=document.getElementById('gbiRatio'), gp=document.getElementById('gbiPlatforms');
    var sl=document.getElementById('spLabel'), sd=document.getElementById('spDesc');
    if(gn) gn.textContent=m.label;
    if(gr) gr.textContent=m.ratio.split(' ')[0];
    if(gp) gp.innerHTML=m.platforms.map(function(p){return '<span class="gbi-plat">'+p+'</span>';}).join('<span class="gbi-sep"> · </span>');
    if(sl) sl.textContent=m.label;
    if(sd) sd.textContent=m.desc;
  }
}

function getActiveFrameForSlot(fmt) {
  var scale = document.getElementById('scale'+fmt);
  if (!scale) return null;
  var active = scale.querySelector('.template-frame.active');
  if (!active) return null;
  return parseInt(active.id.replace('frame',''));
}

function applySlotScales() {
  var specs = {
    916: {shellW:320, shellH:640, slotW:210, slotH:420},
    45:  {shellW:300, shellH:533, slotW:224, slotH:280},
    11:  {shellW:420, shellH:420, slotW:280, slotH:280},
  };
  Object.keys(specs).forEach(function(fmt) {
    var sp = specs[fmt];
    var el = document.getElementById('scale'+fmt);
    if (!el) return;
    var sx = sp.slotW / sp.shellW;
    var sy = sp.slotH / sp.shellH;
    var s  = Math.min(sx, sy);
    el.style.transform = 'scale('+s+')';
    el.style.width  = sp.shellW+'px';
    el.style.height = sp.shellH+'px';
  });
}

// Override switchTemplate for 3-up: activates a frame within its slot
var _orig3upSwitchTemplate = switchTemplate;
switchTemplate = function(n, el) {
  _activeTpl = n;
  // Update sidebar active state
  document.querySelectorAll('.dt-tpl-card').forEach(function(c){c.classList.remove('active');});
  if(el) el.classList.add('active');
  // Set preferred frame in each slot
  var pref = slotPref[n] || {};
  ['916','45','11'].forEach(function(fmt) {
    var prefN = pref[fmt];
    if (!prefN) return;
    var scale = document.getElementById('scale'+fmt);
    if (!scale) return;
    scale.querySelectorAll('.template-frame').forEach(function(f){f.classList.remove('active');});
    var target = document.getElementById('frame'+prefN);
    if (target) target.classList.add('active');
  });
  // Activate the slot corresponding to this template's natural ratio
  var natFmt = tplSlot[n] || '916';
  setActiveFormat(natFmt, null);
  // Update genbar info
  var m = meta[n];
  if (m) {
    var gn=document.getElementById('gbiName'), gr=document.getElementById('gbiRatio'), gp=document.getElementById('gbiPlatforms');
    if(gn) gn.textContent = m.label;
    if(gr) gr.textContent = m.ratio.split(' ')[0];
    if(gp) gp.innerHTML = m.platforms.map(function(p){return '<span class="gbi-plat">'+p+'</span>';}).join('<span class="gbi-sep"> · </span>');
    var sl=document.getElementById('spLabel'), sd=document.getElementById('spDesc');
    if(sl) sl.textContent=m.label;
    if(sd) sd.textContent=m.desc;
  }
  // Mark canvas as having content (hide empty state hint after first interaction)
  var ce = document.getElementById('canvasEmpty');
  if (ce) ce.classList.add('hidden');
};

// Hide empty state once generateAll is called
var _origGenAll3up = generateAll;
generateAll = async function() {
  var ce = document.getElementById('canvasEmpty');
  if (ce) ce.classList.add('hidden');
  return _origGenAll3up.apply(this, arguments);
};

// Init on load
(function init3up(){
  applySlotScales();
  // set initial active slot
  document.querySelectorAll('.canvas-slot').forEach(function(s){
    s.classList.toggle('active-slot', s.dataset.fmt==='916');
  });
})();

window.addEventListener('resize', applySlotScales);
window.setActiveFormat = setActiveFormat;

// ── Expose all onclick-referenced functions to window ──────────────────────
// (needed because index.html uses inline onclick="..." attributes)
const _expose = {
  // UI
  switchTemplate, switchRTab, setTone, replayActive, updateHandle,
  // Generation
  generateAll, iterateAll,
  // Background
  handleBgUpload, clearBg,
  // Export
  exportTemplate, exportAllVariants,
  // Caption
  copyCaption,
  // Unsplash
  searchUnsplash, saveUnsplashKey,
  // Brand modal
  openBrandModal, dismissBrandModal,
  saveBrandProfile, bmNext, bmPrev, bmToggleChip,
  // History
  openHistoryDrawer, closeHistoryDrawer,
};
Object.assign(window, _expose);
