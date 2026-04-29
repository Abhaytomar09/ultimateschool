import React, { useState } from 'react';
import { AppShell, Icon } from '../components/AppShell';
import { CountUp, ProgressRing } from '../components/Widgets';
import { useAuth } from '../context/AuthContext';

const NAV = [
  { id:'home',        label:'Dashboard',    icon:'home' },
  { id:'attendance',  label:'Attendance',   icon:'calendar' },
  { id:'assignments', label:'Assignments',  icon:'assignment' },
  { id:'marks',       label:'Enter Marks',  icon:'chart' },
  { id:'notes',       label:'Upload Notes', icon:'upload' },
  { id:'broadcast',   label:'Broadcast',    icon:'message' },
];

const MY_CLASSES = [
  { id:1, class:'10A', sub:'Mathematics', students:42, time:'08:00–08:45', status:'done' },
  { id:2, class:'10B', sub:'Mathematics', students:38, time:'09:00–09:45', status:'live' },
  { id:3, class:'9A',  sub:'Mathematics', students:40, time:'11:00–11:45', status:'upcoming' },
];

const STUDENTS = [
  { id:'ST0001', name:'Ankit Verma',   att:68, score:62 },
  { id:'ST0002', name:'Priya Sharma',  att:92, score:88 },
  { id:'ST0003', name:'Rahul Singh',   att:80, score:74 },
  { id:'ST0004', name:'Neha Gupta',    att:55, score:45 },
  { id:'ST0005', name:'Vikash Kumar',  att:88, score:78 },
  { id:'ST0006', name:'Sana Siddiqui', att:72, score:70 },
];

const PENDING_ASSIGNMENTS = [
  { id:1, class:'10A', title:'Algebra Ch.5 Problems',      due:'02-05-2026', submitted:34, total:42 },
  { id:2, class:'10B', title:'Linear Equations Worksheet', due:'30-04-2026', submitted:38, total:38 },
  { id:3, class:'9A',  title:'Quadratic Equations',        due:'05-05-2026', submitted:12, total:40 },
];

