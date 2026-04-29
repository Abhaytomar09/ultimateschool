import React, { useState } from 'react';
import { AppShell } from '../components/AppShell';
import { formatDate, formatRupees, getAttendanceColor } from '../utils/format';
import { useAuth } from '../context/AuthContext';

const NAV = [
  { id: 'home',        label: 'Dashboard',    icon: 'home' },
  { id: 'timetable',   label: 'Timetable',    icon: 'calendar' },
  { id: 'assignments', label: 'Assignments',  icon: 'assignment' },
  { id: 'notes',       label: 'Notes',        icon: 'book' },
  { id: 'performance', label: 'Performance',  icon: 'chart' },
  { id: 'fees',        label: 'Fees',         icon: 'rupee' },
];

// ── Mock Data ────────────────────────────────────────────────
const TODAY_CLASSES = [
  { id: 1, subject: 'Mathematics', teacher: 'Sunita Sharma', time: '08:00 – 08:45', status: 'completed', room: '10A' },
  { id: 2, subject: 'Physics',     teacher: 'Vikram Singh',  time: '09:00 – 09:45', status: 'live',      room: '10A' },
  { id: 3, subject: 'English',     teacher: 'Priya Gupta',   time: '10:00 – 10:45', status: 'upcoming',  room: '10A' },
  { id: 4, subject: 'Chemistry',   teacher: 'Anil Sharma',   time: '11:00 – 11:45', status: 'upcoming',  room: '10A' },
];

const ASSIGNMENTS = [
  { id: 1, subject: 'Mathematics', title: 'Algebra – Chapter 5 Problems', due: '02-05-2026', status: 'pending' },
  { id: 2, subject: 'Physics',     title: 'Laws of Motion – Numericals',  due: '30-04-2026', status: 'submitted' },
  { id: 3, subject: 'English',     title: 'Essay: Digital India',          due: '05-05-2026', status: 'pending' },
];

const PERFORMANCE = [
  { subject: 'Mathematics', score: 62, topic_weak: 'Algebra' },
  { subject: 'Physics',     score: 78, topic_weak: null },
  { subject: 'English',     score: 85, topic_weak: null },
  { subject: 'Chemistry',   score: 44, topic_weak: 'Thermodynamics' },
];

const FEE_DATA = {
  total: 18000, paid: 12000, pending: 6000,
  history: [
    { month: 'March 2026', amount: 4000, mode: 'Online', date: '05-03-2026', status: 'Paid' },
    { month: 'February 2026', amount: 4000, mode: 'Offline', date: '03-02-2026', status: 'Paid' },
    { month: 'January 2026', amount: 4000, mode: 'Online', date: '02-01-2026', status: 'Paid' },
  ]
};

// ── SubPages ─────────────────────────────────────────────────

