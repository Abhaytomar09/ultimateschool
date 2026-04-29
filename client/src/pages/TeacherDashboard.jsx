import React, { useState } from 'react';
import { AppShell } from '../components/AppShell';
import { useAuth } from '../context/AuthContext';

const NAV = [
  { id: 'home',       label: 'Dashboard',   icon: 'home' },
  { id: 'attendance', label: 'Attendance',  icon: 'calendar' },
  { id: 'assignments',label: 'Assignments', icon: 'assignment' },
  { id: 'marks',      label: 'Enter Marks', icon: 'chart' },
  { id: 'notes',      label: 'Notes',       icon: 'book' },
  { id: 'broadcast',  label: 'Broadcast',   icon: 'bell' },
];

const MY_CLASSES = [
  { class:'10A', subject:'Mathematics', students:42, time:'08:00–08:45', day:'Monday,Wednesday,Friday' },
  { class:'10B', subject:'Mathematics', students:38, time:'09:00–09:45', day:'Tuesday,Thursday' },
  { class:'9A',  subject:'Mathematics', students:40, time:'11:00–11:45', day:'Monday,Wednesday' },
];

const STUDENTS = [
  { id:'ST0001', name:'Ankit Verma',    attendance:68, score:62 },
  { id:'ST0002', name:'Priya Sharma',   attendance:92, score:88 },
  { id:'ST0003', name:'Rahul Singh',    attendance:80, score:74 },
  { id:'ST0004', name:'Neha Gupta',     attendance:55, score:45 },
  { id:'ST0005', name:'Vikash Kumar',   attendance:88, score:78 },
];

function TeacherHome({ user }) {
  const todayClasses = [
    { id:1, class:'10A', subject:'Mathematics', time:'08:00–08:45', status:'completed' },
    { id:2, class:'10B', subject:'Mathematics', time:'09:00–09:45', status:'live' },
    { id:3, class:'9A',  subject:'Mathematics', time:'11:00–11:45', status:'upcoming' },
  ];

  return (
    <>
      <div className="page-header">
        <h2>नमस्ते, {user?.name} 👋</h2>
        <p>Subject: Mathematics · {new Date().toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long' })}</p>
      </div>

      <div className="grid gap-4" style={{ gridTemplateColumns:'repeat(4,1fr)', marginBottom:24 }}>
        {[['📚','3','Classes Today','1 Live Now','primary'],['👨‍🎓','120','Total Students','Across 3 classes','primary'],['📝','8','Pending Reviews','Assignments','warning'],['⚠️','4','Low Attendance','Below 75%','danger']].map(([icon,val,label,sub,color]) => (
          <div key={label} className="stat-card">
            <div className="stat-icon" style={{ background:`var(--${color}-bg)`, color:`var(--${color})` }}>{icon}</div>
            <div><div className="stat-value">{val}</div><div className="stat-label">{label}</div><div className="stat-sub">{sub}</div></div>
          </div>
        ))}
      </div>

      <div className="grid gap-4" style={{ gridTemplateColumns:'1fr 1fr' }}>
        <div className="card">
          <div className="card-header"><h3>📅 Today's Classes</h3></div>
          {todayClasses.map(c => (
            <div key={c.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 0', borderBottom:'1px solid var(--gray-100)' }}>
              <div>
                <div style={{ fontWeight:600 }}>Class {c.class} — {c.subject}</div>
                <div style={{ fontSize:'.75rem', color:'var(--gray-400)' }}>{c.time}</div>
              </div>
              <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                {c.status==='live'      && <><span className="badge badge-success">LIVE</span><button className="btn btn-primary btn-sm">Start</button></>}
                {c.status==='completed' && <span className="badge badge-primary">Done</span>}
                {c.status==='upcoming'  && <span className="badge" style={{ background:'var(--gray-100)', color:'var(--gray-500)' }}>Upcoming</span>}
              </div>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="card-header"><h3>⚠️ Low Attendance Alert</h3></div>
          {STUDENTS.filter(s => s.attendance < 75).map(s => (
            <div key={s.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom:'1px solid var(--gray-100)' }}>
              <div>
                <div style={{ fontWeight:500, fontSize:'.875rem' }}>{s.name}</div>
                <div style={{ fontSize:'.72rem', color:'var(--gray-400)' }}>ID: {s.id}</div>
              </div>
              <span className="badge badge-danger">{s.attendance}%</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function AttendancePage() {
  const [marks, setMarks] = useState(Object.fromEntries(STUDENTS.map(s => [s.id, 'Present'])));
  return (
    <>
      <div className="page-header">
        <h2>✅ Mark Attendance</h2>
        <p>Class 10A — Mathematics — {new Date().toLocaleDateString('en-IN', { day:'2-digit', month:'2-digit', year:'numeric' }).replace(/\//g,'-')}</p>
      </div>
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead><tr><th>#</th><th>Student Name</th><th>Student ID</th><th>Status</th></tr></thead>
            <tbody>
              {STUDENTS.map((s,i) => (
                <tr key={s.id}>
                  <td>{i+1}</td>
                  <td style={{ fontWeight:500 }}>{s.name}</td>
                  <td><span className="id-badge">{s.id}</span></td>
                  <td>
                    <div style={{ display:'flex', gap:8 }}>
                      {['Present','Absent','Late'].map(status => (
                        <button key={status} className={`btn btn-sm ${marks[s.id]===status ? (status==='Present'?'btn-success':status==='Absent'?'btn-danger':'btn-primary') : 'btn-secondary'}`}
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
        <div style={{ marginTop:20, display:'flex', justifyContent:'flex-end', gap:12 }}>
          <button className="btn btn-secondary">Reset</button>
          <button className="btn btn-primary">Submit Attendance</button>
        </div>
      </div>
    </>
  );
}

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [active, setActive] = useState('home');

  const titles = {
    home:'Dashboard', attendance:'Mark Attendance', assignments:'Assignments',
    marks:'Enter Marks', notes:'Upload Notes', broadcast:'Broadcast Message'
  };

  return (
    <AppShell navItems={NAV} active={active} setActive={setActive} title={titles[active]} subtitle="Teacher Portal">
      {active === 'home'       && <TeacherHome user={user} />}
      {active === 'attendance' && <AttendancePage />}
      {active === 'broadcast'  && (
        <div className="card" style={{ maxWidth:560 }}>
          <h3 style={{ marginBottom:20 }}>📢 Broadcast Message</h3>
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <div className="form-group">
              <label>Select Class</label>
              <select className="input"><option>Class 10A</option><option>Class 10B</option><option>Class 9A</option></select>
            </div>
            <div className="form-group">
              <label>Subject (Optional)</label>
              <select className="input"><option>All Subjects</option><option>Mathematics</option></select>
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea className="input" rows={4} placeholder="Type your message here…" style={{ resize:'vertical' }} />
            </div>
            <button className="btn btn-primary">Send to Class 10A</button>
          </div>
        </div>
      )}
      {['assignments','marks','notes'].includes(active) && (
        <div className="card"><div className="empty-state"><div className="icon">🚧</div><p>This section is under development.</p></div></div>
      )}
    </AppShell>
  );
}
