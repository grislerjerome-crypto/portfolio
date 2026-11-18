/* Native portfolio shell interactions, route-specific destinations. */
(()=>{'use strict';const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
function setTheme(theme){if(!['dark','light','space'].includes(theme))return;document.documentElement.dataset.theme=theme;$$('[data-theme-choice]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.themeChoice===theme)));document.querySelector('meta[name="color-scheme"]').content=theme==='light'?'light':'dark';}
setTheme('dark');$$('[data-theme-choice]').forEach(b=>b.addEventListener('click',()=>setTheme(b.dataset.themeChoice)));
const nav=$('.nav'),menu=$('#mobile-menu'),toggle=$('#menu-open');
function closeMenu(){menu.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Open menu');toggle.textContent='☰';}
toggle.setAttribute('aria-controls','mobile-menu');toggle.onclick=()=>{const open=!menu.classList.contains('open');menu.classList.toggle('open',open);toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Close menu':'Open menu');toggle.textContent=open?'✕':'☰';};
menu.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu();});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.classList.contains('open')){closeMenu();toggle.focus();}});document.addEventListener('click',e=>{if(!nav.contains(e.target))closeMenu();});
new ResizeObserver(()=>document.documentElement.style.setProperty('--shell-height',nav.getBoundingClientRect().height+'px')).observe(nav);
function clock(){$('#clock').textContent=new Intl.DateTimeFormat('en-US',{timeZone:'America/New_York',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false}).format(new Date());}clock();setInterval(clock,1000);
function setupPalette(){
  const wrap=$("#palette"),input=$("#palette-input"),list=$("#palette-list");
  const items=[...document.querySelectorAll('.nav ul a')].map(a=>({ic:'↳',label:a.textContent,go:a.getAttribute('href')}));
  items.unshift({ic:'↳',label:'Project Samples',act:()=>document.querySelector('#library').scrollIntoView()});
  items.push({ic:'◎',label:'About me, Jerome Grisler',go:'../#about'},{ic:'✉',label:"Let's Connect!",go:'../#contact'},{ic:'↗',label:'Open CRM live demo',go:'../crm/'},{ic:'✦',label:'AI Space Mode',act:()=>setTheme('space')},{ic:'☀',label:'Light mode',act:()=>setTheme('light')},{ic:'☾',label:'Dark mode',act:()=>setTheme('dark')},{ic:'⎘',label:'Copy email',act:()=>navigator.clipboard?.writeText('grislerjerome@gmail.com')});
  let active=0,filtered=items,previousFocus=null;
  wrap.setAttribute('role','dialog');wrap.setAttribute('aria-modal','true');wrap.setAttribute('aria-label','Command menu');
  input.setAttribute('role','combobox');input.setAttribute('aria-label','Search commands');input.setAttribute('aria-controls','palette-list');input.setAttribute('aria-autocomplete','list');input.setAttribute('aria-expanded','false');
  list.setAttribute('role','listbox');list.setAttribute('aria-label','Commands');
  function render(){
    filtered=items.filter(it=>it.label.toLowerCase().includes(input.value.toLowerCase()));
    active=Math.max(0,Math.min(active,filtered.length-1));
    list.innerHTML=filtered.map((it,i)=>`<div id="palette-option-${i}" role="option" aria-selected="${i===active}" class="item ${i===active?'active':''}" data-i="${i}"><span class="ic">${it.ic}</span>${it.label}</div>`).join('')||'<div class="hint" role="status">No matching commands</div>';
    if(filtered.length)input.setAttribute('aria-activedescendant','palette-option-'+active);else input.removeAttribute('aria-activedescendant');
    $$("#palette-list .item").forEach(el=>el.onclick=()=>choose(+el.dataset.i));
    const selected=list.querySelector('.active');if(selected)selected.scrollIntoView({block:'nearest'});
  }
  function choose(i){const it=filtered[i];if(!it)return;close();if(it.go)location.assign(it.go);if(it.act)it.act();}
  function open(){if(wrap.classList.contains('open'))return;previousFocus=document.activeElement;wrap.classList.add('open');input.setAttribute('aria-expanded','true');input.value="";active=0;render();input.focus();}
  function close(){wrap.classList.remove('open');input.setAttribute('aria-expanded','false');if(previousFocus&&previousFocus.isConnected)previousFocus.focus({preventScroll:true});}
  $("#cmd-open").onclick=()=>wrap.classList.contains('open')?close():open();
  input.oninput=()=>{active=0;render();};
  input.onkeydown=e=>{
    if(e.key==="ArrowDown"){e.preventDefault();active=Math.min(filtered.length-1,active+1);render();}
    else if(e.key==="ArrowUp"){e.preventDefault();active=Math.max(0,active-1);render();}
    else if(e.key==="Enter"){e.preventDefault();choose(active);}
    else if(e.key==="Escape"){e.preventDefault();e.stopPropagation();close();}
    else if(e.key==="Tab"){e.preventDefault();input.focus();}
  };
  wrap.onclick=e=>{if(e.target===wrap)close();};
  addEventListener("keydown",e=>{
    if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==="k"){e.preventDefault();wrap.classList.contains('open')?close():open();}
    else if(e.key==="/"&&!["INPUT","TEXTAREA"].includes(document.activeElement.tagName)){e.preventDefault();open();}
  });
}


setupPalette();})();
