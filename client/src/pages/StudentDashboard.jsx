import React, { useState } from 'react';
import { AppShell, Icon } from '../components/AppShell';
import { CountUp, CountdownTimer, ProgressRing } from '../components/Widgets';
import { useAuth } from '../context/AuthContext';

const NAV = [
  { id:'home',        label:'Dashboard',   icon:'home' },
  { id:'timetable',   label:'Timetable',   icon:'calendar' },
  { id:'assignments', label:'Assignments', icon:'assignment' },
  { id:'performance', label:'Performance', icon:'chart' },
  { id:'fees',        label:'Fees',        icon:'rupee' },
  { id:'notes',       label:'Notes',       icon:'book' },
];

const SCHEDULE = [
  { id:1, sub:'Mathematics', teacher:'Sunita Sharma', time:'08:00', end:'08:45', color:'var(--blue)',   status:'done' },
  { id:2, sub:'Physics',     teacher:'Vikram Singh',  time:'09:00', end:'09:45', color:'var(--purple)', status:'live' },
  { id:3, sub:'English',     teacher:'Priya Gupta',   time:'10:00', end:'10:45', color:'var(--amber)',  status:'upcoming' },
  { id:4, sub:'Chemistry',   teacher:'Anil Sharma',   time:'11:00', end:'11:45', color:'var(--green)',  status:'upcoming' },
  { id:5, sub:'Lunch Break', teacher:'—',             time:'12:00', end:'12:45', color:'var(--text-muted)', status:'upcoming' },
  { id:6, sub:'Hindi',       teacher:'Meena Joshi',   time:'13:00', end:'13:45', color:'var(--rose)',   status:'upcoming' },
];

const ASSIGNMENTS = [
  { id:1, sub:'Mathematics', title:'Algebra – Ch.5 Problems',    due:'02-05-2026', priority:'urgent',  status:'pending' },
  { id:2, sub:'Physics',     title:'Laws of Motion Numericals',  due:'30-04-2026', priority:'normal',  status:'submitted' },
  { id:3, sub:'English',     title:'Essay: Digital India',       due:'05-05-2026', priority:'normal',  status:'pending' },
  { id:4, sub:'Chemistry',   title:'Periodic Table Worksheet',   due:'28-04-2026', priority:'urgent',  status:'graded' },
];

const SUBJECTS = [
  { name:'Mathematics', score:62, topics:[{t:'Algebra',s:38},{t:'Geometry',s:72},{t:'Trigonometry',s:61}], color:'var(--blue)' },
  { name:'Physics',     score:78, topics:[{t:'Mechanics',s:80},{t:'Thermodynamics',s:72},{t:'Optics',s:78}], color:'var(--purple)' },
  { name:'English',     score:85, topics:[{t:'Grammar',s:90},{t:'Essay',s:82},{t:'Literature',s:83}], color:'var(--amber)' },
  { name:'Chemistry',   score:44, topics:[{t:'Thermodynamics',s:40},{t:'Organic',s:55},{t:'Inorganic',s:38}], color:'var(--green)' },
];

const greet = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
};

