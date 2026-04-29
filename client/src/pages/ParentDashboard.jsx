import React, { useState } from 'react';
import { AppShell, Icon } from '../components/AppShell';
import { CountUp, ProgressRing } from '../components/Widgets';
import { useAuth } from '../context/AuthContext';

const NAV = [
  { id:'home',       label:'Overview',     icon:'home' },
  { id:'attendance', label:'Attendance',   icon:'calendar' },
  { id:'performance',label:'Performance',  icon:'chart' },
  { id:'fees',       label:'Fees',         icon:'rupee' },
  { id:'messages',   label:'Message',      icon:'message' },
];

const CHILD = {
  name:'Ankit Verma', id:'ST0001', class:'10A',
  att: 68, rank:12, total:180,
  fees:{ annual:18000, paid:12000, pending:6000 },
  subjects:[
    { name:'Mathematics', score:62, color:'var(--blue)',   topics:[{t:'Algebra',s:38},{t:'Geometry',s:72}] },
    { name:'Physics',     score:78, color:'var(--purple)', topics:[{t:'Mechanics',s:80},{t:'Optics',s:76}] },
    { name:'English',     score:85, color:'var(--amber)',  topics:[{t:'Grammar',s:90},{t:'Essay',s:80}] },
    { name:'Chemistry',   score:44, color:'var(--green)',  topics:[{t:'Thermodynamics',s:40},{t:'Organic',s:48}] },
  ],
};

const ATT_CALENDAR = [
  [1,'P'],[2,'P'],[3,'A'],[4,'P'],[5,'P'],
  [6,'P'],[7,'P'],[8,'A'],[9,'A'],[10,'P'],
  [11,'P'],[12,'L'],[13,'P'],[14,'A'],[15,'P'],
  [16,'P'],[17,'P'],[18,'P'],[19,'A'],[20,'P'],
  [21,'P'],[22,'P'],[23,'A'],[24,'P'],[25,'P'],
  [26,'P'],[27,'P'],[28,'A'],[29,'P'],[30,'P'],
];

