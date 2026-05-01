import React, { useState, useEffect } from 'react';
import axios from 'axios';
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

function Home({ user, child }) {
  if (!child) return <div className="fade-up">Select a child or wait for data...</div>;
  const att = child.att;
  
  return (
    <div className="fade-up">
      <div style={{ marginBottom:24 }}>
        <h2 style={{ fontSize:'1.5rem' }}>नमस्ते, {user?.name?.split(' ')[0]} 👨‍👩‍👧</h2>
        <p style={{ fontFamily:'var(--font-mono)', fontSize:'.8rem', marginTop:4 }}>
          Monitoring: <strong style={{ color:'var(--blue-light)' }}>{child.name}</strong> &nbsp;·&nbsp; <span className="id-badge">{child.id}</span>
        </p>
      </div>

      {/* Critical alerts */}
      {att < 75 && (
        <div className="alert alert-rose" style={{ marginBottom:12 }}>
          ⚠️ <strong>{child.name}'s attendance is {att}%</strong> — below the 75% minimum. Exam eligibility at risk. Please ensure regular attendance.
        </div>
      )}
      {child.fees.pending > 0 && (
        <div className="alert alert-amber" style={{ marginBottom:20 }}>
          💰 Fee pending: <strong>₹ {child.fees.pending.toLocaleString('en-IN')}</strong> — Due date: <strong>Soon</strong>
        </div>
      )}

      <div className="grid gap-4 stagger" style={{ gridTemplateColumns:'repeat(4,1fr)', marginBottom:24 }}>
        {[
          { icon:'✅', val:att,        label:'Attendance',    sub:att<75?'⚠️ Below 75%':'On track',  color:att<75?'var(--rose)':'var(--green)', dim:att<75?'var(--rose-dim)':'var(--green-dim)' },
          { icon:'🏆', val:child.rank, label:'Class Rank',    sub:`Performance`,        color:'var(--blue)',   dim:'var(--blue-dim)' },
          { icon:'✅', val:'',         label:'Fees Paid',     sub:'Annual',                   color:'var(--green)',  dim:'var(--green-dim)' },
          { icon:'⏳', val:'',         label:'Fees Pending',  sub:'Due Soon',                   color:'var(--rose)',   dim:'var(--rose-dim)' },
        ].map((s,i) => (
          <div key={i} className="stat-card fade-up">
            <div className="stat-icon" style={{ background:s.dim, color:s.color }}>{s.icon}</div>
            <div>
              <div className="stat-value" style={{ color:s.color, fontSize:'1.4rem' }}>
                {i===0 ? <><CountUp to={att}/>%</> : i===1 ? child.rank : i===2 ? `₹ ${(child.fees.paid/1000).toFixed(1)}K` : `₹ ${(child.fees.pending/1000).toFixed(1)}K`}
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
          {child.subjects.map(s => (
            <div key={s.name} style={{ marginBottom:16 }}>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:'.85rem', marginBottom:6 }}>
                <span style={{ fontWeight:600, color:'var(--text-primary)' }}>{s.name}</span>
                <span style={{ fontFamily:'var(--font-mono)', fontWeight:700, color: s.color || 'var(--blue)' }}>{s.score}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width:`${s.score}%`, background:s.color || 'var(--blue)' }}/>
              </div>
            </div>
          ))}
          {child.subjects.length === 0 && <span style={{color:'var(--text-muted)'}}>No recent marks.</span>}
        </div>

        {/* Suggestions */}
        <div className="glass-card" style={{ padding:20 }}>
          <h3 style={{ marginBottom:14 }}>💡 Recommendations</h3>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {att < 75 && (
              <div style={{ padding:12, background:'var(--rose-dim)', border:'1px solid rgba(244,63,94,.2)', borderRadius:8 }}>
                <div style={{ fontWeight:600, fontSize:'.82rem', color:'var(--rose)', marginBottom:4 }}>🚨 Attendance Priority</div>
                <div style={{ fontSize:'.78rem', color:'var(--text-secondary)' }}>Only {att}% attendance. Please ensure regular classes.</div>
              </div>
            )}
            {child.subjects.filter(s=>s.score<50).map(s => (
              <div key={s.name} style={{ padding:12, background:'var(--amber-dim)', border:'1px solid rgba(245,158,11,.2)', borderRadius:8 }}>
                <div style={{ fontWeight:600, fontSize:'.82rem', color:'var(--amber)', marginBottom:4 }}>📌 {s.name}</div>
                <div style={{ fontSize:'.78rem', color:'var(--text-secondary)' }}>Score {s.score}% — Consider tuition or additional practice sessions.</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AttCalendar({ child }) {
  if (!child) return null;
  const clr = { P:'var(--green)', A:'var(--rose)', L:'var(--amber)' };
  const bg  = { P:'var(--green-dim)', A:'var(--rose-dim)', L:'var(--amber-dim)' };
  const lbl = { P:'Present', A:'Absent', L:'Late' };
  
  const total = child.attCalendar.length;
  const present = child.attCalendar.filter(d=>d[1]==='P').length;
  const absent  = child.attCalendar.filter(d=>d[1]==='A').length;
  const late    = child.attCalendar.filter(d=>d[1]==='L').length;
  const pct = child.att;

  return (
    <div className="fade-up">
      <div className="page-header"><h2>📆 Attendance Calendar</h2><p>{child.name} · Last 30 Days</p></div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr auto', gap:20 }}>
        <div className="glass-card" style={{ padding:20 }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:8 }}>
            {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => (
              <div key={d} style={{ textAlign:'center', fontSize:'.68rem', color:'var(--text-muted)', fontWeight:700, padding:'4px 0', fontFamily:'var(--font-mono)' }}>{d}</div>
            ))}
            {[0,1].map(i => <div key={i}/>)}
            {child.attCalendar.map(([day, status], i) => (
              <div key={i} style={{ textAlign:'center', padding:'10px 4px', borderRadius:8, background:bg[status], color:clr[status], fontSize:'.8rem', fontWeight:700, fontFamily:'var(--font-mono)', border:`1px solid ${clr[status]}22`, cursor:'default' }}>
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

function FeesPage({ child }) {
  if(!child) return null;
  const { fees } = child;
  const pct = fees.annual > 0 ? Math.round((fees.paid/fees.annual)*100) : 100;
  return (
    <div className="fade-up">
      <div className="page-header"><h2>💰 Fee Management</h2><p>{child.name} · ₹ INR</p></div>
      <div className="grid gap-4" style={{ gridTemplateColumns:'repeat(3,1fr)', marginBottom:20 }}>
        {[['Annual Fee',fees.annual,'var(--blue)'],['Paid',fees.paid,'var(--green)'],['Pending',fees.pending,'var(--rose)']].map(([l,v,c]) => (
          <div key={l} className="glass-card" style={{ padding:20 }}>
            <div style={{ fontSize:'.7rem', color:'var(--text-muted)', fontFamily:'var(--font-mono)', marginBottom:6 }}>{l}</div>
            <div style={{ fontSize:'1.5rem', fontWeight:800, fontFamily:'var(--font-head)', color:c }}>₹ {v.toLocaleString('en-IN')}</div>
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
          ⚠️ ₹ {fees.pending.toLocaleString('en-IN')} pending. Please pay soon to avoid late fees.
        </div>
      )}
      <div className="glass-card" style={{ padding:0, overflow:'hidden' }}>
        <div style={{ padding:'16px 20px', borderBottom:'1px solid var(--border)' }}><h3>Payment Timeline</h3></div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Fee Type</th><th>Amount Due</th><th>Amount Paid</th><th>Due Date</th><th>Status</th><th>Receipt</th></tr></thead>
            <tbody>
              {fees.history.map(f => (
                <tr key={f._id} style={{ background: f.status==='Pending' ? 'rgba(244,63,94,0.06)' : 'transparent' }}>
                  <td style={{ fontWeight:500, color: f.status==='Pending'?'var(--rose)':'var(--text-primary)' }}>{f.feeType}</td>
                  <td style={{ fontFamily:'var(--font-mono)', fontWeight:700, color: f.status==='Pending'?'var(--rose)':'var(--text-primary)' }}>₹ {f.amountDue.toLocaleString('en-IN')}</td>
                  <td style={{ fontFamily:'var(--font-mono)', fontWeight:700, color:'var(--green)' }}>₹ {f.amountPaid.toLocaleString('en-IN')}</td>
                  <td style={{ fontFamily:'var(--font-mono)', color: f.status==='Pending'?'var(--rose)':'var(--text-muted)' }}>{new Date(f.dueDate).toLocaleDateString()}</td>
                  <td><span className={`badge ${f.status==='Paid'?'badge-green':'badge-rose'}`}>{f.status}</span></td>
                  <td>
                      {f.status==='Pending' 
                      ? <button className="btn btn-primary btn-sm" onClick={() => alert('Razorpay / Stripe integration goes here')}>Pay Now</button> 
                      : <button className="btn btn-ghost btn-sm">📄</button>}
                  </td>
                </tr>
              ))}
              {fees.history.length === 0 && <tr><td colSpan="6" style={{textAlign:'center', color:'var(--text-muted)'}}>No fee records found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function MessagePage({ child, token }) {
  const [msg, setMsg] = useState('');
  if (!child) return null;

  const handleSend = async () => {
      try {
          await axios.post('http://localhost:5000/api/parent/message', { message: msg }, {
              headers: { Authorization: `Bearer ${token}` }
          });
          alert('Message sent!');
          setMsg('');
      } catch (e) {
          alert('Error sending message');
      }
  };

  return (
    <div className="fade-up">
      <div className="page-header"><h2>💬 Message Teacher</h2><p>Send a message to {child.name}'s teachers</p></div>
      <div className="glass-card" style={{ padding:24, maxWidth:520 }}>
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <div className="form-group">
            <label>Teacher / Subject</label>
            <select className="input"><option>Class Teacher</option></select>
          </div>
          <div className="form-group">
            <label>Your Message</label>
            <textarea className="input" rows={5} placeholder="Type your message…" value={msg} onChange={e=>setMsg(e.target.value)}/>
          </div>
          <button className="btn btn-primary" disabled={!msg.trim()} onClick={handleSend}><Icon name="message" size={15}/> Send Message</button>
        </div>
      </div>
    </div>
  );
}

export default function ParentDashboard() {
  const { user } = useAuth();
  const token = localStorage.getItem('us_token');
  const [active, setActive] = useState('home');
  const [children, setChildren] = useState([]);
  const [activeChildIndex, setActiveChildIndex] = useState(0);

  useEffect(() => {
      if(token) {
          axios.get('http://localhost:5000/api/parent/dashboard', { headers: { Authorization: `Bearer ${token}` } })
          .then(res => setChildren(res.data.children))
          .catch(console.error);
      }
  }, [token]);

  const child = children[activeChildIndex];

  const titles = { home:'Parent Dashboard', attendance:'Attendance Calendar', performance:'Performance Report', fees:'Fee Management', messages:'Message Teacher' };
  const subtitles = { home:`Monitoring: ${child?.name || '...'}`, attendance:'Month-wise tracking', performance:'Subject analytics', fees:'₹ INR · Payments', messages:'Direct communication' };
  
  return (
    <AppShell nav={NAV} active={active} setActive={setActive} title={titles[active]} subtitle={subtitles[active]} notifications={{ messages:0 }}>
      {children.length > 1 && (
          <div style={{ display:'flex', gap:10, marginBottom:20 }}>
              {children.map((c, i) => (
                  <button key={c.id} className={`btn ${activeChildIndex === i ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setActiveChildIndex(i)}>
                      {c.name}
                  </button>
              ))}
          </div>
      )}
      {children.length === 0 && <div className="glass-card fade-up" style={{ padding:40 }}><div className="empty-state"><div className="icon">👨‍👩‍👧</div><p>No children linked to this account.</p></div></div>}
      
      {child && (
          <>
            {active==='home'        && <Home user={user} child={child}/>}
            {active==='attendance'  && <AttCalendar child={child}/>}
            {active==='fees'        && <FeesPage child={child}/>}
            {active==='messages'    && <MessagePage child={child} token={token}/>}
            {active==='performance' && (
              <div className="fade-up">
                <div className="page-header"><h2>📊 Subject Performance</h2><p>{child.name}</p></div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
                  {child.subjects.map(s => (
                    <div key={s.name} className="glass-card" style={{ padding:20 }}>
                      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:12 }}>
                        <h4 style={{ color:s.color || 'var(--blue)' }}>{s.name}</h4>
                        <span style={{ fontFamily:'var(--font-mono)', fontWeight:700, color:s.color || 'var(--blue)' }}>{s.score}%</span>
                      </div>
                      <div className="progress-bar" style={{ marginBottom:12 }}>
                        <div className="progress-fill" style={{ width:`${s.score}%`, background:s.color || 'var(--blue)' }}/>
                      </div>
                    </div>
                  ))}
                  {child.subjects.length === 0 && <span style={{color:'var(--text-muted)'}}>No recent marks.</span>}
                </div>
              </div>
            )}
          </>
      )}
    </AppShell>
  );
}
