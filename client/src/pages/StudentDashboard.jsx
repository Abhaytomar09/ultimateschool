import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AppShell, Icon } from '../components/AppShell';
import { CountUp, CountdownTimer, ProgressRing } from '../components/Widgets';
import { useAuth } from '../context/AuthContext';
import { formatRupees } from '../utils/format'; // Assuming format function exists, or we use toLocaleString

const NAV = [
  { id:'home',        label:'Dashboard',   icon:'home' },
  { id:'timetable',   label:'Timetable',   icon:'calendar' },
  { id:'assignments', label:'Assignments', icon:'assignment' },
  { id:'performance', label:'Performance', icon:'chart' },
  { id:'fees',        label:'Fees',        icon:'rupee' },
  { id:'notes',       label:'Notes',       icon:'book' },
];

const greet = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
};

// --- Sub-components ---

function Home({ user, data }) {
  if (!data) return <div className="fade-up">Loading...</div>;

  const { todaySchedule, attendancePercentage: att, assignments, fees, performance } = data;
  
  // Prepare SCHEDULE for UI
  const SCHEDULE = todaySchedule.map((p, i) => {
      const now = new Date();
      const [h, m] = p.startTime.split(':');
      const [eh, em] = p.endTime.split(':');
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m);
      const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), eh, em);
      
      let status = 'upcoming';
      if (now >= start && now <= end) status = 'live';
      if (now > end) status = 'done';
      
      const colors = ['var(--blue)', 'var(--purple)', 'var(--amber)', 'var(--green)', 'var(--rose)'];
      
      return {
          id: p._id || i,
          sub: p.subjectId?.name || 'Lunch',
          teacher: p.teacherId?.name || '—',
          time: p.startTime,
          end: p.endTime,
          color: colors[i % colors.length],
          status
      };
  });

  const liveClass = SCHEDULE.find(s => s.status === 'live');
  const nextClass = SCHEDULE.find(s => s.status === 'upcoming');
  const pendingFees = fees.filter(f => f.status === 'Pending').reduce((acc, f) => acc + f.amountDue, 0);
  const pendingTasks = assignments.filter(a => a.status === 'Pending').length;

  return (
    <div className="fade-up">
      {/* Greeting */}
      <div style={{ marginBottom:24 }}>
        <h2 style={{ fontSize:'1.6rem' }}>{greet()}, {user?.name?.split(' ')[0]} 👋</h2>
        <p style={{ fontFamily:'var(--font-mono)', fontSize:'.8rem', marginTop:4 }}>
          Class {data.student.classId} &nbsp;·&nbsp; {new Date().toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}
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
          { icon:'📚', val:SCHEDULE.length,   label:'Classes Today', sub:liveClass ? '1 Live Now' : 'No Live Classes', color:'var(--blue)',  dim:'var(--blue-dim)' },
          { icon:'✅', val:att, label:'Attendance %',  sub:att<75?'⚠️ Below 75%':'On track', color:att<75?'var(--rose)':'var(--green)', dim:att<75?'var(--rose-dim)':'var(--green-dim)' },
          { icon:'📝', val:pendingTasks,   label:'Pending Tasks', sub:'Due soon',        color:'var(--amber)', dim:'var(--amber-dim)' },
          { icon:'₹',  val:pendingFees,  label:'Fees Pending',  sub:'Check Deadlines',       color:'var(--rose)',  dim:'var(--rose-dim)' },
        ].map((s,i) => (
          <div key={i} className="stat-card fade-up">
            <div className="stat-icon" style={{ background:s.dim, color:s.color }}>{s.icon}</div>
            <div>
              <div className="stat-value" style={{ color:s.color }}>
                <CountUp to={typeof s.val==='number'?s.val:0} suffix={i===1?'%':''}/>
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
            <span className="badge badge-blue">{new Date().toLocaleDateString('en-IN',{weekday:'long'})}</span>
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
                  {s.status==='live' && <button className="btn btn-primary btn-sm" onClick={() => window.open(`https://meet.jit.si/ultimateschool_${s.sub.replace(/\s+/g,'_')}`, '_blank')}>Join</button>}
                  {s.status==='done' && <span className="badge badge-green">Done</span>}
                </div>
              </div>
            ))}
            {SCHEDULE.length === 0 && <div style={{padding:'20px', textAlign:'center', color:'var(--text-muted)'}}>No classes scheduled for today.</div>}
          </div>
        </div>

        {/* Right column */}
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          {/* Performance rings */}
          <div className="glass-card" style={{ padding:20 }}>
            <h3 style={{ marginBottom:14 }}>📊 Performance</h3>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:12 }}>
              {performance?.subjectMarks?.map((s,i) => {
                const score = Math.round(s.normalizedPercentage || 0);
                const colors = ['var(--blue)', 'var(--purple)', 'var(--amber)', 'var(--green)'];
                const color = colors[i % colors.length];
                return (
                <div key={s._id} style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <ProgressRing pct={score} size={56} stroke={5} color={color}>
                    <span style={{ fontSize:'.75rem', fontWeight:700, color:color, fontFamily:'var(--font-mono)' }}>{score}</span>
                  </ProgressRing>
                  <div>
                    <div style={{ fontSize:'.78rem', fontWeight:600, color:'var(--text-primary)' }}>{s.subjectId?.name}</div>
                    {score < 50 && <div style={{ fontSize:'.65rem', color:'var(--rose)', marginTop:2 }}>⚠️ Weak</div>}
                  </div>
                </div>
              )})}
              {!performance && <div style={{fontSize:'.8rem', color:'var(--text-muted)'}}>No recent report card found.</div>}
            </div>
          </div>

          {/* Assignments */}
          <div className="glass-card" style={{ padding:20 }}>
            <h3 style={{ marginBottom:14 }}>📝 Assignments</h3>
            {assignments.filter(a => a.status !== 'Graded').slice(0, 4).map(a => (
              <div key={a._id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 0', borderBottom:'1px solid var(--border)' }}>
                <div>
                  <div style={{ fontSize:'.83rem', fontWeight:500, color:'var(--text-primary)' }}>{a.title}</div>
                  <div style={{ fontSize:'.7rem', color:'var(--text-muted)', fontFamily:'var(--font-mono)', marginTop:2 }}>{a.subject} · Due {new Date(a.dueDate).toLocaleDateString()}</div>
                </div>
                <div style={{ display:'flex', gap:6, flexShrink:0 }}>
                  <span className={`badge ${a.status==='Submitted'?'badge-green':'badge-amber'}`}>{a.status}</span>
                </div>
              </div>
            ))}
            {assignments.filter(a => a.status !== 'Graded').length === 0 && <div style={{fontSize:'.8rem', color:'var(--text-muted)'}}>No pending assignments.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

function Timetable({ data }) {
    // Basic mock mapping for the week, as the backend only returns today's timetable right now in data.todaySchedule.
    // In a real app, we'd fetch the whole week's timetable. For now, we will reuse the mockup but you can extend the API.
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
        <div className="page-header"><h2>📅 Weekly Timetable</h2><p>Class {data?.student?.classId || '10A'} — Academic Year 2025–2026</p></div>
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

function Assignments({ data, token, fetchDashboardData }) {
    if(!data) return null;
    const cols = [
        { key:'Pending',   label:'📋 Pending',   color:'var(--amber)' },
        { key:'Submitted', label:'📤 Submitted',  color:'var(--blue)' },
        { key:'Graded',    label:'✅ Graded',     color:'var(--green)' },
    ];

    const handleSubmit = async (id) => {
        try {
            await axios.post(`http://localhost:5000/api/student/assignment/${id}/submit`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Assignment submitted successfully!');
            fetchDashboardData();
        } catch (error) {
            console.error('Submit error:', error);
            alert('Failed to submit assignment');
        }
    };

    return (
        <div className="fade-up">
        <div className="page-header"><h2>📝 Assignments</h2><p>Kanban board</p></div>
        <div className="kanban">
            {cols.map(col => (
            <div key={col.key} className="kanban-col">
                <div className="kanban-col-title" style={{ color:col.color }}>{col.label} ({data.assignments.filter(a=>a.status===col.key).length})</div>
                {data.assignments.filter(a => a.status===col.key).map(a => (
                <div key={a._id} className="kanban-card">
                    <div style={{ fontSize:'.75rem', color:'var(--text-muted)', fontFamily:'var(--font-mono)', marginBottom:6 }}>{a.subject}</div>
                    <div style={{ fontWeight:600, fontSize:'.88rem', color:'var(--text-primary)', marginBottom:8 }}>{a.title}</div>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <span style={{ fontSize:'.7rem', color:'var(--text-muted)', fontFamily:'var(--font-mono)' }}>Due: {new Date(a.dueDate).toLocaleDateString()}</span>
                    </div>
                    {col.key==='Pending' && <button onClick={() => handleSubmit(a._id)} className="btn btn-primary btn-sm w-full" style={{ marginTop:10 }}>Submit</button>}
                </div>
                ))}
                {data.assignments.filter(a=>a.status===col.key).length === 0 && (
                <div style={{ textAlign:'center', padding:'20px 0', color:'var(--text-muted)', fontSize:'.8rem' }}>Nothing here</div>
                )}
            </div>
            ))}
        </div>
        </div>
    );
}

function Performance({ data }) {
    if(!data) return null;
    const p = data.performance;
    const final = p ? Math.round(p.overallPercentage) : 0;
    const rank = p ? p.rank : '-';
    
    return (
        <div className="fade-up">
        <div className="page-header"><h2>📊 Performance & Analytics</h2><p>Academic Year 2025–2026</p></div>

        {/* Rank hero card */}
        <div style={{ background:'linear-gradient(135deg, rgba(59,130,246,.15), rgba(139,92,246,.1))', border:'1px solid rgba(59,130,246,.25)', borderRadius:'var(--radius-lg)', padding:28, marginBottom:20, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div>
            <div style={{ fontSize:'.75rem', color:'var(--text-muted)', fontFamily:'var(--font-mono)', marginBottom:8 }}>YOUR RANK</div>
            <div style={{ fontSize:'4rem', fontWeight:800, fontFamily:'var(--font-head)', lineHeight:1, color:'var(--blue-light)' }}>
                {rank !== '-' ? <CountUp to={rank}/> : '-'}
            </div>
            </div>
            <div style={{ display:'flex', gap:20 }}>
            <div style={{ textAlign:'center' }}>
                <ProgressRing pct={final} size={76} stroke={6} color="var(--amber)">
                <span style={{ fontSize:'.8rem', fontWeight:700, color:'var(--amber)', fontFamily:'var(--font-mono)' }}>{final}%</span>
                </ProgressRing>
                <div style={{ fontSize:'.72rem', color:'var(--text-muted)', marginTop:6 }}>Final Score</div>
            </div>
            </div>
        </div>
        </div>
    );
}

function Fees({ data }) {
    if(!data) return null;
    const fees = data.fees;
    const total = fees.reduce((acc, f) => acc + f.amountDue, 0);
    const paid = fees.reduce((acc, f) => acc + f.amountPaid, 0);
    const pending = total - paid;
    const pct = total === 0 ? 100 : Math.round((paid/total)*100);

    return (
        <div className="fade-up">
        <div className="page-header"><h2>💰 Fee Management</h2><p>Academic Year 2025–2026 · Amounts in ₹</p></div>

        {/* Summary */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:16, marginBottom:24 }}>
            {[['Total Annual',total,'var(--blue)'],['Paid',paid,'var(--green)'],['Pending',pending,'var(--rose)']].map(([l,v,c]) => (
            <div key={l} className="glass-card" style={{ padding:20 }}>
                <div style={{ fontSize:'.72rem', color:'var(--text-muted)', fontFamily:'var(--font-mono)', marginBottom:6 }}>{l}</div>
                <div style={{ fontSize:'1.6rem', fontWeight:800, fontFamily:'var(--font-head)', color:c }}>₹ {v.toLocaleString('en-IN')}</div>
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
            <span>₹ 0</span><span>₹ {total.toLocaleString('en-IN')}</span>
            </div>
        </div>

        {pending > 0 && (
            <div className="alert alert-rose" style={{ marginBottom:20 }}>
            ⚠️ <strong>₹ {pending.toLocaleString('en-IN')} pending.</strong> Please clear dues.
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
                <thead><tr><th>Fee Type</th><th>Amount Due</th><th>Amount Paid</th><th>Due Date</th><th>Receipt</th><th>Status</th><th></th></tr></thead>
                <tbody>
                {fees.map(f => (
                    <tr key={f._id} style={{ background: f.status==='Pending' ? 'var(--rose-dim)' : 'transparent' }}>
                    <td style={{ fontWeight:500, color: f.status==='Pending'?'var(--rose)':'var(--text-primary)' }}>{f.feeType}</td>
                    <td style={{ fontFamily:'var(--font-mono)', fontWeight:700, color: f.status==='Pending'?'var(--rose)':'var(--text-primary)' }}>₹ {f.amountDue.toLocaleString('en-IN')}</td>
                    <td style={{ fontFamily:'var(--font-mono)', fontWeight:700, color:'var(--green)' }}>₹ {f.amountPaid.toLocaleString('en-IN')}</td>
                    <td style={{ fontFamily:'var(--font-mono)', color: f.status==='Pending'?'var(--rose)':'var(--text-muted)' }}>{new Date(f.dueDate).toLocaleDateString()}</td>
                    <td style={{ fontFamily:'var(--font-mono)', fontSize:'.75rem', color:'var(--text-muted)' }}>{f.receiptUrl || '—'}</td>
                    <td><span className={`badge ${f.status==='Paid'?'badge-green':'badge-rose'}`}>{f.status}</span></td>
                    <td>
                        {f.status==='Pending' 
                        ? <button className="btn btn-primary btn-sm" onClick={() => alert('Razorpay / Stripe integration goes here')}>Pay Now</button> 
                        : <button className="btn btn-ghost btn-sm">📄</button>}
                    </td>
                    </tr>
                ))}
                {fees.length === 0 && <tr><td colSpan="7" style={{textAlign:'center', color:'var(--text-muted)'}}>No fee records found.</td></tr>}
                </tbody>
            </table>
            </div>
        </div>
        </div>
    );
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const token = localStorage.getItem('us_token');
  const [active, setActive] = useState('home');
  const [data, setData] = useState(null);
  
  const titles = { home:'Dashboard', timetable:'Timetable', assignments:'Assignments', performance:'Performance', fees:'Fee Management', notes:'Study Notes' };
  const subtitles = { home:`${data?.student?.classId || ''} · Student`, timetable:`${data?.student?.classId || ''} · AY 2025–2026`, assignments:'Pending · Submitted · Graded', performance:'Topic-level analytics', fees:'₹ INR · DD-MM-YYYY', notes:'Uploaded by teachers' };

  const fetchDashboardData = async () => {
    try {
        const res = await axios.get('http://localhost:5000/api/student/dashboard', {
            headers: { Authorization: `Bearer ${token}` }
        });
        setData(res.data);
    } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
    }
  };

  useEffect(() => {
    if(token) fetchDashboardData();
  }, [token]);

  return (
    <AppShell nav={NAV} active={active} setActive={setActive} title={titles[active]} subtitle={subtitles[active]} notifications={{ assignments: data?.assignments?.filter(a => a.status === 'Pending').length || 0 }}>
      {active==='home'        && <Home user={user} data={data}/>}
      {active==='timetable'   && <Timetable data={data}/>}
      {active==='assignments' && <Assignments data={data} token={token} fetchDashboardData={fetchDashboardData}/>}
      {active==='performance' && <Performance data={data}/>}
      {active==='fees'        && <Fees data={data}/>}
      {active==='notes'       && <div className="glass-card fade-up" style={{ padding:40 }}><div className="empty-state"><div className="icon">📚</div><p>Notes uploaded by your teachers will appear here.</p></div></div>}
    </AppShell>
  );
}
