import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

const API = 'http://localhost:5000';

// ─── Demo payloads (offline / backend-down fallback) ─────────────────────────
const DEMO = {
    admin:   { customId:'AD0001', name:'Rajesh Kumar',  role:'admin',   schoolCode:'SCH001', schoolName:'Demo Public School', token:'demo' },
    teacher: { customId:'TH0001', name:'Sunita Sharma', role:'teacher', schoolCode:'SCH001', schoolName:'Demo Public School', token:'demo' },
    student: { customId:'ST0001', name:'Ankit Verma',   role:'student', schoolCode:'SCH001', schoolName:'Demo Public School', token:'demo', class:'10A' },
    parent:  { customId:'PF0001', name:'Ramesh Verma',  role:'parent',  schoolCode:'SCH001', schoolName:'Demo Public School', token:'demo', childName:'Ankit Verma' },
};

const DEMO_ROLES = [
    { id:'admin',   label:'Admin',   icon:'🏫' },
    { id:'teacher', label:'Teacher', icon:'👨‍🏫' },
    { id:'student', label:'Student', icon:'👨‍🎓' },
    { id:'parent',  label:'Parent',  icon:'👨‍👩‍👧' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'सुप्रभात 🌅';
    if (h < 17) return 'नमस्ते 🌤️';
    return 'शुभ संध्या 🌙';
};

// Detect role from ID prefix for the hint pill
const ROLE_HINTS = { st:'Student', th:'Teacher', pf:'Parent (Father)', pm:'Parent (Mother)', ad:'Admin' };
const getRoleHint = (id) => ROLE_HINTS[(id || '').toLowerCase().slice(0, 2)] || '';

// Simple debounce hook
function useDebounce(value, delay) {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const t = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(t);
    }, [value, delay]);
    return debounced;
}