function HomeDash({ user }) {
  const attendance = 82;
  const attColor = getAttendanceColor(attendance);

  return (
    <>
      <div className="page-header">
        <h2>नमस्ते, {user.name} 👋</h2>
        <p>Class 10A &nbsp;|&nbsp; Today is {new Date().toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}</p>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4" style={{ gridTemplateColumns:'repeat(4,1fr)', marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background:'var(--primary-bg)', color:'var(--primary)' }}>📚</div>
          <div>
            <div className="stat-value">4</div>
            <div className="stat-label">Classes Today</div>
            <div className="stat-sub">1 Live Now</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background:attendance>=75?'var(--success-bg)':'var(--danger-bg)', color:attendance>=75?'var(--success)':'var(--danger)' }}>✅</div>
          <div>
            <div className="stat-value">{attendance}%</div>
            <div className="stat-label">Attendance</div>
            <div className="stat-sub">{attendance >= 75 ? 'Good standing' : '⚠️ Below 75%'}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background:'var(--warning-bg)', color:'var(--warning)' }}>📝</div>
          <div>
            <div className="stat-value">2</div>
            <div className="stat-label">Pending Tasks</div>
            <div className="stat-sub">Due this week</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background:'var(--danger-bg)', color:'var(--danger)' }}>₹</div>
          <div>
            <div className="stat-value fee-amount pending" style={{ fontSize:'1.1rem' }}>{formatRupees(6000)}</div>
            <div className="stat-label">Fees Pending</div>
            <div className="stat-sub">Due: 10-05-2026</div>
          </div>
        </div>
      </div>

      {/* Today's Classes + Assignments */}
      <div className="grid gap-4" style={{ gridTemplateColumns:'1fr 1fr' }}>
        <div className="card">
          <div className="card-header">
            <h3>📅 Today's Classes</h3>
            <span className="badge badge-success">Wednesday</span>
          </div>
          {TODAY_CLASSES.map(cls => (
            <div key={cls.id} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid var(--gray-100)' }}>
              <div>
                <div style={{ fontWeight:600, fontSize:'.9rem' }}>{cls.subject}</div>
                <div style={{ fontSize:'.75rem', color:'var(--gray-400)' }}>{cls.teacher} &nbsp;·&nbsp; {cls.time}</div>
              </div>
              {cls.status === 'live' && <button className="btn btn-primary btn-sm">Join Now</button>}
              {cls.status === 'completed' && <span className="badge badge-success">Done</span>}
              {cls.status === 'upcoming' && <span className="badge badge-primary">Soon</span>}
            </div>
          ))}
        </div>

        <div>
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="card-header"><h3>📝 Assignments</h3></div>
            {ASSIGNMENTS.map(a => (
              <div key={a.id} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid var(--gray-100)' }}>
                <div>
                  <div style={{ fontWeight:500, fontSize:'.875rem' }}>{a.title}</div>
                  <div style={{ fontSize:'.72rem', color:'var(--gray-400)' }}>{a.subject} &nbsp;·&nbsp; Due: {a.due}</div>
                </div>
                <span className={`badge ${a.status === 'submitted' ? 'badge-success' : 'badge-warning'}`}>{a.status}</span>
              </div>
            ))}
          </div>

          <div className="card">
            <div className="card-header"><h3>📊 Performance</h3></div>
            {PERFORMANCE.map(p => (
              <div key={p.subject} style={{ marginBottom:12 }}>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:'.8rem', marginBottom:4 }}>
                  <span style={{ fontWeight:500 }}>{p.subject}</span>
                  <span style={{ color: p.score < 50 ? 'var(--danger)' : p.score < 75 ? 'var(--warning)' : 'var(--success)', fontWeight:700 }}>{p.score}%</span>
                </div>
                <div className="progress-bar">
                  <div className={`progress-fill ${p.score<50?'danger':p.score<75?'warning':'success'}`} style={{ width:`${p.score}%` }} />
                </div>
                {p.topic_weak && <div style={{ fontSize:'.7rem', color:'var(--danger)', marginTop:3 }}>⚠️ Weak in {p.topic_weak}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function TimetablePage() {
  const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const periods = [
    { time:'08:00–08:45', subjects: ['Mathematics','Physics','English','Chemistry','Mathematics','Physics'] },
    { time:'09:00–09:45', subjects: ['Physics','English','Mathematics','Physics','Chemistry','English'] },
    { time:'10:00–10:45', subjects: ['English','Chemistry','Physics','English','Physics','—'] },
    { time:'11:00–11:45', subjects: ['Chemistry','Mathematics','Chemistry','Mathematics','English','—'] },
    { time:'12:00–12:45', subjects: ['Lunch','Lunch','Lunch','Lunch','Lunch','—'] },
    { time:'13:00–13:45', subjects: ['Hindi','Hindi','Hindi','Hindi','Hindi','—'] },
  ];
  return (
    <>
      <div className="page-header"><h2>📅 Timetable</h2><p>Class 10A — Academic Year 2025–2026</p></div>
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Time</th>
                {days.map(d => <th key={d}>{d}</th>)}
              </tr>
            </thead>
            <tbody>
              {periods.map((p,i) => (
                <tr key={i}>
                  <td style={{ fontWeight:600, whiteSpace:'nowrap', color:'var(--primary)' }}>{p.time}</td>
                  {p.subjects.map((s,j) => (
                    <td key={j} style={{ fontWeight: s==='Lunch'?700:400, color: s==='Lunch'?'var(--accent)':s==='—'?'var(--gray-300)':'inherit' }}>{s}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function FeesPage() {
  return (
    <>
      <div className="page-header"><h2>💰 Fee Status</h2><p>Academic Year 2025–2026</p></div>
      <div className="grid gap-4" style={{ gridTemplateColumns:'1fr 1fr 1fr', marginBottom:24 }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background:'var(--primary-bg)', color:'var(--primary)' }}>📋</div>
          <div><div className="stat-value">{formatRupees(FEE_DATA.total)}</div><div className="stat-label">Total Annual Fee</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background:'var(--success-bg)', color:'var(--success)' }}>✅</div>
          <div><div className="stat-value" style={{ color:'var(--success)' }}>{formatRupees(FEE_DATA.paid)}</div><div className="stat-label">Paid Amount</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background:'var(--danger-bg)', color:'var(--danger)' }}>⏳</div>
          <div><div className="stat-value" style={{ color:'var(--danger)' }}>{formatRupees(FEE_DATA.pending)}</div><div className="stat-label">Pending</div></div>
        </div>
      </div>

      {FEE_DATA.pending > 0 && (
        <div className="alert alert-warning" style={{ marginBottom:24 }}>
          ⚠️ You have {formatRupees(FEE_DATA.pending)} pending. Due date: <strong>10-05-2026</strong>. Please pay to avoid late fee.
        </div>
      )}

      <div className="card">
        <div className="card-header"><h3>Payment History</h3></div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Month</th><th>Amount</th><th>Mode</th><th>Date</th><th>Status</th><th>Receipt</th></tr></thead>
            <tbody>
              {FEE_DATA.history.map((h,i) => (
                <tr key={i}>
                  <td style={{ fontWeight:500 }}>{h.month}</td>
                  <td style={{ fontWeight:700 }}>{formatRupees(h.amount)}</td>
                  <td>{h.mode}</td>
                  <td>{h.date}</td>
                  <td><span className="badge badge-success">{h.status}</span></td>
                  <td><button className="btn btn-secondary btn-sm">Download</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function PerformancePage() {
  const rank = 12, total = 180;
  const examScore = 68, assignScore = 72, attendScore = 82;
  const finalScore = Math.round(examScore*0.6 + assignScore*0.25 + attendScore*0.15);

  const topics = [
    { subject:'Mathematics', topics:[{name:'Algebra',score:38},{name:'Geometry',score:72},{name:'Trigonometry',score:61}] },
    { subject:'Chemistry',   topics:[{name:'Thermodynamics',score:40},{name:'Organic Chemistry',score:55},{name:'Periodic Table',score:74}] },
  ];

  return (
    <>
      <div className="page-header"><h2>📊 Performance & Insights</h2><p>Academic Year 2025–2026 | Class 10A (All Sections Combined)</p></div>

      {/* Rank Card */}
      <div className="card" style={{ marginBottom:20, background:'linear-gradient(135deg,var(--primary-dark),var(--primary))', color:'#fff', border:'none' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div>
            <div style={{ fontSize:'.8rem', opacity:.7, marginBottom:6 }}>Your Class Rank</div>
            <div style={{ fontSize:'3rem', fontWeight:800, lineHeight:1 }}>{rank} <span style={{ fontSize:'1.2rem', fontWeight:500, opacity:.7 }}>/ {total}</span></div>
            <div style={{ fontSize:'.8rem', opacity:.7, marginTop:6 }}>Combined score of all Class 10 sections</div>
          </div>
          <div style={{ textAlign:'right' }}>
            <div style={{ fontSize:'.75rem', opacity:.7 }}>Final Score</div>
            <div style={{ fontSize:'2.2rem', fontWeight:800 }}>{finalScore}%</div>
            <div style={{ fontSize:'.72rem', opacity:.6 }}>Exams 60% + Assignments 25% + Attendance 15%</div>
          </div>
        </div>
        <div style={{ marginTop:20, display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
          {[['📝 Exams','60%',examScore,'%'],['📚 Assignments','25%',assignScore,'%'],['✅ Attendance','15%',attendScore,'%']].map(([label,wt,val]) => (
            <div key={label} style={{ background:'rgba(255,255,255,.1)', borderRadius:'var(--radius-sm)', padding:12 }}>
              <div style={{ fontSize:'.7rem', opacity:.7 }}>{label} (weight {wt})</div>
              <div style={{ fontSize:'1.4rem', fontWeight:700 }}>{val}%</div>
              <div className="progress-bar" style={{ background:'rgba(255,255,255,.2)', marginTop:6 }}>
                <div style={{ height:'100%', width:`${val}%`, background:'rgba(255,255,255,.8)', borderRadius:'9999px' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Topic Weakness */}
      <h3 style={{ marginBottom:14, color:'var(--gray-700)' }}>🔍 Topic-Level Analysis</h3>
      {topics.map(sub => (
        <div key={sub.subject} className="card" style={{ marginBottom:16 }}>
          <div className="card-header"><h4>{sub.subject}</h4></div>
          {sub.topics.map(t => {
            const cls = t.score >= 75 ? 'success' : t.score >= 50 ? 'warning' : 'danger';
            const label = t.score >= 75 ? 'Strong' : t.score >= 50 ? 'Average' : 'Weak';
            return (
              <div key={t.name} style={{ marginBottom:12 }}>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:'.85rem', marginBottom:4 }}>
                  <span style={{ fontWeight:500 }}>{t.name}</span>
                  <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                    <span style={{ fontWeight:700, color:`var(--${cls})` }}>{t.score}%</span>
                    <span className={`badge badge-${cls}`}>{label}</span>
                  </div>
                </div>
                <div className="progress-bar">
                  <div className={`progress-fill ${cls}`} style={{ width:`${t.score}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      ))}

      {/* Insights */}
      <div className="card" style={{ borderLeft:'4px solid var(--primary)' }}>
        <h3 style={{ marginBottom:14 }}>💡 AI Insights & Improvement Strategy</h3>
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {[
            { icon:'⚠️', title:'Algebra is your weakest topic', desc:'Your score of 38% in Algebra is significantly below the class average. Focus on practising basic equations and linear expressions daily.', color:'danger' },
            { icon:'⚠️', title:'Thermodynamics needs attention', desc:'Score of 40% in Thermodynamics. Revisit first and second laws. Practise numerical problems with standard formulae.', color:'warning' },
            { icon:'✅', title:'English is your strength', desc:'Maintain your 85% score. Continue regular reading and essay practice.', color:'success' },
          ].map((ins,i) => (
            <div key={i} style={{ padding:14, background:`var(--${ins.color}-bg)`, borderRadius:'var(--radius-sm)', border:`1px solid var(--${ins.color === 'success' ? 'success' : ins.color === 'warning' ? 'warning' : 'danger'})`, borderOpacity:.3 }}>
              <div style={{ fontWeight:600, marginBottom:4 }}>{ins.icon} {ins.title}</div>
              <div style={{ fontSize:'.83rem', color:'var(--gray-600)' }}>{ins.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ── Main Export ───────────────────────────────────────────────
export default function StudentDashboard() {
  const { user } = useAuth();
  const [active, setActive] = useState('home');

  const titles = {
    home: ['Dashboard', `Welcome back, ${user?.name}`],
    timetable: ['My Timetable', 'Class 10A schedule'],
    assignments: ['Assignments', 'Your tasks and submissions'],
    notes: ['Notes', 'Study materials uploaded by teachers'],
    performance: ['Performance', 'Your academic insights'],
    fees: ['Fee Management', 'View and track your fee payments'],
  };

  const [title, subtitle] = titles[active] || ['Dashboard', ''];

  return (
    <AppShell navItems={NAV} active={active} setActive={setActive} title={title} subtitle={subtitle}>
      {active === 'home'        && <HomeDash user={user} />}
      {active === 'timetable'   && <TimetablePage />}
      {active === 'fees'        && <FeesPage />}
      {active === 'performance' && <PerformancePage />}
      {active === 'assignments' && (
        <div className="card">
          <div className="card-header"><h3>📝 All Assignments</h3></div>
          {ASSIGNMENTS.map(a => (
            <div key={a.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'14px 0', borderBottom:'1px solid var(--gray-100)' }}>
              <div>
                <div style={{ fontWeight:600 }}>{a.title}</div>
                <div style={{ fontSize:'.75rem', color:'var(--gray-400)', marginTop:4 }}>{a.subject} · Due: {a.due}</div>
              </div>
              <div style={{ display:'flex', gap:10, alignItems:'center' }}>
                <span className={`badge ${a.status==='submitted'?'badge-success':'badge-warning'}`}>{a.status}</span>
                {a.status === 'pending' && <button className="btn btn-primary btn-sm">Submit</button>}
              </div>
            </div>
          ))}
        </div>
      )}
      {active === 'notes' && (
        <div className="card">
          <div className="empty-state">
            <div className="icon">📚</div>
            <p>Notes uploaded by your teachers will appear here.</p>
          </div>
        </div>
      )}
    </AppShell>
  );
}
