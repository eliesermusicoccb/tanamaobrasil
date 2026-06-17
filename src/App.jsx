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
  zap:(c=C.g,s=18)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
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

function Home({ nav, trial }) {
  const [bi, setBi] = useState(0);
  const [sf, setSf] = useState(false);
  const [favs, setFavs] = useState({});
  useEffect(()=>{ const t=setInterval(()=>setBi(i=>(i+1)%BANNERS.length),4500); return()=>clearInterval(t); },[]);

  return (
    <div className="screen-content">
      {trial.active && (
        <div className="anim-in" onClick={()=>nav("plans")} style={{ margin:"12px 16px 0", padding:"14px 16px", borderRadius:12, background:`linear-gradient(135deg, ${C.acc} 0%, #D4940F 100%)`, display:"flex", alignItems:"center", gap:12, cursor:"pointer", boxShadow:"0 4px 16px rgba(232,168,23,0.25)" }}>
          {I.zap("#fff",18)}
          <div style={{ flex:1 }}><div style={{ fontFamily:font.d, fontSize:14, fontWeight:800, color:"#fff" }}>⏰ TRIAL: {trial.daysLeft} dias grátis restantes!</div>
          <div style={{ fontSize:12, color:"rgba(255,255,255,0.85)" }}>Conclua seu perfil para ganhar R$ 5k+/mês</div></div>
          {I.arrow("#fff",14)}
        </div>
      )}

      <div className="anim-in" style={{ padding:"12px 16px 0", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <LogoText size={30}/><div style={{ display:"flex", gap:6, alignItems:"center" }}>
        <button onClick={()=>nav("notifs")} className="icon-btn">{I.bell(C.dk)}<span className="notif-dot"/></button>
        <button onClick={()=>nav("settings")} className="icon-btn">{I.settings(C.dk)}</button>
        <div onClick={()=>nav("settings")} style={{ width:34, height:34, borderRadius:10, background:C.priLt, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:font.d, fontWeight:700, fontSize:13, color:C.pri, cursor:"pointer", border:`1.5px solid ${C.pri}33` }}>VC</div></div>
      </div>

      <div className="anim-in d1" style={{ padding:"12px 16px 0" }}>
        <div className={`search-bar ${sf?"focused":""}`}>
          {I.search(sf?C.pri:C.gL,18)}
          <input placeholder="Buscar profissional ou serviço..." onFocus={()=>setSf(true)} onBlur={()=>setSf(false)} style={{ flex:1, border:"none", outline:"none", background:"transparent", fontSize:14, color:C.dk, fontFamily:font.b }}/>
          <button onClick={()=>{}} className="filter-pill">{I.filter(C.w,14)}</button>
        </div>
      </div>

      <div className="anim-in d2" style={{ padding:"12px 16px 0" }}>
        <div className="banner" style={{ background:BANNERS[bi].bg }}>
          <span className="banner-label">{BANNERS[bi].label}</span>
          <div key={bi} className="anim-fade"><h3 className="banner-title">{BANNERS[bi].t}</h3><p className="banner-sub">{BANNERS[bi].s}</p></div>
          <div style={{ display:"flex", gap:5, marginTop:14 }}>{BANNERS.map((_,i)=><div key={i} onClick={()=>setBi(i)} className={`dot ${i===bi?"active":""}`}/>)}</div>
        </div>
      </div>

      <div className="anim-in d3 stats-row">
        {[{n:"2.547",l:"Profissionais",c:C.pri},{n:"15.890",l:"Clientes ativos",c:C.acc},{n:"R$ 5k+",l:"Ganho médio/mês",c:C.cor}].map((s,i)=><div key={i} className="stat-card"><div style={{ fontFamily:font.d, fontSize:18, fontWeight:800, color:s.c }}>{s.n}</div><div style={{ fontSize:10, color:C.gL, fontWeight:500, marginTop:1 }}>{s.l}</div></div>)}
      </div>

      <div className="anim-in d3"><div className="section-header"><h2 className="section-title">Categorias</h2><button onClick={()=>nav("categories")} className="link-btn">Ver todas</button></div>
      <div className="cat-scroll">{CATEGORIES.slice(0,8).map((c,i)=><div key={i} onClick={()=>nav("categories")} className="cat-card"><div style={{ fontSize:26, marginBottom:4 }}>{c.icon}</div><div style={{ fontSize:11, fontWeight:600, color:C.dk }}>{c.name}</div><div style={{ fontSize:9, color:C.gL, marginTop:1 }}>{c.count}</div></div>)}</div></div>

      <div className="anim-in d4"><div className="section-header"><h2 className="section-title">Destaques</h2><button onClick={()=>nav("search")} className="link-btn">Ver todos</button></div>
      <div className="pro-list">{PROS.slice(0,4).map((p,i)=><ProCard key={p.id} p={p} onClick={()=>nav("profile",p)} fav={favs[p.id]} onFav={()=>setFavs(f=>({...f,[p.id]:!f[p.id]}))} i={i}/>)}</div></div>

      <div className="anim-in d5" style={{ padding:"8px 16px 0" }}>
        <div style={{ background:`linear-gradient(135deg, ${C.pri} 0%, ${C.priDk} 100%)`, borderRadius:16, padding:22, position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:-20, right:-20, width:90, height:90, borderRadius:"50%", background:C.acc, opacity:0.15 }}/>
          <h3 style={{ fontFamily:font.d, fontSize:20, fontWeight:800, color:"#fff", marginBottom:8, position:"relative" }}>🎯 Você é profissional?</h3>
          <p style={{ fontSize:13, color:"rgba(255,255,255,0.85)", lineHeight:1.6, marginBottom:4, position:"relative" }}><strong>Receba clientes direto do seu celular</strong></p>
          <p style={{ fontSize:12, color:"rgba(255,255,255,0.7)", lineHeight:1.5, marginBottom:16, position:"relative" }}>✅ 7 dias grátis (sem cartão) · ✅ Fatura em PIX · ✅ +2500 profissionais já ganhando</p>
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

// Minimal remaining screens (just essential routing)
function Categories({ nav }) {
  return (<div className="screen-content"><TopBar title="Categorias" onBack={()=>nav("home")}/><div className="cat-grid">{CATEGORIES.map((c,i)=><div key={i} className={`cat-grid-card anim-in d${Math.min(i%6+1,6)}`} onClick={()=>nav("search")}><div style={{ fontSize:30, marginBottom:6 }}>{c.icon}</div><div style={{ fontSize:12, fontWeight:700, color:C.dk, fontFamily:font.d }}>{c.name}</div><div style={{ fontSize:10, color:C.gL, marginTop:2 }}>{c.count} prof.</div></div>)}</div></div>);
}

function Search({ nav }) {
  const [fl,setFl]=useState("todos"); const [favs,setFavs]=useState({});
  return (<div className="screen-content"><TopBar title="Profissionais" onBack={()=>nav("home")}/><div className="filter-scroll">{["todos","premium","pro"].map(f=><button key={f} onClick={()=>setFl(f)} className={`filter-chip ${fl===f?"active":""}`}>{f}</button>)}</div><div className="pro-list" style={{padding:"4px 16px 0"}}>{PROS.map((p,i)=><ProCard key={p.id} p={p} onClick={()=>nav("profile",p)} fav={favs[p.id]} onFav={()=>setFavs(f=>({...f,[p.id]:!f[p.id]}))} i={i}/>)}</div></div>);
}

function Profile({ nav, data }) {
  const p = data || PROS[0];
  const [fav, setFav] = useState(false);
  return (
    <div className="screen-content" style={{ paddingBottom:90 }}>
      <TopBar title={p.name} onBack={()=>nav("back")}/>
      <div style={{ padding:"20px 16px", textAlign:"center" }}>
        <Avatar ini={p.av} size={64} badge={p.badge}/>
        <h2 style={{ fontFamily:font.d, fontSize:22, fontWeight:800, color:C.dk, marginTop:12 }}>{p.name}</h2>
        <div style={{ fontSize:13, color:C.g, marginTop:3 }}>{p.role}</div>
        <div style={{ fontSize:12, color:C.gL, marginTop:8 }}>⭐ {p.rating} ({p.reviews} avaliações)</div>
        <Btn v="primary" full sz="lg" onClick={()=>{trackEvent("Contact",{content_name:p.name}); const msg=encodeURIComponent(`Olá ${p.name}! Vi seu perfil no TáNaMão Brasil.`); window.open(`https://wa.me/${p.whatsapp}?text=${msg}`,"_blank");}} style={{ marginTop:16 }}>{I.whatsapp("#fff",16)} Chamar no WhatsApp</Btn>
      </div>
    </div>
  );
}

function ChatList({ nav }) {
  return <div className="screen-content"><TopBar title="Mensagens" onBack={()=>nav("home")}/></div>;
}

function Notifs({ nav }) {
  return <div className="screen-content"><TopBar title="Notificações" onBack={()=>nav("home")}/></div>;
}

function PlansScreen({ nav, trial }) {
  return <div className="screen-content"><TopBar title="Planos" onBack={()=>nav("home")}/><div style={{padding:16,textAlign:"center"}}><div style={{fontFamily:font.d,fontSize:20,fontWeight:900}}>Escolha seu plano</div><p style={{fontSize:13,color:C.g,marginTop:8}}>7 dias grátis para todos os planos</p></div></div>;
}

function Settings({ nav, trial }) {
  return <div className="screen-content"><TopBar title="Configurações" onBack={()=>nav("home")}/></div>;
}

function Advertise({ nav }) {
  return <div className="screen-content"><TopBar title="Anuncie" onBack={()=>nav("home")}/></div>;
}

export default function App() {
  const [screen,setScreen]=useState("home");const [screenData,setScreenData]=useState(null);const [history,setHistory]=useState(["home"]);const scrollRef=useRef(null);
  const { trial, setTrial, trialNotifs } = useTrialSystem();

  const nav=useCallback((s,data=null)=>{if(s==="back"){const h=[...history];h.pop();setScreen(h[h.length-1]||"home");setHistory(h);}else{setScreen(s);setScreenData(data);setHistory(h=>[...h,s]);}scrollRef.current?.scrollTo(0,0);},[history]);

  const tabs=[{id:"home",icon:I.home,label:"Início"},{id:"categories",icon:I.grid,label:"Categorias"},{id:"chatlist",icon:I.chat,label:"Chat"},{id:"register",icon:I.user,label:"Perfil"}];
  const activeTab=["home","categories","chatlist","register"].includes(screen)?screen:null;

  const renderScreen=()=>{switch(screen){
    case "home":return <Home nav={nav} trial={trial}/>;
    case "categories":return <Categories nav={nav}/>;
    case "search":return <Search nav={nav}/>;
    case "profile":return <Profile nav={nav} data={screenData}/>;
    case "chatlist":return <ChatList nav={nav}/>;
    case "notifs":return <Notifs nav={nav}/>;
    case "plans":return <PlansScreen nav={nav} trial={trial}/>;
    case "register":return <RegisterProfessional onBack={()=>nav("home")} onSuccess={(data)=>{trackEvent('Subscribe',{value:parseInt(data.planPrice||99),currency:'BRL'}); nav("home");}} nav={nav}/>;
    case "advertise":return <Advertise nav={nav}/>;
    case "settings":return <Settings nav={nav} trial={trial}/>;
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
      .ad-cta{background:${C.accLt};border-radius:12px;padding:14px 16px;display:flex;align-items:center;justify-content:space-between;cursor:pointer;border:1.5px solid ${C.acc}22;}
      .filter-scroll{display:flex;gap:7px;padding:10px 16px;overflow-x:auto;}
      .filter-chip{padding:8px 14px;border-radius:10px;border:none;background:${C.gBg};color:${C.g};font-size:12px;font-weight:600;cursor:pointer;font-family:${font.b};white-space:nowrap;text-transform:capitalize;}
      .filter-chip.active{background:${C.pri};color:#fff;}
      .bottom-nav{position:fixed;bottom:0;left:0;right:0;background:rgba(255,255,255,.97);backdrop-filter:blur(16px);border-top:1px solid ${C.gB};display:flex;padding:6px 8px 10px;max-width:480px;margin:0 auto;width:100%;}
      .nav-tab{flex:1;display:flex;flex-direction:column;align-items:center;gap:2px;background:none;border:none;cursor:pointer;padding:5px 0;}
      .nav-label{font-size:10px;font-weight:500;color:${C.gL};font-family:${font.b};}
      .nav-label.active{font-weight:700;color:${C.pri};}
      .nav-dot{width:4px;height:4px;border-radius:2px;background:${C.pri};margin-top:1px;}
    `}</style>
    <div className="app-shell"><div ref={scrollRef} className="app-scroll">{renderScreen()}</div>
      {activeTab&&<div className="bottom-nav">{tabs.map(tab=>{const active=activeTab===tab.id;return(<button key={tab.id} onClick={()=>nav(tab.id)} className="nav-tab">{tab.icon(active?C.pri:C.gL)}<span className={`nav-label ${active?"active":""}`}>{tab.label}</span>{active&&<div className="nav-dot"/>}</button>);})}</div>}
    </div>
  </>);
}
