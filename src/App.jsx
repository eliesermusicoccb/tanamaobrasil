import { useState, useEffect, useRef, useCallback } from "react";
import RegisterProfessional from "./RegisterProfessional";

// ══════════════════════════════════════════════════════════════
// DESIGN SYSTEM
// ══════════════════════════════════════════════════════════════
const C = {
  pri: "#0C8C5E", priDk: "#07634A", priLt: "#E6F5EF", priGlow: "#0C8C5E22",
  acc: "#E8A817", accLt: "#FEF7E0",
  cor: "#E8573A", corLt: "#FEF0ED",
  dk: "#111827", dkSoft: "#1F2937",
  g: "#6B7280", gL: "#9CA3AF", gB: "#E5E7EB", gBg: "#F3F4F6", w: "#FFFFFF",
  green: "#22C55E", red: "#EF4444", blue: "#3B82F6",
};
const font = { d: "'Outfit', sans-serif", b: "'DM Sans', sans-serif" };

// ══════════════════════════════════════════════════════════════
// META PIXEL EVENTS - PROFESSIONAL CONVERSION TRACKING
// ══════════════════════════════════════════════════════════════
function trackEvent(event, data) {
  try { 
    if(window.fbq) window.fbq('track', event, data); 
    console.log(`📊 FB Event: ${event}`, data);
  } catch(e) {}
}
// Events mapping:
// trackEvent('Lead') — professional clicked signup button
// trackEvent('CompleteRegistration') — finished registration form
// trackEvent('Subscribe', {value: 99, currency:'BRL'}) — subscribed to plan
// trackEvent('AddToWishlist') — saved a client inquiry
// trackEvent('Contact') — sent message to client
// trackEvent('ViewContent', {content_name: 'Profile'}) — viewed competitor profile

// ══════════════════════════════════════════════════════════════
// NOTIFICATION SOUND SYSTEM
// ══════════════════════════════════════════════════════════════
let audioCtx = null;
function playNotifSound() {
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.type = "sine"; osc.frequency.setValueAtTime(880, audioCtx.currentTime);
    osc.frequency.setValueAtTime(1100, audioCtx.currentTime + 0.08);
    osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.16);
    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
    osc.start(audioCtx.currentTime); osc.stop(audioCtx.currentTime + 0.4);
  } catch(e) {}
}

// ══════════════════════════════════════════════════════════════
// MODERATION SYSTEM
// ══════════════════════════════════════════════════════════════
const BANNED_WORDS = ["idiota","burro","incompetente","lixo","porcaria","nojo","imbecil","cretino","vagabundo","preguiçoso","ladrão","caloteiro","pilantra","safado","desgraça","merda","porra","caralho","puta","fdp","arrombado","otário","trouxa"];
function moderateText(text) {
  if (!text) return { safe:true, cleaned:text };
  const lower = text.toLowerCase();
  const found = BANNED_WORDS.filter(w => lower.includes(w));
  if (found.length === 0) return { safe:true, cleaned:text };
  let cleaned = text;
  found.forEach(w => { const re = new RegExp(w, "gi"); cleaned = cleaned.replace(re, "***"); });
  return { safe:false, cleaned, flagged:found };
}

// ══════════════════════════════════════════════════════════════
// DATA
// ══════════════════════════════════════════════════════════════
const CATEGORIES = [
  { icon:"🔧", name:"Encanador", count:342 },{ icon:"⚡", name:"Eletricista", count:289 },
  { icon:"🎨", name:"Pintor", count:415 },{ icon:"🏗️", name:"Pedreiro", count:523 },
  { icon:"💇", name:"Cabeleireiro", count:678 },{ icon:"📱", name:"Técnico TI", count:234 },
  { icon:"🚗", name:"Mecânico", count:456 },{ icon:"📸", name:"Fotógrafo", count:312 },
  { icon:"🧹", name:"Diarista", count:891 },{ icon:"👩‍⚕️", name:"Enfermeiro(a)", count:187 },
  { icon:"📐", name:"Arquiteto", count:156 },{ icon:"🍳", name:"Chef", count:267 },
  { icon:"🪚", name:"Marceneiro", count:198 },{ icon:"❄️", name:"Ar Cond.", count:321 },
  { icon:"🔒", name:"Chaveiro", count:145 },{ icon:"🌿", name:"Jardineiro", count:276 },
  { icon:"🐕", name:"Pet Care", count:389 },{ icon:"🎶", name:"Músico", count:201 },
];

const PROS = [
  { id:1, name:"Carlos Silva", role:"Eletricista", rating:4.9, reviews:127, city:"São Paulo, SP", price:"R$ 80", badge:"premium", av:"CS", on:true,
    desc:"Mais de 15 anos no mercado. Instalações residenciais e comerciais, manutenção preventiva e laudos técnicos. Atendimento 24h.",
    whatsapp:"5511999990001", phone:"(11) 99999-0001", email:"carlos@email.com",
    address:"Rua Augusta, 1200 - Consolação, São Paulo - SP, 01304-001",
    hours:"Seg-Sáb: 7h às 20h | Dom: Emergências",
    social:{ ig:"@carlos.eletricista", fb:"carlos.eletricista", li:"carlos-silva-elet" },
    categories:["Eletricista","Instalações","Manutenção"],
    since:"2009", jobs:1450, views:3842, emergency24h:true,
    userReviews:[
      {n:"Maria S.",r:5,t:"Excelente! Pontual e muito atencioso. Resolveu tudo em 2h.",d:"2 dias atrás"},
      {n:"Pedro L.",r:5,t:"Trabalho impecável, super recomendo. Preço justo.",d:"1 semana atrás"},
      {n:"Ana C.",r:4,t:"Bom profissional, só demorou um pouco para chegar.",d:"2 semanas atrás"},
    ]},
  { id:2, name:"Ana Oliveira", role:"Designer de Interiores", rating:4.8, reviews:89, city:"Rio de Janeiro, RJ", price:"R$ 150", badge:"pro", av:"AO", on:true,
    desc:"Projetos residenciais e corporativos com foco em funcionalidade e estética. Consultoria online disponível.",
    whatsapp:"5521999990002", phone:"(21) 99999-0002", email:"ana@design.com",
    address:"Av. Atlântica, 500 - Copacabana, Rio de Janeiro - RJ",
    hours:"Seg-Sex: 9h às 18h",
    social:{ ig:"@ana.interiores", fb:"ana.oliveira.design", li:"ana-oliveira-design" },
    categories:["Design","Interiores","Consultoria"],
    since:"2015", jobs:320, views:1567, emergency24h:false,
    userReviews:[{n:"Lucas M.",r:5,t:"Projeto incrível! Transformou meu apê.",d:"3 dias atrás"},{n:"Carla R.",r:4,t:"Ótimo gosto, entregou no prazo.",d:"1 semana atrás"}]},
  { id:3, name:"Roberto Santos", role:"Encanador", rating:4.7, reviews:203, city:"Belo Horizonte, MG", price:"R$ 60", badge:"premium", av:"RS", on:false,
    desc:"Especialista em instalações hidráulicas, desentupimento, troca de registros e reparos em geral.",
    whatsapp:"5531999990003", phone:"(31) 99999-0003", email:"roberto@email.com",
    address:"Rua da Bahia, 800 - Centro, Belo Horizonte - MG",
    hours:"Seg-Sáb: 6h às 19h",
    social:{ ig:"@roberto.encanador" }, categories:["Encanador","Hidráulica"], since:"2010", jobs:2100, views:4210, emergency24h:true,
    userReviews:[{n:"Fernanda A.",r:5,t:"Resolveu um vazamento complexo rapidamente.",d:"5 dias atrás"}]},
  { id:4, name:"Mariana Costa", role:"Fotógrafa", rating:5.0, reviews:56, city:"Curitiba, PR", price:"R$ 200", badge:"pro", av:"MC", on:true,
    desc:"Fotografia de eventos, retratos profissionais, ensaios e fotografia de produto para e-commerce.",
    whatsapp:"5541999990004", phone:"(41) 99999-0004", email:"mari@foto.com",
    address:"Rua XV de Novembro, 300 - Centro, Curitiba - PR",
    hours:"Seg-Sáb: 8h às 20h",
    social:{ ig:"@mari.fotografia", fb:"mari.costa.foto", li:"mariana-costa-foto" },
    categories:["Fotografia","Eventos","Produto"], since:"2017", jobs:680, views:2890, emergency24h:false,
    userReviews:[{n:"João P.",r:5,t:"Fotos do casamento ficaram perfeitas!",d:"1 dia atrás"}]},
  { id:5, name:"João Pereira", role:"Pintor Residencial", rating:4.6, reviews:178, city:"Salvador, BA", price:"R$ 70", badge:null, av:"JP", on:true,
    desc:"Pintura interna e externa, texturização, grafiato e efeitos decorativos.",
    whatsapp:"5571999990005", phone:"(71) 99999-0005", email:"joao@email.com",
    address:"Rua Chile, 150 - Pelourinho, Salvador - BA",
    hours:"Seg-Sáb: 7h às 17h", social:{}, categories:["Pintor","Texturização"], since:"2012", jobs:900, views:1234, emergency24h:false,
    userReviews:[{n:"Rita M.",r:4,t:"Bom trabalho, acabamento bonito.",d:"4 dias atrás"}]},
  { id:6, name:"Fernanda Lima", role:"Cabeleireira", rating:4.9, reviews:312, city:"Brasília, DF", price:"R$ 50", badge:"pro", av:"FL", on:true,
    desc:"Corte, coloração, tratamentos capilares e penteados. Atendo em domicílio.",
    whatsapp:"5561999990006", phone:"(61) 99999-0006", email:"fer@hair.com",
    address:"SQS 308 Bloco A - Asa Sul, Brasília - DF",
    hours:"Seg-Sáb: 8h às 21h | Dom: 9h às 14h",
    social:{ ig:"@fer.hair", fb:"fernanda.lima.hair" }, categories:["Cabeleireira","Coloração"], since:"2014", jobs:4200, views:5678, emergency24h:false,
    userReviews:[{n:"Camila T.",r:5,t:"Melhor cabeleireira de Brasília!",d:"2 dias atrás"},{n:"Bruna S.",r:5,t:"Atende super bem em domicílio.",d:"1 semana atrás"}]},
  { id:7, name:"Lucas Mendes", role:"Técnico AC", rating:4.8, reviews:94, city:"Manaus, AM", price:"R$ 120", badge:"premium", av:"LM", on:true,
    desc:"Instalação, limpeza e manutenção de splits. Todas as marcas. Garantia de 90 dias.",
    whatsapp:"5592999990007", phone:"(92) 99999-0007", email:"lucas@ac.com",
    address:"Av. Eduardo Ribeiro, 600 - Centro, Manaus - AM",
    hours:"Seg-Sáb: 7h às 18h",
    social:{ ig:"@lucas.arcond", li:"lucas-mendes-ac" }, categories:["Ar Condicionado","Manutenção"], since:"2016", jobs:780, views:2103, emergency24h:true,
    userReviews:[{n:"marcos R.",r:5,t:"Limpou 3 splits em 1 manhã. Top!",d:"3 dias atrás"}]},
  { id:8, name:"Patrícia Almeida", role:"Diarista", rating:4.9, reviews:445, city:"São Paulo, SP", price:"R$ 180", badge:"pro", av:"PA", on:true,
    desc:"Limpeza residencial completa, passadoria, organização. Pontual e detalhista.",
    whatsapp:"5511999990008", phone:"(11) 99999-0008", email:"patricia@email.com",
    address:"Vila Mariana, São Paulo - SP",
    hours:"Seg-Sex: 7h às 17h",
    social:{ ig:"@pat.limpeza" }, categories:["Diarista","Limpeza","Organização"], since:"2011", jobs:5600, views:7890, emergency24h:false,
    userReviews:[{n:"Lucia F.",r:5,t:"Casa ficou impecável! Super pontual.",d:"1 dia atrás"},{n:"Roberto C.",r:5,t:"Melhor diarista que já contratei.",d:"5 dias atrás"}]},
];

const BANNERS = [
  { t:"Receba clientes SEM sair de casa", s:"7 dias grátis. Sem cartão. Sem compromisso.", bg:`linear-gradient(135deg, ${C.pri} 0%, ${C.acc} 100%)`, label:"⏱️ POR TEMPO LIMITADO", cta:true, proOnly:false },
  { t:"💰 Ganhe R$ 5k+/mês", s:"2.500+ profissionais já estão na plataforma", bg:`linear-gradient(135deg, #E8573A 0%, #D4940F 100%)`, label:"PROOF OF SUCCESS", cta:true, proOnly:false },
  { t:"Fatura automática em pix", s:"Receba pagamentos de clientes de forma segura", bg:`linear-gradient(135deg, ${C.priDk} 0%, ${C.acc} 100%)`, label:"FACILIDADE", cta:true, proOnly:false },
];

const PLANS = [
  { name:"Free", price:"R$ 0", color:C.pri, bg:C.priLt, pop:false, cta:"Plano Atual",
    feats:["Perfil básico com foto","Até 3 categorias","Receber avaliações","Chat (10/mês)","Aparecer nas buscas"] },
  { name:"Pro", price:"R$ 29,90", color:C.cor, bg:C.corLt, pop:true, cta:"Assinar Pro",
    feats:["Tudo do Free +","Destaque nas buscas","Categorias ilimitadas","Chat ilimitado","Selo Pro","Portfólio 20 fotos","Redes sociais no perfil","Relatório de views"] },
  { name:"Premium", price:"R$ 69,90", color:C.acc, bg:C.accLt, pop:false, cta:"Assinar Premium",
    feats:["Tudo do Pro +","1º nas buscas da região","Selo Premium verificado","Portfólio ilimitado + vídeo","Link WhatsApp/site","Redes sociais no perfil","Suporte prioritário","Banner rotativo incluso","Dashboard de métricas"] },
];

