(function(){
var API=window.SITE_API||'';
if(!API)return;
var own=false;
try{if(location.hash==='#owner')localStorage.setItem('owner','1');own=localStorage.getItem('owner')==='1';}catch(e){}
var vid='',first=false;
try{vid=localStorage.getItem('vid')||'';if(!vid){vid=Math.random().toString(36).slice(2)+Date.now().toString(36);localStorage.setItem('vid',vid);first=true;}}catch(e){vid='anon';}
function send(kind,label){
  if(own)return;
  var host='';
  try{host=document.referrer?new URL(document.referrer).hostname:'';if(host===location.hostname)host='';}catch(e){}
  var body=JSON.stringify({t:'track',kind:kind,label:label||'',vid:vid,first:first&&kind==='view',path:(location.pathname.split('/').pop()||'home'),lang:(navigator.language||'').slice(0,10),device:/Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)?'mobile':'desktop',ref:host});
  try{fetch(API,{method:'POST',headers:{'Content-Type':'text/plain;charset=UTF-8'},body:body,keepalive:true}).catch(function(){});}catch(e){}
}
document.addEventListener('click',function(e){
  var t=e.target;if(!t||!t.closest)return;
  if(t.closest('.cp')){send('click','sham-copy');return;}
  var a=t.closest('a.card');
  if(a){var h=a.getAttribute('href')||'',l=h;try{if(/^https?:/.test(h))l=new URL(h).hostname.replace('www.','');}catch(x){}send('click',l);return;}
  var b=t.closest('#sh,#qb,#ib');
  if(b)send('click',{sh:'share',qb:'qr',ib:'install'}[b.id]);
},true);
function banner(txt){var d=document.createElement('div');d.textContent=txt;d.style.cssText='position:relative;z-index:50;background:#6ea8ff;color:#06101f;text-align:center;padding:10px 14px;font:600 14px system-ui,sans-serif';document.body.insertBefore(d,document.body.firstChild);}
function maint(){var d=document.createElement('div');d.textContent='الموقع تحت الصيانة حالياً، نعود قريباً';d.style.cssText='position:fixed;inset:0;z-index:99999;background:#0b0e14;color:#f2f4f8;display:flex;align-items:center;justify-content:center;text-align:center;padding:30px;font:600 22px/1.8 system-ui,sans-serif';document.body.appendChild(d);}
function counter(n){
  var f=document.getElementById('foot');
  if(!f||document.getElementById('vc'))return;
  var d=document.createElement('div');d.id='vc';
  d.style.cssText='margin-top:10px;font-size:13px;opacity:.7;display:flex;gap:6px;align-items:center;justify-content:center';
  d.innerHTML='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
  var s=document.createElement('span');s.textContent=String(n);d.appendChild(s);
  f.parentNode.insertBefore(d,f.nextSibling);
}
function hideSham(){
  var f=function(){
    document.querySelectorAll('.cp').forEach(function(b){
      var c=b.closest('.card');
      if(c){c.style.display='none';var p=c.previousElementSibling;if(p&&p.className==='sec')p.style.display='none';}
    });
  };
  f();
  var l=document.getElementById('list');
  if(l)new MutationObserver(f).observe(l,{childList:true});
}
send('view');
fetch(API,{cache:'no-store'}).then(function(r){return r.json();}).then(function(s){
  if(s.maintenance==='on'&&!own)maint();
  if(s.announcement&&document.getElementById('list'))banner(s.announcement);
  if(s.show_sham==='off')hideSham();
  if(s.show_counter!=='off'&&typeof s.views==='number')counter(s.views);
}).catch(function(){});
})();
