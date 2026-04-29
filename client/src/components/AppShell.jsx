import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LiveClock } from './Widgets';

const SVG = ({ d }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" width="17" height="17">
    <path strokeLinecap="round" strokeLinejoin="round" d={d}/>
  </svg>
);

const ICONS = {
  home:       'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
  clock:      'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
  book:       'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
  chart:      'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
  rupee:      'M9 8h6M9 12h6m-6 4h6M9 4h6a7 7 0 010 14H9l3 3M9 4l3 17',
  bell:       'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9',
  users:      'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
  calendar:   'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
  logout:     'M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1',
  assignment: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01',
  school:     'M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222',
  menu:       'M4 6h16M4 12h16M4 18h16',
  upload:     'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12',
  message:    'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
  settings:   'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
};

export function Icon({ name, size = 17 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
      strokeWidth={1.8} stroke="currentColor" width={size} height={size}>
      <path strokeLinecap="round" strokeLinejoin="round" d={ICONS[name] || ICONS.home} />
    </svg>
  );
}

function Sidebar({ nav, active, setActive, notifications = {} }) {
  const { user, logout } = useAuth();
  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase() || 'US';

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon">🏫</div>
        <div className="brand-text">
          <div className="name">UltimateSchool</div>
          <div className="year">AY 2025–2026</div>
        </div>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-section-label">Navigation</div>
        {nav.map(item => (
          <div
            key={item.id}
            className={`nav-item ${active === item.id ? 'active' : ''}`}
            onClick={() => setActive(item.id)}
          >
            <Icon name={item.icon} />
            {item.label}
            {notifications[item.id] > 0 && (
              <span className="nav-badge">{notifications[item.id]}</span>
            )}
          </div>
        ))}
      </div>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-avatar">
            {initials}
            <span className="online-dot" />
          </div>
          <div>
            <div className="user-name">{user?.name}</div>
            <div className="user-role mono">{user?.customId} · {user?.role}</div>
          </div>
        </div>
        <button
          className="btn btn-ghost w-full"
          style={{ marginTop:12, fontSize:'.8rem', justifyContent:'flex-start' }}
          onClick={logout}
        >
          <Icon name="logout" /> Sign Out
        </button>
      </div>
    </aside>
  );
}

function Topbar({ title, subtitle }) {
  const today = new Date().toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long' });
  return (
    <header className="topbar">
      <div className="topbar-left">
        <h2>{title}</h2>
        {subtitle && <p className="mono">{subtitle}</p>}
      </div>
      <div className="topbar-right">
        <LiveClock />
        <span style={{ color:'var(--text-muted)', fontSize:'.78rem', fontFamily:'var(--font-mono)' }}>{today}</span>
        <button className="btn btn-ghost btn-icon" style={{ position:'relative' }}>
          <Icon name="bell" size={18}/>
          <span style={{ position:'absolute', top:5, right:5, width:6, height:6, borderRadius:'50%', background:'var(--rose)' }}/>
        </button>
      </div>
    </header>
  );
}

export function AppShell({ nav, active, setActive, title, subtitle, notifications, children }) {
  return (
    <div className="app-shell">
      <Sidebar nav={nav} active={active} setActive={setActive} notifications={notifications}/>
      <div className="main-content">
        <Topbar title={title} subtitle={subtitle}/>
        <div className="page-body">{children}</div>
      </div>
    </div>
  );
}
