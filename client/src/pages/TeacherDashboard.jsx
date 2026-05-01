import React, { useState, useEffect } from 'react';
import axios from 'axios';
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

function HomeDash({ user, data }) {
  if (!data) return <div className="fade-up">Loading...</div>;
  const { myClasses, lowAttendanceStudents, pendingAssignments } = data;
  const lowAtt = lowAttendanceStudents;

  return (
    <div className="fade-up">
      <div style={{ marginBottom:24 }}>
        <h2 style={{ fontSize:'1.5rem' }}>Welcome, {user?.name?.split(' ')[0]} 🧑‍🏫</h2>
        <p style={{ fontFamily:'var(--font-mono)', fontSize:'.8rem', marginTop:4 }}>
          {new Date().toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long'})}
        </p>
      </div>

      <div className="grid gap-4 stagger" style={{ gridTemplateColumns:'repeat(4,1fr)', marginBottom:24 }}>
        {[
          { icon:'📚', val:myClasses.length,   label:'Classes Today',    sub:'Scheduled',       color:'var(--blue)',   dim:'var(--blue-dim)' },
          { icon:'👨‍🎓', val:myClasses.reduce((acc, c)=>acc+c.students,0), label:'Total Students',  sub:`Across ${myClasses.length} classes`, color:'var(--purple)', dim:'var(--purple-dim)' },
          { icon:'📝', val:pendingAssignments.length,   label:'Pending Reviews',  sub:'Assignments',      color:'var(--amber)',  dim:'var(--amber-dim)' },
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
          {myClasses.map(c => (
            <div key={c.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 0', borderBottom:'1px solid var(--border)' }}>
              <div>
                <div style={{ fontWeight:600, color:'var(--text-primary)' }}>
                  Class {c.class} — {c.sub}
                  {c.status==='live' && <><span className="pulse-dot" style={{ marginLeft:8 }}/><span style={{ fontSize:'.7rem', color:'var(--green)', marginLeft:6 }}>LIVE</span></>}
                </div>
                <div style={{ fontSize:'.72rem', color:'var(--text-muted)', fontFamily:'var(--font-mono)', marginTop:2 }}>{c.time} · {c.students} students</div>
              </div>
              {c.status==='live'     && <button className="btn btn-green btn-sm" onClick={() => window.open(`https://meet.jit.si/ultimateschool_${c.class.replace(/\s+/g,'_')}`, '_blank')}>Start</button>}
              {c.status==='done'     && <span className="badge badge-green">Done</span>}
              {c.status==='upcoming' && <span className="badge badge-blue">Soon</span>}
            </div>
          ))}
          {myClasses.length === 0 && <div style={{textAlign:'center', color:'var(--text-muted)'}}>No classes scheduled today.</div>}
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
          {lowAtt.length === 0 && <div style={{textAlign:'center', color:'var(--text-muted)'}}>No attendance alerts!</div>}
          {lowAtt.length > 0 && <button className="btn btn-ghost btn-sm w-full" style={{ marginTop:12 }}>Notify Parents</button>}
        </div>
      </div>

      {/* Assignment review */}
      <div className="glass-card" style={{ padding:20, marginTop:20 }}>
        <h3 style={{ marginBottom:16 }}>📋 Assignment Review Status</h3>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Class</th><th>Assignment</th><th>Due</th><th>Submissions</th><th>Progress</th><th></th></tr></thead>
            <tbody>
              {pendingAssignments.map(a => {
                const pct = a.total === 0 ? 0 : Math.round((a.submitted/a.total)*100);
                return (
                  <tr key={a.id}>
                    <td><span className="badge badge-blue">Class {a.class}</span></td>
                    <td style={{ fontWeight:500, color:'var(--text-primary)' }}>{a.title}</td>
                    <td style={{ fontFamily:'var(--font-mono)', fontSize:'.8rem' }}>{new Date(a.due).toLocaleDateString()}</td>
                    <td style={{ fontFamily:'var(--font-mono)' }}>{a.submitted}/{a.total}</td>
                    <td style={{ width:120 }}>
                      <div className="progress-bar"><div className={`progress-fill ${pct===100?'fill-green':'fill-blue'}`} style={{ width:`${pct}%` }}/></div>
                    </td>
                    <td><button className="btn btn-ghost btn-sm">Review</button></td>
                  </tr>
                );
              })}
              {pendingAssignments.length === 0 && <tr><td colSpan="6" style={{textAlign:'center', color:'var(--text-muted)'}}>No pending assignments.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AttendancePage({ data, token }) {
  if(!data) return null;
  const [selectedClass, setSelectedClass] = useState(data.myClasses[0]?.id || '');
  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState({});

  useEffect(() => {
    if(!selectedClass) return;
    axios.get(`http://localhost:5000/api/teacher/students/${selectedClass}`, {
        headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
        setStudents(res.data);
        setMarks(Object.fromEntries(res.data.map(s => [s._id, 'Present'])));
    }).catch(console.error);
  }, [selectedClass, token]);

  const counts = { Present: Object.values(marks).filter(v=>v==='Present').length, Absent: Object.values(marks).filter(v=>v==='Absent').length, Late: Object.values(marks).filter(v=>v==='Late').length };

  const handleSubmit = async () => {
    try {
        await axios.post(`http://localhost:5000/api/teacher/attendance`, {
            classId: selectedClass,
            date: new Date().toISOString(),
            marks
        }, { headers: { Authorization: `Bearer ${token}` } });
        alert('Attendance submitted successfully!');
    } catch (e) {
        alert('Error submitting attendance');
    }
  };

  return (
    <div className="fade-up">
      <div className="page-header"><h2>✅ Mark Attendance</h2><p>Session-based tracking · {new Date().toLocaleDateString('en-IN',{day:'2-digit',month:'2-digit',year:'numeric'}).replace(/\//g,'-')}</p></div>

      <div style={{ display:'flex', gap:12, marginBottom:20, alignItems:'center' }}>
        {data.myClasses.map(c => (
          <button key={c.id} className={`btn ${selectedClass===c.id?'btn-primary':'btn-ghost'}`} onClick={() => setSelectedClass(c.id)}>Class {c.class}</button>
        ))}
        {data.myClasses.length === 0 && <span style={{color:'var(--text-muted)'}}>No classes assigned.</span>}
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
              {students.map((s,i) => (
                <tr key={s._id}>
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
                          className={`btn btn-sm ${marks[s._id]===status ? (status==='Present'?'btn-green':status==='Absent'?'btn-rose':'btn-primary') : 'btn-ghost'}`}
                          onClick={() => setMarks(m => ({...m, [s._id]:status}))}>
                          {status}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
              {students.length === 0 && <tr><td colSpan="5" style={{textAlign:'center', color:'var(--text-muted)'}}>Select a class or no students found.</td></tr>}
            </tbody>
          </table>
        </div>
        <div style={{ padding:'16px 20px', borderTop:'1px solid var(--border)', display:'flex', justifyContent:'flex-end', gap:12 }}>
          <button className="btn btn-primary" onClick={handleSubmit}>Submit Attendance</button>
        </div>
      </div>
    </div>
  );
}

function BroadcastPage({ data, token }) {
  const [msg, setMsg] = useState('');
  const handleSubmit = async () => {
      try {
          await axios.post(`http://localhost:5000/api/teacher/broadcast`, { message: msg }, {
              headers: { Authorization: `Bearer ${token}` }
          });
          alert('Broadcast sent!');
          setMsg('');
      } catch(e) {
          alert('Failed to send broadcast');
      }
  };
  return (
    <div className="fade-up">
      <div className="page-header"><h2>📢 Broadcast Message</h2><p>Send to class, parents, or all</p></div>
      <div className="glass-card" style={{ padding:24, maxWidth:560 }}>
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <div className="form-group">
            <label>Target Class</label>
            <select className="input"><option>All My Classes</option>{data?.myClasses.map(c => <option key={c.id}>Class {c.class}</option>)}</select>
          </div>
          <div className="form-group">
            <label>Target Audience</label>
            <select className="input"><option>Students</option><option>Parents</option><option>Students + Parents</option></select>
          </div>
          <div className="form-group">
            <label>Subject</label>
            <input className="input" placeholder="e.g. Test tomorrow"/>
          </div>
          <div className="form-group">
            <label>Message</label>
            <textarea className="input" rows={5} placeholder="Type your message…" value={msg} onChange={e=>setMsg(e.target.value)}/>
          </div>
          <div style={{ display:'flex', gap:10, justifyContent:'flex-end' }}>
            <button className="btn btn-primary" disabled={!msg.trim()} onClick={handleSubmit}><Icon name="message" size={15}/> Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TeacherDashboard() {
  const { user } = useAuth();
  const token = localStorage.getItem('us_token');
  const [active, setActive] = useState('home');
  const [data, setData] = useState(null);

  useEffect(() => {
    if(token) {
        axios.get('http://localhost:5000/api/teacher/dashboard', { headers: { Authorization: `Bearer ${token}` } })
        .then(res => setData(res.data))
        .catch(console.error);
    }
  }, [token]);

  const titles = { home:'Dashboard', attendance:'Mark Attendance', assignments:'Assignments', marks:'Enter Marks', notes:'Upload Notes', broadcast:'Broadcast' };
  const subtitles = { home:'Teacher Portal', attendance:'Session-based tracking', assignments:'Create & review', marks:'Subject-wise entry', notes:'Share resources', broadcast:'Class announcements' };
  
  return (
    <AppShell nav={NAV} active={active} setActive={setActive} title={titles[active]} subtitle={subtitles[active]} notifications={{ assignments: data?.pendingAssignments?.length || 0 }}>
      {active==='home'       && <HomeDash user={user} data={data}/>}
      {active==='attendance' && <AttendancePage data={data} token={token}/>}
      {active==='broadcast'  && <BroadcastPage data={data} token={token}/>}
      {['assignments','marks','notes'].includes(active) && (
        <div className="glass-card fade-up" style={{ padding:40 }}><div className="empty-state"><div className="icon">🚧</div><p>Coming in Phase 3 — Full {titles[active]} module</p></div></div>
      )}
    </AppShell>
  );
}
