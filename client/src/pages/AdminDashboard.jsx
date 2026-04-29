import React, { useState } from 'react';
import { AppShell } from '../components/AppShell';
import { formatRupees } from '../utils/format';
import { useAuth } from '../context/AuthContext';

const NAV = [
  { id: 'home',    label: 'Overview',      icon: 'home' },
  { id: 'schools', label: 'Schools',       icon: 'school' },
  { id: 'users',   label: 'Users',         icon: 'users' },
  { id: 'fees',    label: 'Fee Manager',   icon: 'rupee' },
  { id: 'reports', label: 'Reports',       icon: 'chart' },
];

const STATS = [
  { icon:'🏫', val:'1',    label:'Schools',       sub:'Active', color:'primary' },
  { icon:'👨‍🎓', val:'247',  label:'Students',     sub:'Enrolled', color:'primary' },
  { icon:'👨‍🏫', val:'18',   label:'Teachers',     sub:'Active', color:'success' },
  { icon:'👨‍👩‍👧', val:'198', label:'Parents',       sub:'Registered', color:'accent' },
];

const RECENT_USERS = [
  { id:'ST0245', name:'Riya Sharma',   role:'Student', class:'10A', date:'29-04-2026' },
  { id:'TH0018', name:'Anil Kumar',    role:'Teacher', class:'—',   date:'28-04-2026' },
  { id:'ST0244', name:'Mohit Yadav',   role:'Student', class:'9B',  date:'28-04-2026' },
  { id:'PF0196', name:'Suresh Gupta',  role:'Parent',  class:'—',   date:'27-04-2026' },
];

const FEE_PENDING = [
  { id:'ST0001', name:'Ankit Verma',  class:'10A', due:6000 },
  { id:'ST0044', name:'Kavya Joshi',  class:'9B',  due:4000 },
  { id:'ST0102', name:'Ramesh Tiwari',class:'8A',  due:6000 },
];

