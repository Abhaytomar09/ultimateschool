import React, { useState } from 'react';
import { AppShell } from '../components/AppShell';
import { formatRupees } from '../utils/format';
import { useAuth } from '../context/AuthContext';

const NAV = [
  { id: 'home',        label: 'Overview',     icon: 'home' },
  { id: 'attendance',  label: 'Attendance',   icon: 'calendar' },
  { id: 'performance', label: 'Performance',  icon: 'chart' },
  { id: 'fees',        label: 'Fees',         icon: 'rupee' },
  { id: 'announcements', label: 'Notices',    icon: 'bell' },
];

const CHILD = {
  name: 'Ankit Verma', id: 'ST0001', class: '10A',
  attendance: 68, rank: 12, totalStudents: 180,
  fees: { total: 18000, paid: 12000, pending: 6000 },
  subjects: [
    { name: 'Mathematics', score: 62, weak: 'Algebra' },
    { name: 'Physics',     score: 78, weak: null },
    { name: 'English',     score: 85, weak: null },
    { name: 'Chemistry',   score: 44, weak: 'Thermodynamics' },
  ]
};

function ParentHome() {
  const { user } = useAuth();
  const attColor = CHILD.attendance >= 75 ? 'var(--success)' : CHILD.attendance >= 60 ? 'var(--warning)' : 'var(--danger)';

  return (
    <>
      <div className="page-header">
        <h2>नमस्ते, {user?.name} 👋</h2>
        <p>Monitoring: <strong>{CHILD.name}</strong> · Class {CHILD.class} · ID: <span className="id-badge">ST0001</span></p>
      </div>

      {/* Attention Banner */}
      {CHILD.attendance < 75 && (
        <div className="alert alert-danger" style={{ marginBottom:20 }}>
          ⚠️ <strong>{CHILD.name}'s attendance is {CHILD.attendance}%</strong> — below the required 75%. Please ensure regular school attendance.
        </div>
      )}
      {CHILD.fees.pending > 0 && (
        <div className="alert alert-warning" style={{ marginBottom:20 }}>
          💰 Fee pending: <strong>{formatRupees(CHILD.fees.pending)}</strong>. Due date: <strong>10-05-2026</strong>.
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid gap-4" style={{ gridTemplateColumns:'repeat(4,1fr)', marginBottom:24 }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: CHILD.attendance>=75?'var(--success-bg)':'var(--danger-bg)', color:attColor }}>✅</div>
          <div>
            <div className="stat-value" style={{ color:attColor }}>{CHILD.attendance}%</div>
            <div className="stat-label">Attendance</div>
            <div className="stat-sub">{CHILD.attendance < 75 ? '⚠️ Below 75%' : 'Good'}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background:'var(--primary-bg)', color:'var(--primary)' }}>🏆</div>
          <div>
            <div className="stat-value">{CHILD.rank}</div>
            <div className="stat-label">Class Rank</div>
            <div className="stat-sub">out of {CHILD.totalStudents}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background:'var(--success-bg)', color:'var(--success)' }}>💵</div>
          <div>
            <div className="stat-value" style={{ color:'var(--success)', fontSize:'1.1rem' }}>{formatRupees(CHILD.fees.paid)}</div>
            <div className="stat-label">Fees Paid</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background:'var(--danger-bg)', color:'var(--danger)' }}>⏳</div>
          <div>
            <div className="stat-value" style={{ color:'var(--danger)', fontSize:'1.1rem' }}>{formatRupees(CHILD.fees.pending)}</div>
            <div className="stat-label">Fees Pending</div>
          </div>
        </div>
      </div>

      {/* Subject Performance */}
      <div className="grid gap-4" style={{ gridTemplateColumns:'1fr 1fr' }}>
        <div className="card">
          <div className="card-header"><h3>📊 Subject Performance</h3></div>
          {CHILD.subjects.map(s => {
            const color = s.score>=75?'success':s.score>=50?'warning':'danger';
            return (
              <div key={s.name} style={{ marginBottom:14 }}>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:'.85rem', marginBottom:4 }}>
                  <span style={{ fontWeight:500 }}>{s.name}</span>
                  <span style={{ fontWeight:700, color:`var(--${color})` }}>{s.score}%</span>
                </div>
                <div className="progress-bar">
                  <div className={`progress-fill ${color}`} style={{ width:`${s.score}%` }} />
                </div>
                {s.weak && <div style={{ fontSize:'.7rem', color:'var(--danger)', marginTop:3 }}>⚠️ Needs attention: {s.weak}</div>}
              </div>
            );
          })}
        </div>

        <div className="card">
          <div className="card-header"><h3>💡 Suggestions for You</h3></div>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {CHILD.attendance < 75 && (
              <div style={{ padding:12, background:'var(--danger-bg)', borderRadius:'var(--radius-sm)', fontSize:'.83rem' }}>
                <strong>📌 Attendance Priority:</strong> Ensure {CHILD.name} attends school daily. Current attendance of {CHILD.attendance}% risks being marked ineligible for exams.
              </div>
            )}
            {CHILD.subjects.filter(s=>s.weak).map(s => (
              <div key={s.name} style={{ padding:12, background:'var(--warning-bg)', borderRadius:'var(--radius-sm)', fontSize:'.83rem' }}>
                <strong>📌 {s.name}:</strong> Help your child focus on <em>{s.weak}</em>. Consider arranging extra practice or tuition.
              </div>
            ))}
            <div style={{ padding:12, background:'var(--success-bg)', borderRadius:'var(--radius-sm)', fontSize:'.83rem' }}>
              <strong>✅ English:</strong> Your child is performing well. Encourage continued reading practice.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function ParentFees() {
  return (
    <>
      <div className="page-header"><h2>💰 Fee Management</h2><p>Child: Ankit Verma · Class 10A</p></div>
      <div className="grid gap-4" style={{ gridTemplateColumns:'repeat(3,1fr)', marginBottom:24 }}>
        {[['Total Annual','var(--primary)',formatRupees(18000)],['Paid','var(--success)',formatRupees(12000)],['Pending','var(--danger)',formatRupees(6000)]].map(([l,c,v]) => (
          <div key={l} className="stat-card">
            <div style={{ flex:1 }}>
              <div style={{ color:'var(--gray-500)', fontSize:'.8rem', marginBottom:4 }}>{l} Fee</div>
              <div style={{ fontSize:'1.5rem', fontWeight:800, color:c }}>{v}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="card">
        <div className="card-header"><h3>Payment History</h3><button className="btn btn-secondary btn-sm">Download All</button></div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Month</th><th>Amount (₹)</th><th>Mode</th><th>Date</th><th>Status</th><th>Receipt</th></tr></thead>
            <tbody>
              {[['March 2026',4000,'Online','05-03-2026','Paid'],['February 2026',4000,'Offline','03-02-2026','Paid'],['January 2026',4000,'Online','02-01-2026','Paid']].map(([m,a,mode,d,s]) => (
                <tr key={m}>
                  <td style={{ fontWeight:500 }}>{m}</td>
                  <td style={{ fontWeight:700 }}>₹ {a.toLocaleString('en-IN')}</td>
                  <td>{mode}</td>
                  <td>{d}</td>
                  <td><span className="badge badge-success">{s}</span></td>
                  <td><button className="btn btn-secondary btn-sm">📄 Download</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pending Banner */}
        <div style={{ marginTop:20, padding:16, background:'var(--danger-bg)', borderRadius:'var(--radius-sm)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div>
            <div style={{ fontWeight:700, color:'var(--danger)' }}>April 2026 — ₹ 6,000 Pending</div>
            <div style={{ fontSize:'.78rem', color:'var(--gray-500)' }}>Due date: 10-05-2026</div>
          </div>
          <button className="btn btn-primary">Pay Now ₹ 6,000</button>
        </div>
      </div>
    </>
  );
}

export default function ParentDashboard() {
  const { user } = useAuth();
  const [active, setActive] = useState('home');

  const titles = {
    home:         ['Parent Dashboard', `Monitoring: ${CHILD.name}`],
    attendance:   ['Attendance Report', `${CHILD.name} · Class ${CHILD.class}`],
    performance:  ['Performance Report', `${CHILD.name} · Academic Year 2025–2026`],
    fees:         ['Fee Management', `${CHILD.name} · Class ${CHILD.class}`],
    announcements:['School Notices', 'Announcements from school'],
  };

  const [title, subtitle] = titles[active] || ['Dashboard',''];

  return (
    <AppShell navItems={NAV} active={active} setActive={setActive} title={title} subtitle={subtitle}>
      {active === 'home'        && <ParentHome />}
      {active === 'fees'        && <ParentFees />}
      {active === 'attendance'  && (
        <div className="card">
          <div className="card-header">
            <h3>Attendance Summary — {CHILD.name}</h3>
            <span className="badge badge-danger">{CHILD.attendance}% — Low</span>
          </div>
          <div className="alert alert-danger">⚠️ Attendance is below 75%. The student may be barred from exams if this continues.</div>
        </div>
      )}
      {active === 'performance' && (
        <div className="card">
          <div className="card-header"><h3>Subject-wise Performance</h3></div>
          {CHILD.subjects.map(s => {
            const color = s.score>=75?'success':s.score>=50?'warning':'danger';
            return (
              <div key={s.name} style={{ marginBottom:16 }}>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:'.9rem', marginBottom:6 }}>
                  <span style={{ fontWeight:600 }}>{s.name}</span>
                  <span style={{ fontWeight:700, color:`var(--${color})` }}>{s.score}%</span>
                </div>
                <div className="progress-bar"><div className={`progress-fill ${color}`} style={{ width:`${s.score}%` }} /></div>
                {s.weak && <div style={{ fontSize:'.75rem', color:'var(--danger)', marginTop:4 }}>⚠️ Weak in {s.weak}</div>}
              </div>
            );
          })}
        </div>
      )}
      {active === 'announcements' && (
        <div className="card"><div className="empty-state"><div className="icon">📢</div><p>No new announcements from school.</p></div></div>
      )}
    </AppShell>
  );
}