function HomeDash({ user }) {
  const lowAtt = STUDENTS.filter(s => s.att < 75);
  return (
    <div className="fade-up">
      <div style={{ marginBottom:24 }}>
        <h2 style={{ fontSize:'1.5rem' }}>Welcome, {user?.name?.split(' ')[0]} 🧑‍🏫</h2>
        <p style={{ fontFamily:'var(--font-mono)', fontSize:'.8rem', marginTop:4 }}>
          Subject: Mathematics &nbsp;·&nbsp; {new Date().toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long'})}
        </p>
      </div>

      <div className="grid gap-4 stagger" style={{ gridTemplateColumns:'repeat(4,1fr)', marginBottom:24 }}>
        {[
          { icon:'📚', val:3,   label:'Classes Today',    sub:'1 Live Now',       color:'var(--blue)',   dim:'var(--blue-dim)' },
          { icon:'👨‍🎓', val:120, label:'Total Students',  sub:'Across 3 classes', color:'var(--purple)', dim:'var(--purple-dim)' },
          { icon:'📝', val:8,   label:'Pending Reviews',  sub:'Assignments',      color:'var(--amber)',  dim:'var(--amber-dim)' },
          { icon:'⚠️', val:lowAtt.length, label:'Low Attendance', sub:'Below 75%', color:'var(--rose)', dim:'var(--rose-dim)' },
        ].map((s,i) => (
          <div key={i} className="stat-card fade-up">
            <div className="stat-icon" style={{ background:s.dim, color:s.color }}>{s.icon}</div>
            <div>
              <div className="stat-value" style={{ color:s.color }}><CountUp to={s.val}/></div>
              <div className="stat-label">{s.label}</div>
              <div className="stat-sub">{s.sub}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4" style={{ gridTemplateColumns:'1fr 1fr' }}>
        {/* Today's classes */}
        <div className="glass-card" style={{ padding:20 }}>
          <h3 style={{ marginBottom:16 }}>📅 Today's Classes</h3>
          {MY_CLASSES.map(c => (
            <div key={c.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 0', borderBottom:'1px solid var(--border)' }}>
              <div>
                <div style={{ fontWeight:600, color:'var(--text-primary)' }}>
                  Class {c.class} — {c.sub}
                  {c.status==='live' && <><span className="pulse-dot" style={{ marginLeft:8 }}/><span style={{ fontSize:'.7rem', color:'var(--green)', marginLeft:6 }}>LIVE</span></>}
                </div>
                <div style={{ fontSize:'.72rem', color:'var(--text-muted)', fontFamily:'var(--font-mono)', marginTop:2 }}>{c.time} · {c.students} students</div>
              </div>
              {c.status==='live'     && <button className="btn btn-green btn-sm">Start</button>}
              {c.status==='done'     && <span className="badge badge-green">Done</span>}
              {c.status==='upcoming' && <span className="badge badge-blue">Soon</span>}
            </div>
          ))}
        </div>

        {/* Low attendance */}
        <div className="glass-card" style={{ padding:20 }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:16 }}>
            <h3>⚠️ Attendance Alerts</h3>
            <span className="badge badge-rose">{lowAtt.length} Students</span>
          </div>
          {lowAtt.map(s => (
            <div key={s.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom:'1px solid var(--border)' }}>
              <div>
                <div style={{ fontWeight:500, color:'var(--text-primary)', fontSize:'.88rem' }}>{s.name}</div>
                <div style={{ fontSize:'.7rem', color:'var(--text-muted)', fontFamily:'var(--font-mono)' }}>{s.id}</div>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div style={{ width:60 }}>
                  <div className="progress-bar">
                    <div className="progress-fill fill-rose" style={{ width:`${s.att}%` }}/>
                  </div>
                </div>
                <span style={{ fontFamily:'var(--font-mono)', fontWeight:700, color:'var(--rose)', fontSize:'.85rem' }}>{s.att}%</span>
              </div>
            </div>
          ))}
          <button className="btn btn-ghost btn-sm w-full" style={{ marginTop:12 }}>Notify Parents</button>
        </div>
      </div>

      {/* Assignment review */}
      <div className="glass-card" style={{ padding:20, marginTop:20 }}>
        <h3 style={{ marginBottom:16 }}>📋 Assignment Review Status</h3>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Class</th><th>Assignment</th><th>Due</th><th>Submissions</th><th>Progress</th><th></th></tr></thead>
            <tbody>
              {PENDING_ASSIGNMENTS.map(a => {
                const pct = Math.round((a.submitted/a.total)*100);
                return (
                  <tr key={a.id}>
                    <td><span className="badge badge-blue">Class {a.class}</span></td>
                    <td style={{ fontWeight:500, color:'var(--text-primary)' }}>{a.title}</td>
                    <td style={{ fontFamily:'var(--font-mono)', fontSize:'.8rem' }}>{a.due}</td>
                    <td style={{ fontFamily:'var(--font-mono)' }}>{a.submitted}/{a.total}</td>
                    <td style={{ width:120 }}>
                      <div className="progress-bar"><div className={`progress-fill ${pct===100?'fill-green':'fill-blue'}`} style={{ width:`${pct}%` }}/></div>
                    </td>
                    <td><button className="btn btn-ghost btn-sm">Review</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AttendancePage() {
  const [marks, setMarks] = useState(Object.fromEntries(STUDENTS.map(s => [s.id,'Present'])));
  const [selectedClass, setSelectedClass] = useState('10A');
  const counts = { Present: Object.values(marks).filter(v=>v==='Present').length, Absent: Object.values(marks).filter(v=>v==='Absent').length, Late: Object.values(marks).filter(v=>v==='Late').length };

  return (
    <div className="fade-up">
      <div className="page-header"><h2>✅ Mark Attendance</h2><p>Session-based tracking · {new Date().toLocaleDateString('en-IN',{day:'2-digit',month:'2-digit',year:'numeric'}).replace(/\//g,'-')}</p></div>

      <div style={{ display:'flex', gap:12, marginBottom:20, alignItems:'center' }}>
        {['10A','10B','9A'].map(c => (
          <button key={c} className={`btn ${selectedClass===c?'btn-primary':'btn-ghost'}`} onClick={() => setSelectedClass(c)}>Class {c}</button>
        ))}
        <div style={{ marginLeft:'auto', display:'flex', gap:10 }}>
          {[['Present','var(--green)'],['Absent','var(--rose)'],['Late','var(--amber)']].map(([s,c]) => (
            <div key={s} style={{ fontFamily:'var(--font-mono)', fontSize:'.8rem' }}>
              <span style={{ color:c, fontWeight:700 }}>{counts[s]}</span> <span style={{ color:'var(--text-muted)' }}>{s}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card" style={{ padding:0, overflow:'hidden' }}>
        <div className="table-wrap">
          <table>
            <thead><tr><th>#</th><th>Student</th><th>ID</th><th>Overall Att.</th><th>Today's Status</th></tr></thead>
            <tbody>
              {STUDENTS.map((s,i) => (
                <tr key={s.id}>
                  <td style={{ color:'var(--text-muted)', fontFamily:'var(--font-mono)' }}>{i+1}</td>
                  <td style={{ fontWeight:500, color:'var(--text-primary)' }}>{s.name}</td>
                  <td><span className="id-badge">{s.id}</span></td>
                  <td>
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                      <div style={{ width:60 }}>
                        <div className="progress-bar"><div className={`progress-fill ${s.att>=75?'fill-green':s.att>=60?'fill-blue':'fill-rose'}`} style={{ width:`${s.att}%` }}/></div>
                      </div>
                      <span style={{ fontFamily:'var(--font-mono)', fontSize:'.8rem', color:s.att>=75?'var(--green)':s.att>=60?'var(--amber)':'var(--rose)' }}>{s.att}%</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display:'flex', gap:6 }}>
                      {['Present','Absent','Late'].map(status => (
                        <button key={status}
                          className={`btn btn-sm ${marks[s.id]===status ? (status==='Present'?'btn-green':status==='Absent'?'btn-rose':'btn-primary') : 'btn-ghost'}`}
                          onClick={() => setMarks(m => ({...m, [s.id]:status}))}>
                          {status}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ padding:'16px 20px', borderTop:'1px solid var(--border)', display:'flex', justifyContent:'flex-end', gap:12 }}>
          <button className="btn btn-ghost">Reset</button>
          <button className="btn btn-primary">Submit Attendance for Class {selectedClass}</button>
        </div>
      </div>
    </div>
  );
}

function BroadcastPage() {
  const [msg, setMsg] = useState('');
  return (
    <div className="fade-up">
      <div className="page-header"><h2>📢 Broadcast Message</h2><p>Send to class, parents, or all</p></div>
      <div className="glass-card" style={{ padding:24, maxWidth:560 }}>
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <div className="form-group">
            <label>Target Class</label>
            <select className="input"><option>Class 10A</option><option>Class 10B</option><option>Class 9A</option><option>All My Classes</option></select>
          </div>
          <div className="form-group">
            <label>Target Audience</label>
            <select className="input"><option>Students</option><option>Parents</option><option>Students + Parents</option></select>
          </div>
          <div className="form-group">
            <label>Subject</label>
            <input className="input" placeholder="e.g. Test tomorrow – Algebra Ch.5"/>
          </div>
          <div className="form-group">
            <label>Message</label>
            <textarea className="input" rows={5} placeholder="Type your message…" value={msg} onChange={e=>setMsg(e.target.value)}/>
          </div>
          <div style={{ display:'flex', gap:10, justifyContent:'flex-end' }}>
            <button className="btn btn-ghost">Preview</button>
            <button className="btn btn-primary" disabled={!msg.trim()}><Icon name="message" size={15}/> Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [active, setActive] = useState('home');
  const titles = { home:'Dashboard', attendance:'Mark Attendance', assignments:'Assignments', marks:'Enter Marks', notes:'Upload Notes', broadcast:'Broadcast' };
  const subtitles = { home:'Teacher Portal', attendance:'Session-based tracking', assignments:'Create & review', marks:'Subject-wise entry', notes:'Share resources', broadcast:'Class announcements' };
  return (
    <AppShell nav={NAV} active={active} setActive={setActive} title={titles[active]} subtitle={subtitles[active]} notifications={{ assignments:3 }}>
      {active==='home'       && <HomeDash user={user}/>}
      {active==='attendance' && <AttendancePage/>}
      {active==='broadcast'  && <BroadcastPage/>}
      {['assignments','marks','notes'].includes(active) && (
        <div className="glass-card fade-up" style={{ padding:40 }}><div className="empty-state"><div className="icon">🚧</div><p>Coming in Phase 2 — Full {titles[active]} module</p></div></div>
      )}
    </AppShell>
  );
}
