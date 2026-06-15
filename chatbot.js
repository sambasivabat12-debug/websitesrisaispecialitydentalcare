/* Sri Sai Speciality Dental Care — lead-capture chat widget
   Self-contained. No dependencies. Matches the site's white+blue palette.
   Flow: greeting -> book? -> name -> phone (validated) -> service -> WhatsApp send. */
(function () {
  'use strict';

  /* ============================ EDIT THESE ============================ */
  var WHATSAPP_NUMBER = '918688033072';   // WhatsApp lead number (country code + number, NO + or spaces)
  var CALL_NUMBER     = '+918688033072';  // Phone number for the Call button
  var CLINIC_NAME     = 'Sri Sai Dental Care';
  var SERVICES = ['Dental Implants', 'Root Canal', 'Braces / Aligners', 'Crowns & Bridges',
                  'Dentures', 'Teeth Whitening', 'Smile Design', 'Kids Dentistry',
                  'General Check-up', 'Other'];
  /* =================================================================== */

  if (document.getElementById('ssdc-chat')) return; // guard against double-load

  var CSS = `
  #ssdc-chat *{box-sizing:border-box}
  #ssdc-launch{position:fixed;bottom:116px;right:28px;width:60px;height:60px;border-radius:50%;background:#0A66C2;border:none;cursor:pointer;box-shadow:0 10px 28px rgba(10,102,194,.45);z-index:940;display:flex;align-items:center;justify-content:center;transition:transform .3s,box-shadow .3s}
  #ssdc-launch:hover{transform:scale(1.08);box-shadow:0 14px 34px rgba(10,102,194,.55)}
  #ssdc-launch svg{width:29px;height:29px;fill:#fff}
  #ssdc-launch .ssdc-pulse{position:absolute;inset:0;border-radius:50%;background:#0A66C2;z-index:-1;animation:ssdcPulse 2.4s ease-out infinite}
  @keyframes ssdcPulse{0%{transform:scale(1);opacity:.5}70%,100%{transform:scale(1.7);opacity:0}}
  #ssdc-launch .ssdc-nudge{position:absolute;top:-3px;right:-3px;min-width:20px;height:20px;padding:0 5px;background:#16a34a;color:#fff;font:800 11px/20px 'Nunito',sans-serif;border-radius:10px;text-align:center;border:2px solid #fff}
  .ssdc-panel{position:fixed;bottom:116px;right:28px;width:374px;max-width:calc(100vw - 32px);height:558px;max-height:calc(100vh - 150px);background:#fff;border-radius:18px;box-shadow:0 24px 64px rgba(10,37,64,.30);z-index:945;display:none;flex-direction:column;overflow:hidden;border:1px solid #d2e4f5;font-family:'Nunito',-apple-system,BlinkMacSystemFont,sans-serif}
  .ssdc-panel.ssdc-open{display:flex;animation:ssdcUp .34s cubic-bezier(.16,1,.3,1)}
  @keyframes ssdcUp{from{opacity:0;transform:translateY(18px) scale(.98)}to{opacity:1;transform:none}}
  .ssdc-hd{background:linear-gradient(135deg,#0A66C2,#2f8ae0);color:#fff;padding:15px 16px;display:flex;align-items:center;gap:11px}
  .ssdc-hd-av{width:42px;height:42px;border-radius:50%;background:#fff;display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0}
  .ssdc-hd-i{flex:1;min-width:0}
  .ssdc-hd-n{font-family:'Playfair Display',Georgia,serif;font-weight:700;font-size:15px;line-height:1.15}
  .ssdc-hd-s{font-size:11.5px;opacity:.92;display:flex;align-items:center;gap:5px;margin-top:3px}
  .ssdc-live{width:7px;height:7px;border-radius:50%;background:#4ade80;animation:ssdcLive 1.8s infinite}
  @keyframes ssdcLive{0%{box-shadow:0 0 0 0 rgba(74,222,128,.6)}70%{box-shadow:0 0 0 6px rgba(74,222,128,0)}100%{box-shadow:0 0 0 0 rgba(74,222,128,0)}}
  .ssdc-x{background:rgba(255,255,255,.22);border:none;color:#fff;width:30px;height:30px;border-radius:50%;cursor:pointer;font-size:19px;line-height:1;flex-shrink:0}
  .ssdc-x:hover{background:rgba(255,255,255,.35)}
  .ssdc-bd{flex:1;overflow-y:auto;padding:16px 14px;background:#F8FAFC;display:flex;flex-direction:column;gap:9px}
  .ssdc-m{max-width:82%;padding:10px 13px;border-radius:14px;font-size:13.5px;line-height:1.5;word-wrap:break-word;animation:ssdcM .28s ease}
  @keyframes ssdcM{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:none}}
  .ssdc-m.bot{background:#fff;color:#0F172A;border:1px solid #e9eef5;border-bottom-left-radius:4px;align-self:flex-start}
  .ssdc-m.me{background:#0A66C2;color:#fff;border-bottom-right-radius:4px;align-self:flex-end}
  .ssdc-typ{align-self:flex-start;background:#fff;border:1px solid #e9eef5;padding:13px 15px;border-radius:14px;border-bottom-left-radius:4px;display:flex;gap:4px}
  .ssdc-typ i{width:7px;height:7px;border-radius:50%;background:#9fcef5;animation:ssdcBlink 1.3s infinite}
  .ssdc-typ i:nth-child(2){animation-delay:.18s}.ssdc-typ i:nth-child(3){animation-delay:.36s}
  @keyframes ssdcBlink{0%,60%,100%{opacity:.3;transform:translateY(0)}30%{opacity:1;transform:translateY(-2px)}}
  .ssdc-opts{display:flex;flex-wrap:wrap;gap:7px;align-self:flex-start;max-width:100%;margin-top:2px}
  .ssdc-o{background:#fff;border:1.5px solid #0A66C2;color:#0A66C2;padding:8px 13px;border-radius:100px;font:700 12.5px 'Nunito',sans-serif;cursor:pointer;transition:background .2s,color .2s}
  .ssdc-o:hover{background:#0A66C2;color:#fff}
  .ssdc-cta{display:flex;flex-direction:column;gap:8px;align-self:stretch;margin-top:4px}
  .ssdc-cta a{display:flex;align-items:center;justify-content:center;gap:7px;padding:12px;border-radius:11px;font:800 13.5px 'Nunito',sans-serif;text-decoration:none}
  .ssdc-cta .wa{background:#16a34a;color:#fff}
  .ssdc-cta .wa:hover{background:#15803d}
  .ssdc-cta .call{background:#fff;border:1.5px solid #0A66C2;color:#0A66C2}
  .ssdc-ft{padding:10px 11px;border-top:1px solid #eef3f8;background:#fff;display:flex;gap:8px;align-items:center}
  .ssdc-in{flex:1;border:1.5px solid #d2e4f5;border-radius:100px;padding:9px 14px;font:400 13px 'Nunito',sans-serif;outline:none;color:#0F172A}
  .ssdc-in:focus{border-color:#0A66C2}
  .ssdc-in:disabled{background:#f1f5f9;color:#94a3b8;cursor:not-allowed}
  .ssdc-snd{background:#0A66C2;border:none;width:38px;height:38px;border-radius:50%;cursor:pointer;flex-shrink:0;display:flex;align-items:center;justify-content:center;transition:background .2s}
  .ssdc-snd:disabled{background:#cbd5e1;cursor:not-allowed}
  .ssdc-snd svg{width:17px;height:17px;fill:#fff}
  @media(max-width:768px){
    #ssdc-launch{bottom:78px;right:14px;width:56px;height:56px}
    #ssdc-launch svg{width:27px;height:27px}
    .ssdc-panel{bottom:74px;right:10px;left:10px;top:64px;width:auto;height:auto;max-height:none}
  }`;

  var style = document.createElement('style');
  style.textContent = CSS;
  document.head.appendChild(style);

  var root = document.createElement('div');
  root.id = 'ssdc-chat';
  root.innerHTML =
    '<button id="ssdc-launch" aria-label="Chat with us">' +
      '<span class="ssdc-pulse"></span>' +
      '<span class="ssdc-nudge">1</span>' +
      '<svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM7 9h10v2H7zm6 4H7v-2h6zm4-6H7V5h10z"/></svg>' +
    '</button>' +
    '<div class="ssdc-panel" role="dialog" aria-label="Chat with Sri Sai Dental Care">' +
      '<div class="ssdc-hd">' +
        '<div class="ssdc-hd-av">🦷</div>' +
        '<div class="ssdc-hd-i"><div class="ssdc-hd-n">' + CLINIC_NAME + '</div>' +
          '<div class="ssdc-hd-s"><span class="ssdc-live"></span> Online · replies in minutes</div></div>' +
        '<button class="ssdc-x" aria-label="Close chat">&times;</button>' +
      '</div>' +
      '<div class="ssdc-bd"></div>' +
      '<div class="ssdc-ft">' +
        '<input class="ssdc-in" type="text" autocomplete="off" placeholder="Tap a button above…" disabled>' +
        '<button class="ssdc-snd" aria-label="Send" disabled><svg viewBox="0 0 24 24"><path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/></svg></button>' +
      '</div>' +
    '</div>';
  document.body.appendChild(root);

  var launch  = root.querySelector('#ssdc-launch');
  var panel   = root.querySelector('.ssdc-panel');
  var closeBt = root.querySelector('.ssdc-x');
  var bd      = root.querySelector('.ssdc-bd');
  var input   = root.querySelector('.ssdc-in');
  var snd     = root.querySelector('.ssdc-snd');

  var lead = { name: '', phone: '', service: '' };
  var step = null;       // null | 'name' | 'phone'
  var started = false;

  function esc(s){ return String(s).replace(/[&<>"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
  function down(){ bd.scrollTop = bd.scrollHeight; }
  function bubble(text, who){ var d=document.createElement('div'); d.className='ssdc-m '+who; d.textContent=text; bd.appendChild(d); down(); return d; }
  function bubbleHtml(html){ var d=document.createElement('div'); d.className='ssdc-m bot'; d.innerHTML=html; bd.appendChild(d); down(); return d; }
  function typing(cb, ms){ var t=document.createElement('div'); t.className='ssdc-typ'; t.innerHTML='<i></i><i></i><i></i>'; bd.appendChild(t); down(); setTimeout(function(){ if(t.parentNode) t.parentNode.removeChild(t); cb(); }, ms||850); }
  function bot(text, after){ typing(function(){ bubble(text,'bot'); if(after) after(); }); }
  function lock(){ input.disabled=true; snd.disabled=true; input.value=''; input.placeholder='Tap a button above…'; }
  function unlock(ph){ input.disabled=false; snd.disabled=false; input.placeholder=ph||'Type here…'; setTimeout(function(){ input.focus(); }, 50); }
  function options(list){ var w=document.createElement('div'); w.className='ssdc-opts'; list.forEach(function(o){ var b=document.createElement('button'); b.className='ssdc-o'; b.textContent=o.label; b.addEventListener('click', function(){ if(w.parentNode) w.parentNode.removeChild(w); bubble(o.label,'me'); o.go(); }); w.appendChild(b); }); bd.appendChild(w); down(); }
  function ctas(html){ var w=document.createElement('div'); w.className='ssdc-cta'; w.innerHTML=html; bd.appendChild(w); down(); }

  function waLink(){
    var msg = 'Hi! I would like to book an appointment at ' + CLINIC_NAME + '.';
    if (lead.name)    msg += '\nName: ' + lead.name;
    if (lead.phone)   msg += '\nPhone: ' + lead.phone;
    if (lead.service) msg += '\nTreatment: ' + lead.service;
    return 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(msg);
  }
  function contactCtas(){
    ctas('<a class="wa" href="' + waLink() + '" target="_blank" rel="noopener">💬 Chat on WhatsApp</a>' +
         '<a class="call" href="tel:' + CALL_NUMBER + '">📞 Call the clinic</a>');
  }

  function start(){
    if (started) return; started = true;
    lock();
    bot('Hi there! 👋 Welcome to ' + CLINIC_NAME + '.', function(){
      bot('Would you like to book an appointment?', function(){
        options([
          { label: 'Yes, book me in 😊', go: askName },
          { label: 'Just looking',        go: justLooking }
        ]);
      });
    });
  }
  function askName(){ bot('Wonderful! May I know your name?', function(){ step='name'; unlock('Type your name…'); }); }
  function justLooking(){ bot('No problem at all! Have a look around. 🙂 Whenever you are ready, you can reach us directly here:', function(){ contactCtas(); }); }
  function askService(){
    bot('Perfect! 🦷 Which treatment are you interested in?', function(){
      options(SERVICES.map(function(s){ return { label: s, go: function(){ pick(s); } }; }));
    });
  }
  function pick(s){
    lead.service = s;
    bot('All done, ' + lead.name + '! 🎉 Here is your appointment request:', function(){
      bubbleHtml('👤 ' + esc(lead.name) + '<br>📱 ' + esc(lead.phone) + '<br>🦷 ' + esc(s));
      bot('Tap below to send it to us on WhatsApp — we will confirm your slot right away. 👇', function(){
        ctas('<a class="wa" href="' + waLink() + '" target="_blank" rel="noopener">💬 Send on WhatsApp</a>' +
             '<a class="call" href="tel:' + CALL_NUMBER + '">📞 Call instead</a>');
      });
    });
  }
  function submit(){
    var v = (input.value || '').trim();
    if (!v) return;
    if (step === 'name'){
      lead.name = v; bubble(v,'me'); lock(); step=null;
      bot('Thanks, ' + lead.name + '! 📱 What is the best number to reach you?', function(){ step='phone'; unlock('Your mobile number…'); });
    } else if (step === 'phone'){
      var digits = v.replace(/\D/g,'');
      bubble(v,'me');
      if (digits.length < 10){
        input.value='';
        bot('Hmm, that does not look complete — please enter a 10-digit mobile number. 🙂', function(){ unlock('Your mobile number…'); });
        return;
      }
      lead.phone = v; lock(); step=null; askService();
    }
  }

  input.addEventListener('keydown', function(e){ if (e.key === 'Enter'){ e.preventDefault(); submit(); } });
  snd.addEventListener('click', submit);
  launch.addEventListener('click', function(){ panel.classList.add('ssdc-open'); launch.style.display='none'; if (!started) start(); });
  closeBt.addEventListener('click', function(){ panel.classList.remove('ssdc-open'); launch.style.display='flex'; });
})();