// ══════════════════════════════════════════════════════════════
// ICONS
// ══════════════════════════════════════════════════════════════
const I = {
  search:(c=C.g,s=20)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  home:(c=C.g,s=22)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  grid:(c=C.g,s=22)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>,
  chat:(c=C.g,s=22)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  user:(c=C.g,s=22)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  star:(c=C.acc,s=14)=><svg width={s} height={s} viewBox="0 0 24 24" fill={c} stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
  starEmpty:(c=C.gB,s=14)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
  check:(c=C.pri,s=16)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  arrow:(c=C.g,s=18)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  back:(c=C.dk,s=22)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
  pin:(c=C.g,s=14)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  crown:(c=C.acc,s=12)=><svg width={s} height={s} viewBox="0 0 24 24" fill={c} stroke="none"><path d="M2 20h20L19 8l-5 6-2-8-2 8-5-6z"/></svg>,
  bolt:(c=C.cor,s=12)=><svg width={s} height={s} viewBox="0 0 24 24" fill={c} stroke="none"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
  filter:(c=C.dk,s=18)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
  heart:(c=C.g,s=20,f=false)=><svg width={s} height={s} viewBox="0 0 24 24" fill={f?C.cor:"none"} stroke={f?C.cor:c} strokeWidth="2" strokeLinecap="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
  bell:(c=C.g,s=22)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  phone:(c=C.g,s=18)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  whatsapp:(c="#25D366",s=18)=><svg width={s} height={s} viewBox="0 0 24 24" fill={c}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>,
  settings:(c=C.g,s=22)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  briefcase:(c=C.pri,s=22)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
  building:(c=C.acc,s=22)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><rect x="4" y="2" width="16" height="20" rx="1"/><line x1="9" y1="6" x2="9" y2="6.01"/><line x1="15" y1="6" x2="15" y2="6.01"/><path d="M9 22v-4h6v4"/></svg>,
  send:(c=C.pri,s=20)=><svg width={s} height={s} viewBox="0 0 24 24" fill={c} stroke="none"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>,
  ig:(c="#E4405F",s=16)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>,
  fb:(c="#1877F2",s=16)=><svg width={s} height={s} viewBox="0 0 24 24" fill={c} stroke="none"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>,
  li:(c="#0A66C2",s=16)=><svg width={s} height={s} viewBox="0 0 24 24" fill={c} stroke="none"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>,
  lock:(c=C.gL,s=14)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  clock:(c=C.g,s=14)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  mail:(c=C.g,s=14)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  calendar:(c=C.cor,s=14)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
};

// ══════════════════════════════════════════════════════════════
// SHARED COMPONENTS
// ══════════════════════════════════════════════════════════════
function Logo({ size=36, white=false }) {
  const c1=white?"#FFF":C.pri, c2=white?"rgba(255,255,255,0.7)":C.acc;
  return (<svg width={size} height={size} viewBox="0 0 120 120" fill="none"><rect width="120" height="120" rx="28" fill={white?"rgba(255,255,255,0.15)":C.priLt}/><g transform="translate(18,15)"><path d="M42 88C20 88 10 70 10 55L10 38C10 34 13 31 17 31C21 31 24 34 24 38L24 45" stroke={c1} strokeWidth="5" strokeLinecap="round" fill="none"/><path d="M24 45L24 22C24 18 27 15 31 15C35 15 38 18 38 22L38 42" stroke={c1} strokeWidth="5" strokeLinecap="round" fill="none"/><path d="M38 42L38 18C38 14 41 11 45 11C49 11 52 14 52 18L52 42" stroke={c1} strokeWidth="5" strokeLinecap="round" fill="none"/><path d="M52 42L52 22C52 18 55 15 59 15C63 15 66 18 66 22L66 45" stroke={c1} strokeWidth="5" strokeLinecap="round" fill="none"/><path d="M66 45L66 35C66 31 69 28 73 28C77 28 80 31 80 35L80 58C80 75 65 88 48 88" stroke={c1} strokeWidth="5" strokeLinecap="round" fill="none"/><circle cx="31" cy="11" r="4" fill={c2}/><circle cx="45" cy="7" r="4" fill={c2}/><circle cx="59" cy="11" r="4" fill={c2}/><circle cx="73" cy="24" r="3.5" fill={c2}/><circle cx="17" cy="27" r="3.5" fill={c2}/><line x1="31" y1="11" x2="45" y2="7" stroke={c2} strokeWidth="1.5" opacity=".4"/><line x1="45" y1="7" x2="59" y2="11" stroke={c2} strokeWidth="1.5" opacity=".4"/></g></svg>);
}
function LogoText({ size=30, white=false }) {
  return (<div style={{ display:"flex", alignItems:"center", gap:8 }}><Logo size={size} white={white}/><div style={{ lineHeight:1.05 }}><div style={{ fontFamily:font.d, fontWeight:800, fontSize:size*0.55, color:white?"#fff":C.dk, letterSpacing:"-0.02em" }}>TáNa<span style={{ color:white?"rgba(255,255,255,0.85)":C.pri }}>Mão</span></div><div style={{ fontFamily:font.b, fontSize:size*0.26, color:white?"rgba(255,255,255,0.6)":C.gL, fontWeight:600, letterSpacing:"0.14em", textTransform:"uppercase" }}>Brasil</div></div></div>);
}
function Avatar({ ini, size=48, badge }) {
  const pals=[["#0C8C5E","#E6F5EF"],["#E8A817","#FEF7E0"],["#E8573A","#FEF0ED"],["#6366F1","#EEF2FF"],["#EC4899","#FDF2F8"],["#3B82F6","#EFF6FF"]];
  const i=ini.charCodeAt(0)%pals.length; const [fg,bg]=pals[i];
  return (<div style={{ position:"relative", flexShrink:0 }}><div style={{ width:size, height:size, borderRadius:size*0.3, background:bg, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:font.d, fontWeight:700, fontSize:size*0.36, color:fg }}>{ini}</div>{badge&&<div style={{ position:"absolute", bottom:-2, right:-2, width:size*0.36, height:size*0.36, borderRadius:size*0.12, background:badge==="premium"?C.acc:C.cor, display:"flex", alignItems:"center", justifyContent:"center", border:`2px solid ${C.w}` }}>{badge==="premium"?I.crown("#fff",size*0.18):I.bolt("#fff",size*0.18)}</div>}</div>);
}
function Badge({ type }) {
  const s={premium:{bg:C.accLt,c:"#92600A",icon:I.crown("#92600A",10),t:"Premium"},pro:{bg:C.corLt,c:C.cor,icon:I.bolt(C.cor,10),t:"Pro"},emergency:{bg:"#FEE2E2",c:"#DC2626",icon:null,t:"🚨 24h"}}; const b=s[type]; if(!b) return null;
  return <span style={{ display:"inline-flex", alignItems:"center", gap:3, background:b.bg, color:b.c, fontSize:10, fontWeight:700, padding:"2px 7px", borderRadius:5 }}>{b.icon} {b.t}</span>;
}
function Btn({ children, v="primary", full, sz="md", onClick, style:st }) {
  const vars={primary:{bg:C.pri,c:"#fff"},accent:{bg:C.acc,c:"#fff"},coral:{bg:C.cor,c:"#fff"},outline:{bg:"transparent",c:C.pri,bd:`2px solid ${C.pri}`},ghost:{bg:C.gBg,c:C.dk},dark:{bg:C.dk,c:"#fff"},white:{bg:"#fff",c:C.dk},whatsapp:{bg:"#25D366",c:"#fff"}};
  const sizes={sm:{p:"9px 16px",f:13},md:{p:"12px 22px",f:14},lg:{p:"15px 28px",f:15}};
  const va=vars[v]||vars.primary,si=sizes[sz];
  return <button onClick={onClick} style={{ padding:si.p, fontSize:si.f, background:va.bg, color:va.c, border:va.bd||"none", borderRadius:12, fontWeight:700, fontFamily:font.d, cursor:"pointer", display:"inline-flex", alignItems:"center", justifyContent:"center", gap:7, width:full?"100%":"auto", WebkitTapHighlightColor:"transparent", transition:"transform .1s", ...st }} onTouchStart={e=>e.currentTarget.style.transform="scale(0.97)"} onTouchEnd={e=>e.currentTarget.style.transform="scale(1)"}>{children}</button>;
}
function TopBar({ title, onBack, right }) {
  return (<div style={{ padding:"12px 16px", display:"flex", alignItems:"center", gap:12, background:C.w, borderBottom:`1px solid ${C.gB}`, position:"sticky", top:0, zIndex:50 }}>{onBack&&<button onClick={onBack} style={{ width:40, height:40, borderRadius:12, border:"none", background:C.gBg, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{I.back()}</button>}<h2 style={{ fontFamily:font.d, fontSize:18, fontWeight:800, color:C.dk, flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{title}</h2>{right}</div>);
}
function Toast({ msg, visible }) {
  if(!visible) return null;
  return <div style={{ position:"fixed", bottom:80, left:"50%", transform:"translateX(-50%)", background:C.dk, color:"#fff", padding:"10px 20px", borderRadius:12, fontSize:13, fontWeight:600, zIndex:300, animation:"fadeInUp .3s ease", boxShadow:"0 8px 30px rgba(0,0,0,0.2)" }}>{msg}</div>;
}

// ★ STAR RATING COMPONENT (interactive)
function StarRating({ value=0, onChange, size=24, readonly=false }) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display:"flex", gap:4 }}>
      {[1,2,3,4,5].map(s=>(
        <button key={s}
          onClick={()=>!readonly&&onChange&&onChange(s)}
          onMouseEnter={()=>!readonly&&setHover(s)}
          onMouseLeave={()=>!readonly&&setHover(0)}
          style={{ background:"none", border:"none", cursor:readonly?"default":"pointer", padding:2, WebkitTapHighlightColor:"transparent", transition:"transform .15s", transform:(hover===s&&!readonly)?"scale(1.2)":"scale(1)" }}>
          {(hover||value)>=s ? I.star(C.acc,size) : I.starEmpty(C.gB,size)}
        </button>
      ))}
    </div>
  );
}

