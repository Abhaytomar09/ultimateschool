import React, { useState } from 'react';
import { AppShell, Icon } from '../components/AppShell';
import { CountUp } from '../components/Widgets';
import { useAuth } from '../context/AuthContext';

const NAV = [
  { id:'home',    label:'Overview',    icon:'home' },
  { id:'users',   label:'Users',       icon:'users' },
  { id:'fees',    label:'Fee Manager', icon:'rupee' },
  { id:'classes', label:'Classes',     icon:'school' },
  { id:'notices', label:'Notices',     icon:'bell' },
];

const RECENT_USERS = [
  { id:'ST0245', name:'Riya Sharma',   role:'student', class:'10A', date:'29-04-2026', status:'active' },
  { id:'TH0018', name:'Anil Kumar',    role:'teacher', class:'—',   date:'28-04-2026', status:'active' },
  { id:'ST0244', name:'Mohit Yadav',   role:'student', class:'9B',  date:'28-04-2026', status:'active' },
  { id:'PF0196', name:'Suresh Gupta',  role:'parent',  class:'—',   date:'27-04-2026', status:'active' },
  { id:'ST0243', name:'Deepa Patel',   role:'student', class:'8A',  date:'26-04-2026', status:'inactive' },
];

const FEE_PENDING = [
  { id:'ST0001', name:'Ankit Verma',   class:'10A', due:6000, days:10 },
  { id:'ST0044', name:'Kavya Joshi',   class:'9B',  due:4000, days:5  },
  { id:'ST0102', name:'Ramesh Tiwari', class:'8A',  due:6000, days:15 },
  { id:'ST0188', name:'Nisha Yadav',   class:'7C',  due:3000, days:2  },
];

const CLASSES = [
  { name:'10A', students:42, teachers:8, avg:71, section:'Senior' },
  { name:'10B', students:38, teachers:8, avg:68, section:'Senior' },
  { name:'9A',  students:40, teachers:7, avg:74, section:'Middle' },
  { name:'9B',  students:36, teachers:7, avg:65, section:'Middle' },
  { name:'8A',  students:44, teachers:6, avg:78, section:'Middle' },
];

const roleColor = { student:'badge-blue', teacher:'badge-purple', parent:'badge-amber' };

