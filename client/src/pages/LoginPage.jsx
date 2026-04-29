import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { formatId } from '../utils/format';

const ROLES = [
  { id: 'admin',   label: 'Admin',   icon: '🏫' },
  { id: 'teacher', label: 'Teacher', icon: '👨‍🏫' },
  { id: 'student', label: 'Student', icon: '👨‍🎓' },
  { id: 'parent',  label: 'Parent',  icon: '👨‍👩‍👧' },
];

// Demo credentials for each role
const DEMO_USERS = {
  admin:   { customId: 'AD0001', name: 'Rajesh Kumar',   role: 'admin',   schoolId: 'sch001', token: 'demo' },
  teacher: { customId: 'TH0001', name: 'Sunita Sharma',  role: 'teacher', schoolId: 'sch001', token: 'demo' },
  student: { customId: 'ST0001', name: 'Ankit Verma',    role: 'student', schoolId: 'sch001', token: 'demo', className: '10A' },
  parent:  { customId: 'PF0001', name: 'Ramesh Verma',   role: 'parent',  schoolId: 'sch001', token: 'demo', childId: 'ST0001', childName: 'Ankit Verma' },
};

export default function LoginPage() {
  const { login } = useAuth();
  const [role, setRole]       = useState('student');
  const [userId, setUserId]   = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!userId || !password) { setError('Please enter your User ID and password.'); return; }
    setLoading(true);

    try {
      // Attempt real API first
      const resp = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userId, password }),
      });

      if (resp.ok) {
        const data = await resp.json();
        login({ ...data, customId: formatId(data.customId) });
      } else {
        // Fallback to demo for UI preview
        const demoUser = DEMO_USERS[role];
        if (password === 'demo123') {
          login(demoUser);
        } else {
          setError('Invalid credentials. Use demo123 as password for demo mode.');
        }
      }
    } catch {
      // If API not reachable, fallback to demo
      const demoUser = DEMO_USERS[role];
      if (password === 'demo123') {
        login(demoUser);
      } else {
        setError('Server not reachable. Use demo123 as password for demo mode.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <div className="logo-icon">🏫</div>
          <h1>UltimateSchool</h1>
          <p>भारत के विद्यालयों का डिजिटल प्लेटफॉर्म</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {/* Role Selector */}
          <div>
            <label style={{ marginBottom: 8, display: 'block' }}>Login As</label>
            <div className="role-selector">
              {ROLES.map(r => (
                <div
                  key={r.id}
                  className={`role-option ${role === r.id ? 'active' : ''}`}
                  onClick={() => setRole(r.id)}
                >
                  <span className="role-icon">{r.icon}</span>
                  {r.label}
                </div>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="userId">User ID / Email</label>
            <input
              id="userId"
              type="text"
              className="input"
              placeholder="e.g. ST0001 or admin@school.in"
              value={userId}
              onChange={e => setUserId(e.target.value)}
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="input"
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="alert alert-danger">
              ⚠️ {error}
            </div>
          )}

          <button type="submit" className="btn btn-primary btn-lg w-full" disabled={loading}>
            {loading ? <span className="spinner" /> : 'Login to Dashboard'}
          </button>

          <div className="login-divider">Quick Demo Login</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
            {ROLES.map(r => (
              <button
                key={r.id}
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => login({ ...DEMO_USERS[r.id] })}
              >
                {r.icon} {r.label} Demo
              </button>
            ))}
          </div>
        </form>
      </div>
    </div>
  );
}