// SOCIAL LINK COMPONENT
function SocialLink({ type, handle, locked }) {
  const icons = { ig:I.ig, fb:I.fb, li:I.li };
  const labels = { ig:"Instagram", fb:"Facebook", li:"LinkedIn" };
  const IconFn = icons[type];
  if (!handle && !locked) return null;
  return (
    <div style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 0", opacity:locked?0.5:1 }}>
      {IconFn ? IconFn(locked?C.gL:undefined, 16) : null}
      <span style={{ fontSize:13, color:locked?C.gL:C.dk, flex:1 }}>
        {locked ? `${labels[type]} (plano Pro+)` : handle}
      </span>
      {locked && I.lock(C.gL,14)}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// TRIAL SYSTEM
// ══════════════════════════════════════════════════════════════
function useTrialSystem() {
  const [trial, setTrial] = useState({ active:true, daysLeft:5, startDate:"2025-06-10" });
  const notifications = [];
  if (trial.active && trial.daysLeft <= 5) {
    for (let d = trial.daysLeft; d >= 1; d--) {
      notifications.push({ type:"trial", title:`Trial expira em ${d} dia${d>1?"s":""}!`, msg:d<=2?"Assine agora para não perder os recursos Pro.":"Aproveite para conhecer todos os recursos.", time:`${trial.daysLeft-d}d`, icon:"⏰" });
    }
  }
  return { trial, setTrial, trialNotifs: notifications.slice(0,1) };
}

// ══════════════════════════════════════════════════════════════
// SCREEN: HOME
// ══════════════════════════════════════════════════════════════
function Home({ nav, trial }) {
  const [bi, setBi] = useState(0);
  const [sf, setSf] = useState(false);
  const [favs, setFavs] = useState({});
  useEffect(()=>{ const t=setInterval(()=>setBi(i=>(i+1)%BANNERS.length),4500); return()=>clearInterval(t); },[]);

  return (
    <div className="screen-content">
      {/* Trial Banner */}
      {trial.active && (
        <div className="anim-in" onClick={()=>nav("plans")} style={{ margin:"12px 16px 0", padding:"14px 16px", borderRadius:12, background:`linear-gradient(135deg, ${C.acc} 0%, #D4940F 100%)`, display:"flex", alignItems:"center", gap:12, cursor:"pointer", boxShadow:"0 4px 16px rgba(232,168,23,0.25)" }}>
          {I.zap("#fff",18)}
          <div style={{ flex:1 }}><div style={{ fontFamily:font.d, fontSize:14, fontWeight:800, color:"#fff" }}>⏰ TRIAL: {trial.daysLeft} dias grátis restantes!</div>
          <div style={{ fontSize:12, color:"rgba(255,255,255,0.85)" }}>Conclua seu perfil para ganhar R$ 5k+/mês</div></div>
          {I.arrow("#fff",14)}
        </div>
      )}

      {/* Header */}
      <div className="anim-in" style={{ padding:"12px 16px 0", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <LogoText size={30}/><div style={{ display:"flex", gap:6, alignItems:"center" }}>
        <button onClick={()=>nav("notifs")} className="icon-btn">{I.bell(C.dk)}<span className="notif-dot"/></button>
        <button onClick={()=>nav("settings")} className="icon-btn">{I.settings(C.dk)}</button>
        <div onClick={()=>nav("settings")} style={{ width:34, height:34, borderRadius:10, background:C.priLt, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:font.d, fontWeight:700, fontSize:13, color:C.pri, cursor:"pointer", border:`1.5px solid ${C.pri}33` }}>VC</div></div>
      </div>

      {/* Search */}
      <div className="anim-in d1" style={{ padding:"12px 16px 0" }}>
        <div className={`search-bar ${sf?"focused":""}`}>
          {I.search(sf?C.pri:C.gL,18)}
          <input placeholder="Buscar profissional ou serviço..." onFocus={()=>setSf(true)} onBlur={()=>setSf(false)} style={{ flex:1, border:"none", outline:"none", background:"transparent", fontSize:14, color:C.dk, fontFamily:font.b }}/>
          <button onClick={()=>{}} className="filter-pill">{I.filter(C.w,14)}</button>
        </div>
      </div>

      {/* Banner */}
      <div className="anim-in d2" style={{ padding:"12px 16px 0" }}>
        <div className="banner" style={{ background:BANNERS[bi].bg }}>
          <span className="banner-label">{BANNERS[bi].label}</span>
          <div key={bi} className="anim-fade"><h3 className="banner-title">{BANNERS[bi].t}</h3><p className="banner-sub">{BANNERS[bi].s}</p></div>
          <div style={{ display:"flex", gap:5, marginTop:14 }}>{BANNERS.map((_,i)=><div key={i} onClick={()=>setBi(i)} className={`dot ${i===bi?"active":""}`}/>)}</div>
        </div>
      </div>

      {/* Stats */}
      <div className="anim-in d3 stats-row">
        {[{n:"2.547",l:"Profissionais",c:C.pri},{n:"15.890",l:"Clientes ativos",c:C.acc},{n:"R$ 5k+",l:"Ganho médio/mês",c:C.cor}].map((s,i)=><div key={i} className="stat-card"><div style={{ fontFamily:font.d, fontSize:18, fontWeight:800, color:s.c }}>{s.n}</div><div style={{ fontSize:10, color:C.gL, fontWeight:500, marginTop:1 }}>{s.l}</div></div>)}
      </div>

      {/* Categories */}
      <div className="anim-in d3"><div className="section-header"><h2 className="section-title">Categorias</h2><button onClick={()=>nav("categories")} className="link-btn">Ver todas</button></div>
      <div className="cat-scroll">{CATEGORIES.slice(0,8).map((c,i)=><div key={i} onClick={()=>nav("categories")} className="cat-card"><div style={{ fontSize:26, marginBottom:4 }}>{c.icon}</div><div style={{ fontSize:11, fontWeight:600, color:C.dk }}>{c.name}</div><div style={{ fontSize:9, color:C.gL, marginTop:1 }}>{c.count}</div></div>)}</div></div>

      {/* Professionals */}
      <div className="anim-in d4"><div className="section-header"><h2 className="section-title">Destaques</h2><button onClick={()=>nav("search")} className="link-btn">Ver todos</button></div>
      <div className="pro-list">{PROS.slice(0,4).map((p,i)=><ProCard key={p.id} p={p} onClick={()=>nav("profile",p)} fav={favs[p.id]} onFav={()=>setFavs(f=>({...f,[p.id]:!f[p.id]}))} i={i}/>)}</div></div>

      {/* CTA - PROFESSIONAL CONVERSION */}
      <div className="anim-in d5" style={{ padding:"8px 16px 0" }}>
        <div style={{ background:`linear-gradient(135deg, ${C.pri} 0%, ${C.priDk} 100%)`, borderRadius:16, padding:22, position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:-20, right:-20, width:90, height:90, borderRadius:"50%", background:C.acc, opacity:0.15 }}/>
          <h3 style={{ fontFamily:font.d, fontSize:20, fontWeight:800, color:"#fff", marginBottom:8, position:"relative" }}>🎯 Você é profissional?</h3>
          <p style={{ fontSize:13, color:"rgba(255,255,255,0.85)", lineHeight:1.6, marginBottom:4, position:"relative" }><strong>Receba clientes direto do seu celular</strong></p>
          <p style={{ fontSize:12, color:"rgba(255,255,255,0.7)", lineBottom:1.5, marginBottom:16, position:"relative" }}>✅ 7 dias grátis (sem cartão) · ✅ Fatura em PIX · ✅ +2500 profissionais já ganhando</p>
          <button onClick={()=>{trackEvent('Lead'); nav("register");}} style={{ width:"100%", padding:"15px", fontSize:15, fontWeight:800, background:C.acc, color:"#fff", border:"none", borderRadius:12, cursor:"pointer", fontFamily:font.d, transition:"transform .1s", letterSpacing:"0.5px" }} onTouchStart={e=>e.currentTarget.style.transform="scale(0.97)"} onTouchEnd={e=>e.currentTarget.style.transform="scale(1)"}>CADASTRE-SE AGORA → 7 DIAS GRÁTIS</button>
          <div style={{ marginTop:12, display:"flex", gap:6, fontSize:11, color:"rgba(255,255,255,0.6)", justifyContent:"space-between" }}>
            <span>⏰ Oferta válida por tempo limitado</span>
            <button onClick={()=>nav("plans")} style={{ background:"none", border:"none", color:"rgba(255,255,255,0.8)", cursor:"pointer", textDecoration:"underline", fontSize:11 }}>Ver planos</button>
          </div>
        </div>
      </div>

      <div style={{ padding:"10px 16px 0" }}>
        <div onClick={()=>nav("advertise")} className="ad-cta"><div><div style={{ fontFamily:font.d, fontSize:13, fontWeight:700, color:"#92600A" }}>📢 Anuncie no Banner</div><div style={{ fontSize:11, color:"#92600A", opacity:.7, marginTop:1 }}>Destaque para milhares de clientes</div></div>{I.arrow("#92600A",16)}</div>
      </div>
    </div>
  );
}

function ProCard({ p, onClick, fav, onFav, i }) {
  return (
    <div className={`pro-card anim-slide d${i+1}`} onClick={onClick}>
      <Avatar ini={p.av} size={48} badge={p.badge}/>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:5, marginBottom:2 }}>
          <span style={{ fontFamily:font.d, fontSize:14, fontWeight:700, color:C.dk, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{p.name}</span>
          {p.badge&&<Badge type={p.badge}/>}
          {p.emergency24h&&<Badge type="emergency"/>}
        </div>
        <div style={{ fontSize:12, color:C.g, marginBottom:3 }}>{p.role}</div>
        <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:11 }}>
          <span style={{ display:"flex", alignItems:"center", gap:2 }}>{I.star(C.acc,12)} <b style={{ color:C.dk }}>{p.rating}</b><span style={{ color:C.gL }}>({p.reviews})</span></span>
          <span style={{ display:"flex", alignItems:"center", gap:2, color:C.gL }}>{I.pin(C.gL,11)} {p.city.split(",")[0]}</span>
        </div>
      </div>
      <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:6, flexShrink:0 }}>
        <button onClick={e=>{e.stopPropagation();onFav();}} style={{ background:"none", border:"none", cursor:"pointer", padding:4 }}>{I.heart(C.gB,18,fav)}</button>
        <div style={{ fontSize:11, fontWeight:700, color:C.pri }}>R$ {p.price.split("R$ ")[1]}</div>
        <div style={{ width:7, height:7, borderRadius:"50%", background:p.on?C.green:C.gL }}/>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// SCREEN: PROFILE (complete with all data + rating + social)
// ══════════════════════════════════════════════════════════════
function Profile({ nav, data }) {
  const p = data || PROS[0];
  const [fav, setFav] = useState(false);
  const [toast, setToast] = useState("");
  const [showRate, setShowRate] = useState(false);
  const [myRating, setMyRating] = useState(0);
  const [myComment, setMyComment] = useState("");
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const hasSocial = p.badge === "premium" || p.badge === "pro";
  const showToast=(m)=>{setToast(m);setTimeout(()=>setToast(""),2500);};

  const submitRating = () => {
    if(myRating===0) return;
    const mod = moderateText(myComment);
    if(!mod.safe) {
      showToast("⚠️ Comentário contém linguagem inadequada. Foi ajustado.");
      setMyComment(mod.cleaned);
      return;
    }
    setRatingSubmitted(true); setShowRate(false);
    playNotifSound();
    showToast(`Avaliação de ${myRating} estrela${myRating>1?"s":""} enviada!`);
  };

  // Track profile view
  useEffect(()=>{trackEvent("ViewContent",{content_name:p.name,content_category:p.role});},[]);

  const openWhatsApp = () => {
    trackEvent("Contact",{content_name:p.name});
    const msg = encodeURIComponent(`Olá ${p.name}! Vi seu perfil no TáNaMão Brasil e gostaria de um orçamento.`);
    window.open(`https://wa.me/${p.whatsapp}?text=${msg}`, "_blank");
  };

  return (
    <div className="screen-content" style={{ paddingBottom:90 }}>
      {/* Cover Photo */}
      <div style={{ position:"relative" }}>
        <div style={{ height:160, background:p.badge==="premium"?`linear-gradient(135deg, ${C.acc}88 0%, ${C.pri} 100%)`:p.badge==="pro"?`linear-gradient(135deg, ${C.cor}88 0%, ${C.pri} 100%)`:`linear-gradient(135deg, ${C.priLt} 0%, ${C.pri}44 100%)`, position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:-30, right:-30, width:120, height:120, borderRadius:"50%", background:"rgba(255,255,255,0.08)" }}/>
          <div style={{ position:"absolute", bottom:-40, left:-20, width:140, height:140, borderRadius:"50%", background:"rgba(255,255,255,0.05)" }}/>
          <div style={{ position:"absolute", bottom:8, right:8, background:"rgba(0,0,0,0.3)", borderRadius:8, padding:"4px 8px", fontSize:10, color:"#fff", display:"flex", alignItems:"center", gap:4, cursor:"pointer" }}>📷 Capa</div>
        </div>
        {/* Back + Fav buttons over cover */}
        <div style={{ position:"absolute", top:12, left:12, right:12, display:"flex", justifyContent:"space-between" }}>
          <button onClick={()=>nav("back")} style={{ width:38, height:38, borderRadius:12, border:"none", background:"rgba(0,0,0,0.3)", backdropFilter:"blur(8px)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>{I.back("#fff",20)}</button>
          <button onClick={()=>setFav(!fav)} style={{ width:38, height:38, borderRadius:12, border:"none", background:"rgba(0,0,0,0.3)", backdropFilter:"blur(8px)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>{I.heart("#fff",20,fav)}</button>
        </div>
        {/* Profile Photo overlapping cover */}
        <div style={{ position:"absolute", bottom:-40, left:"50%", transform:"translateX(-50%)" }}>
          <div style={{ position:"relative" }}>
            <div style={{ width:88, height:88, borderRadius:26, border:`4px solid ${C.w}`, boxShadow:"0 4px 12px rgba(0,0,0,0.1)", overflow:"hidden" }}>
              <Avatar ini={p.av} size={80} badge={p.badge}/>
            </div>
            <div style={{ position:"absolute", bottom:0, right:-4, width:28, height:28, borderRadius:9, background:C.pri, border:`2.5px solid ${C.w}`, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
              <span style={{ fontSize:12 }}>📷</span>
            </div>
          </div>
        </div>
      </div>

      {/* Name & Info (below cover) */}
      <div style={{ textAlign:"center", padding:"48px 16px 16px" }}>
        <h2 style={{ fontFamily:font.d, fontSize:22, fontWeight:800, color:C.dk }}>{p.name}</h2>
        <div style={{ fontSize:13, color:C.g, marginTop:3 }}>{p.role}</div>
        <div style={{ display:"flex", justifyContent:"center", gap:4, marginTop:6, alignItems:"center" }}>{I.pin(C.gL,13)}<span style={{ fontSize:12, color:C.gL }}>{p.city}</span></div>
        {p.badge&&<div style={{ marginTop:8 }}><Badge type={p.badge}/></div>}
      </div>

      {/* Stats */}
      <div className="profile-stats">
        <div className="pstat"><div className="pstat-v">{I.star(C.acc,16)} {p.rating}</div><div className="pstat-l">Avaliação</div></div>
        <div className="pstat-divider"/>
        <div className="pstat"><div className="pstat-v">{p.reviews}</div><div className="pstat-l">Avaliações</div></div>
        <div className="pstat-divider"/>
        <div className="pstat"><div className="pstat-v">{p.jobs||"—"}</div><div className="pstat-l">Serviços</div></div>
        <div className="pstat-divider"/>
        <div className="pstat"><div className="pstat-v">👁 {p.views||0}</div><div className="pstat-l">Visualizações</div></div>
        <div className="pstat-divider"/>
        <div className="pstat"><div className="pstat-v" style={{ color:p.on?C.green:C.gL, fontSize:13 }}>{p.on?"Online":"Offline"}</div><div className="pstat-l">Status</div></div>
      </div>

      {/* About */}
      <div style={{ padding:"0 16px 14px" }}>
        <h3 className="profile-section-title">Sobre</h3>
        <p style={{ fontSize:13, color:C.g, lineHeight:1.65 }}>{p.desc}</p>
        {p.categories&&<div style={{ display:"flex", gap:6, flexWrap:"wrap", marginTop:8 }}>{p.categories.map((c,i)=><span key={i} style={{ background:C.priLt, color:C.pri, fontSize:11, fontWeight:600, padding:"4px 10px", borderRadius:8 }}>{c}</span>)}</div>}
        <div style={{ fontSize:11, color:C.gL, marginTop:8 }}>🗓️ No TáNaMão desde {p.since}</div>
        {p.emergency24h&&<div style={{ marginTop:8, background:"#FEE2E2", borderRadius:10, padding:"10px 14px", display:"flex", alignItems:"center", gap:8 }}><span style={{ fontSize:18 }}>🚨</span><div><div style={{ fontFamily:font.d, fontSize:13, fontWeight:700, color:"#DC2626" }}>Atendimento 24 horas</div><div style={{ fontSize:11, color:"#991B1B" }}>Disponível para emergências a qualquer hora</div></div></div>}
      </div>

      {/* Contact Info */}
      <div style={{ padding:"0 16px 14px" }}>
        <h3 className="profile-section-title">Contato</h3>
        <div className="info-card">
          <div className="info-row">{I.phone(C.pri,15)}<span>{p.phone}</span></div>
          <div className="info-row">{I.whatsapp("#25D366",15)}<span>{p.phone}</span><button onClick={openWhatsApp} className="info-action" style={{background:"#25D366"}}>Chamar</button></div>
          <div className="info-row">{I.mail(C.pri,15)}<span style={{ fontSize:12 }}>{p.email}</span></div>
          <div className="info-row">{I.pin(C.pri,15)}<span style={{ fontSize:12, lineHeight:1.4 }}>{p.address}</span></div>
          <div className="info-row">{I.clock(C.pri,15)}<span style={{ fontSize:12 }}>{p.hours}</span></div>
        </div>
      </div>

      {/* Social Media */}
      <div style={{ padding:"0 16px 14px" }}>
        <h3 className="profile-section-title">Redes Sociais {!hasSocial&&<span style={{ fontSize:11, color:C.gL, fontWeight:400 }}>(Pro+)</span>}</h3>
        <div className="info-card">
          <SocialLink type="ig" handle={p.social?.ig} locked={!hasSocial}/>
          <SocialLink type="fb" handle={p.social?.fb} locked={!hasSocial}/>
          <SocialLink type="li" handle={p.social?.li} locked={!hasSocial}/>
          {!hasSocial&&<div style={{ fontSize:11, color:C.cor, marginTop:4, cursor:"pointer" }} onClick={()=>nav("plans")}>🔓 Assine Pro para exibir redes sociais</div>}
        </div>
      </div>

      {/* Portfolio */}
      <div style={{ padding:"0 16px 14px" }}>
        <h3 className="profile-section-title">Portfólio</h3>
        <div className="portfolio-grid">{[1,2,3,4,5,6].map(i=><div key={i} className="portfolio-item"><span style={{ fontSize:11, color:C.gL }}>📷 {i}</span></div>)}</div>
      </div>

      {/* Price */}
      <div style={{ padding:"0 16px 14px" }}>
        <div className="price-card">
          <div><div style={{ fontSize:11, color:C.g }}>A partir de</div><div style={{ fontFamily:font.d, fontSize:22, fontWeight:800, color:C.pri }}>{p.price}</div></div>
          <Btn v="primary" sz="sm" onClick={()=>showToast("Orçamento solicitado!")}>Solicitar</Btn>
        </div>
      </div>

      {/* ★ RATE THIS PROFESSIONAL */}
      <div style={{ padding:"0 16px 14px" }}>
        <h3 className="profile-section-title">Avaliar profissional</h3>
        {ratingSubmitted ? (
          <div className="info-card" style={{ textAlign:"center", padding:16 }}>
            <div style={{ fontSize:24, marginBottom:6 }}>✅</div>
            <div style={{ fontFamily:font.d, fontSize:14, fontWeight:700 }}>Avaliação enviada!</div>
            <div style={{ display:"flex", justifyContent:"center", marginTop:6 }}><StarRating value={myRating} readonly size={18}/></div>
          </div>
        ) : showRate ? (
          <div className="info-card" style={{ padding:16 }}>
            <div style={{ textAlign:"center", marginBottom:12 }}>
              <div style={{ fontSize:13, color:C.g, marginBottom:8 }}>Toque nas estrelas para avaliar</div>
              <StarRating value={myRating} onChange={setMyRating} size={32}/>
              {myRating>0&&<div style={{ fontFamily:font.d, fontSize:13, fontWeight:700, color:C.acc, marginTop:6 }}>{myRating} estrela{myRating>1?"s":""}</div>}
            </div>
            <textarea value={myComment} onChange={e=>setMyComment(e.target.value)} placeholder="Conte como foi sua experiência (opcional)..." className="form-input" style={{ minHeight:60, resize:"vertical", marginBottom:10 }} onFocus={e=>e.target.style.borderColor=C.pri} onBlur={e=>e.target.style.borderColor=C.gB}/>
            <div style={{ display:"flex", gap:8 }}>
              <Btn v="ghost" full sz="sm" onClick={()=>setShowRate(false)}>Cancelar</Btn>
              <Btn v="primary" full sz="sm" onClick={submitRating} style={{ opacity:myRating===0?0.5:1 }}>Enviar</Btn>
            </div>
          </div>
        ) : (
          <Btn v="outline" full sz="md" onClick={()=>setShowRate(true)}>⭐ Avaliar {p.name.split(" ")[0]}</Btn>
        )}
      </div>

      {/* Reviews */}
      <div style={{ padding:"0 16px 14px" }}>
        <h3 className="profile-section-title">Avaliações ({p.userReviews?.length||0})</h3>
        {(p.userReviews||[]).map((rv,i)=>
          <div key={i} className="review-card">
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
              <span style={{ fontFamily:font.d, fontSize:13, fontWeight:700 }}>{rv.n}</span>
              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                <StarRating value={rv.r} readonly size={12}/>
                <button onClick={(e)=>{e.stopPropagation();showToast("🚩 Denúncia enviada para moderação");}} style={{ background:"none", border:"none", cursor:"pointer", fontSize:10, color:C.gL, padding:2 }} title="Denunciar">🚩</button>
              </div>
            </div>
            <p style={{ fontSize:12, color:C.g, lineHeight:1.5, marginBottom:3 }}>{rv.t}</p>
            <span style={{ fontSize:10, color:C.gL }}>{rv.d}</span>
          </div>
        )}
      </div>

      {/* Fixed bottom: Chat + WhatsApp */}
      <div className="fixed-bottom">
        <Btn v="outline" full onClick={()=>nav("chatview",p)}>💬 Chat</Btn>
        <Btn v="whatsapp" full style={{ flex:1.5 }} onClick={openWhatsApp}>{I.whatsapp("#fff",16)} WhatsApp</Btn>
      </div>
      <Toast msg={toast} visible={!!toast}/>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// SCREEN: CHAT VIEW (with notification sound)
// ══════════════════════════════════════════════════════════════
function ChatView({ nav, data }) {
  const p=data||PROS[0];
  const [msgs, setMsgs] = useState([
    { from:"them", text:"Olá! Vi seu perfil no TáNaMão.", time:"10:30" },
    { from:"them", text:"Preciso de um orçamento.", time:"10:31" },
    { from:"me", text:"Oi! Claro, posso te ajudar. Qual a metragem?", time:"10:32" },
    { from:"them", text:"Apartamento de 70m², 2 quartos.", time:"10:33" },
  ]);
  const [input, setInput] = useState("");
  const endRef = useRef(null);
  useEffect(()=>{endRef.current?.scrollIntoView({behavior:"smooth"});},[msgs]);

  // Simulate incoming message with notification sound
  useEffect(()=>{
    const t = setTimeout(()=>{
      setMsgs(m=>[...m, { from:"them", text:"Consegue vir amanhã pela manhã?", time:new Date().toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"}) }]);
      playNotifSound();
    }, 8000);
    return ()=>clearTimeout(t);
  },[]);

  const send=()=>{
    if(!input.trim()) return;
    setMsgs(m=>[...m,{from:"me",text:input,time:new Date().toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})}]);
    setInput(""); playNotifSound();
  };

  const openWhatsApp=()=>{
    trackEvent("Contact",{content_name:p.name});
    if(p.whatsapp){
      const msg=encodeURIComponent(`Olá ${p.name}! Continuando nossa conversa do TáNaMão...`);
      window.open(`https://wa.me/${p.whatsapp}?text=${msg}`,"_blank");
    }
  };

  return (
    <div className="screen-content" style={{ display:"flex", flexDirection:"column", height:"100%" }}>
      <div style={{ padding:"10px 16px", display:"flex", alignItems:"center", gap:10, borderBottom:`1px solid ${C.gB}`, background:C.w }}>
        <button onClick={()=>nav("back")} style={{ width:36, height:36, borderRadius:10, border:"none", background:C.gBg, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{I.back(C.dk,18)}</button>
        <Avatar ini={p.av} size={36} badge={p.badge}/>
        <div style={{ flex:1 }}><div style={{ fontFamily:font.d, fontSize:14, fontWeight:700 }}>{p.name}</div><div style={{ fontSize:10, color:C.green }}>online</div></div>
        <button onClick={openWhatsApp} style={{ width:36, height:36, borderRadius:10, border:"none", background:"#E6F9EE", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>{I.whatsapp("#25D366",18)}</button>
      </div>
      <div style={{ flex:1, overflow:"auto", padding:"12px 16px", display:"flex", flexDirection:"column", gap:6 }}>
        {msgs.map((m,i)=><div key={i} style={{ display:"flex", justifyContent:m.from==="me"?"flex-end":"flex-start" }}><div className={`msg-bubble ${m.from}`}><div>{m.text}</div><div style={{ fontSize:9, color:m.from==="me"?"rgba(255,255,255,0.6)":C.gL, marginTop:3, textAlign:"right" }}>{m.time}</div></div></div>)}
        <div ref={endRef}/>
      </div>
      <div className="chat-input-bar">
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Digite sua mensagem..." style={{ flex:1, border:"none", outline:"none", background:"transparent", fontSize:14, fontFamily:font.b, color:C.dk }}/>
        <button onClick={send} style={{ width:40, height:40, borderRadius:12, background:C.pri, border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{I.send("#fff",18)}</button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// REMAINING SCREENS (Categories, Search, ChatList, Notifs, Plans, Register, Advertise, Settings)
// ══════════════════════════════════════════════════════════════
function Categories({ nav }) {
  return (<div className="screen-content"><TopBar title="Categorias" onBack={()=>nav("home")}/><div className="cat-grid">{CATEGORIES.map((c,i)=><div key={i} className={`cat-grid-card anim-in d${Math.min(i%6+1,6)}`} onClick={()=>nav("search")}><div style={{ fontSize:30, marginBottom:6 }}>{c.icon}</div><div style={{ fontSize:12, fontWeight:700, color:C.dk, fontFamily:font.d }}>{c.name}</div><div style={{ fontSize:10, color:C.gL, marginTop:2 }}>{c.count} prof.</div></div>)}</div></div>);
}

function Search({ nav }) {
  const [fl,setFl]=useState("todos"); const [favs,setFavs]=useState({});
  const filtered=PROS.filter(p=>{if(fl==="premium")return p.badge==="premium";if(fl==="pro")return p.badge==="pro";if(fl==="disponíveis")return p.on;if(fl==="24h")return p.emergency24h;return true;});
  return (<div className="screen-content"><TopBar title="Profissionais" onBack={()=>nav("home")}/><div className="filter-scroll">{["todos","premium","pro","24h","disponíveis"].map(f=><button key={f} onClick={()=>setFl(f)} className={`filter-chip ${fl===f?"active":""}`}>{f==="24h"?"🚨 24h":f}</button>)}</div><div className="pro-list" style={{padding:"4px 16px 0"}}>{filtered.map((p,i)=><ProCard key={p.id} p={p} onClick={()=>nav("profile",p)} fav={favs[p.id]} onFav={()=>setFavs(f=>({...f,[p.id]:!f[p.id]}))} i={i}/>)}</div></div>);
}

function ChatList({ nav }) {
  const chats=[
    {name:"Carlos Silva",msg:"Posso ir amanhã às 14h?",time:"10:32",unread:2,av:"CS",role:"Eletricista"},
    {name:"Ana Oliveira",msg:"Segue o orçamento 📎",time:"Ontem",unread:0,av:"AO",role:"Designer"},
    {name:"Fernanda Lima",msg:"Confirmado! Até sábado 💇‍♀️",time:"Seg",unread:1,av:"FL",role:"Cabeleireira"},
    {name:"Lucas Mendes",msg:"Qual o modelo do split?",time:"12/06",unread:0,av:"LM",role:"Técnico AC"},
  ];
  return (<div className="screen-content"><div style={{padding:"14px 16px 0",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:`1px solid ${C.gB}`,paddingBottom:12}}><h2 style={{fontFamily:font.d,fontSize:22,fontWeight:800}}>Mensagens</h2><span style={{fontSize:12,color:C.pri,fontWeight:600}}>3 novas</span></div><div className="pro-list" style={{padding:"8px 16px 0"}}>{chats.map((ch,i)=><div key={i} className={`chat-item anim-in d${i+1}`} onClick={()=>{playNotifSound();nav("chatview",PROS.find(p=>p.av===ch.av)||{av:ch.av,name:ch.name,role:ch.role})}}><Avatar ini={ch.av} size={48}/><div style={{flex:1,minWidth:0}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:2}}><span style={{fontFamily:font.d,fontSize:14,fontWeight:700}}>{ch.name}</span><span style={{fontSize:10,color:C.gL}}>{ch.time}</span></div><div style={{fontSize:12,color:C.g,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{ch.msg}</div></div>{ch.unread>0&&<div className="unread-badge">{ch.unread}</div>}</div>)}</div></div>);
}

function Notifs({ nav, trial, trialNotifs }) {
  const baseNotifs=[
    {type:"review",title:"Nova avaliação",msg:"Carlos Silva recebeu 5 estrelas",time:"2h",icon:"⭐"},
    {type:"msg",title:"Nova mensagem",msg:"Fernanda Lima enviou uma mensagem",time:"4h",icon:"💬"},
    {type:"promo",title:"Oferta especial",msg:"Assine Pro com 30% OFF esta semana",time:"1d",icon:"🔥"},
    {type:"system",title:"Perfil atualizado",msg:"Suas alterações foram salvas",time:"2d",icon:"✅"},
  ];
  const planNotifs = trial.active && trial.daysLeft<=5 ? [
    {type:"trial",title:`⏰ Trial expira em ${trial.daysLeft} dia${trial.daysLeft>1?"s":""}`,msg:trial.daysLeft<=2?"Última chance! Assine para manter os recursos.":"Assine agora e não perca os benefícios Pro.",time:"Hoje",icon:"⏰"},
    ...Array.from({length:Math.min(trial.daysLeft-1,4)},(_,i)=>({type:"trial",title:`Trial: ${trial.daysLeft-i-1} dia${trial.daysLeft-i-1>1?"s":""} restante${trial.daysLeft-i-1>1?"s":""}`,msg:"Seu período de teste está acabando.",time:`${i+1}d`,icon:"📅"})),
  ] : [];
  const allNotifs = [...planNotifs, ...baseNotifs];

  return (<div className="screen-content"><TopBar title="Notificações" onBack={()=>nav("home")}/><div style={{padding:"8px 16px"}}>{allNotifs.map((n,i)=><div key={i} className={`notif-item anim-in d${Math.min(i+1,6)}`} style={{background:n.type==="trial"?C.corLt:"transparent",borderRadius:n.type==="trial"?12:0,padding:n.type==="trial"?"12px":"14px 0"}} onClick={()=>n.type==="trial"&&nav("plans")}><div className="notif-icon" style={{background:n.type==="trial"?C.cor+"20":C.gBg}}>{n.icon}</div><div style={{flex:1}}><div style={{fontFamily:font.d,fontSize:13,fontWeight:700,marginBottom:1,color:n.type==="trial"?C.cor:C.dk}}>{n.title}</div><div style={{fontSize:12,color:C.g}}>{n.msg}</div></div><span style={{fontSize:10,color:C.gL,flexShrink:0}}>{n.time}</span></div>)}</div></div>);
}

function PlansScreen({ nav, trial }) {
  const [toast,setToast]=useState("");const [selected,setSelected]=useState(null);
  const showToast=(m)=>{setToast(m);setTimeout(()=>setToast(""),3000);};
  const handlePlan=(pl)=>{
    if(pl.name==="Free"){showToast("Você já está no plano Free");return;}
    setSelected(pl);
  };
  const confirmPlan=()=>{trackEvent("Subscribe",{value:selected.price,currency:"BRL",plan:selected.name});playNotifSound();setSelected(null);setPayment(selected);};
  const [payment,setPayment]=useState(null);
  const processPayment=(method)=>{playNotifSound();showToast(`✅ Plano ${payment.name} ativado via ${method}!`);setPayment(null);};

  return (<div className="screen-content"><TopBar title="Planos" onBack={()=>nav("home")}/>
    {trial.active&&<div style={{margin:"12px 16px 0",padding:"14px 16px",borderRadius:14,background:`linear-gradient(135deg,${C.cor},#C9432A)`,color:"#fff"}}><div style={{fontFamily:font.d,fontSize:15,fontWeight:800}}>🎁 Trial ativo: {trial.daysLeft} dias restantes</div><div style={{fontSize:12,opacity:.8,marginTop:2}}>Todos os recursos Pro liberados. Após o trial, volta ao plano Free.</div></div>}
    <div style={{padding:"16px",textAlign:"center"}}><h3 className="anim-in" style={{fontFamily:font.d,fontSize:22,fontWeight:900,color:C.dk,marginBottom:4}}>Escolha seu plano</h3><p className="anim-in d1" style={{fontSize:13,color:C.g}}>7 dias grátis ao cadastrar. Depois, escolha o melhor plano.</p></div>
    <div style={{padding:"0 16px",display:"flex",flexDirection:"column",gap:14}}>{PLANS.map((pl,i)=><div key={i} className={`plan-card anim-in d${i+2} ${pl.pop?"popular":""}`} style={{borderColor:pl.pop?pl.color:C.gB}}>{pl.pop&&<div className="pop-ribbon" style={{background:pl.color}}>POPULAR</div>}<div className="plan-badge" style={{background:pl.bg}}><span style={{fontFamily:font.d,fontSize:13,fontWeight:800,color:pl.color}}>{pl.name}</span></div><div style={{display:"flex",alignItems:"baseline",gap:4,margin:"12px 0"}}><span style={{fontFamily:font.d,fontSize:32,fontWeight:900,color:C.dk}}>{pl.price}</span><span style={{fontSize:13,color:C.gL}}>/mês</span></div><div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:16}}>{pl.feats.map((f,j)=><div key={j} style={{display:"flex",alignItems:"flex-start",gap:8}}><span style={{flexShrink:0,marginTop:2}}>{I.check(pl.color,14)}</span><span style={{fontSize:13,color:C.dk,lineHeight:1.4}}>{f}</span></div>)}</div><Btn v={pl.pop?"coral":pl.name==="Premium"?"accent":"outline"} full sz="lg" onClick={()=>handlePlan(pl)}>{pl.cta}</Btn></div>)}</div>

    {/* Confirmation Modal */}
    {selected&&<div onClick={()=>setSelected(null)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:20,animation:"fadeIn .2s ease"}}><div onClick={e=>e.stopPropagation()} style={{background:C.w,borderRadius:20,padding:24,maxWidth:340,width:"100%",textAlign:"center"}}><div style={{fontSize:36,marginBottom:12}}>{selected.name==="Pro"?"⚡":"👑"}</div><h3 style={{fontFamily:font.d,fontSize:20,fontWeight:900,marginBottom:6}}>Assinar {selected.name}</h3><div style={{fontFamily:font.d,fontSize:28,fontWeight:900,color:selected.color,marginBottom:4}}>{selected.price}<span style={{fontSize:14,color:C.gL,fontWeight:400}}>/mês</span></div><p style={{fontSize:13,color:C.g,marginBottom:20,lineHeight:1.5}}>Você terá acesso a todos os recursos do plano {selected.name}. Pode cancelar a qualquer momento.</p><div style={{display:"flex",gap:8}}><Btn v="ghost" full onClick={()=>setSelected(null)}>Cancelar</Btn><Btn v={selected.name==="Pro"?"coral":"accent"} full onClick={confirmPlan}>Confirmar</Btn></div></div></div>}

    {/* Payment Modal */}
    {payment&&<div onClick={()=>setPayment(null)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",zIndex:210,display:"flex",alignItems:"flex-end",justifyContent:"center",animation:"fadeIn .2s ease"}}><div onClick={e=>e.stopPropagation()} style={{background:C.w,borderRadius:"20px 20px 0 0",padding:24,maxWidth:480,width:"100%",animation:"sheetUp .3s ease"}}>
      <div style={{display:"flex",justifyContent:"center",marginBottom:8}}><div style={{width:36,height:4,borderRadius:2,background:C.gB}}/></div>
      <h3 style={{fontFamily:font.d,fontSize:18,fontWeight:900,marginBottom:4,textAlign:"center"}}>Pagamento</h3>
      <p style={{fontSize:13,color:C.g,textAlign:"center",marginBottom:16}}>Plano {payment.name} — {payment.price}/mês</p>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        <button onClick={()=>processPayment("Mercado Pago")} style={{display:"flex",alignItems:"center",gap:12,padding:"16px",borderRadius:14,border:`2px solid ${C.gB}`,background:"#fff",cursor:"pointer",textAlign:"left",fontFamily:font.b,transition:"border-color .2s"}} onMouseEnter={e=>e.currentTarget.style.borderColor=C.blue} onMouseLeave={e=>e.currentTarget.style.borderColor=C.gB}>
          <div style={{width:44,height:44,borderRadius:12,background:"#009EE3",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:800,fontSize:14}}>MP</div>
          <div style={{flex:1}}><div style={{fontSize:14,fontWeight:700,color:C.dk}}>Mercado Pago</div><div style={{fontSize:11,color:C.gL}}>Cartão, Pix, boleto</div></div>{I.arrow(C.gL,14)}
        </button>
        <button onClick={()=>processPayment("Pix")} style={{display:"flex",alignItems:"center",gap:12,padding:"16px",borderRadius:14,border:`2px solid ${C.gB}`,background:"#fff",cursor:"pointer",textAlign:"left",fontFamily:font.b,transition:"border-color .2s"}} onMouseEnter={e=>e.currentTarget.style.borderColor=C.pri} onMouseLeave={e=>e.currentTarget.style.borderColor=C.gB}>
          <div style={{width:44,height:44,borderRadius:12,background:"#32BCAD",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>⚡</div>
          <div style={{flex:1}}><div style={{fontSize:14,fontWeight:700,color:C.dk}}>Pix</div><div style={{fontSize:11,color:C.gL}}>Aprovação instantânea</div></div>{I.arrow(C.gL,14)}
        </button>
        <button onClick={()=>processPayment("Cartão de Crédito")} style={{display:"flex",alignItems:"center",gap:12,padding:"16px",borderRadius:14,border:`2px solid ${C.gB}`,background:"#fff",cursor:"pointer",textAlign:"left",fontFamily:font.b,transition:"border-color .2s"}} onMouseEnter={e=>e.currentTarget.style.borderColor=C.acc} onMouseLeave={e=>e.currentTarget.style.borderColor=C.gB}>
          <div style={{width:44,height:44,borderRadius:12,background:C.accLt,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>💳</div>
          <div style={{flex:1}}><div style={{fontSize:14,fontWeight:700,color:C.dk}}>Cartão de Crédito</div><div style={{fontSize:11,color:C.gL}}>Até 12x sem juros</div></div>{I.arrow(C.gL,14)}
        </button>
      </div>
      <div style={{textAlign:"center",marginTop:14}}><span style={{fontSize:11,color:C.gL}}>🔒 Pagamento seguro e criptografado</span></div>
    </div></div>}

    <Toast msg={toast} visible={!!toast}/>
  </div>);
}

function Register({ nav }) {
  const [type,setType]=useState(null);const [step,setStep]=useState(0);const [toast,setToast]=useState("");
  const accent=type==="pro"?C.pri:type==="emp"?C.acc:C.cor;
  const InputF=({ph,type:t})=><input placeholder={ph} type={t||"text"} className="form-input" onFocus={e=>e.target.style.borderColor=accent} onBlur={e=>e.target.style.borderColor=C.gB}/>;

  if(step===0) return (<div className="screen-content"><TopBar title="Cadastro" onBack={()=>nav("home")}/><div style={{padding:"24px 16px",textAlign:"center"}}><Logo size={56}/><h2 className="anim-in" style={{fontFamily:font.d,fontSize:24,fontWeight:900,marginTop:16,marginBottom:6}}>Junte-se ao TáNaMão</h2><p className="anim-in d1" style={{fontSize:13,color:C.g,marginBottom:4}}>7 dias grátis com todos os recursos Pro!</p><p className="anim-in d2" style={{fontSize:11,color:C.gL,marginBottom:24}}>Após o trial, volta ao plano Free automaticamente.</p>
    <div style={{display:"flex",flexDirection:"column",gap:12}}>{[
      {k:"pro",icon:I.briefcase(C.pri),t:"Sou Profissional",s:"Autônomo ou prestador de serviço",c:C.pri,bg:C.priLt},
      {k:"emp",icon:I.building(C.acc),t:"Sou Empresa",s:"Empresa, agência ou escritório",c:C.acc,bg:C.accLt},
      {k:"cli",icon:I.user(C.cor),t:"Busco Profissional",s:"Quero contratar um serviço",c:C.cor,bg:C.corLt},
    ].map((o,i)=><div key={o.k} className={`reg-option anim-in d${i+2}`} onClick={()=>{setType(o.k);setStep(1);}}><div className="reg-icon" style={{background:o.bg}}>{o.icon}</div><div style={{flex:1}}><div style={{fontFamily:font.d,fontSize:15,fontWeight:700}}>{o.t}</div><div style={{fontSize:12,color:C.g,marginTop:1}}>{o.s}</div></div>{I.arrow(o.c,16)}</div>)}</div></div></div>);

  if(step===3){trackEvent("CompleteRegistration",{registration_type:type});}
  if(step===3) return (<div className="screen-content"><TopBar title="" onBack={()=>nav("home")}/><div style={{textAlign:"center",padding:"48px 16px"}}><div className="anim-in success-icon">🎉</div><h3 className="anim-in d1" style={{fontFamily:font.d,fontSize:22,fontWeight:900,marginBottom:6}}>Cadastro realizado!</h3>
    {type!=="cli"&&<div className="anim-in d2" style={{background:C.priLt,borderRadius:12,padding:"12px 16px",marginBottom:16}}><div style={{fontFamily:font.d,fontSize:14,fontWeight:700,color:C.pri}}>🎁 7 dias grátis ativados!</div><div style={{fontSize:12,color:C.g,marginTop:2}}>Todos os recursos Pro liberados. Você será notificado 5 dias antes de expirar.</div></div>}
    <p className="anim-in d3" style={{fontSize:13,color:C.g,lineHeight:1.6,marginBottom:24}}>{type!=="cli"?"Perfil sendo verificado. Confirmação por e-mail em 24h.":"Conta criada! Busque profissionais agora."}</p>
    {type!=="cli"&&<Btn v={type==="pro"?"primary":"accent"} sz="lg" onClick={()=>nav("plans")}>Ver Planos</Btn>}
    <div style={{marginTop:10}}><Btn v="ghost" onClick={()=>nav("home")}>Ir para início</Btn></div></div></div>);

  return (<div className="screen-content"><TopBar title={type==="pro"?"Profissional":type==="emp"?"Empresa":"Cliente"} onBack={()=>setStep(s=>s-1)}/><div className="progress-bar">{[1,2,3].map(s=><div key={s} className="progress-seg" style={{background:s<=step?accent:C.gBg}}/>)}</div><div className="anim-fade" style={{padding:"20px 16px"}}>
    {step===1&&<div className="form-col"><h3 className="form-title">Dados {type==="emp"?"da empresa":"pessoais"}</h3><InputF ph={type==="emp"?"Razão Social":"Nome completo"}/><InputF ph="E-mail" type="email"/><InputF ph="Telefone / WhatsApp"/><InputF ph={type==="emp"?"CNPJ":"CPF"}/><InputF ph="Endereço completo"/><InputF ph="Cidade / Estado"/><Btn v={type==="pro"?"primary":type==="emp"?"accent":"coral"} full sz="lg" onClick={()=>setStep(2)} style={{marginTop:8}}>Continuar</Btn></div>}
    {step===2&&type!=="cli"&&<div className="form-col"><h3 className="form-title">Serviços e Perfil</h3><p style={{fontSize:12,color:C.g,marginBottom:8}}>Categorias de atuação</p><div style={{display:"flex",flexWrap:"wrap",gap:7}}>{CATEGORIES.slice(0,12).map((c,i)=><button key={i} className="cat-chip" onClick={e=>{const el=e.currentTarget;const a=el.dataset.a==="1";el.dataset.a=a?"0":"1";el.style.background=a?"#fff":accent+"14";el.style.borderColor=a?C.gB:accent;el.style.color=a?C.dk:accent;}}>{c.icon} {c.name}</button>)}</div>
      <div style={{display:"flex",gap:8,marginTop:4}}><input className="form-input" placeholder="Sua categoria não está na lista? Digite aqui..." style={{flex:1,fontSize:13}} onFocus={e=>e.target.style.borderColor=accent} onBlur={e=>e.target.style.borderColor=C.gB} id="customCat"/><Btn v={type==="pro"?"primary":"accent"} sz="sm" onClick={()=>{const inp=document.getElementById("customCat");if(inp&&inp.value.trim()){playNotifSound();inp.value="";}}}>+</Btn></div>
      <textarea className="form-input" placeholder="Descreva seus serviços..." style={{minHeight:60,resize:"vertical"}} onFocus={e=>e.target.style.borderColor=accent} onBlur={e=>e.target.style.borderColor=C.gB}/>
      <InputF ph="WhatsApp (com DDD)"/><InputF ph="Instagram (ex: @seunome)"/><InputF ph="Facebook (opcional)"/><InputF ph="LinkedIn (opcional)"/>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 0",borderTop:`1px solid ${C.gBg}`,marginTop:4}}>
        <div><div style={{fontSize:14,fontWeight:600,color:C.dk}}>🚨 Atendimento 24h</div><div style={{fontSize:11,color:C.gL,marginTop:1}}>Emergências a qualquer hora</div></div>
        <div onClick={e=>{const el=e.currentTarget;const on=el.dataset.on==="1";el.dataset.on=on?"0":"1";el.style.background=on?C.gB:C.cor;el.querySelector("div").style.transform=on?"translateX(0)":"translateX(20px)";}} style={{width:48,height:28,borderRadius:14,background:C.gB,cursor:"pointer",padding:3,transition:"background .2s"}} data-on="0"><div style={{width:22,height:22,borderRadius:11,background:"#fff",boxShadow:"0 1px 3px rgba(0,0,0,0.15)",transition:"transform .2s"}}/></div>
      </div>
      <Btn v={type==="pro"?"primary":"accent"} full sz="lg" onClick={()=>setStep(3)} style={{marginTop:8}}>Finalizar</Btn></div>}
    {step===2&&type==="cli"&&<div className="form-col"><h3 className="form-title">Segurança</h3><InputF ph="Criar senha" type="password"/><InputF ph="Confirmar senha" type="password"/><Btn v="coral" full sz="lg" onClick={()=>setStep(3)} style={{marginTop:8}}>Criar conta</Btn></div>}
  </div><Toast msg={toast} visible={!!toast}/></div>);
}

function Advertise({ nav }) {
  return (<div className="screen-content"><TopBar title="Anuncie" onBack={()=>nav("home")}/><div style={{padding:"16px"}}><div className="anim-in ad-hero"><div style={{fontSize:36,marginBottom:10}}>📢</div><h2 style={{fontFamily:font.d,fontSize:22,fontWeight:900,color:"#fff",marginBottom:6}}>Banner Publicitário</h2><p style={{fontSize:13,color:"rgba(255,255,255,0.7)",lineHeight:1.5}}>Destaque no carrossel principal.</p></div>
    <div style={{display:"flex",flexDirection:"column",gap:12,marginTop:16}}>{[
      {n:"Semanal",p:"R$ 49,90",d:"7 dias",v:"~5k views",c:C.pri},
      {n:"Mensal",p:"R$ 149,90",d:"30 dias",v:"~22k views",c:C.cor,pop:true},
      {n:"Trimestral",p:"R$ 349,90",d:"90 dias + extra",v:"~70k views",c:C.acc},
    ].map((pk,i)=><div key={i} className={`ad-pkg anim-in d${i+1} ${pk.pop?"popular":""}`} style={{borderColor:pk.pop?pk.c:C.gB}}>{pk.pop&&<span className="pkg-badge" style={{background:pk.c}}>MELHOR CUSTO</span>}<div style={{fontFamily:font.d,fontSize:15,fontWeight:700}}>{pk.n}</div><div style={{fontFamily:font.d,fontSize:26,fontWeight:900,color:pk.c,margin:"6px 0"}}>{pk.p}</div><div style={{fontSize:12,color:C.g}}>{pk.d}</div><div style={{fontSize:11,color:C.gL,marginBottom:12}}>📊 {pk.v}</div><Btn v={pk.pop?"coral":"outline"} full sz="md">Contratar</Btn></div>)}</div></div></div>);
}

// ══════════════════════════════════════════════════════════════
// SETTINGS SUB-SCREENS
// ══════════════════════════════════════════════════════════════
function EditProfile({ nav }) {
  const [toast,setToast]=useState("");
  const [name,setName]=useState("Seu Nome");
  const [phone,setPhone]=useState("(11) 99999-0000");
  const [email,setEmail]=useState("voce@email.com");
  const [wpp,setWpp]=useState("(11) 99999-0000");
  const [addr,setAddr]=useState("");
  const [bio,setBio]=useState("");
  const [profileImg,setProfileImg]=useState(null);
  const [coverImg,setCoverImg]=useState(null);
  const showToast=(m)=>{setToast(m);setTimeout(()=>setToast(""),2500);};
  const save=()=>{playNotifSound();showToast("✅ Perfil salvo com sucesso!");};

  const handleImg=(e,setter)=>{
    const file=e.target.files?.[0];
    if(file){const reader=new FileReader();reader.onload=(ev)=>setter(ev.target.result);reader.readAsDataURL(file);}
  };

  const F=({label,val,set,ph,type})=>(<div><div style={{fontSize:12,fontWeight:600,color:C.dk,marginBottom:4}}>{label}</div><input value={val} onChange={e=>set(e.target.value)} placeholder={ph} type={type||"text"} className="form-input" onFocus={e=>e.target.style.borderColor=C.pri} onBlur={e=>e.target.style.borderColor=C.gB}/></div>);

  return (<div className="screen-content"><TopBar title="Editar Perfil" onBack={()=>nav("back")}/>
    <div style={{padding:"16px"}}>
      {/* Cover Photo */}
      <div className="anim-in" style={{position:"relative",marginBottom:50}}>
        <label style={{cursor:"pointer",display:"block"}}>
          <input type="file" accept="image/*" onChange={e=>handleImg(e,setCoverImg)} style={{display:"none"}}/>
          <div style={{height:130,borderRadius:16,background:coverImg?`url(${coverImg}) center/cover`:`linear-gradient(135deg, ${C.priLt} 0%, ${C.pri}44 100%)`,display:"flex",alignItems:"center",justifyContent:"center",border:`2px dashed ${coverImg?'transparent':C.gB}`,overflow:"hidden",position:"relative"}}>
            {!coverImg&&<div style={{textAlign:"center",color:C.gL}}><div style={{fontSize:28}}>🖼️</div><div style={{fontSize:11,fontWeight:600,marginTop:4}}>Adicionar foto de capa</div></div>}
            <div style={{position:"absolute",bottom:8,right:8,background:"rgba(0,0,0,0.4)",borderRadius:8,padding:"4px 10px",fontSize:11,color:"#fff",fontWeight:600}}>📷 {coverImg?"Trocar":"Adicionar"}</div>
          </div>
        </label>
        {/* Profile Photo overlapping */}
        <label style={{cursor:"pointer",position:"absolute",bottom:-36,left:"50%",transform:"translateX(-50%)"}}>
          <input type="file" accept="image/*" onChange={e=>handleImg(e,setProfileImg)} style={{display:"none"}}/>
          <div style={{position:"relative"}}>
            <div style={{width:76,height:76,borderRadius:22,border:`3px solid ${C.w}`,boxShadow:"0 4px 12px rgba(0,0,0,0.1)",overflow:"hidden",background:profileImg?`url(${profileImg}) center/cover`:C.priLt,display:"flex",alignItems:"center",justifyContent:"center"}}>
              {!profileImg&&<span style={{fontFamily:font.d,fontWeight:800,fontSize:26,color:C.pri}}>VC</span>}
            </div>
            <div style={{position:"absolute",bottom:-2,right:-2,width:26,height:26,borderRadius:8,background:C.pri,border:`2px solid ${C.w}`,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:11}}>📷</span></div>
          </div>
        </label>
      </div>

      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        <F label="Nome completo" val={name} set={setName} ph="Seu nome"/>
        <F label="E-mail" val={email} set={setEmail} ph="email@exemplo.com" type="email"/>
        <F label="Telefone" val={phone} set={setPhone} ph="(11) 99999-0000"/>
        <F label="WhatsApp" val={wpp} set={setWpp} ph="(11) 99999-0000"/>
        <F label="Endereço" val={addr} set={setAddr} ph="Rua, número, cidade - UF"/>
        <div><div style={{fontSize:12,fontWeight:600,color:C.dk,marginBottom:4}}>Bio</div>
        <textarea value={bio} onChange={e=>setBio(e.target.value)} placeholder="Fale sobre você e seus serviços..." className="form-input" style={{minHeight:70,resize:"vertical"}} onFocus={e=>e.target.style.borderColor=C.pri} onBlur={e=>e.target.style.borderColor=C.gB}/></div>
        <Btn v="primary" full sz="lg" onClick={save} style={{marginTop:8}}>Salvar Alterações</Btn>
      </div>
    </div><Toast msg={toast} visible={!!toast}/></div>);
}

function PrivacyScreen({ nav }) {
  const [toggles,setToggles]=useState({phone:true,email:false,addr:true,online:true,reviews:true});
  const Toggle=({label,desc,k})=>(<div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 0",borderBottom:`1px solid ${C.gBg}`}}>
    <div><div style={{fontSize:14,fontWeight:600,color:C.dk}}>{label}</div><div style={{fontSize:11,color:C.gL,marginTop:1}}>{desc}</div></div>
    <div onClick={()=>setToggles(t=>({...t,[k]:!t[k]}))} style={{width:48,height:28,borderRadius:14,background:toggles[k]?C.pri:C.gB,cursor:"pointer",padding:3,transition:"background .2s",display:"flex",alignItems:toggles[k]?"center":"center",justifyContent:toggles[k]?"flex-end":"flex-start"}}>
      <div style={{width:22,height:22,borderRadius:11,background:"#fff",boxShadow:"0 1px 3px rgba(0,0,0,0.15)",transition:"all .2s"}}/>
    </div></div>);
  return (<div className="screen-content"><TopBar title="Privacidade" onBack={()=>nav("back")}/>
    <div style={{padding:"8px 16px"}}>
      <div className="anim-in" style={{background:C.priLt,borderRadius:14,padding:16,marginBottom:16}}>
        <div style={{fontFamily:font.d,fontSize:14,fontWeight:700,color:C.pri,marginBottom:4}}>🔒 Seus dados estão protegidos</div>
        <div style={{fontSize:12,color:C.g,lineHeight:1.5}}>Controle quem pode ver suas informações.</div>
      </div>
      <Toggle label="Exibir telefone" desc="Visível no seu perfil" k="phone"/>
      <Toggle label="Exibir e-mail" desc="Visível no seu perfil" k="email"/>
      <Toggle label="Exibir endereço" desc="Apenas cidade e estado" k="addr"/>
      <Toggle label="Mostrar status online" desc="Outros veem quando você está ativo" k="online"/>
      <Toggle label="Receber avaliações" desc="Clientes podem te avaliar" k="reviews"/>
    </div></div>);
}

function ModerationScreen({ nav }) {
  const [toast,setToast]=useState("");
  const showToast=(m)=>{setToast(m);setTimeout(()=>setToast(""),2500);};
  const reports=[
    {user:"Anônimo",text:"Comentário ofensivo no perfil de Carlos S.",status:"pending",time:"2h"},
    {user:"Maria R.",text:"Spam em mensagens",status:"resolved",time:"1d"},
    {user:"Sistema",text:"Palavra proibida detectada automaticamente",status:"blocked",time:"3d"},
  ];
  const statusColors={pending:{bg:C.accLt,c:"#92600A",t:"Pendente"},resolved:{bg:C.priLt,c:C.pri,t:"Resolvido"},blocked:{bg:C.corLt,c:C.cor,t:"Bloqueado"}};
  return (<div className="screen-content"><TopBar title="Moderação" onBack={()=>nav("back")}/>
    <div style={{padding:"12px 16px"}}>
      <div className="anim-in" style={{display:"flex",gap:8,marginBottom:16}}>
        {[{n:"3",l:"Pendentes",c:C.acc},{n:"12",l:"Resolvidos",c:C.pri},{n:"5",l:"Bloqueados",c:C.cor}].map((s,i)=>
          <div key={i} style={{flex:1,background:"#fff",borderRadius:12,padding:"12px 8px",border:`1.5px solid ${C.gB}`,textAlign:"center"}}>
            <div style={{fontFamily:font.d,fontSize:20,fontWeight:800,color:s.c}}>{s.n}</div>
            <div style={{fontSize:10,color:C.gL}}>{s.l}</div></div>)}
      </div>
      <h3 style={{fontFamily:font.d,fontSize:15,fontWeight:700,marginBottom:10}}>Denúncias recentes</h3>
      {reports.map((r,i)=>{const st=statusColors[r.status];return(
        <div key={i} className={`anim-in d${i+1}`} style={{background:"#fff",borderRadius:14,border:`1.5px solid ${C.gB}`,padding:14,marginBottom:8}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
            <span style={{fontFamily:font.d,fontSize:13,fontWeight:700}}>{r.user}</span>
            <span style={{background:st.bg,color:st.c,fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:6}}>{st.t}</span>
          </div>
          <div style={{fontSize:12,color:C.g,lineHeight:1.5,marginBottom:6}}>{r.text}</div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{fontSize:10,color:C.gL}}>{r.time}</span>
            {r.status==="pending"&&<div style={{display:"flex",gap:6}}>
              <button onClick={()=>showToast("✅ Denúncia resolvida")} style={{background:C.pri,color:"#fff",border:"none",borderRadius:8,padding:"4px 10px",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:font.d}}>Resolver</button>
              <button onClick={()=>showToast("🚫 Usuário bloqueado")} style={{background:C.cor,color:"#fff",border:"none",borderRadius:8,padding:"4px 10px",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:font.d}}>Bloquear</button>
            </div>}
          </div>
        </div>);})}
    </div><Toast msg={toast} visible={!!toast}/></div>);
}

function AppearanceScreen({ nav }) {
  const [dark,setDark]=useState(false);
  const [fontSize,setFontSize]=useState("normal");
  return (<div className="screen-content"><TopBar title="Aparência" onBack={()=>nav("back")}/>
    <div style={{padding:"12px 16px"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 0",borderBottom:`1px solid ${C.gBg}`}}>
        <div><div style={{fontSize:14,fontWeight:600}}>Tema escuro</div><div style={{fontSize:11,color:C.gL}}>Reduz brilho da tela</div></div>
        <div onClick={()=>setDark(!dark)} style={{width:48,height:28,borderRadius:14,background:dark?C.pri:C.gB,cursor:"pointer",padding:3,transition:"background .2s",display:"flex",alignItems:"center",justifyContent:dark?"flex-end":"flex-start"}}>
          <div style={{width:22,height:22,borderRadius:11,background:"#fff",boxShadow:"0 1px 3px rgba(0,0,0,0.15)"}}/>
        </div>
      </div>
      <div style={{padding:"16px 0"}}>
        <div style={{fontSize:14,fontWeight:600,marginBottom:10}}>Tamanho da fonte</div>
        <div style={{display:"flex",gap:8}}>
          {[{k:"small",l:"Pequena"},{k:"normal",l:"Normal"},{k:"large",l:"Grande"}].map(o=>
            <button key={o.k} onClick={()=>setFontSize(o.k)} style={{flex:1,padding:"10px",borderRadius:10,border:`2px solid ${fontSize===o.k?C.pri:C.gB}`,background:fontSize===o.k?C.priLt:"#fff",color:fontSize===o.k?C.pri:C.dk,fontWeight:fontSize===o.k?700:500,fontSize:13,cursor:"pointer",fontFamily:font.b}}>{o.l}</button>
          )}
        </div>
      </div>
      <div style={{background:C.gBg,borderRadius:14,padding:16,marginTop:8}}>
        <div style={{fontSize:12,color:C.g}}>Pré-visualização</div>
        <div style={{marginTop:8,padding:12,background:"#fff",borderRadius:10,fontSize:fontSize==="small"?12:fontSize==="large"?16:14,color:C.dk}}>Assim ficará o texto no app com a fonte {fontSize==="small"?"pequena":fontSize==="large"?"grande":"normal"}.</div>
      </div>
    </div></div>);
}

function HelpScreen({ nav }) {
  const [open,setOpen]=useState(null);
  const faqs=[
    {q:"Como me cadastrar?",a:"Vá em Perfil > Cadastro, escolha se é Profissional, Empresa ou Cliente e preencha seus dados. O cadastro é gratuito e inclui 7 dias de trial com todos os recursos Pro."},
    {q:"O trial é realmente grátis?",a:"Sim. 7 dias completos sem pedir cartão de crédito. Após o período, seu perfil volta ao plano Free automaticamente. Nenhuma cobrança surpresa."},
    {q:"Como recebo clientes?",a:"Depois de completar seu perfil, você aparece nas buscas da sua região. Clientes podem te chamar pelo chat do app ou diretamente pelo WhatsApp."},
    {q:"Como funciona a avaliação?",a:"Clientes avaliam de 1 a 5 estrelas após o serviço. Avaliações passam por moderação automática para evitar conteúdo ofensivo. Você pode denunciar avaliações indevidas."},
    {q:"Posso cancelar meu plano?",a:"Sim, a qualquer momento em Configurações > Assinatura. O acesso continua até o fim do período pago."},
    {q:"Como funciona o banner publicitário?",a:"Empresas e profissionais podem anunciar no carrossel principal do app. Pacotes a partir de R$ 49,90 por semana com milhares de impressões."},
    {q:"Meus dados estão seguros?",a:"Sim. Seus dados são protegidos e você controla a visibilidade de cada informação em Configurações > Privacidade."},
  ];
  return (<div className="screen-content"><TopBar title="Ajuda" onBack={()=>nav("back")}/>
    <div style={{padding:"12px 16px"}}>
      <div className="anim-in" style={{background:C.priLt,borderRadius:14,padding:16,marginBottom:16,textAlign:"center"}}>
        <div style={{fontSize:28,marginBottom:6}}>❓</div>
        <div style={{fontFamily:font.d,fontSize:15,fontWeight:700,color:C.pri}}>Como podemos ajudar?</div>
      </div>
      {faqs.map((f,i)=>(
        <div key={i} className={`anim-in d${Math.min(i+1,6)}`} onClick={()=>setOpen(open===i?null:i)} style={{background:"#fff",borderRadius:14,border:`1.5px solid ${open===i?C.pri:C.gB}`,padding:"14px 16px",marginBottom:8,cursor:"pointer",transition:"border-color .2s"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{fontFamily:font.d,fontSize:14,fontWeight:700,color:C.dk}}>{f.q}</span>
            <span style={{fontSize:18,color:C.gL,transition:"transform .2s",transform:open===i?"rotate(45deg)":"rotate(0)"}}>+</span>
          </div>
          {open===i&&<div style={{fontSize:13,color:C.g,lineHeight:1.6,marginTop:10,paddingTop:10,borderTop:`1px solid ${C.gBg}`}}>{f.a}</div>}
        </div>
      ))}
      <div style={{textAlign:"center",marginTop:16}}>
        <div style={{fontSize:13,color:C.g,marginBottom:8}}>Ainda precisa de ajuda?</div>
        <Btn v="outline" sz="md">📧 Enviar e-mail para suporte</Btn>
      </div>
    </div></div>);
}

function TermsScreen({ nav }) {
  return (<div className="screen-content"><TopBar title="Termos de Uso" onBack={()=>nav("back")}/>
    <div style={{padding:"12px 16px"}}>
      <div style={{background:"#fff",borderRadius:14,border:`1.5px solid ${C.gB}`,padding:20}}>
        <h3 style={{fontFamily:font.d,fontSize:17,fontWeight:800,marginBottom:12}}>Termos de Uso e Política de Privacidade</h3>
        <div style={{fontSize:13,color:C.g,lineHeight:1.7}}>
          <p style={{marginBottom:12}}><strong>1. Sobre o TáNaMão Brasil</strong><br/>O TáNaMão Brasil é uma plataforma marketplace que conecta profissionais prestadores de serviço a clientes que buscam esses serviços. A plataforma não se responsabiliza pela qualidade dos serviços prestados.</p>
          <p style={{marginBottom:12}}><strong>2. Cadastro</strong><br/>O usuário deve fornecer informações verdadeiras no cadastro. Informações falsas podem resultar em suspensão da conta. O trial de 7 dias é gratuito e não requer dados de pagamento.</p>
          <p style={{marginBottom:12}}><strong>3. Avaliações e Moderação</strong><br/>Avaliações passam por sistema de moderação automática e manual. Conteúdo ofensivo, discriminatório ou falso será removido. Usuários que violarem repetidamente serão banidos.</p>
          <p style={{marginBottom:12}}><strong>4. Planos e Pagamentos</strong><br/>Os planos Pro (R$ 29,90/mês) e Premium (R$ 69,90/mês) podem ser cancelados a qualquer momento. Não há multa de cancelamento. O reembolso é proporcional ao período não utilizado.</p>
          <p style={{marginBottom:12}}><strong>5. Privacidade</strong><br/>Seus dados pessoais são protegidos conforme a LGPD. Não compartilhamos informações com terceiros sem seu consentimento. Você pode solicitar a exclusão dos seus dados a qualquer momento.</p>
          <p><strong>6. Contato</strong><br/>Para dúvidas: suporte@tanamao.com.br</p>
        </div>
        <div style={{fontSize:11,color:C.gL,marginTop:16,textAlign:"center"}}>Última atualização: Junho 2025</div>
      </div>
    </div></div>);
}

function Settings({ nav, trial }) {
  const [showLogout,setShowLogout]=useState(false);
  const items=[
    {icon:"👤",t:"Editar Perfil",s:"Nome, foto, endereço, WhatsApp",action:()=>nav("editProfile")},
    {icon:"🔔",t:"Notificações",s:"Sons e alertas",action:()=>nav("notifs")},
    {icon:"🔒",t:"Privacidade",s:"Dados e segurança",action:()=>nav("privacy")},
    {icon:"💳",t:"Assinatura",s:trial.active?`Trial: ${trial.daysLeft} dias restantes`:"Plano Free",action:()=>nav("plans")},
    {icon:"🛡️",t:"Moderação",s:"Denúncias e bloqueios",action:()=>nav("moderation")},
    {icon:"🎨",t:"Aparência",s:"Tema e tamanho de fonte",action:()=>nav("appearance")},
    {icon:"❓",t:"Ajuda",s:"FAQ e suporte",action:()=>nav("help")},
    {icon:"📋",t:"Termos de Uso",s:"Política de privacidade",action:()=>nav("terms")},
    {icon:"🚪",t:"Sair",s:"Encerrar sessão",action:()=>setShowLogout(true)},
  ];
  return (<div className="screen-content"><TopBar title="Configurações" onBack={()=>nav("home")}/><div style={{padding:"8px 16px"}}><div className="anim-in settings-user"><Avatar ini="VC" size={52}/><div style={{flex:1}}><div style={{fontFamily:font.d,fontSize:16,fontWeight:700}}>Você</div><div style={{fontSize:12,color:trial.active?C.cor:C.g}}>{trial.active?`Trial: ${trial.daysLeft} dias`:"Plano Free"}</div></div><Btn v="primary" sz="sm" onClick={()=>nav("plans")}>Upgrade</Btn></div>
    <div style={{display:"flex",flexDirection:"column",gap:1,marginTop:12}}>{items.map((it,i)=><div key={i} className={`settings-item anim-in d${Math.min(i+1,6)}`} onClick={it.action} style={{cursor:"pointer"}}><span style={{fontSize:20}}>{it.icon}</span><div style={{flex:1}}><div style={{fontSize:14,fontWeight:600}}>{it.t}</div><div style={{fontSize:11,color:C.gL}}>{it.s}</div></div>{I.arrow(C.gL,14)}</div>)}</div>
    <div style={{textAlign:"center",marginTop:24}}><LogoText size={24}/><div style={{fontSize:11,color:C.gL,marginTop:6}}>Versão 2.2.0</div></div></div>
    {/* Logout modal */}
    {showLogout&&<div onClick={()=>setShowLogout(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:20,animation:"fadeIn .2s ease"}}><div onClick={e=>e.stopPropagation()} style={{background:C.w,borderRadius:20,padding:24,maxWidth:320,width:"100%",textAlign:"center"}}><div style={{fontSize:36,marginBottom:12}}>🚪</div><h3 style={{fontFamily:font.d,fontSize:18,fontWeight:900,marginBottom:6}}>Sair da conta?</h3><p style={{fontSize:13,color:C.g,marginBottom:20}}>Você precisará fazer login novamente.</p><div style={{display:"flex",gap:8}}><Btn v="ghost" full onClick={()=>setShowLogout(false)}>Cancelar</Btn><Btn v="coral" full onClick={()=>{setShowLogout(false);nav("home");}}>Sair</Btn></div></div></div>}
  </div>);
}

// ══════════════════════════════════════════════════════════════
// MAIN APP
// ══════════════════════════════════════════════════════════════
export default function App() {
  const [screen,setScreen]=useState("home");const [screenData,setScreenData]=useState(null);const [history,setHistory]=useState(["home"]);const scrollRef=useRef(null);
  const { trial, setTrial, trialNotifs } = useTrialSystem();

  const nav=useCallback((s,data=null)=>{if(s==="back"){const h=[...history];h.pop();setScreen(h[h.length-1]||"home");setHistory(h);}else{setScreen(s);setScreenData(data);setHistory(h=>[...h,s]);}scrollRef.current?.scrollTo(0,0);},[history]);

  const tabs=[{id:"home",icon:I.home,label:"Início"},{id:"categories",icon:I.grid,label:"Categorias"},{id:"chatlist",icon:I.chat,label:"Chat"},{id:"register",icon:I.user,label:"Perfil"}];
  const activeTab=["home","categories","chatlist","register"].includes(screen)?screen:null;
  const showNav=!["chatview","editProfile","privacy","moderation","appearance","help","terms"].includes(screen);

  const renderScreen=()=>{switch(screen){
    case "home":return <Home nav={nav} trial={trial}/>;
    case "categories":return <Categories nav={nav}/>;
    case "search":return <Search nav={nav}/>;
    case "profile":return <Profile nav={nav} data={screenData}/>;
    case "chatlist":return <ChatList nav={nav}/>;
    case "chatview":return <ChatView nav={nav} data={screenData}/>;
    case "notifs":return <Notifs nav={nav} trial={trial} trialNotifs={trialNotifs}/>;
    case "plans":return <PlansScreen nav={nav} trial={trial}/>;
    case "register":return <RegisterProfessional onBack={()=>nav("home")} onSuccess={(data)=>{console.log("Novo profissional cadastrado:",data); trackEvent('Subscribe',{value:parseInt(data.planPrice||99),currency:'BRL'}); nav("home");}} nav={nav}/>;
    case "advertise":return <Advertise nav={nav}/>;
    case "settings":return <Settings nav={nav} trial={trial}/>;
    case "editProfile":return <EditProfile nav={nav}/>;
    case "privacy":return <PrivacyScreen nav={nav}/>;
    case "moderation":return <ModerationScreen nav={nav}/>;
    case "appearance":return <AppearanceScreen nav={nav}/>;
    case "help":return <HelpScreen nav={nav}/>;
    case "terms":return <TermsScreen nav={nav}/>;
    default:return <Home nav={nav} trial={trial}/>;
  }};

  return (<>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap');
      *{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent;}
      ::-webkit-scrollbar{width:0;height:0;}
      body{font-family:'DM Sans',sans-serif;background:#000;}
      @keyframes fadeIn{from{opacity:0}to{opacity:1}}
      @keyframes fadeInUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
      @keyframes slideIn{from{opacity:0;transform:translateX(16px)}to{opacity:1;transform:translateX(0)}}
      .anim-in{animation:fadeInUp .45s ease forwards}.anim-fade{animation:fadeIn .35s ease forwards}.anim-slide{animation:slideIn .4s ease forwards}
      .d1{animation-delay:.05s;opacity:0}.d2{animation-delay:.1s;opacity:0}.d3{animation-delay:.15s;opacity:0}.d4{animation-delay:.2s;opacity:0}.d5{animation-delay:.25s;opacity:0}.d6{animation-delay:.3s;opacity:0}
      .app-shell{max-width:480px;margin:0 auto;height:100vh;height:100dvh;background:${C.w};position:relative;overflow:hidden;box-shadow:0 0 80px rgba(0,0,0,.12);}
      .app-scroll{height:100%;overflow-y:auto;overflow-x:hidden;-webkit-overflow-scrolling:touch;}
      .screen-content{padding-bottom:80px;min-height:100%;}
      .icon-btn{width:38px;height:38px;border-radius:11px;border:1.5px solid ${C.gB};background:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;position:relative;}
      .notif-dot{position:absolute;top:7px;right:7px;width:7px;height:7px;border-radius:50%;background:${C.cor};border:1.5px solid #fff;}
      .search-bar{display:flex;align-items:center;gap:8px;background:${C.gBg};border:2px solid transparent;border-radius:14px;padding:10px 12px;transition:all .2s;}
      .search-bar.focused{background:#fff;border-color:${C.pri};box-shadow:0 0 0 4px ${C.priGlow};}
      .filter-pill{width:34px;height:34px;border-radius:10px;border:none;background:${C.pri};cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
      .banner{border-radius:16px;padding:20px;min-height:110px;position:relative;overflow:hidden;}
      .banner-label{position:absolute;top:10px;right:10px;background:rgba(255,255,255,.2);border-radius:5px;padding:2px 7px;font-size:9px;font-weight:700;color:#fff;letter-spacing:.04em;text-transform:uppercase;}
      .banner-title{font-family:${font.d};font-size:20px;font-weight:800;color:#fff;margin-bottom:4px;}
      .banner-sub{font-size:12px;color:rgba(255,255,255,.85);line-height:1.4;}
      .dot{width:7px;height:7px;border-radius:50%;background:rgba(255,255,255,.3);cursor:pointer;transition:all .3s;}
      .dot.active{width:22px;border-radius:4px;background:#fff;}
      .stats-row{display:flex;gap:8px;padding:10px 16px 0;}
      .stat-card{flex:1;background:#fff;border-radius:12px;padding:12px 8px;border:1.5px solid ${C.gB};text-align:center;}
      .section-header{display:flex;justify-content:space-between;align-items:center;padding:16px 16px 10px;}
      .section-title{font-family:${font.d};font-size:17px;font-weight:800;color:${C.dk};}
      .link-btn{background:none;border:none;color:${C.pri};font-size:12px;font-weight:700;cursor:pointer;font-family:${font.b};}
      .cat-scroll{display:flex;gap:8px;padding:0 16px;overflow-x:auto;-webkit-overflow-scrolling:touch;}
      .cat-card{min-width:72px;max-width:72px;background:#fff;border-radius:14px;border:1.5px solid ${C.gB};padding:12px 8px;text-align:center;cursor:pointer;flex-shrink:0;}
      .cat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;padding:12px 16px;}
      .cat-grid-card{background:#fff;border-radius:14px;border:1.5px solid ${C.gB};padding:16px 8px;text-align:center;cursor:pointer;}
      .pro-list{padding:0 16px;display:flex;flex-direction:column;gap:8px;}
      .pro-card{background:#fff;border-radius:14px;padding:14px;border:1.5px solid ${C.gB};cursor:pointer;display:flex;gap:12px;align-items:center;}
      .cta-dark{background:linear-gradient(135deg,${C.dk},${C.dkSoft});border-radius:16px;padding:22px;position:relative;overflow:hidden;}
      .cta-circle{position:absolute;top:-20px;right:-20px;width:90px;height:90px;border-radius:50%;background:${C.pri};opacity:.1;}
      .ad-cta{background:${C.accLt};border-radius:12px;padding:14px 16px;display:flex;align-items:center;justify-content:space-between;cursor:pointer;border:1.5px solid ${C.acc}22;}
      .filter-scroll{display:flex;gap:7px;padding:10px 16px;overflow-x:auto;}
      .filter-chip{padding:8px 14px;border-radius:10px;border:none;background:${C.gBg};color:${C.g};font-size:12px;font-weight:600;cursor:pointer;font-family:${font.b};white-space:nowrap;text-transform:capitalize;}
      .filter-chip.active{background:${C.pri};color:#fff;}
      .profile-stats{display:flex;margin:0 16px 14px;background:${C.gBg};border-radius:14px;padding:14px 0;}
      .pstat{flex:1;text-align:center;}.pstat-v{font-family:${font.d};font-size:16px;font-weight:800;color:${C.dk};display:flex;align-items:center;justify-content:center;gap:3px;}
      .pstat-l{font-size:10px;color:${C.gL};margin-top:2px;}.pstat-divider{width:1px;background:${C.gB};}
      .profile-section-title{font-family:${font.d};font-size:15px;font-weight:700;margin-bottom:8px;}
      .portfolio-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;}
      .portfolio-item{aspect-ratio:1;border-radius:12px;background:linear-gradient(135deg,${C.priLt},${C.gBg});display:flex;align-items:center;justify-content:center;}
      .price-card{background:${C.priLt};border-radius:14px;padding:14px 16px;display:flex;justify-content:space-between;align-items:center;}
      .review-card{background:${C.gBg};border-radius:12px;padding:12px;margin-bottom:8px;}
      .info-card{background:#fff;border:1.5px solid ${C.gB};border-radius:14px;padding:14px;}
      .info-row{display:flex;align-items:center;gap:10px;padding:7px 0;font-size:13px;color:${C.dk};border-bottom:1px solid ${C.gBg};}
      .info-row:last-child{border-bottom:none;}
      .info-action{padding:4px 12px;border-radius:8px;border:none;color:#fff;font-size:11px;font-weight:700;cursor:pointer;font-family:${font.d};margin-left:auto;}
      .fixed-bottom{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:480px;padding:10px 16px 14px;background:rgba(255,255,255,.97);backdrop-filter:blur(12px);border-top:1px solid ${C.gB};display:flex;gap:8px;z-index:60;}
      .chat-item{display:flex;gap:12px;align-items:center;padding:12px 0;border-bottom:1px solid ${C.gBg};cursor:pointer;}
      .unread-badge{min-width:20px;height:20px;border-radius:10px;background:${C.pri};color:#fff;font-size:10px;font-weight:700;display:flex;align-items:center;justify-content:center;padding:0 6px;}
      .msg-bubble{max-width:78%;padding:10px 14px;border-radius:16px;font-size:13px;line-height:1.45;}
      .msg-bubble.me{background:${C.pri};color:#fff;border-bottom-right-radius:4px;}
      .msg-bubble.them{background:${C.gBg};color:${C.dk};border-bottom-left-radius:4px;}
      .chat-input-bar{display:flex;align-items:center;gap:8px;padding:8px 12px 14px;border-top:1px solid ${C.gB};background:${C.w};}
      .notif-item{display:flex;gap:12px;align-items:center;padding:14px 0;border-bottom:1px solid ${C.gBg};cursor:pointer;}
      .notif-icon{width:40px;height:40px;border-radius:12px;background:${C.gBg};display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;}
      .plan-card{background:#fff;border-radius:18px;border:2px solid ${C.gB};padding:22px;position:relative;overflow:hidden;}
      .plan-card.popular{border-width:2.5px;}
      .pop-ribbon{position:absolute;top:14px;right:-28px;color:#fff;font-size:9px;font-weight:800;padding:3px 30px;transform:rotate(45deg);letter-spacing:.04em;}
      .plan-badge{display:inline-block;border-radius:8px;padding:4px 12px;}
      .reg-option{background:#fff;border-radius:16px;border:2px solid ${C.gB};padding:18px;cursor:pointer;display:flex;align-items:center;gap:14px;}
      .reg-icon{width:46px;height:46px;border-radius:13px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
      .form-col{display:flex;flex-direction:column;gap:12px;}
      .form-title{font-family:${font.d};font-size:19px;font-weight:800;margin-bottom:4px;}
      .form-input{width:100%;padding:13px 14px;border-radius:12px;border:2px solid ${C.gB};font-size:14px;font-family:${font.b};outline:none;background:#fff;transition:border .2s;}
      .cat-chip{padding:8px 12px;border-radius:10px;border:1.5px solid ${C.gB};background:#fff;font-size:12px;cursor:pointer;font-family:${font.b};display:flex;align-items:center;gap:4px;transition:all .15s;}
      .success-icon{width:72px;height:72px;border-radius:20px;background:${C.priLt};display:flex;align-items:center;justify-content:center;margin:0 auto 16px;font-size:34px;}
      .progress-bar{display:flex;gap:5px;padding:14px 16px 0;}
      .progress-seg{flex:1;height:4px;border-radius:2px;transition:background .3s;}
      .ad-hero{background:linear-gradient(135deg,${C.dk},${C.dkSoft});border-radius:18px;padding:28px 20px;text-align:center;position:relative;overflow:hidden;}
      .ad-pkg{background:#fff;border-radius:16px;border:2px solid ${C.gB};padding:20px;position:relative;}
      .ad-pkg.popular{border-width:2.5px;}
      .pkg-badge{position:absolute;top:10px;right:10px;color:#fff;font-size:9px;font-weight:700;padding:3px 8px;border-radius:5px;}
      .settings-user{display:flex;align-items:center;gap:14px;background:${C.gBg};border-radius:16px;padding:16px;}
      .settings-item{display:flex;align-items:center;gap:14px;padding:14px 4px;border-bottom:1px solid ${C.gBg};cursor:pointer;}
      .bottom-nav{position:absolute;bottom:0;left:0;right:0;background:rgba(255,255,255,.97);backdrop-filter:blur(16px);border-top:1px solid ${C.gB};display:flex;padding:6px 8px 10px;z-index:100;}
      .nav-tab{flex:1;display:flex;flex-direction:column;align-items:center;gap:2px;background:none;border:none;cursor:pointer;padding:5px 0;}
      .nav-label{font-size:10px;font-weight:500;color:${C.gL};font-family:${font.b};}
      .nav-label.active{font-weight:700;color:${C.pri};}
      .nav-dot{width:4px;height:4px;border-radius:2px;background:${C.pri};margin-top:1px;}
      @media(max-width:380px){.banner-title{font-size:18px;}.cat-card{min-width:66px;max-width:66px;}.cat-grid{grid-template-columns:repeat(3,1fr);gap:8px;}.pro-card{padding:12px;}.stats-row{gap:6px;}.pstat-v{font-size:14px;}}
    `}</style>
    <div className="app-shell"><div ref={scrollRef} className="app-scroll">{renderScreen()}</div>
      {showNav&&<div className="bottom-nav">{tabs.map(tab=>{const active=activeTab===tab.id;return(<button key={tab.id} onClick={()=>nav(tab.id)} className="nav-tab">{tab.icon(active?C.pri:C.gL)}<span className={`nav-label ${active?"active":""}`}>{tab.label}</span>{active&&<div className="nav-dot"/>}</button>);})}</div>}
    </div>
  </>);
}
