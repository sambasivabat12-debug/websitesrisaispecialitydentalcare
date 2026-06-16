/* Sri Sai Speciality Dental Care — chat assistant widget
   Self-contained. No dependencies, no AI/server. White+blue palette.
   Flow: greeting -> name -> phone (validated) -> treatment -> intent-based Q&A (knowledge base) + WhatsApp/Call handoff. */
(function () {
  'use strict';

  /* ============================ EDIT THESE ============================ */
  var WHATSAPP_NUMBER = '918688033072';   // WhatsApp lead number (country code + number, NO + or spaces)
  var CALL_NUMBER     = '+918688033072';  // Phone number for the Call button
  var CLINIC_NAME     = 'Sri Sai Speciality Dental Care';
  var SERVICES = ['Dental Implants','Crowns & Bridges','Dentures','Braces / Aligners','Root Canal',
                  'Teeth Whitening','Wisdom Tooth','Kids Dentistry','Fillings','Smile Design',
                  'General Check-up','Other'];
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
  .ssdc-bd>*:first-child{margin-top:auto}
  .ssdc-m{max-width:82%;padding:10px 13px;border-radius:14px;font-size:13.5px;line-height:1.5;white-space:pre-line;word-wrap:break-word;animation:ssdcM .28s ease}
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
    .ssdc-in{font-size:16px}
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
          '<div class="ssdc-hd-s"><span class="ssdc-live"></span> Online · here to help</div></div>' +
        '<button class="ssdc-x" aria-label="Close chat">&times;</button>' +
      '</div>' +
      '<div class="ssdc-bd"></div>' +
      '<div class="ssdc-ft">' +
        '<input class="ssdc-in" type="text" autocomplete="off" placeholder="Type here…" disabled>' +
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
  var step = null;       // null | 'name' | 'phone' | 'treatment' | 'chat'
  var started = false;
  var busy = false;
  var chatRow = null;

  /* ===================== KNOWLEDGE BASE (intents) ===================== */
  var INTENTS = [
   {id:"hours",kw:["timing","timings","open","opening","hours","close","closing","what time","working hours","open today","timings today"],a:"We're open all 7 days, 9 AM to 9 PM. You're welcome to walk in, or book a slot by calling 86880 33072."},
   {id:"location",kw:["where","location","address","located","direction","directions","reach","how to reach","area","karmanghat","map"],a:"We're at Sri Sai Speciality Dental Care, TKR College Road, Karmanghat, Hyderabad 500079. Tap 'Send on WhatsApp' below and we'll share the exact location pin."},
   {id:"contact",kw:["phone","number","contact","mobile","whatsapp","your number","call you"],a:"You can reach us on 86880 33072 (or 93965 22492), every day from 9 AM to 9 PM. We'll be glad to help!"},
   {id:"doctors",kw:["doctor","doctors","dentist","specialist","who is","experience","qualified","dr rao","dr vakula"],a:"You'll be in expert hands. Dr. T. Venkat Rao has 35+ years of experience and specialises in crowns, bridges and dentures. Dr. T. Sai Vakula is our oral & maxillofacial surgeon and implant expert."},
   {id:"tooth_pain",kw:["tooth pain","toothache","tooth ache","tooth hurt","tooth hurts","molar pain","aching tooth","painful tooth","tooth paining","pain when chewing","paining","hurts","pain"],a:"I'm sorry you're in pain. Toothache can come from a cavity, infection, or a crack, and it's best checked soon so it doesn't get worse. Please call 86880 33072 to see the dentist. Meanwhile, try to avoid very hot or cold food on that side. (If you notice facial swelling or fever, please call us immediately.)"},
   {id:"sensitivity",kw:["sensitive","sensitivity","cold water","hot and cold","ice cream","sensitive teeth","teeth sensitive"],a:"Sensitivity to hot, cold or sweet often points to worn enamel, a small cavity, or exposed roots. A quick check-up can find the cause and ease it. Call 86880 33072 to book a visit."},
   {id:"gum_bleeding",kw:["gum bleeding","bleeding gum","bleeding gums","gums bleed","gum bleed","blood when brushing","gums bleeding"],a:"Bleeding gums are usually an early sign of gum inflammation, and they're very treatable, especially when caught early. A cleaning and check-up help a lot. Please call 86880 33072 to book, and keep brushing gently twice a day."},
   {id:"swelling",kw:["swelling","swollen","gum swollen","abscess","puffy"],a:"Swelling can be a sign of infection and shouldn't be ignored. Please call us on 86880 33072 to be seen soon. If the swelling is large or spreading, or you have a fever or trouble swallowing, please treat it as an emergency and call right away."},
   {id:"bad_breath",kw:["bad breath","halitosis","mouth smell","smell from mouth","breath smell","bad smell","smell","smells","breath","stinks"],a:"Persistent bad breath often comes from plaque, gum issues, or a dry mouth, and a professional cleaning usually helps a lot. We can find the cause during a check-up. Call 86880 33072 to book."},
   {id:"broken_tooth",kw:["broken tooth","chipped","cracked tooth","tooth broke","fractured","tooth chipped","broke my tooth"],a:"Sorry about that! If a piece broke off, keep it if you can and avoid chewing on that side. It's best seen soon to protect the tooth, so please call 86880 33072. (If a tooth was completely knocked out or there's heavy bleeding, treat it as an emergency and call immediately.)"},
   {id:"loose_tooth",kw:["loose tooth","wobbly","tooth moving","shaky tooth","tooth loose"],a:"A loose tooth in an adult should be checked promptly to find the cause and, where possible, save it. Please call 86880 33072 to book a visit soon."},
   {id:"ulcer",kw:["ulcer","mouth sore","mouth ulcer","blister"],a:"Most mouth ulcers heal on their own within 1 to 2 weeks. If yours lasts longer than two weeks, is very painful, or keeps returning, please get it checked. Call 86880 33072."},
   {id:"root_canal",kw:["root canal","rct","nerve treatment"],a:"A root canal gently removes infection from inside the tooth and saves it, relieving the pain. It's a routine, comfortable procedure with us. To check if you need one, book a visit on 86880 33072."},
   {id:"extraction",kw:["extraction","remove tooth","pull tooth","tooth removal","take out tooth","extract"],a:"We do gentle tooth removals when a tooth truly can't be saved, with care to keep you comfortable. The dentist will always try to save the tooth first where possible. Call 86880 33072 to get assessed."},
   {id:"wisdom",kw:["wisdom tooth","wisdom teeth","third molar","wisdom"],a:"Wisdom teeth often need attention when they're impacted or causing pain or swelling. Dr. Sai Vakula, our oral surgeon, handles these routinely. Book an assessment on 86880 33072."},
   {id:"implant",kw:["implant","implants","fixed teeth","replace missing","missing tooth"],a:"Dental implants are a strong, natural-looking way to replace missing teeth, almost like having your own tooth back. Dr. Sai Vakula plans these with precision. To check if implants suit you, book a consult on 86880 33072."},
   {id:"crown",kw:["crown","crowns","cap","tooth cap"],a:"A crown (cap) covers and protects a weak, cracked, or root-treated tooth and restores its shape. Dr. Venkat Rao specialises in crowns and bridges. Call 86880 33072 to discuss options."},
   {id:"bridge",kw:["bridge","bridges"],a:"A bridge replaces one or more missing teeth by anchoring to the neighbouring teeth, restoring your bite and smile. Dr. Venkat Rao is our crowns & bridges specialist. Book on 86880 33072."},
   {id:"denture",kw:["denture","dentures","false teeth","removable teeth"],a:"We make comfortable, natural-looking dentures, full or partial, and also implant-supported options for extra grip. Dr. Venkat Rao specialises in these. Call 86880 33072 to get started."},
   {id:"braces",kw:["braces","metal braces","orthodontic","orthodontist"],a:"Braces straighten teeth and correct the bite over time, and they suit both kids and adults. We'll assess and explain the best option for you. Book a consult on 86880 33072."},
   {id:"aligners",kw:["aligner","aligners","invisible braces","clear aligner","clear aligners"],a:"Clear aligners are a nearly invisible, removable way to straighten teeth. After an assessment we can tell if they're right for you. Call 86880 33072 to book."},
   {id:"filling",kw:["filling","fillings","cavity","cavities","decay","hole in tooth"],a:"A filling repairs a cavity and stops decay from spreading, and it's quick and tooth-coloured. The sooner a cavity is treated, the simpler it is. Book a check-up on 86880 33072."},
   {id:"whitening",kw:["whitening","whiten","bleaching","yellow teeth","white teeth","brighten"],a:"Professional teeth whitening safely brightens your smile far more effectively than over-the-counter kits. We'll first check your teeth are suitable. Call 86880 33072 to book."},
   {id:"smile",kw:["smile design","smile makeover","veneer","veneers","makeover","smile"],a:"A smile makeover combines treatments like veneers, whitening, and reshaping to design a smile you love, planned around your face and goals. Book a consult on 86880 33072."},
   {id:"kids",kw:["kid","kids","child","children","baby teeth","pediatric","paediatric","my son","my daughter","my child"],a:"We make dental visits gentle and friendly for children, from check-ups and cleaning to fillings and habit guidance. Call 86880 33072 to book your child's visit any day, 9 AM to 9 PM."},
   {id:"cleaning",kw:["cleaning","scaling","polishing","tartar","plaque","clean my teeth"],a:"A professional cleaning (scaling) removes plaque and tartar that brushing can't, keeping gums healthy and breath fresh. We usually recommend it every 6 months. Book on 86880 33072."},
   {id:"book",kw:["book","appointment","booking","schedule","want to visit","want to come","meet doctor","consult","consultation","fix appointment"],a:"Wonderful! We've noted your details and our team will reach out, or you can confirm instantly by tapping 'Send on WhatsApp' below, or calling 86880 33072. We're open every day, 9 AM to 9 PM."},
   {id:"reschedule",kw:["reschedule","change appointment","postpone","different time","change my time"],a:"No problem. To reschedule, please call us on 86880 33072 and we'll find a time that suits you."},
   {id:"cancel",kw:["cancel","cancellation","cancel appointment"],a:"That's okay. To cancel or change a booking, just call 86880 33072 and we'll sort it out."},
   {id:"cost",kw:["cost","price","charges","fee","fees","charge","how much","rate","expensive"],a:"Costs depend on your specific needs, which the dentist confirms after a quick look. We always explain the charges clearly before starting anything. For an estimate, call 86880 33072 or tap WhatsApp below."},
   {id:"payment",kw:["insurance","cashless","claim","reimburse","emi","installment","instalment","payment"],a:"For payment options, please call our team on 86880 33072 and they'll be happy to walk you through what's available."},
   {id:"greeting",kw:["hi","hello","hey","namaste","good morning","good evening","good afternoon"],a:"Hello! 😊 How can I help? You can ask about our timings, treatments, costs, or booking an appointment."},
   {id:"thanks",kw:["thank","thanks","thank you","thanku"],a:"You're most welcome! If there's anything else, just ask, or tap 'Send on WhatsApp' and our team will help you further. 🦷"},
   {id:"bye",kw:["bye","goodbye","ok bye","see you"],a:"Take care! We're here every day, 9 AM to 9 PM, on 86880 33072 whenever you need us. 😊"}
  ];
  var FALLBACK="I'm not totally sure I understood that 😊. You can ask me about our timings, location, treatments, costs, or booking. Or tap 'Send on WhatsApp' below and our team will help you personally.";
  var EMERGENCY_ANSWER="That sounds urgent. Please call us right away on 86880 33072, or go to the nearest emergency room if it's after hours or severe. Please don't wait, we'll help you as fast as we can.";

  function normalize(s){ return ' ' + String(s).toLowerCase().replace(/[^a-z0-9\s]/g,' ').replace(/\s+/g,' ').trim() + ' '; }
  function has(t,kw){ return t.indexOf(' '+kw+' ') !== -1; }
  var ER_PHRASES=["knocked out","knocked off","tooth fell out","tooth came out","cant breathe","can t breathe","difficulty breathing","trouble breathing","difficulty swallowing","cant swallow","can t swallow","accident","met with accident","trauma","jaw broken","broke my jaw","unbearable pain","severe pain"];
  function isEmergency(t){
    for (var i=0;i<ER_PHRASES.length;i++){ if (t.indexOf(ER_PHRASES[i]) !== -1) return true; }
    var swell = (t.indexOf('swollen')!==-1 || t.indexOf('swelling')!==-1);
    if (swell && (has(t,'face')||has(t,'cheek')||has(t,'eye')||has(t,'throat')||has(t,'neck'))) return true;
    var bleed = (t.indexOf('bleeding')!==-1 || t.indexOf('blood')!==-1);
    if (bleed && (has(t,'stop')||t.indexOf('wont stop')!==-1||has(t,'heavy')||has(t,'lot')||t.indexOf('not stopping')!==-1)) return true;
    return false;
  }
  function match(text){
    var t = normalize(text);
    if (isEmergency(t)) return { id:"emergency", a:EMERGENCY_ANSWER };
    var best=null, bestScore=0;
    for (var i=0;i<INTENTS.length;i++){
      var intent=INTENTS[i], score=0;
      for (var j=0;j<intent.kw.length;j++){ var kw=intent.kw[j]; if (has(t,kw)) score += (kw.indexOf(' ')!==-1 ? 2 : 1); }
      if (score>bestScore){ bestScore=score; best=intent; }
    }
    return bestScore>0 ? best : { id:"fallback", a:FALLBACK };
  }
  var SHOW_CTA = ['emergency','book','cost','location','payment','fallback'];

  /* ============================ HELPERS ============================ */
  function esc(s){ return String(s).replace(/[&<>"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
  function down(){ bd.scrollTop = bd.scrollHeight; }
  function bubble(text, who){ var d=document.createElement('div'); d.className='ssdc-m '+who; d.textContent=text; bd.appendChild(d); down(); return d; }
  function bubbleHtml(html){ var d=document.createElement('div'); d.className='ssdc-m bot'; d.innerHTML=html; bd.appendChild(d); down(); return d; }
  function typing(cb, ms){ var t=document.createElement('div'); t.className='ssdc-typ'; t.innerHTML='<i></i><i></i><i></i>'; bd.appendChild(t); down(); setTimeout(function(){ if(t.parentNode) t.parentNode.removeChild(t); cb(); }, ms||800); }
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
    ctas('<a class="wa" href="' + waLink() + '" target="_blank" rel="noopener">💬 Send on WhatsApp</a>' +
         '<a class="call" href="tel:' + CALL_NUMBER + '">📞 Call the clinic</a>');
  }

  /* persistent quick-reply chips for the Q&A stage */
  function showChatChips(){
    var labels = ['Timings','Location','Cost','Book appointment','Dental implants','Tooth pain','Ask any question'];
    chatRow = document.createElement('div'); chatRow.className='ssdc-opts';
    labels.forEach(function(l){ var b=document.createElement('button'); b.className='ssdc-o'; b.textContent=l; b.addEventListener('click', function(){ if(!busy) answer(l); }); chatRow.appendChild(b); });
    bd.appendChild(chatRow); down();
  }
  function parkChips(){ if (chatRow){ bd.appendChild(chatRow); down(); } }

  /* ============================ FLOW ============================ */
  function start(){
    if (started) return; started = true; lock();
    bot('Hello! 👋 Welcome to ' + CLINIC_NAME + '.\nDr. T. Sai Vakula and our team are delighted to assist you today.\nTo get started, may I know your name?', function(){
      step='name'; unlock('Type your name…');
    });
  }
  function askService(){
    bot('Thank you! 🦷 Which treatment are you interested in? Tap one below, or type it.', function(){
      step='treatment';
      options(SERVICES.map(function(s){ return { label: s, go: function(){ pick(s); } }; }));
      unlock('Type or tap a treatment…');
    });
  }
  function pick(s){
    lead.service = s; lock();
    bot('Perfect, ' + lead.name + '! ✅ I have noted your interest in ' + s + ', and our team can reach you at ' + lead.phone + '.', function(){
      bot('Now, how can I help? Ask me anything below, or tap an option. 👇', function(){
        step='chat'; contactCtas(); showChatChips(); unlock('Type your question…'); busy=false;
      });
    });
  }
  function answer(text){
    if (busy) return; busy = true;
    bubble(text,'me');
    if (text.toLowerCase() === 'ask any question'){
      bot("Of course! 😊 Just type your question below — about any treatment, symptom, cost, or appointment — and I'll help you.", function(){ parkChips(); busy=false; });
      return;
    }
    var r = match(text);
    bot(r.a, function(){ if (SHOW_CTA.indexOf(r.id) !== -1) contactCtas(); parkChips(); busy=false; });
  }
  function submit(){
    var v = (input.value || '').trim();
    if (!v) return;
    if (step !== 'chat' && isEmergency(normalize(v))){
      bubble(v,'me'); input.value='';
      bot(EMERGENCY_ANSWER, function(){
        contactCtas();
        if (step==='name') unlock('Type your name…');
        else if (step==='phone') unlock('Your mobile number…');
        else if (step==='treatment') unlock('Type or tap a treatment…');
      });
      return;
    }
    if (step === 'name'){
      lead.name = v; bubble(v,'me'); lock(); step=null;
      bot("Nice to meet you, " + lead.name + "! 😊 What is the best mobile number to reach you?", function(){ step='phone'; unlock('Your mobile number…'); });
    } else if (step === 'phone'){
      var digits = v.replace(/\D/g,''); bubble(v,'me');
      if (digits.length < 10){ input.value=''; bot("Hmm, that does not look complete — please enter a 10-digit mobile number. 🙂", function(){ unlock('Your mobile number…'); }); return; }
      lead.phone = v; lock(); step=null; askService();
    } else if (step === 'treatment'){
      bubble(v,'me'); pick(v);
    } else if (step === 'chat'){
      input.value=''; answer(v);
    }
  }

  input.addEventListener('keydown', function(e){ if (e.key === 'Enter'){ e.preventDefault(); submit(); } });
  snd.addEventListener('click', submit);
  launch.addEventListener('click', function(){ panel.classList.add('ssdc-open'); launch.style.display='none'; if (!started) start(); });
  closeBt.addEventListener('click', function(){ panel.classList.remove('ssdc-open'); launch.style.display='flex'; });
})();