function AdminHome() {
  const { user } = useAuth();
  return (
    <>
      <div className="page-header">
        <h2>Admin Dashboard 🏫</h2>
        <p>School: Shri Ram Public School · Academic Year 2025–2026</p>
      </div>
      <div className="grid gap-4" style={{ gridTemplateColumns:'repeat(4,1fr)', marginBottom:24 }}>
        {STATS.map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-icon" style={{ background:`var(--${s.color}-bg)`, color:`var(--${s.color})`, fontSize:'1.4rem' }}>{s.icon}</div>
            <div><div className="stat-value">{s.val}</div><div className="stat-label">{s.label}</div><div className="stat-sub">{s.sub}</div></div>
          </div>
        ))}
      </div>

      <div className="grid gap-4" style={{ gridTemplateColumns:'1fr 1fr' }}>
        <div className="card">
          <div className="card-header"><h3>👤 Recently Added Users</h3><button className="btn btn-primary btn-sm">+ Add User</button></div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>ID</th><th>Name</th><th>Role</th><th>Class</th><th>Added</th></tr></thead>
              <tbody>
                {RECENT_USERS.map(u => (
                  <tr key={u.id}>
                    <td><span className="id-badge">{u.id}</span></td>
                    <td style={{ fontWeight:500 }}>{u.name}</td>
                    <td><span className={`badge ${u.role==='Teacher'?'badge-primary':u.role==='Parent'?'badge-accent':'badge-success'}`}>{u.role}</span></td>
                    <td>{u.class}</td>
                    <td style={{ color:'var(--gray-400)', fontSize:'.8rem' }}>{u.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><h3>💰 Pending Fees</h3><span className="badge badge-danger">₹ {(6000+4000+6000).toLocaleString('en-IN')} Due</span></div>
          {FEE_PENDING.map(f => (
            <div key={f.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom:'1px solid var(--gray-100)' }}>
              <div>
                <div style={{ fontWeight:500 }}>{f.name} <span className="id-badge" style={{ marginLeft:6 }}>{f.id}</span></div>
                <div style={{ fontSize:'.72rem', color:'var(--gray-400)' }}>Class {f.class}</div>
              </div>
              <div style={{ fontWeight:700, color:'var(--danger)' }}>₹ {f.due.toLocaleString('en-IN')}</div>
            </div>
          ))}
          <button className="btn btn-secondary w-full" style={{ marginTop:14 }}>View All Pending</button>
        </div>
      </div>
    </>
  );
}

function AddUserForm() {
  const [role, setRole] = useState('student');
  return (
    <div className="card" style={{ maxWidth:560 }}>
      <h3 style={{ marginBottom:20 }}>➕ Add New User</h3>
      <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
        <div className="form-group">
          <label>Role</label>
          <select className="input" value={role} onChange={e=>setRole(e.target.value)}>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="parent">Parent (Father)</option>
            <option value="parent_m">Parent (Mother)</option>
          </select>
        </div>
        <div className="form-group"><label>Full Name</label><input className="input" placeholder="e.g. Ramesh Kumar" /></div>
        <div className="form-group"><label>Email Address</label><input className="input" type="email" placeholder="e.g. ramesh@school.in" /></div>
        {role === 'student' && (
          <div className="form-group">
            <label>Class</label>
            <select className="input"><option>10A</option><option>10B</option><option>9A</option><option>9B</option></select>
          </div>
        )}
        <div className="alert alert-primary" style={{ borderColor:'var(--primary)' }}>
          ℹ️ A unique ID will be auto-generated: e.g. <strong className="id-badge">ST0248</strong>. Default password: <strong>school@123</strong>
        </div>
        <div style={{ display:'flex', gap:12 }}>
          <button className="btn btn-secondary" style={{ flex:1 }}>Cancel</button>
          <button className="btn btn-primary" style={{ flex:1 }}>Create User</button>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [active, setActive] = useState('home');

  const titles = { home:'Admin Dashboard', schools:'Schools', users:'User Management', fees:'Fee Manager', reports:'Reports' };

  return (
    <AppShell navItems={NAV} active={active} setActive={setActive} title={titles[active]} subtitle="Admin Portal">
      {active === 'home'    && <AdminHome />}
      {active === 'users'   && (
        <div className="grid gap-4" style={{ gridTemplateColumns:'1fr 1.2fr' }}>
          <AddUserForm />
          <div className="card">
            <div className="card-header"><h3>All Users</h3></div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>ID</th><th>Name</th><th>Role</th><th>Status</th></tr></thead>
                <tbody>
                  {RECENT_USERS.map(u => (
                    <tr key={u.id}>
                      <td><span className="id-badge">{u.id}</span></td>
                      <td style={{ fontWeight:500 }}>{u.name}</td>
                      <td><span className={`badge ${u.role==='Teacher'?'badge-primary':u.role==='Parent'?'badge-accent':'badge-success'}`}>{u.role}</span></td>
                      <td><span className="badge badge-success">Active</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      {active === 'fees' && (
        <>
          <div className="page-header"><h2>Fee Manager Dashboard</h2></div>
          <div className="grid gap-4" style={{ gridTemplateColumns:'repeat(3,1fr)', marginBottom:24 }}>
            <div className="stat-card"><div className="stat-icon" style={{ background:'var(--primary-bg)', color:'var(--primary)' }}>📋</div><div><div className="stat-value">{formatRupees(18000*247)}</div><div className="stat-label">Total Fees (Annual)</div></div></div>
            <div className="stat-card"><div className="stat-icon" style={{ background:'var(--success-bg)', color:'var(--success)' }}>✅</div><div><div className="stat-value" style={{ color:'var(--success)' }}>{formatRupees(12000*247)}</div><div className="stat-label">Collected</div></div></div>
            <div className="stat-card"><div className="stat-icon" style={{ background:'var(--danger-bg)', color:'var(--danger)' }}>⏳</div><div><div className="stat-value" style={{ color:'var(--danger)' }}>{formatRupees(6000*3)}</div><div className="stat-label">Pending (Sample)</div></div></div>
          </div>
          <div className="card">
            <div className="card-header"><h3>Enter Offline Payment</h3></div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, maxWidth:600 }}>
              <div className="form-group"><label>Student ID</label><input className="input" placeholder="ST0001" style={{ textTransform:'uppercase' }} /></div>
              <div className="form-group"><label>Amount (₹)</label><input className="input" type="number" placeholder="4000" /></div>
              <div className="form-group"><label>Payment Mode</label><select className="input"><option>Cash</option><option>UPI</option><option>Cheque</option><option>NEFT</option></select></div>
              <div className="form-group"><label>Payment Date</label><input className="input" type="date" /></div>
            </div>
            <button className="btn btn-primary" style={{ marginTop:16 }}>Record Payment</button>
          </div>
        </>
      )}
      {['schools','reports'].includes(active) && (
        <div className="card"><div className="empty-state"><div className="icon">🚧</div><p>This section is under development.</p></div></div>
      )}
    </AppShell>
  );
}
