import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { createClient } from '@supabase/supabase-js';
import { Sparkles, Scissors, CalendarDays, Menu, X, Star, ArrowRight, CheckCircle2, MessageCircle, ShieldCheck } from 'lucide-react';
import './style.css';

const envUrl = import.meta.env.VITE_SUPABASE_URL;
const envKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const supabase = envUrl && envKey ? createClient(envUrl, envKey) : null;
const whatsapp = (import.meta.env.VITE_WHATSAPP_NUMBER || '').replace(/\D/g, '');
const services = [
  {id:'gel-manicure', category:'Nails', name:'Gel manicure', price:600, detail:'A polished, lasting finish for your hands.'},
  {id:'gel-pedicure', category:'Nails', name:'Gel pedicure', price:500, detail:'Fresh, neat toes with a gel finish.'},
  {id:'removal', category:'Nails', name:'Nail & gel removal', price:400, detail:'Gentle removal and tidy nail care.'},
  {id:'simple-art', category:'Nails', name:'Simple nail art', price:0, detail:'Simple designs included with your service.'},
  {id:'complex-art', category:'Nails', name:'Complex nail art', price:50, unit:'per nail', detail:'Detailed art — KSh 50 per nail.'},
  {id:'foot-massage', category:'Spa', name:'Foot massage', price:500, detail:'Relax and unwind.'},
  {id:'gems', category:'Nails', name:'Nail gems', price:50, unit:'per gem', detail:'Add a little sparkle — KSh 50 per gem.'},
  {id:'adult-cut', category:'Barber', name:'Adult haircut', price:100, detail:'Clean, fresh haircut.'},
  {id:'child-cut', category:'Barber', name:'Children haircut', price:50, detail:'A neat cut for little clients.'}
];
const money = n => `KSh ${Number(n||0).toLocaleString('en-KE')}`;
function App(){
  const [page,setPage]=useState('home'); const [menu,setMenu]=useState(false);
  const [selected,setSelected]=useState({}); const [counts,setCounts]=useState({});
  const [form,setForm]=useState({name:'',phone:'',date:'',time:'',notes:''});
  const [message,setMessage]=useState(''); const [busy,setBusy]=useState(false);
  const total=useMemo(()=>services.reduce((sum,s)=>sum+(selected[s.id]?s.price*(s.id==='complex-art'||s.id==='gems'?(counts[s.id]||1):1):0),0),[selected,counts]);
  const chosen=services.filter(s=>selected[s.id]);
  const toggle=s=>setSelected(p=>({...p,[s.id]:!p[s.id]}));
  const nav=(p)=>{setPage(p);setMenu(false);window.scrollTo({top:0,behavior:'smooth'});};
  const submit=async e=>{
    e.preventDefault(); if(!chosen.length){setMessage('Please choose at least one service.');return;}
    if(!form.name||!form.phone||!form.date||!form.time){setMessage('Please fill in your name, phone, date and time.');return;}
    setBusy(true);setMessage('');
    const payload={customer_name:form.name,phone:form.phone,appointment_date:form.date,appointment_time:form.time,notes:form.notes,items:chosen.map(s=>({service_id:s.id,service_name:s.name,quantity:(s.id==='complex-art'||s.id==='gems')?(counts[s.id]||1):1,unit_price:s.price,line_total:s.price*((s.id==='complex-art'||s.id==='gems')?(counts[s.id]||1):1)})),total};
    let saved=false;
    if(supabase){const {error}=await supabase.from('wm_bookings').insert(payload); saved=!error;if(error) console.error(error);}
    const msg=`Hello Wild Modern! I'd like to book:\n\n${chosen.map(s=>`• ${s.name}${(s.id==='complex-art'||s.id==='gems')?` x${counts[s.id]||1}`:''} — ${money(s.price*((s.id==='complex-art'||s.id==='gems')?(counts[s.id]||1):1))}`).join('\n')}\n\nTotal: ${money(total)}\nName: ${form.name}\nPhone: ${form.phone}\nDate: ${form.date}\nTime: ${form.time}${form.notes?`\nNotes: ${form.notes}`:''}`;
    setBusy(false);
    if(whatsapp){window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(msg)}`,'_blank');setMessage(saved?'Booking saved! WhatsApp is opening to send your request.':'WhatsApp is opening with your booking details.');}
    else setMessage(saved?'Booking request saved! Please contact the salon to confirm.':'Please set up Supabase and the WhatsApp number in the deployment settings, or contact the salon to confirm.');
  };
  return <><header className="header"><a className="brand" onClick={()=>nav('home')}><span className="logo">WM</span><span><b>WILD MODERN</b><small>NAIL SPA & BARBER</small></span></a><nav>{[['Home','home'],['Nail Spa','nails'],['Barber','barber'],['Book','book'],['Reviews','reviews']].map(([t,p])=><button key={p} onClick={()=>nav(p)}>{t}</button>)}</nav><button className="menuBtn" onClick={()=>setMenu(!menu)}>{menu?<X/>:<Menu/>}</button></header>
  {menu&&<div className="mobileNav">{[['Home','home'],['Nail Spa','nails'],['Barber','barber'],['Book','book'],['Reviews','reviews']].map(([t,p])=><button key={p} onClick={()=>nav(p)}>{t}</button>)}</div>}
  <main>
  {page==='home'&&<><section className="hero"><div className="heroText"><div className="eyebrow"><Sparkles size={16}/> BEAUTY IN EVERY DETAIL</div><h1>Your beauty.<br/><em>Your moment.</em></h1><p>Fresh nails, clean cuts and a little time just for you. Welcome to Wild Modern.</p><div className="actions"><button className="primary" onClick={()=>nav('book')}>Book an appointment <ArrowRight size={18}/></button><button className="secondary" onClick={()=>nav('nails')}>Explore services</button></div><div className="heroStats"><span><b>9</b> services</span><span><b>Nairobi</b> Kenya</span><span><b>Made for you</b></span></div></div><div className="heroArt"><div className="artCircle"><div className="artInner"><span>W</span><small>WILD MODERN</small><b>NAIL SPA<br/>& BARBER</b></div></div><div className="floating">Beauty in every detail ✦</div></div></section><section className="quick"><div><Sparkles/><h3>Nail Spa</h3><p>Manicures, pedicures, art and sparkle.</p><button onClick={()=>nav('nails')}>View nail services →</button></div><div><Scissors/><h3>Barber</h3><p>Fresh cuts for adults and little ones.</p><button onClick={()=>nav('barber')}>View barber services →</button></div><div><CalendarDays/><h3>Easy booking</h3><p>Choose your services and see your total.</p><button onClick={()=>nav('book')}>Book now →</button></div></section></>}
  {['nails','barber'].includes(page)&&<section className="page"><div className="eyebrow">OUR SERVICES</div><h1>{page==='nails'?'Nail spa':'Barber shop'}<em>.</em></h1><p className="lead">Choose your favourites and make your next visit yours.</p><div className="serviceGrid">{services.filter(s=>page==='nails'?s.category!=='Barber':s.category==='Barber').map(s=><article className="serviceCard" key={s.id}><div className="serviceIcon">{s.category==='Barber'?<Scissors/>:<Sparkles/>}</div><h3>{s.name}</h3><p>{s.detail}</p><strong>{s.price===0?'FREE':money(s.price)}{s.unit&&<small> / {s.unit}</small>}</strong><button onClick={()=>{setSelected(p=>({...p,[s.id]:true}));nav('book')}}>Book this service →</button></article>)}</div></section>}
  {page==='book'&&<section className="page booking"><div className="eyebrow"><CalendarDays size={16}/> APPOINTMENT REQUEST</div><h1>Let's get you booked<em>.</em></h1><p className="lead">Choose one or more services. Your total updates as you go.</p><div className="bookingLayout"><div className="choose"><h2>Select services</h2>{services.map(s=><div className={`pick ${selected[s.id]?'picked':''}`} key={s.id}><label><input type="checkbox" checked={!!selected[s.id]} onChange={()=>toggle(s)}/><span><b>{s.name}</b><small>{s.detail}</small></span></label><strong>{s.price===0?'FREE':money(s.price)}{s.unit&&<small> / {s.unit}</small>}</strong>{selected[s.id]&&(s.id==='complex-art'||s.id==='gems')&&<div className="qty"><button onClick={()=>setCounts(p=>({...p,[s.id]:Math.max(1,(p[s.id]||1)-1)}))}>−</button><span>{counts[s.id]||1} {s.id==='gems'?'gems':'nails'}</span><button onClick={()=>setCounts(p=>({...p,[s.id]:(p[s.id]||1)+1}))}>+</button></div>}</div>)}</div><form className="form" onSubmit={submit}><h2>Your details</h2><label>Full name<input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Your name"/></label><label>Phone number<input required value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="07xx xxx xxx"/></label><div className="two"><label>Date<input type="date" required value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/></label><label>Preferred time<input type="time" required value={form.time} onChange={e=>setForm({...form,time:e.target.value})}/></label></div><label>Notes<textarea value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} placeholder="Anything you'd like us to know?"/></label><div className="total"><span>Estimated total</span><b>{money(total)}</b></div><button className="primary full" disabled={busy}>{busy?'Submitting…':'Request appointment'} <ArrowRight size={18}/></button>{message&&<div className="notice">{message}</div>}<small className="fine">Appointment requests are subject to confirmation.</small></form></div></section>}
  {page==='reviews'&&<section className="page"><div className="eyebrow">CLIENT LOVE</div><h1>Good vibes.<br/><em>Great reviews.</em></h1><div className="reviewBox"><Star/><h2>We'd love to hear from you!</h2><p>After your appointment, share your experience with Wild Modern.</p><a className="primary" href={`mailto:wildmodern4@gmail.com?subject=Wild%20Modern%20Review`}>Write a review <ArrowRight/></a></div></section>}
  </main><footer><div className="footerBrand"><span className="logo">WM</span><b>WILD MODERN</b><small>NAIL SPA & BARBER</small></div><div><b>Visit us</b><p>Nairobi, Kenya</p><a href="mailto:wildmodern4@gmail.com">wildmodern4@gmail.com</a></div><div><b>Book your moment</b><p>Beauty in every detail.</p><button onClick={()=>nav('book')}>Book an appointment →</button></div><div className="copyright">© {new Date().getFullYear()} Wild Modern. Made with care.</div></footer></>;
}
createRoot(document.getElementById('root')).render(<App/>);