function Home({ user }) {
  const att = CHILD.att;
  return (
    <div className="fade-up">
      <div style={{ marginBottom:24 }}>
        <h2 style={{ fontSize:'1.5rem' }}>नमस्ते, {user?.name?.split(' ')[0]} 👨‍👩‍👧</h2>
        <p style={{ fontFamily:'var(--font-mono)', fontSize:'.8rem', marginTop:4 }}>
          Monitoring: <strong style={{ color:'var(--blue-light)' }}>{CHILD.name}</strong> &nbsp;·&nbsp; Class {CHILD.class} &nbsp;·&nbsp; <span className="id-badge">{CHILD.id}</span>
        </p>
      </div>

      {/* Critical alerts */}
      {att < 75 && (
        <div className="alert alert-rose" style={{ marginBottom:12 }}>
          ⚠️ <strong>{CHILD.name}'s attendance is {att}%</strong> — below the 75% minimum. Exam eligibility at risk. Please ensure regular attendance.
        </div>
      )}
      {CHILD.fees.pending > 0 && (
        <div className="alert alert-amber" style={{ marginBottom:20 }}>
          💰 Fee pending: <strong>₹ {CHILD.fees.pending.toLocaleString('en-IN')}</strong> — Due date: <strong>10-05-2026</strong>
        </div>
      )}

      <div className="grid gap-4 stagger" style={{ gridTemplateColumns:'repeat(4,1fr)', marginBottom:24 }}>
        {[
          { icon:'✅', val:att,        label:'Attendance',    sub:att<75?'⚠️ Below 75%':'On track',  color:att<75?'var(--rose)':'var(--green)', dim:att<75?'var(--rose-dim)':'var(--green-dim)' },
          { icon:'🏆', val:CHILD.rank, label:'Class Rank',    sub:`of ${CHILD.total} students`,        color:'var(--blue)',   dim:'var(--blue-dim)' },
          { icon:'✅', val:'',         label:'Fees Paid',     sub:'Annual 2025–26',                   color:'var(--green)',  dim:'var(--green-dim)' },
          { icon:'⏳', val:'',         label:'Fees Pending',  sub:'Due 10-05-2026',                   color:'var(--rose)',   dim:'var(--rose-dim)' },
        ].map((s,i) => (
          <div key={i} className="stat-card fade-up">
            <div className="stat-icon" style={{ background:s.dim, color:s.color }}>{s.icon}</div>
            <div>
              <div className="stat-value" style={{ color:s.color, fontSize:'1.4rem' }}>
                {i===0 ? <><CountUp to={att}/>%</> : i===1 ? <CountUp to={CHILD.rank}/> : i===2 ? `₹ ${(CHILD.fees.paid/1000)}K` : `₹ ${(CHILD.fees.pending/1000)}K`}
              </div>
              <div className="stat-label">{s.label}</div>
              <div className="stat-sub">{s.sub}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4" style={{ gridTemplateColumns:'1.2fr 1fr' }}>
        {/* Subject performance */}
        <div className="glass-card" style={{ padding:20 }}>
          <h3 style={{ marginBottom:16 }}>📊 Subject Performance</h3>
          {CHILD.subjects.map(s => (
            <div key={s.name} style={{ marginBottom:16 }}>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:'.85rem', marginBottom:6 }}>
                <span style={{ fontWeight:600, color:'var(--text-primary)' }}>{s.name}</span>
                <span style={{ fontFamily:'var(--font-mono)', fontWeight:700, color:s.color }}>{s.score}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width:`${s.score}%`, background:s.color }}/>
              </div>
              {s.topics.filter(t=>t.s<50).map(t => (
                <div key={t.t} style={{ fontSize:'.7rem', color:'var(--rose)', marginTop:4 }}>
                  ⚠️ Weak in <strong>{t.t}</strong> ({t.s}%) — Arrange extra practice
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Suggestions */}
        <div className="glass-card" style={{ padding:20 }}>
          <h3 style={{ marginBottom:14 }}>💡 Recommendations</h3>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {att < 75 && (
              <div style={{ padding:12, background:'var(--rose-dim)', border:'1px solid rgba(244,63,94,.2)', borderRadius:8 }}>
                <div style={{ fontWeight:600, fontSize:'.82rem', color:'var(--rose)', marginBottom:4 }}>🚨 Attendance Priority</div>
                <div style={{ fontSize:'.78rem', color:'var(--text-secondary)' }}>Only {att}% attendance. {Math.ceil((0.75*120 - 0.01*att*120) / 0.25)} more classes required to reach 75% minimum.</div>
              </div>
            )}
            {CHILD.subjects.filter(s=>s.score<50).map(s => (
              <div key={s.name} style={{ padding:12, background:'var(--amber-dim)', border:'1px solid rgba(245,158,11,.2)', borderRadius:8 }}>
                <div style={{ fontWeight:600, fontSize:'.82rem', color:'var(--amber)', marginBottom:4 }}>📌 {s.name}</div>
                <div style={{ fontSize:'.78rem', color:'var(--text-secondary)' }}>Score {s.score}% — Consider tuition or additional practice sessions.</div>
              </div>
            ))}
            <div style={{ padding:12, background:'var(--green-dim)', border:'1px solid rgba(16,185,129,.2)', borderRadius:8 }}>
              <div style={{ fontWeight:600, fontSize:'.82rem', color:'var(--green)', marginBottom:4 }}>✅ English Strength</div>
              <div style={{ fontSize:'.78rem', color:'var(--text-secondary)' }}>{CHILD.name} is performing well (85%). Encourage reading and writing practice to maintain.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AttCalendar() {
  const clr = { P:'var(--green)', A:'var(--rose)', L:'var(--amber)' };
  const bg  = { P:'var(--green-dim)', A:'var(--rose-dim)', L:'var(--amber-dim)' };
  const lbl = { P:'Present', A:'Absent', L:'Late' };
  const total = ATT_CALENDAR.length;
  const present = ATT_CALENDAR.filter(d=>d[1]==='P').length;
  const absent  = ATT_CALENDAR.filter(d=>d[1]==='A').length;
  const late    = ATT_CALENDAR.filter(d=>d[1]==='L').length;
  const pct = Math.round((present/total)*100);
  return (
    <div className="fade-up">
      <div className="page-header"><h2>📆 Attendance Calendar</h2><p>{CHILD.name} · Class {CHILD.class} · April 2026</p></div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr auto', gap:20 }}>
        <div className="glass-card" style={{ padding:20 }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:8 }}>
            {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => (
              <div key={d} style={{ textAlign:'center', fontSize:'.68rem', color:'var(--text-muted)', fontWeight:700, padding:'4px 0', fontFamily:'var(--font-mono)' }}>{d}</div>
            ))}
            {/* spacer for April 1 = Wednesday (offset 2) */}
            {[0,1].map(i => <div key={i}/>)}
            {ATT_CALENDAR.map(([day, status]) => (
              <div key={day} style={{ textAlign:'center', padding:'10px 4px', borderRadius:8, background:bg[status], color:clr[status], fontSize:'.8rem', fontWeight:700, fontFamily:'var(--font-mono)', border:`1px solid ${clr[status]}22`, cursor:'default' }}>
                {day}
              </div>
            ))}
          </div>
          <div style={{ display:'flex', gap:16, marginTop:16 }}>
            {[['P','Present',present],['A','Absent',absent],['L','Late',late]].map(([k,l,n]) => (
              <div key={k} style={{ display:'flex', alignItems:'center', gap:6, fontSize:'.78rem' }}>
                <div style={{ width:10, height:10, borderRadius:3, background:clr[k] }}/>
                <span style={{ color:'var(--text-secondary)' }}>{l}: <strong style={{ color:clr[k], fontFamily:'var(--font-mono)' }}>{n}</strong></span>
              </div>
            ))}
          </div>
        </div>
        <div className="glass-card" style={{ padding:24, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:12, minWidth:160 }}>
          <ProgressRing pct={pct} size={100} stroke={8} color={pct>=75?'var(--green)':'var(--rose)'}>
            <span style={{ fontFamily:'var(--font-mono)', fontWeight:800, fontSize:'1.1rem', color:pct>=75?'var(--green)':'var(--rose)' }}>{pct}%</span>
          </ProgressRing>
          <div style={{ textAlign:'center' }}>
            <div style={{ fontWeight:700, color:'var(--text-primary)' }}>Monthly</div>
            <div style={{ fontSize:'.75rem', color:'var(--text-muted)' }}>{present}/{total} days</div>
            <div style={{ fontSize:'.72rem', marginTop:8, color:pct>=75?'var(--green)':'var(--rose)', fontWeight:600 }}>
              {pct>=75 ? '✅ Above threshold' : '⚠️ Below 75%'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeesPage() {
  const { fees } = CHILD;
  const pct = Math.round((fees.paid/fees.annual)*100);
  return (
    <div className="fade-up">
      <div className="page-header"><h2>💰 Fee Management</h2><p>{CHILD.name} · Class {CHILD.class} · ₹ INR</p></div>
      <div className="grid gap-4" style={{ gridTemplateColumns:'repeat(3,1fr)', marginBottom:20 }}>
        {[['Annual Fee','₹ 18,000','var(--blue)'],['Paid','₹ 12,000','var(--green)'],['Pending','₹ 6,000','var(--rose)']].map(([l,v,c]) => (
          <div key={l} className="glass-card" style={{ padding:20 }}>
            <div style={{ fontSize:'.7rem', color:'var(--text-muted)', fontFamily:'var(--font-mono)', marginBottom:6 }}>{l}</div>
            <div style={{ fontSize:'1.5rem', fontWeight:800, fontFamily:'var(--font-head)', color:c }}>{v}</div>
          </div>
        ))}
      </div>
      <div className="glass-card" style={{ padding:20, marginBottom:20 }}>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:10 }}>
          <h4>Payment Progress</h4>
          <span style={{ fontFamily:'var(--font-mono)', color:'var(--green)', fontWeight:700 }}>{pct}% Paid</span>
        </div>
        <div className="progress-bar" style={{ height:10 }}>
          <div className="progress-fill fill-green" style={{ width:`${pct}%` }}/>
        </div>
      </div>
      {fees.pending > 0 && (
        <div className="alert alert-rose" style={{ marginBottom:20 }}>
          ⚠️ ₹ {fees.pending.toLocaleString('en-IN')} pending. Due: <strong>10-05-2026</strong>. Late fee: ₹ 200/day thereafter.
        </div>
      )}
      <div className="glass-card" style={{ padding:0, overflow:'hidden' }}>
        <div style={{ padding:'16px 20px', borderBottom:'1px solid var(--border)' }}><h3>Payment Timeline</h3></div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Month</th><th>Amount</th><th>Mode</th><th>Date</th><th>Status</th><th>Receipt</th></tr></thead>
            <tbody>
              {[['March 2026',4000,'UPI','05-03-2026','Paid'],['February 2026',4000,'Cash','03-02-2026','Paid'],['January 2026',4000,'NEFT','02-01-2026','Paid']].map(([m,a,md,d,s]) => (
                <tr key={m}>
                  <td style={{ fontWeight:500, color:'var(--text-primary)' }}>{m}</td>
                  <td style={{ fontFamily:'var(--font-mono)', fontWeight:700, color:'var(--green)' }}>₹ {a.toLocaleString('en-IN')}</td>
                  <td>{md}</td>
                  <td style={{ fontFamily:'var(--font-mono)' }}>{d}</td>
                  <td><span className="badge badge-green">{s}</span></td>
                  <td><button className="btn btn-ghost btn-sm">📄</button></td>
                </tr>
              ))}
              <tr style={{ background:'rgba(244,63,94,0.06)' }}>
                <td style={{ color:'var(--rose)', fontWeight:600 }}>April 2026</td>
                <td style={{ fontFamily:'var(--font-mono)', fontWeight:700, color:'var(--rose)' }}>₹ 6,000</td>
                <td>—</td><td style={{ fontFamily:'var(--font-mono)', color:'var(--rose)' }}>Due: 10-05-2026</td>
                <td><span className="badge badge-rose">Pending</span></td>
                <td><button className="btn btn-primary btn-sm">Pay Now</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function MessagePage() {
  const [msg, setMsg] = useState('');
  return (
    <div className="fade-up">
      <div className="page-header"><h2>💬 Message Teacher</h2><p>Send a message to {CHILD.name}'s teachers</p></div>
      <div className="glass-card" style={{ padding:24, maxWidth:520 }}>
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <div className="form-group">
            <label>Teacher / Subject</label>
            <select className="input"><option>Sunita Sharma — Mathematics</option><option>Vikram Singh — Physics</option><option>Priya Gupta — English</option></select>
          </div>
          <div className="form-group">
            <label>Your Message</label>
            <textarea className="input" rows={5} placeholder="Type your message…" value={msg} onChange={e=>setMsg(e.target.value)}/>
          </div>
          <button className="btn btn-primary" disabled={!msg.trim()}><Icon name="message" size={15}/> Send Message</button>
        </div>
      </div>
    </div>
  );
}

export default function ParentDashboard() {
  const { user } = useAuth();
  const [active, setActive] = useState('home');
  const titles = { home:'Parent Dashboard', attendance:'Attendance Calendar', performance:'Performance Report', fees:'Fee Management', messages:'Message Teacher' };
  const subtitles = { home:`Monitoring: ${CHILD.name}`, attendance:'Month-wise tracking', performance:'Subject analytics', fees:'₹ INR · Payments', messages:'Direct communication' };
  return (
    <AppShell nav={NAV} active={active} setActive={setActive} title={titles[active]} subtitle={subtitles[active]} notifications={{ messages:1 }}>
      {active==='home'        && <Home user={user}/>}
      {active==='attendance'  && <AttCalendar/>}
      {active==='fees'        && <FeesPage/>}
      {active==='messages'    && <MessagePage/>}
      {active==='performance' && (
        <div className="fade-up">
          <div className="page-header"><h2>📊 Subject Performance</h2><p>{CHILD.name} · Class {CHILD.class}</p></div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
            {CHILD.subjects.map(s => (
              <div key={s.name} className="glass-card" style={{ padding:20 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:12 }}>
                  <h4 style={{ color:s.color }}>{s.name}</h4>
                  <span style={{ fontFamily:'var(--font-mono)', fontWeight:700, color:s.color }}>{s.score}%</span>
                </div>
                <div className="progress-bar" style={{ marginBottom:12 }}>
                  <div className="progress-fill" style={{ width:`${s.score}%`, background:s.color }}/>
                </div>
                {s.topics.map(t => (
                  <div key={t.t} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'6px 0', borderBottom:'1px solid var(--border)', fontSize:'.8rem' }}>
                    <span style={{ color:'var(--text-secondary)' }}>{t.t}</span>
                    <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                      <div style={{ width:60 }}><div className="progress-bar"><div className={`progress-fill ${t.s>=75?'fill-green':t.s>=50?'fill-blue':'fill-rose'}`} style={{ width:`${t.s}%` }}/></div></div>
                      <span style={{ fontFamily:'var(--font-mono)', fontWeight:700, color:t.s>=75?'var(--green)':t.s>=50?'var(--amber)':'var(--rose)', width:36, textAlign:'right' }}>{t.s}%</span>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </AppShell>
  );
}