// ─── SchoolSearch sub-component ───────────────────────────────────────────────
function SchoolSearch({ onSelect }) {
    const [query,       setQuery]       = useState('');
    const [results,     setResults]     = useState([]);
    const [open,        setOpen]        = useState(false);
    const [searching,   setSearching]   = useState(false);
    const [noResults,   setNoResults]   = useState(false);
    const wrapRef = useRef(null);

    const debouncedQ = useDebounce(query, 300);

    // Fetch results when debounced query changes
    useEffect(() => {
        if (debouncedQ.length < 2) {
            setResults([]);
            setOpen(false);
            setNoResults(false);
            return;
        }
        let cancelled = false;
        setSearching(true);
        fetch(`${API}/api/schools/search?q=${encodeURIComponent(debouncedQ)}`)
            .then(r => r.json())
            .then(data => {
                if (cancelled) return;
                const list = Array.isArray(data) ? data : [];
                setResults(list);
                setNoResults(list.length === 0);
                setOpen(true);
            })
            .catch(() => {
                if (cancelled) return;
                setResults([]);
                setNoResults(true);
                setOpen(true);
            })
            .finally(() => { if (!cancelled) setSearching(false); });
        return () => { cancelled = true; };
    }, [debouncedQ]);

    // Close dropdown on outside click
    useEffect(() => {
        const handler = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleSelect = (school) => {
        setQuery(`${school.name} (${school.schoolCode})`);
        setOpen(false);
        onSelect(school);
    };

    return (
        <div className="school-search-wrap" ref={wrapRef}>
            <div style={{ position:'relative' }}>
                <span className="school-search-icon">🔍</span>
                <input
                    id="schoolSearch"
                    className="input school-search-input"
                    placeholder="Search school by name or code…"
                    value={query}
                    onChange={e => { setQuery(e.target.value); onSelect(null); }}
                    onFocus={() => { if (results.length > 0) setOpen(true); }}
                    autoComplete="off"
                    aria-label="Search school"
                    aria-autocomplete="list"
                    aria-expanded={open}
                />
                {searching && <span className="search-spinner" aria-label="Searching" />}
            </div>

            {open && (
                <ul className="school-dropdown" role="listbox" aria-label="School results">
                    {results.length > 0 ? results.map(s => (
                        <li
                            key={s.schoolCode}
                            className="school-dropdown-item"
                            role="option"
                            onMouseDown={() => handleSelect(s)}
                        >
                            <span className="sdi-name">{s.name}</span>
                            <span className="sdi-code">{s.schoolCode}</span>
                        </li>
                    )) : (
                        <li className="school-dropdown-empty">
                            <span>🏫</span>
                            <span>No school found. Check the spelling or contact your admin.</span>
                        </li>
                    )}
                </ul>
            )}
        </div>
    );
}

// ─── Main LoginPage ───────────────────────────────────────────────────────────
export default function LoginPage() {
    const { login, schoolCode: savedCode, schoolName: savedName, changeSchool } = useAuth();

    // Selected school from autocomplete
    const [selectedSchool, setSelectedSchool] = useState(
        savedCode ? { schoolCode: savedCode, name: savedName } : null
    );

    const [userId,   setUserId]   = useState('');
    const [password, setPassword] = useState('');
    const [loading,  setLoading]  = useState(false);
    const [error,    setError]    = useState('');
    const [showPass, setShowPass] = useState(false);

    const roleHint = getRoleHint(userId);

    // ── Handle school cleared (Change button) ──
    const handleChangeSchool = () => {
        setSelectedSchool(null);
        setError('');
        changeSchool();
    };

    // ── Login submit ──────────────────────────────────────────────────────────
    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        if (!selectedSchool) { setError('Please search and select your school first.'); return; }
        if (!userId.trim())  { setError('Please enter your User ID (e.g. ST0001).'); return; }
        if (!password)       { setError('Please enter your password.'); return; }

        setLoading(true);
        try {
            const r = await fetch(`${API}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    schoolCode: selectedSchool.schoolCode,
                    userId:     userId.trim(),
                    password,
                }),
            });

            if (r.ok) {
                login(await r.json());
                return;
            }

            const errData = await r.json().catch(() => ({}));
            setError(errData.message || 'Invalid credentials.');

        } catch {
            // Backend offline → demo fallback
            if (password === 'demo123' && selectedSchool.schoolCode === 'SCH001') {
                const prefix  = userId.trim().toLowerCase().slice(0, 2);
                const roleKey = { st:'student', th:'teacher', pf:'parent', pm:'parent', ad:'admin' }[prefix];
                if (roleKey) { login(DEMO[roleKey]); return; }
            }
            setError('Cannot connect to server. Use demo mode below (School: SCH001, pwd: demo123).');
        } finally {
            setLoading(false);
        }
    };

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <div className="login-page">
            {/* Animated background orbs */}
            <div className="login-bg-orb" style={{ top:'8%',  left:'12%', width:360, height:360, background:'radial-gradient(circle, rgba(59,130,246,0.14) 0%, transparent 70%)' }} />
            <div className="login-bg-orb" style={{ bottom:'12%', right:'8%', width:300, height:300, background:'radial-gradient(circle, rgba(139,92,246,0.11) 0%, transparent 70%)', animationDelay:'3s' }} />

            <div className="login-card">

                {/* Logo */}
                <div className="login-logo">
                    <div className="logo-icon">🏫</div>
                    <h1>UltimateSchool</h1>
                    <p style={{ color:'var(--text-muted)', marginTop:4, fontSize:'.85rem' }}>
                        {getGreeting()} — भारत का फ्यूचर स्कूल
                    </p>
                </div>

                <form className="login-form" onSubmit={handleLogin} noValidate>

                    {/* ── Step 1: School selection ── */}
                    {!selectedSchool ? (
                        <div className="form-group fade-up">
                            <label htmlFor="schoolSearch">
                                Select Your School
                                <span style={{ color:'var(--text-muted)', fontWeight:400, marginLeft:6, fontSize:'.7rem', textTransform:'none', letterSpacing:0 }}>
                                    — type name or school code
                                </span>
                            </label>
                            <SchoolSearch onSelect={setSelectedSchool} />
                        </div>
                    ) : (
                        /* ── School selected banner ── */
                        <div className="school-banner fade-up">
                            <span className="school-banner-icon">🏫</span>
                            <div style={{ flex:1, minWidth:0 }}>
                                <div className="school-banner-name">{selectedSchool.name}</div>
                                <div className="school-banner-code">Code: {selectedSchool.schoolCode}</div>
                            </div>
                            <button
                                type="button"
                                className="change-school-btn"
                                onClick={handleChangeSchool}
                                title="Search for a different school"
                            >
                                ✕ Change
                            </button>
                        </div>
                    )}

                    {/* ── Step 2: Credentials (only when school is selected) ── */}
                    {selectedSchool && (
                        <>
                            {/* User ID */}
                            <div className="form-group fade-up">
                                <label htmlFor="userId">
                                    User ID
                                    {roleHint && <span className="role-pill">{roleHint}</span>}
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
                            <div className="form-group fade-up">
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
                                        style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)', fontSize:'1rem', lineHeight:1 }}
                                        aria-label={showPass ? 'Hide password' : 'Show password'}
                                        tabIndex={-1}
                                    >
                                        {showPass ? '🙈' : '👁️'}
                                    </button>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Error */}
                    {error && (
                        <div className="alert alert-rose fade-up" role="alert">⚠️ {error}</div>
                    )}

                    {/* Submit — only active when school is selected */}
                    <button
                        id="loginSubmitBtn"
                        className="btn btn-primary btn-lg w-full"
                        type="submit"
                        disabled={loading || !selectedSchool}
                        style={{ opacity: selectedSchool ? 1 : 0.45 }}
                    >
                        {loading
                            ? <><span className="spinner" /> Verifying…</>
                            : selectedSchool ? '→ Enter Campus' : '← Select school above'
                        }
                    </button>

                    {/* Demo section */}
                    <div className="divider">
                        Demo Access — School: SCH001 · pwd: demo123
                    </div>
                    <div className="demo-grid">
                        {DEMO_ROLES.map(r => (
                            <button
                                key={r.id}
                                id={`demoBtn${r.label}`}
                                type="button"
                                className="btn btn-ghost btn-sm"
                                onClick={() => {
                                    setSelectedSchool({ schoolCode:'SCH001', name:'Demo Public School' });
                                    login(DEMO[r.id]);
                                }}
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