function Home() {
  const totalPending = FEE_PENDING.reduce((a,c) => a+c.due, 0);
  return (
    <div className="fade-up">
      <div style={{ marginBottom:24 }}>
        <h2 style={{ fontSize:'1.5rem' }}>School Overview 🏫</h2>
        <p style={{ fontFamily:'var(--font-mono)', fontSize:'.8rem', marginTop:4 }}>Shri Ram Public School · AY 2025–2026 · {new Date().toLocaleDateString('en-IN',{day:'2-digit',month:'2-digit',year:'numeric'}).replace(/\//g,'-')}</p>
      </div>

      <div className="grid gap-4 stagger" style={{ gridTemplateColumns:'repeat(4,1fr)', marginBottom:24 }}>
        {[
          { icon:'👨‍🎓', val:247, label:'Students',     sub:'Enrolled', color:'var(--blue)',   dim:'var(--blue-dim)' },
          { icon:'👨‍🏫', val:18,  label:'Teachers',     sub:'Active',   color:'var(--purple)', dim:'var(--purple-dim)' },
          { icon:'👨‍👩‍👧', val:198, label:'Parents',      sub:'Registered', color:'var(--amber)', dim:'var(--amber-dim)' },
          { icon:'💰', val:'',   label:'Fees Pending', sub:`${FEE_PENDING.length} students`, color:'var(--rose)', dim:'var(--rose-dim)' },
        ].map((s,i) => (
          <div key={i} className="stat-card fade-up">
            <div className="stat-icon" style={{ background:s.dim, color:s.color }}>{s.icon}</div>
            <div>
              <div className="stat-value" style={{ color:s.color }}>
                {i<3 ? <CountUp to={s.val}/> : `₹${(totalPending/1000).toFixed(0)}K`}
              </div>
              <div className="stat-label">{s.label}</div>
              <div className="stat-sub">{s.sub}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4" style={{ gridTemplateColumns:'1.2fr 1fr' }}>
        <div className="glass-card" style={{ padding:20 }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:16 }}>
            <h3>👤 Recent Users</h3>
            <button className="btn btn-primary btn-sm"><Icon name="users" size={13}/> Add User</button>
          </div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>ID</th><th>Name</th><th>Role</th><th>Class</th><th>Status</th></tr></thead>
              <tbody>
                {RECENT_USERS.map(u => (
                  <tr key={u.id}>
                    <td><span className="id-badge">{u.id}</span></td>
                    <td style={{ fontWeight:500, color:'var(--text-primary)' }}>{u.name}</td>
                    <td><span className={`badge ${roleColor[u.role]}`}>{u.role}</span></td>
                    <td style={{ fontFamily:'var(--font-mono)' }}>{u.class}</td>
                    <td><span className={`badge ${u.status==='active'?'badge-green':'badge-rose'}`}>{u.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass-card" style={{ padding:20 }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:16 }}>
            <h3>💰 Fee Alerts</h3>
            <span className="badge badge-rose">₹ {totalPending.toLocaleString('en-IN')} Due</span>
          </div>
          {FEE_PENDING.map(f => (
            <div key={f.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom:'1px solid var(--border)' }}>
              <div>
                <div style={{ fontWeight:500, color:'var(--text-primary)', fontSize:'.88rem' }}>{f.name}</div>
                <div style={{ fontSize:'.68rem', color:'var(--text-muted)', fontFamily:'var(--font-mono)' }}>{f.id} · Class {f.class} · {f.days}d left</div>
              </div>
              <div style={{ fontWeight:700, color:'var(--rose)', fontFamily:'var(--font-mono)' }}>₹{f.due.toLocaleString('en-IN')}</div>
            </div>
          ))}
          <button className="btn btn-ghost btn-sm w-full" style={{ marginTop:12 }}>Send All Reminders</button>
        </div>
      </div>
    </div>
  );
}

function AddUserForm() {
  const [role, setRole] = useState('student');
  const nextId = { student:'ST0248', teacher:'TH0019', parent:'PF0201', admin:'AD0003' };
  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1.1fr', gap:20 }}>
      <div className="glass-card" style={{ padding:24 }}>
        <h3 style={{ marginBottom:20 }}>➕ Add New User</h3>
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <div className="form-group">
            <label>Role</label>
            <select className="input" value={role} onChange={e=>setRole(e.target.value)}>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="parent">Parent</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="form-group"><label>Full Name</label><input className="input" placeholder="e.g. Ramesh Kumar"/></div>
          <div className="form-group"><label>Email</label><input className="input" type="email" placeholder="user@school.in"/></div>
          <div className="form-group"><label>Mobile</label><input className="input" type="tel" placeholder="10-digit number"/></div>
          {role==='student' && (
            <div className="form-group">
              <label>Class</label>
              <select className="input"><option>10A</option><option>10B</option><option>9A</option><option>9B</option><option>8A</option></select>
            </div>
          )}
          <div className="alert alert-blue" style={{ fontSize:'.78rem' }}>
            Auto ID: <strong className="id-badge">{nextId[role]}</strong> &nbsp;·&nbsp; Default password: <span style={{ fontFamily:'var(--font-mono)', color:'var(--amber)' }}>school@123</span>
          </div>
          <div style={{ display:'flex', gap:10 }}>
            <button className="btn btn-ghost" style={{ flex:1 }}>Cancel</button>
            <button className="btn btn-primary" style={{ flex:1 }}>Create User</button>
          </div>
        </div>
      </div>

      <div className="glass-card" style={{ padding:0, overflow:'hidden' }}>
        <div style={{ padding:'16px 20px', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between' }}>
          <h3>All Users</h3>
          <input className="input" style={{ width:180, padding:'6px 10px' }} placeholder="Search…"/>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>ID</th><th>Name</th><th>Role</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {RECENT_USERS.map(u => (
                <tr key={u.id}>
                  <td><span className="id-badge">{u.id}</span></td>
                  <td style={{ fontWeight:500, color:'var(--text-primary)' }}>{u.name}</td>
                  <td><span className={`badge ${roleColor[u.role]}`}>{u.role}</span></td>
                  <td><span className={`badge ${u.status==='active'?'badge-green':'badge-rose'}`}>{u.status}</span></td>
                  <td><button className="btn btn-ghost btn-sm">Edit</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function FeeManager() {
  return (
    <div className="fade-up">
      <div className="page-header"><h2>💰 Fee Manager</h2><p>Shri Ram Public School · AY 2025–2026 · ₹ INR</p></div>
      <div className="grid gap-4" style={{ gridTemplateColumns:'repeat(3,1fr)', marginBottom:20 }}>
        {[['Total Annual','₹ 44,46,000','var(--blue)'],['Collected','₹ 29,64,000','var(--green)'],['Pending','₹ 16,000','var(--rose)']].map(([l,v,c]) => (
          <div key={l} className="glass-card" style={{ padding:20 }}>
            <div style={{ fontSize:'.7rem', color:'var(--text-muted)', fontFamily:'var(--font-mono)', marginBottom:6 }}>{l}</div>
            <div style={{ fontSize:'1.4rem', fontWeight:800, fontFamily:'var(--font-head)', color:c }}>{v}</div>
          </div>
        ))}
      </div>
      <div className="glass-card" style={{ padding:24, marginBottom:20 }}>
        <h3 style={{ marginBottom:18 }}>Record Offline Payment</h3>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, maxWidth:560 }}>
          <div className="form-group"><label>Student ID</label><input className="input" placeholder="ST0001" style={{ textTransform:'uppercase', fontFamily:'var(--font-mono)' }}/></div>
          <div className="form-group"><label>Amount (₹)</label><input className="input" type="number" placeholder="4000"/></div>
          <div className="form-group"><label>Payment Mode</label><select className="input"><option>Cash</option><option>UPI</option><option>Cheque</option><option>NEFT</option><option>DD</option></select></div>
          <div className="form-group"><label>Date (DD-MM-YYYY)</label><input className="input" type="date"/></div>
          <div className="form-group" style={{ gridColumn:'span 2' }}><label>Remarks (Optional)</label><input className="input" placeholder="e.g. Monthly fee for April 2026"/></div>
        </div>
        <div style={{ display:'flex', gap:12, marginTop:16 }}>
          <button className="btn btn-ghost">Reset</button>
          <button className="btn btn-primary">Record Payment &amp; Generate Receipt</button>
        </div>
      </div>
      <div className="glass-card" style={{ padding:0, overflow:'hidden' }}>
        <div style={{ padding:'16px 20px', borderBottom:'1px solid var(--border)' }}><h3>Pending Payments</h3></div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Student</th><th>Class</th><th>Amount Due</th><th>Days Left</th><th>Action</th></tr></thead>
            <tbody>
              {FEE_PENDING.map(f => (
                <tr key={f.id}>
                  <td><div style={{ fontWeight:500, color:'var(--text-primary)' }}>{f.name}</div><span className="id-badge">{f.id}</span></td>
                  <td>Class {f.class}</td>
                  <td style={{ fontFamily:'var(--font-mono)', fontWeight:700, color:'var(--rose)' }}>₹ {f.due.toLocaleString('en-IN')}</td>
                  <td><span className={`badge ${f.days<=3?'badge-rose':f.days<=7?'badge-amber':'badge-blue'}`}>{f.days}d</span></td>
                  <td><div style={{ display:'flex', gap:8 }}><button className="btn btn-ghost btn-sm">Remind</button><button className="btn btn-primary btn-sm">Mark Paid</button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ClassesPage() {
  return (
    <div className="fade-up">
      <div className="page-header"><h2>🏫 Classes</h2><p>Academic Year 2025–2026</p></div>
      <div className="grid gap-4" style={{ gridTemplateColumns:'repeat(3,1fr)' }}>
        {CLASSES.map(c => {
          const avgColor = c.avg>=75?'var(--green)':c.avg>=60?'var(--amber)':'var(--rose)';
          return (
            <div key={c.name} className="glass-card" style={{ padding:20 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:14 }}>
                <div style={{ fontSize:'1.5rem', fontWeight:800, fontFamily:'var(--font-head)', color:'var(--text-primary)' }}>Class {c.name}</div>
                <span className={`badge ${c.section==='Senior'?'badge-blue':'badge-purple'}`}>{c.section}</span>
              </div>
              <div style={{ display:'flex', gap:16, marginBottom:14 }}>
                <div><div style={{ fontFamily:'var(--font-mono)', fontWeight:700, color:'var(--text-primary)' }}>{c.students}</div><div style={{ fontSize:'.68rem', color:'var(--text-muted)' }}>Students</div></div>
                <div><div style={{ fontFamily:'var(--font-mono)', fontWeight:700, color:'var(--text-primary)' }}>{c.teachers}</div><div style={{ fontSize:'.68rem', color:'var(--text-muted)' }}>Teachers</div></div>
              </div>
              <div style={{ fontSize:'.72rem', color:'var(--text-muted)', marginBottom:6 }}>Avg Performance</div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width:`${c.avg}%`, background:avgColor }}/>
              </div>
              <div style={{ fontFamily:'var(--font-mono)', fontWeight:700, color:avgColor, marginTop:4, fontSize:'.85rem' }}>{c.avg}%</div>
              <button className="btn btn-ghost btn-sm w-full" style={{ marginTop:14 }}>Manage Class</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [active, setActive] = useState('home');
  const titles = { home:'Admin Dashboard', users:'User Management', fees:'Fee Manager', classes:'Classes', notices:'Notices' };
  const subtitles = { home:'School Overview', users:'Add · Edit · Manage', fees:'₹ Collections & Pending', classes:'All Sections', notices:'Broadcast Announcements' };
  return (
    <AppShell nav={NAV} active={active} setActive={setActive} title={titles[active]} subtitle={subtitles[active]} notifications={{ notices:2 }}>
      {active==='home'    && <Home/>}
      {active==='users'   && <AddUserForm/>}
      {active==='fees'    && <FeeManager/>}
      {active==='classes' && <ClassesPage/>}
      {active==='notices' && (
        <div className="glass-card fade-up" style={{ padding:24, maxWidth:560 }}>
          <h3 style={{ marginBottom:18 }}>📢 Send School Notice</h3>
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <div className="form-group"><label>Target</label><select className="input"><option>All Students</option><option>All Teachers</option><option>All Parents</option><option>Everyone</option></select></div>
            <div className="form-group"><label>Title</label><input className="input" placeholder="e.g. School closed on 15-05-2026"/></div>
            <div className="form-group"><label>Message</label><textarea className="input" rows={5} placeholder="Notice details…"/></div>
            <button className="btn btn-primary"><Icon name="bell" size={15}/> Broadcast Notice</button>
          </div>
        </div>
      )}
    </AppShell>
  );
}
