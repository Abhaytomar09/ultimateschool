import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const ROLES = [
  { id:'admin',   label:'Admin',   icon:'🏫', desc:'Manage school' },
  { id:'teacher', label:'Teacher', icon:'👨‍🏫', desc:'Classes & marks' },
  { id:'student', label:'Student', icon:'👨‍🎓', desc:'Study & attend' },
  { id:'parent',  label:'Parent',  icon:'👨‍👩‍👧', desc:'Monitor child' },
];

const DEMO = {
  admin:   { customId:'AD0001', name:'Rajesh Kumar',  role:'admin',   schoolId:'sch001', token:'demo' },
  teacher: { customId:'TH0001', name:'Sunita Sharma', role:'teacher', schoolId:'sch001', token:'demo' },
  student: { customId:'ST0001', name:'Ankit Verma',   role:'student', schoolId:'sch001', token:'demo', class:'10A' },
  parent:  { customId:'PF0001', name:'Ramesh Verma',  role:'parent',  schoolId:'sch001', token:'demo', childName:'Ankit Verma' },
};

export default function LoginPage() {
  const { login } = useAuth();
  const [role, setRole]   = useState('student');
  const [uid, setUid]     = useState('');
  const [pass, setPass]   = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const greet = () => {
    const h = new Date().getHours();
    if (h < 12) return 'सुप्रभात 🌅';
    if (h < 17) return 'नमस्ते 🌤️';
    return 'शुभ संध्या 🌙';
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!uid || !pass) { setError('Please enter your credentials.'); return; }
    setLoading(true); setError('');
    try {
      const r = await fetch('http://localhost:5000/api/auth/login', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ email:uid, password:pass }),
      });
      if (r.ok) { login(await r.json()); return; }
    } catch {}
    if (pass === 'demo123') { login(DEMO[role]); }
    else { setError('Invalid credentials. Use demo123 for demo access.'); }
    setLoading(false);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <div className="logo-icon">🏫</div>
          <h1>UltimateSchool</h1>
          <p style={{ color:'var(--text-muted)', marginTop:4 }}>{greet()} — भारत का फ्यूचर स्कूल</p>
        </div>

        <form className="login-form" onSubmit={handleLogin}>
          <div>
            <label style={{ display:'block', marginBottom:8 }}>Select Role</label>
            <div className="role-grid">
              {ROLES.map(r => (
                <div key={r.id} className={`role-option ${role===r.id?'active':''}`} onClick={() => setRole(r.id)}>
                  <span className="role-icon">{r.icon}</span>
                  <strong>{r.label}</strong>
                  <div style={{ fontSize:'.7rem', opacity:.6, marginTop:2 }}>{r.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>User ID / Email</label>
            <input className="input" placeholder="e.g. ST0001" value={uid} onChange={e=>setUid(e.target.value)} autoComplete="username"/>
          </div>
          <div className="form-group">
            <label>Password</label>
            <input className="input" type="password" placeholder="Enter password" value={pass} onChange={e=>setPass(e.target.value)} autoComplete="current-password"/>
          </div>

          {error && <div className="alert alert-rose">⚠️ {error}</div>}

          <button className="btn btn-primary btn-lg w-full" disabled={loading}>
            {loading ? <span className="spinner"/> : '→ Enter Campus'}
          </button>

          <div className="divider">Quick Demo Access</div>
          <div className="demo-grid">
            {ROLES.map(r => (
              <button key={r.id} type="button" className="btn btn-ghost btn-sm"
                onClick={() => login(DEMO[r.id])}>
                {r.icon} {r.label}
              </button>
            ))}
          </div>
        </form>
      </div>
    </div>
  );
}