function Home({ user }) {
  const liveClass = SCHEDULE.find(s => s.status === 'live');
  const nextClass = SCHEDULE.find(s => s.status === 'upcoming');
  const att = 68;

  return (
    <div className="fade-up">
      {/* Greeting */}
      <div style={{ marginBottom:24 }}>
        <h2 style={{ fontSize:'1.6rem' }}>{greet()}, {user?.name?.split(' ')[0]} 👋</h2>
        <p style={{ fontFamily:'var(--font-mono)', fontSize:'.8rem', marginTop:4 }}>
          Class 10A &nbsp;·&nbsp; {new Date().toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}
          {nextClass && <>&nbsp;·&nbsp; <CountdownTimer targetTime={nextClass.time} label={`Next: ${nextClass.sub}`}/></>}
        </p>
      </div>

      {/* Alerts */}
      {att < 75 && (
        <div className="alert alert-rose" style={{ marginBottom:16 }}>
          ⚠️ Your attendance is <strong>{att}%</strong> — below the 75% minimum. You risk being ineligible for exams.
        </div>
      )}

      {/* Stat row */}
      <div className="grid gap-4 stagger" style={{ gridTemplateColumns:'repeat(4,1fr)', marginBottom:24 }}>
        {[
          { icon:'📚', val:4,   label:'Classes Today', sub:'1 Live Now',          color:'var(--blue)',  dim:'var(--blue-dim)' },
          { icon:'✅', val:att, label:'Attendance %',  sub:att<75?'⚠️ Below 75%':'On track', color:att<75?'var(--rose)':'var(--green)', dim:att<75?'var(--rose-dim)':'var(--green-dim)' },
          { icon:'📝', val:2,   label:'Pending Tasks', sub:'Due this week',        color:'var(--amber)', dim:'var(--amber-dim)' },
          { icon:'₹',  val:'',  label:'Fees Pending',  sub:'Due 10-05-2026',       color:'var(--rose)',  dim:'var(--rose-dim)' },
        ].map((s,i) => (
          <div key={i} className="stat-card fade-up">
            <div className="stat-icon" style={{ background:s.dim, color:s.color }}>{s.icon}</div>
            <div>
              <div className="stat-value" style={{ color:s.color }}>
                {s.val !== '' ? <CountUp to={typeof s.val==='number'?s.val:0} suffix={i===1?'%':''}/> : '₹6,000'}
              </div>
              <div className="stat-label">{s.label}</div>
              <div className="stat-sub">{s.sub}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4" style={{ gridTemplateColumns:'1.2fr 1fr' }}>
        {/* Today Schedule */}
        <div className="glass-card" style={{ padding:20 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
            <h3>📅 Today's Schedule</h3>
            <span className="badge badge-blue">Wednesday</span>
          </div>
          <div className="timeline">
            {SCHEDULE.map(s => (
              <div key={s.id} className="timeline-item">
                <div className={`timeline-dot ${s.status}`}/>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 12px', borderRadius:8, background: s.status==='live'?'rgba(59,130,246,0.08)':'transparent', border: s.status==='live'?'1px solid rgba(59,130,246,0.2)':'1px solid transparent' }}>
                  <div>
                    <div style={{ fontWeight:600, fontSize:'.9rem', color: s.status==='done'?'var(--text-muted)':'var(--text-primary)', borderLeft:`3px solid ${s.color}`, paddingLeft:8 }}>
                      {s.sub}
                      {s.status==='live' && <><span className="pulse-dot" style={{ marginLeft:8 }}/><span style={{ fontSize:'.7rem', color:'var(--green)', marginLeft:6, fontFamily:'var(--font-mono)' }}>LIVE</span></>}
                    </div>
                    <div style={{ fontSize:'.72rem', color:'var(--text-muted)', marginTop:2, paddingLeft:8, fontFamily:'var(--font-mono)' }}>{s.time}–{s.end} &nbsp;·&nbsp; {s.teacher}</div>
                  </div>
                  {s.status==='live' && <button className="btn btn-primary btn-sm">Join</button>}
                  {s.status==='done' && <span className="badge badge-green">Done</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          {/* Performance rings */}
          <div className="glass-card" style={{ padding:20 }}>
            <h3 style={{ marginBottom:14 }}>📊 Performance</h3>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:12 }}>
              {SUBJECTS.map(s => (
                <div key={s.name} style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <ProgressRing pct={s.score} size={56} stroke={5} color={s.color}>
                    <span style={{ fontSize:'.75rem', fontWeight:700, color:s.color, fontFamily:'var(--font-mono)' }}>{s.score}</span>
                  </ProgressRing>
                  <div>
                    <div style={{ fontSize:'.78rem', fontWeight:600, color:'var(--text-primary)' }}>{s.name}</div>
                    {s.topics.find(t=>t.s<50) && <div style={{ fontSize:'.65rem', color:'var(--rose)', marginTop:2 }}>⚠️ Weak: {s.topics.find(t=>t.s<50).t}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Assignments */}
          <div className="glass-card" style={{ padding:20 }}>
            <h3 style={{ marginBottom:14 }}>📝 Assignments</h3>
            {ASSIGNMENTS.filter(a => a.status !== 'graded').map(a => (
              <div key={a.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 0', borderBottom:'1px solid var(--border)' }}>
                <div>
                  <div style={{ fontSize:'.83rem', fontWeight:500, color:'var(--text-primary)' }}>{a.title}</div>
                  <div style={{ fontSize:'.7rem', color:'var(--text-muted)', fontFamily:'var(--font-mono)', marginTop:2 }}>{a.sub} · Due {a.due}</div>
                </div>
                <div style={{ display:'flex', gap:6, flexShrink:0 }}>
                  {a.priority==='urgent' && <span className="badge badge-rose">Urgent</span>}
                  <span className={`badge ${a.status==='submitted'?'badge-green':'badge-amber'}`}>{a.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Timetable() {
  const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const today = new Date().getDay(); // 1=Mon ... 6=Sat
  const rows = [
    { time:'08:00–08:45', cols:['Mathematics','Physics','English','Chemistry','Mathematics','Physics'] },
    { time:'09:00–09:45', cols:['Physics','English','Mathematics','Physics','Chemistry','English'] },
    { time:'10:00–10:45', cols:['English','Chemistry','Physics','English','Physics','—'] },
    { time:'11:00–11:45', cols:['Chemistry','Mathematics','Chemistry','Mathematics','English','—'] },
    { time:'12:00–12:45', cols:['Lunch','Lunch','Lunch','Lunch','Lunch','—'] },
    { time:'13:00–13:45', cols:['Hindi','Hindi','Hindi','Hindi','Hindi','—'] },
  ];
  const subColors = { Mathematics:'var(--blue)', Physics:'var(--purple)', English:'var(--amber)', Chemistry:'var(--green)', Hindi:'var(--rose)', Lunch:'var(--text-muted)' };
  return (
    <div className="fade-up">
      <div className="page-header"><h2>📅 Weekly Timetable</h2><p>Class 10A — Academic Year 2025–2026</p></div>
      <div className="glass-card" style={{ padding:0, overflow:'hidden' }}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th style={{ width:110 }}>Period</th>
                {days.map((d,i) => (
                  <th key={d} style={{ background: i===today-1 ? 'rgba(59,130,246,0.12)' : 'transparent', color: i===today-1 ? 'var(--blue-light)':undefined }}>
                    {d} {i===today-1 && '⬤'}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.time}>
                  <td style={{ fontFamily:'var(--font-mono)', fontSize:'.78rem', color:'var(--text-muted)' }}>{r.time}</td>
                  {r.cols.map((s,j) => (
                    <td key={j} style={{ fontWeight:s==='Lunch'?700:500, color:subColors[s]||'var(--text-muted)', background:j===today-1?'rgba(59,130,246,0.05)':undefined }}>
                      {s}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Assignments() {
  const cols = [
    { key:'pending',   label:'📋 Pending',   color:'var(--amber)' },
    { key:'submitted', label:'📤 Submitted',  color:'var(--blue)' },
    { key:'graded',    label:'✅ Graded',     color:'var(--green)' },
  ];
  return (
    <div className="fade-up">
      <div className="page-header"><h2>📝 Assignments</h2><p>Kanban board — drag cards when connected to backend</p></div>
      <div className="kanban">
        {cols.map(col => (
          <div key={col.key} className="kanban-col">
            <div className="kanban-col-title" style={{ color:col.color }}>{col.label} ({ASSIGNMENTS.filter(a=>a.status===col.key).length})</div>
            {ASSIGNMENTS.filter(a => a.status===col.key).map(a => (
              <div key={a.id} className="kanban-card">
                <div style={{ fontSize:'.75rem', color:'var(--text-muted)', fontFamily:'var(--font-mono)', marginBottom:6 }}>{a.sub}</div>
                <div style={{ fontWeight:600, fontSize:'.88rem', color:'var(--text-primary)', marginBottom:8 }}>{a.title}</div>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <span style={{ fontSize:'.7rem', color:'var(--text-muted)', fontFamily:'var(--font-mono)' }}>Due: {a.due}</span>
                  {a.priority==='urgent' && <span className="badge badge-rose">Urgent</span>}
                </div>
                {col.key==='pending' && <button className="btn btn-primary btn-sm w-full" style={{ marginTop:10 }}>Submit</button>}
              </div>
            ))}
            {ASSIGNMENTS.filter(a=>a.status===col.key).length === 0 && (
              <div style={{ textAlign:'center', padding:'20px 0', color:'var(--text-muted)', fontSize:'.8rem' }}>Nothing here</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function Performance() {
  const examScore=68, assignScore=72, attScore=68;
  const final = Math.round(examScore*.6 + assignScore*.25 + attScore*.15);
  const rank=12, total=180;

  return (
    <div className="fade-up">
      <div className="page-header"><h2>📊 Performance & Analytics</h2><p>Academic Year 2025–2026 · Weighted scoring system</p></div>

      {/* Rank hero card */}
      <div style={{ background:'linear-gradient(135deg, rgba(59,130,246,.15), rgba(139,92,246,.1))', border:'1px solid rgba(59,130,246,.25)', borderRadius:'var(--radius-lg)', padding:28, marginBottom:20, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div>
          <div style={{ fontSize:'.75rem', color:'var(--text-muted)', fontFamily:'var(--font-mono)', marginBottom:8 }}>YOUR CLASS RANK</div>
          <div style={{ fontSize:'4rem', fontWeight:800, fontFamily:'var(--font-head)', lineHeight:1, color:'var(--blue-light)' }}>
            <CountUp to={rank}/>
            <span style={{ fontSize:'1.5rem', color:'var(--text-muted)', fontWeight:500 }}> / {total}</span>
          </div>
          <div style={{ fontSize:'.78rem', color:'var(--text-muted)', marginTop:6 }}>Combined: All Class 10 Sections</div>
        </div>
        <div style={{ display:'flex', gap:20 }}>
          {[['Exams','60%',examScore,'var(--blue)'],['Assignments','25%',assignScore,'var(--purple)'],['Attendance','15%',attScore,'var(--green)']].map(([l,w,v,c]) => (
            <div key={l} style={{ textAlign:'center' }}>
              <ProgressRing pct={v} size={76} stroke={6} color={c}>
                <span style={{ fontSize:'.8rem', fontWeight:700, color:c, fontFamily:'var(--font-mono)' }}>{v}%</span>
              </ProgressRing>
              <div style={{ fontSize:'.72rem', color:'var(--text-muted)', marginTop:6 }}>{l}</div>
              <div style={{ fontSize:'.65rem', color:'var(--text-muted)', fontFamily:'var(--font-mono)' }}>weight {w}</div>
            </div>
          ))}
          <div style={{ textAlign:'center' }}>
            <ProgressRing pct={final} size={76} stroke={6} color="var(--amber)">
              <span style={{ fontSize:'.8rem', fontWeight:700, color:'var(--amber)', fontFamily:'var(--font-mono)' }}>{final}%</span>
            </ProgressRing>
            <div style={{ fontSize:'.72rem', color:'var(--text-muted)', marginTop:6 }}>Final Score</div>
          </div>
        </div>
      </div>

      {/* Topic heatmap */}
      <h3 style={{ marginBottom:14, color:'var(--text-secondary)' }}>🔬 Topic-Level Heatmap</h3>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:20 }}>
        {SUBJECTS.map(s => (
          <div key={s.name} className="glass-card" style={{ padding:16 }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:12 }}>
              <h4 style={{ color:s.color }}>{s.name}</h4>
              <span style={{ fontFamily:'var(--font-mono)', fontWeight:700, color:s.color }}>{s.score}%</span>
            </div>
            <div className="heatmap-grid">
              {s.topics.map(t => (
                <div key={t.t} className={`heatmap-cell ${t.s>=75?'heat-strong':t.s>=50?'heat-avg':'heat-weak'}`}>
                  <div style={{ fontSize:'.9rem', fontWeight:700, fontFamily:'var(--font-mono)' }}>{t.s}%</div>
                  <div style={{ fontSize:'.65rem', marginTop:3 }}>{t.t}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* AI Focus Zone */}
      <div className="glass-card glow-blue" style={{ padding:20 }}>
        <h3 style={{ marginBottom:14 }}>🤖 AI Focus Zone — Study Today</h3>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
          {[
            { topic:'Algebra', sub:'Mathematics', why:'Score 38% — critically weak. Practice linear equations for 45 min.', urgency:'high' },
            { topic:'Inorganic Chemistry', sub:'Chemistry', why:'Score 38% — practice periodic table patterns and bonding rules.', urgency:'high' },
            { topic:'Thermodynamics', sub:'Chemistry', why:'Score 40% — revisit first/second laws with numerical problems.', urgency:'medium' },
          ].map((f,i) => (
            <div key={i} style={{ padding:14, background: f.urgency==='high'?'var(--rose-dim)':'var(--amber-dim)', border:`1px solid ${f.urgency==='high'?'rgba(244,63,94,.2)':'rgba(245,158,11,.2)'}`, borderRadius:'var(--radius-sm)' }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                <span style={{ fontWeight:700, fontSize:'.9rem', color: f.urgency==='high'?'var(--rose)':'var(--amber)' }}>{f.topic}</span>
                <span className={`badge ${f.urgency==='high'?'badge-rose':'badge-amber'}`}>{f.urgency==='high'?'Critical':'Focus'}</span>
              </div>
              <div style={{ fontSize:'.68rem', color:'var(--text-muted)', fontFamily:'var(--font-mono)', marginBottom:6 }}>{f.sub}</div>
              <div style={{ fontSize:'.78rem', color:'var(--text-secondary)' }}>{f.why}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Fees() {
  const total=18000, paid=12000, pending=6000;
  const pct = Math.round((paid/total)*100);
  const history = [
    { month:'March 2026', amount:4000, mode:'UPI', date:'05-03-2026', status:'Paid', txn:'TXN2026030512' },
    { month:'February 2026', amount:4000, mode:'Cash', date:'03-02-2026', status:'Paid', txn:'RCT2026020301' },
    { month:'January 2026', amount:4000, mode:'NEFT', date:'02-01-2026', status:'Paid', txn:'TXN2026010234' },
  ];
  return (
    <div className="fade-up">
      <div className="page-header"><h2>💰 Fee Management</h2><p>Academic Year 2025–2026 · Amounts in ₹ (Indian Rupees)</p></div>

      {/* Summary */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:16, marginBottom:24 }}>
        {[['Total Annual','₹ 18,000','var(--blue)'],['Paid','₹ 12,000','var(--green)'],['Pending','₹ 6,000','var(--rose)']].map(([l,v,c]) => (
          <div key={l} className="glass-card" style={{ padding:20 }}>
            <div style={{ fontSize:'.72rem', color:'var(--text-muted)', fontFamily:'var(--font-mono)', marginBottom:6 }}>{l}</div>
            <div style={{ fontSize:'1.6rem', fontWeight:800, fontFamily:'var(--font-head)', color:c }}>{v}</div>
          </div>
        ))}
      </div>

      {/* Progress */}
      <div className="glass-card" style={{ padding:20, marginBottom:20 }}>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:12 }}>
          <h4>Annual Fee Progress</h4>
          <span style={{ fontFamily:'var(--font-mono)', color:'var(--green)', fontWeight:700 }}>{pct}% Paid</span>
        </div>
        <div className="progress-bar" style={{ height:12 }}>
          <div className="progress-fill fill-green" style={{ width:`${pct}%` }}/>
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', marginTop:8, fontSize:'.72rem', color:'var(--text-muted)', fontFamily:'var(--font-mono)' }}>
          <span>₹ 0</span><span>₹ 18,000</span>
        </div>
      </div>

      {pending > 0 && (
        <div className="alert alert-rose" style={{ marginBottom:20 }}>
          ⚠️ <strong>₹ {pending.toLocaleString('en-IN')} pending.</strong> Due date: <strong>10-05-2026</strong>. Late fee of ₹ 200/day after due date.
        </div>
      )}

      {/* History */}
      <div className="glass-card" style={{ padding:0, overflow:'hidden' }}>
        <div style={{ padding:'16px 20px', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between' }}>
          <h3>Payment History</h3>
          <button className="btn btn-ghost btn-sm"><Icon name="upload" size={14}/> Export</button>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Month</th><th>Amount</th><th>Mode</th><th>Date</th><th>Txn / Receipt</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {history.map(h => (
                <tr key={h.txn}>
                  <td style={{ fontWeight:500, color:'var(--text-primary)' }}>{h.month}</td>
                  <td style={{ fontFamily:'var(--font-mono)', fontWeight:700, color:'var(--green)' }}>₹ {h.amount.toLocaleString('en-IN')}</td>
                  <td>{h.mode}</td>
                  <td style={{ fontFamily:'var(--font-mono)' }}>{h.date}</td>
                  <td style={{ fontFamily:'var(--font-mono)', fontSize:'.75rem', color:'var(--text-muted)' }}>{h.txn}</td>
                  <td><span className="badge badge-green">{h.status}</span></td>
                  <td><button className="btn btn-ghost btn-sm">📄</button></td>
                </tr>
              ))}
              <tr style={{ background:'var(--rose-dim)' }}>
                <td style={{ fontWeight:600, color:'var(--rose)' }}>April 2026</td>
                <td style={{ fontFamily:'var(--font-mono)', fontWeight:700, color:'var(--rose)' }}>₹ 6,000</td>
                <td>—</td>
                <td style={{ fontFamily:'var(--font-mono)', color:'var(--rose)' }}>Due: 10-05-2026</td>
                <td>—</td>
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

export default function StudentDashboard() {
  const { user } = useAuth();
  const [active, setActive] = useState('home');
  const titles = { home:'Dashboard', timetable:'Timetable', assignments:'Assignments', performance:'Performance', fees:'Fee Management', notes:'Study Notes' };
  const subtitles = { home:`Class 10A · Student`, timetable:'Class 10A · AY 2025–2026', assignments:'Pending · Submitted · Graded', performance:'Topic-level analytics', fees:'₹ INR · DD-MM-YYYY', notes:'Uploaded by teachers' };
  return (
    <AppShell nav={NAV} active={active} setActive={setActive} title={titles[active]} subtitle={subtitles[active]} notifications={{ assignments:2 }}>
      {active==='home'        && <Home user={user}/>}
      {active==='timetable'   && <Timetable/>}
      {active==='assignments' && <Assignments/>}
      {active==='performance' && <Performance/>}
      {active==='fees'        && <Fees/>}
      {active==='notes'       && <div className="glass-card fade-up" style={{ padding:40 }}><div className="empty-state"><div className="icon">📚</div><p>Notes uploaded by your teachers will appear here.</p></div></div>}
    </AppShell>
  );
}
