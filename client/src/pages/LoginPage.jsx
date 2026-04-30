import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

// ─── Demo Payloads (offline / backend-down fallback) ─────────────────────────
const DEMO = {
    admin:   { customId:'AD0001', name:'Rajesh Kumar',  role:'admin',   schoolId:'sch001', schoolCode:'SCH001', schoolName:'Demo Public School', token:'demo' },
    teacher: { customId:'TH0001', name:'Sunita Sharma', role:'teacher', schoolId:'sch001', schoolCode:'SCH001', schoolName:'Demo Public School', token:'demo' },
    student: { customId:'ST0001', name:'Ankit Verma',   role:'student', schoolId:'sch001', schoolCode:'SCH001', schoolName:'Demo Public School', token:'demo', class:'10A' },
    parent:  { customId:'PF0001', name:'Ramesh Verma',  role:'parent',  schoolId:'sch001', schoolCode:'SCH001', schoolName:'Demo Public School', token:'demo', childName:'Ankit Verma' },
};

const DEMO_ROLES = [
    { id:'admin',   label:'Admin',   icon:'🏫' },
    { id:'teacher', label:'Teacher', icon:'👨‍🏫' },
    { id:'student', label:'Student', icon:'👨‍🎓' },
    { id:'parent',  label:'Parent',  icon:'👨‍👩‍👧' },
];

// ─── ID prefix → role hint ────────────────────────────────────────────────────
const HINT_MAP = { st:'Student', th:'Teacher', pf:'Parent (Father)', pm:'Parent (Mother)', ad:'Admin' };
const getRoleHint = (id) => HINT_MAP[(id || '').toLowerCase().slice(0, 2)] || '';

