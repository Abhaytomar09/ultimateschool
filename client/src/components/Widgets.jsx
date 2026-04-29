import React, { useEffect, useRef, useState } from 'react';

/** Animated count-up number */
export function CountUp({ to, duration = 1000, prefix = '', suffix = '' }) {
  const [val, setVal] = useState(0);
  const start = useRef(null);
  useEffect(() => {
    const step = (ts) => {
      if (!start.current) start.current = ts;
      const p = Math.min((ts - start.current) / duration, 1);
      setVal(Math.floor(p * to));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [to, duration]);
  return <>{prefix}{val.toLocaleString('en-IN')}{suffix}</>;
}

/** Live ticking clock */
export function LiveClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const hh = String(time.getHours()).padStart(2,'0');
  const mm = String(time.getMinutes()).padStart(2,'0');
  const ss = String(time.getSeconds()).padStart(2,'0');
  return (
    <span style={{ fontFamily:'var(--font-mono)', fontSize:'.8rem', color:'var(--text-secondary)', letterSpacing:'.05em' }}>
      {hh}:{mm}:{ss}
    </span>
  );
}

/** Countdown to a given HH:MM time today */
export function CountdownTimer({ targetTime, label }) {
  const [diff, setDiff] = useState(0);
  useEffect(() => {
    const calc = () => {
      const now = new Date();
      const [h, m] = targetTime.split(':').map(Number);
      const target = new Date(now);
      target.setHours(h, m, 0, 0);
      setDiff(Math.max(0, Math.floor((target - now) / 1000)));
    };
    calc();
    const t = setInterval(calc, 1000);
    return () => clearInterval(t);
  }, [targetTime]);

  const mm = Math.floor(diff / 60);
  const ss = String(diff % 60).padStart(2,'0');
  if (diff <= 0) return null;
  return (
    <span style={{ fontFamily:'var(--font-mono)', color:'var(--amber)', fontWeight:700 }}>
      {label} in {mm}m {ss}s
    </span>
  );
}

/** Circular SVG progress ring */
export function ProgressRing({ pct, size = 80, stroke = 6, color = 'var(--blue)', children }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <div style={{ position:'relative', width:size, height:size, flexShrink:0 }}>
      <svg width={size} height={size} style={{ transform:'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={stroke}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round" style={{ transition:'stroke-dashoffset .6s ease' }}
        />
      </svg>
      <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column' }}>
        {children}
      </div>
    </div>
  );
}