// ─── Time greeting (Hindi) ────────────────────────────────────────────────────
const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'सुप्रभात 🌅';
    if (h < 17) return 'नमस्ते 🌤️';
    return 'शुभ संध्या 🌙';
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function LoginPage() {
    const { login, schoolCode: savedCode, schoolName: savedName, changeSchool } = useAuth();

    // Detect returning-user mode: schoolCode already saved in localStorage
    const isReturning = !!savedCode;

    const [schoolCodeInput, setSchoolCodeInput] = useState('');
    const [userId,   setUserId]   = useState('');
    const [password, setPassword] = useState('');
    const [loading,  setLoading]  = useState(false);
    const [error,    setError]    = useState('');
    const [showPass, setShowPass] = useState(false);

    // Lookup school name while user types school code (debounced)
    const [lookupName, setLookupName] = useState('');
    const [lookupStatus, setLookupStatus] = useState(''); // 'found' | 'not-found' | ''
    const lookupTimer = useRef(null);

    // Role hint derived from userId prefix
    const roleHint = getRoleHint(userId);

    // Debounced school code lookup
    useEffect(() => {
        const code = schoolCodeInput.trim().toUpperCase();
        if (!code || code.length < 3) {
            setLookupName('');
            setLookupStatus('');
            return;
        }
        clearTimeout(lookupTimer.current);
        lookupTimer.current = setTimeout(async () => {
            try {
                const r = await fetch(`http://localhost:5000/api/auth/school/${code}`);
                if (r.ok) {
                    const data = await r.json();
                    setLookupName(data.schoolName);
                    setLookupStatus('found');
                } else {
                    setLookupName('');
                    setLookupStatus('not-found');
                }
            } catch {
                setLookupName('');
                setLookupStatus('');
            }
        }, 500);
        return () => clearTimeout(lookupTimer.current);
    }, [schoolCodeInput]);

    // ── Submit ──────────────────────────────────────────────────────────────
    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        const code = isReturning ? savedCode : schoolCodeInput.trim().toUpperCase();
        const uid  = userId.trim();
        const pwd  = password;

        if (!code)  { setError('Please enter your School Code.'); return; }
        if (!uid)   { setError('Please enter your User ID (e.g. ST0001).'); return; }
        if (!pwd)   { setError('Please enter your password.'); return; }

        setLoading(true);

        try {
            const r = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ schoolCode: code, userId: uid, password: pwd }),
            });

            if (r.ok) {
                const data = await r.json();
                login(data);
                return;
            }

            // Try to parse server error
            const errData = await r.json().catch(() => ({}));
            setError(errData.message || 'Invalid credentials.');

        } catch {
            // Backend offline → try demo mode
            if (pwd === 'demo123') {
                const prefix = uid.toLowerCase().slice(0, 2);
                const roleKey = { st:'student', th:'teacher', pf:'parent', pm:'parent', ad:'admin' }[prefix];
                if (roleKey && code === 'SCH001') {
                    login(DEMO[roleKey]);
                    return;
                }
            }
            setError('Cannot connect to server. Use demo mode below (School: SCH001, pwd: demo123).');
        } finally {
            setLoading(false);
        }
    };

    // ── Render ──────────────────────────────────────────────────────────────
    return (
        <div className="login-page">
            {/* Animated background orbs */}
            <div className="login-bg-orb" style={{ top:'10%', left:'15%', width:340, height:340, background:'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)' }} />
            <div className="login-bg-orb" style={{ bottom:'15%', right:'10%', width:280, height:280, background:'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)' }} />

            <div className="login-card">

                {/* Logo */}
                <div className="login-logo">
                    <div className="logo-icon">🏫</div>
                    <h1>UltimateSchool</h1>
                    <p style={{ color:'var(--text-muted)', marginTop:4, fontSize:'.85rem' }}>
                        {getGreeting()} — भारत का फ्यूचर स्कूल
                    </p>
                </div>

                {/* ── Returning-user school banner ── */}
                {isReturning && (
                    <div className="school-banner">
                        <span className="school-banner-icon">🏫</span>
                        <div>
                            <div className="school-banner-name">{savedName || savedCode}</div>
                            <div className="school-banner-code">School Code: {savedCode}</div>
                        </div>
                        <button
                            type="button"
                            className="change-school-btn"
                            onClick={changeSchool}
                            title="Log in to a different school"
                        >
                            Change
                        </button>
                    </div>
                )}

                {/* ── Login form ── */}
                <form className="login-form" onSubmit={handleLogin} noValidate>

                    {/* School Code — only shown for first-time visitors */}
                    {!isReturning && (
                        <div className="form-group">
                            <label htmlFor="schoolCode">
                                School Code
                                <span style={{ color:'var(--text-muted)', fontWeight:400, marginLeft:6, fontSize:'.75rem' }}>
                                    (provided by your school admin)
                                </span>
                            </label>
                            <input
                                id="schoolCode"
                                className={`input ${lookupStatus === 'found' ? 'input-success' : lookupStatus === 'not-found' ? 'input-error' : ''}`}
                                placeholder="e.g. SCH001"
                                value={schoolCodeInput}
                                onChange={e => setSchoolCodeInput(e.target.value.toUpperCase())}
                                autoComplete="organization"
                                maxLength={20}
                            />
                            {lookupStatus === 'found' && (
                                <div className="input-hint input-hint-success">✓ {lookupName}</div>
                            )}
                            {lookupStatus === 'not-found' && (
                                <div className="input-hint input-hint-error">✗ School not found. Check the code.</div>
                            )}
                        </div>
                    )}

                    {/* User ID */}
                    <div className="form-group">
                        <label htmlFor="userId">
                            User ID
                            {roleHint && (
                                <span className="role-pill">{roleHint}</span>
                            )}
                        </label>
                        <input
                            id="userId"
                            className="input"
                            placeholder="e.g. ST0001 / TH0001 / AD0001"
                            value={userId}
                            onChange={e => setUserId(e.target.value.toUpperCase())}
                            autoComplete="username"
                            maxLength={10}
                        />
                    </div>

                    {/* Password */}
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <div style={{ position:'relative' }}>
                            <input
                                id="password"
                                className="input"
                                type={showPass ? 'text' : 'password'}
                                placeholder="Enter your password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                autoComplete="current-password"
                                style={{ paddingRight:48 }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPass(v => !v)}
                                style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)', fontSize:'1rem' }}
                                aria-label={showPass ? 'Hide password' : 'Show password'}
                            >
                                {showPass ? '🙈' : '👁️'}
                            </button>
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="alert alert-rose" role="alert">
                            ⚠️ {error}
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        id="loginSubmitBtn"
                        className="btn btn-primary btn-lg w-full"
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? <><span className="spinner" /> Verifying…</>
                            : '→ Enter Campus'
                        }
                    </button>

                    {/* Demo section */}
                    <div className="divider">Demo Access (School: SCH001 · pwd: demo123)</div>
                    <div className="demo-grid">
                        {DEMO_ROLES.map(r => (
                            <button
                                key={r.id}
                                id={`demoBtn${r.label}`}
                                type="button"
                                className="btn btn-ghost btn-sm"
                                onClick={() => login(DEMO[r.id])}
                            >
                                {r.icon} {r.label}
                            </button>
                        ))}
                    </div>

                </form>
            </div>
        </div>
    );
}
