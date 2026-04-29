# 📁 UltimateSchool — Session Save File
**Date:** 30 April 2026, 02:05 AM IST  
**Conversation ID:** f4a7e8bf-9e7d-461a-8de3-a6c224af46ed  
**GitHub Repo:** https://github.com/Abhaytomar09/ultimateschool.git  
**Last Git Commit:** `feat: Future-school redesign — dark theme, glassmorphism, animated stats, heatmaps, kanban, timeline, AI focus zone`

---

## 🖥️ Dev Server URLs (run these tomorrow)

| Service  | Command (run from folder)                                      | URL                      |
|----------|----------------------------------------------------------------|--------------------------|
| Frontend | `cd client` → `npm run dev`                                    | http://127.0.0.1:5173    |
| Backend  | `cd server` → `npm run dev`                                    | http://localhost:5000    |

> If port 5173 is busy, Vite will auto-pick 5174. Check terminal output.

---

## 🔐 Environment Variables

### `server/.env`
```
PORT=5000
MONGODB_URI=mongodb+srv://abhaytomar392004_db_user:Abhay392004@unmax0.xzitnnf.mongodb.net/myDatabase?retryWrites=true&w=majority
JWT_SECRET=ultimateschool_super_secret_key_2025
```

> ⚠️ Never commit `.env` to GitHub. It is already in `.gitignore`.

### GitHub Actions Secrets (already set in repo)
- `MONGODB_URI` → Atlas URI
- `JWT_SECRET` → JWT key

---

## 📂 Project Structure (Current State)

```
ultimateschool/
├── client/                        ← React + Vite Frontend
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── src/
│       ├── main.jsx
│       ├── App.jsx                ← Routes: /login → /dashboard (role-based)
│       ├── index.css              ← DARK design system (Space Grotesk, glassmorphism)
│       ├── context/
│       │   └── AuthContext.jsx    ← JWT auth state + localStorage
│       ├── utils/
│       │   └── format.js          ← ₹ formatRupees(), DD-MM-YYYY, uppercase IDs
│       ├── components/
│       │   ├── AppShell.jsx       ← Sidebar + Topbar layout (dark, animated nav)
│       │   └── Widgets.jsx        ← CountUp, LiveClock, CountdownTimer, ProgressRing
│       └── pages/
│           ├── LoginPage.jsx      ← Role selector + Quick Demo buttons
│           ├── StudentDashboard.jsx
│           ├── TeacherDashboard.jsx
│           ├── ParentDashboard.jsx
│           └── AdminDashboard.jsx
│
├── server/                        ← Node.js + Express Backend
│   ├── server.js                  ← Entry point, MongoDB connect
│   ├── package.json
│   ├── .env                       ← 🔒 Never commit this
│   ├── models/
│   │   ├── User.js
│   │   ├── School.js
│   │   ├── Class.js
│   │   ├── Timetable.js
│   │   ├── Attendance.js
│   │   ├── Assignment.js
│   │   ├── ReportCard.js
│   │   └── FeePayment.js
│   ├── routes/
│   │   └── auth.js                ← POST /api/auth/login, /register
│   └── middleware/
│       └── auth.js                ← JWT verify + role check
│
├── .github/
│   └── workflows/
│       └── ci.yml                 ← GitHub Actions: build + test on push to main
│
└── README.md
```

---

## 🎨 Design System — Key CSS Variables

```css
--bg-base:       #0A0E1A   /* Deep dark navy */
--bg-card:       rgba(255,255,255,0.04)  /* Glass cards */
--blue:          #3B82F6   /* Primary accent */
--green:         #10B981   /* Success / attendance ok */
--amber:         #F59E0B   /* Warning / pending */
--rose:          #F43F5E   /* Danger / low attendance / pending fees */
--purple:        #8B5CF6   /* Secondary accent */
--font-head:     'Space Grotesk'
--font-body:     'Inter'
--font-mono:     'JetBrains Mono'   /* Used for IDs, numbers, dates */
```

---

## 👤 Demo Login (Quick Access)

On the login page → click any **Quick Demo Access** button:

| Role    | Name           | ID      | Demo Button |
|---------|----------------|---------|-------------|
| Admin   | Rajesh Kumar   | AD0001  | 🏫 Admin    |
| Teacher | Sunita Sharma  | TH0001  | 👨‍🏫 Teacher  |
| Student | Ankit Verma    | ST0001  | 👨‍🎓 Student  |
| Parent  | Ramesh Verma   | PF0001  | 👨‍👩‍👧 Parent   |

For manual login: any User ID + password `demo123`

---

## ✅ What's Fully Done (Phase 1)

### Backend
- [x] MongoDB Atlas connected (`unmax0` cluster)
- [x] All 8 Mongoose models defined
- [x] JWT auth: login + register routes
- [x] Role-based middleware
- [x] nodemon hot-reload (`npm run dev`)
- [x] GitHub Actions CI pipeline

### Frontend
- [x] React + Vite setup
- [x] React Router v6 (`/login` → `/dashboard`)
- [x] AuthContext (JWT + localStorage)
- [x] Dark "future school" design system
- [x] AppShell: collapsible sidebar, live clock topbar, notification badges
- [x] Shared Widgets: CountUp, LiveClock, CountdownTimer, ProgressRing SVG
- [x] LoginPage: role selector, animated background, quick demo buttons
- [x] StudentDashboard: schedule timeline, kanban assignments, topic heatmap, AI Focus Zone, fees table
- [x] TeacherDashboard: live class controls, smart attendance table, broadcast composer
- [x] ParentDashboard: attendance calendar, subject drill-down, fee timeline, message teacher
- [x] AdminDashboard: user management (auto-ID preview), offline fee entry, classes grid, notices

---

## 🔜 Pending — Phase 2 (Start Here Tomorrow)

### Priority Order:

#### 1. 🔗 API Integration
Connect frontend forms to real backend endpoints:
- [ ] Login form → `POST /api/auth/login` (currently uses demo fallback)
- [ ] Attendance submit → `POST /api/attendance`
- [ ] Fee entry (admin) → `POST /api/fees`

#### 2. 📅 Timetable Engine (Backend)
- [ ] `GET /api/timetable/:classId/:day` — returns periods for a class on a weekday
- [ ] Store timetable in MongoDB `Timetable` model
- [ ] Auto-generate "Today's Schedule" from DB instead of hardcoded mock data

#### 3. 🎥 Live Class System
- [ ] Generate Google Meet / Jitsi links per timetable slot
- [ ] "Join Now" button links to real meeting URL
- [ ] Session-based attendance: log join/leave timestamps

#### 4. 📊 Real Performance Data
- [ ] `GET /api/performance/:studentId` — returns scores per subject + topic
- [ ] Ranking calculation endpoint (weighted: exams 60%, assignments 25%, attendance 15%)
- [ ] Connect student dashboard performance rings to API

#### 5. 💰 Fee Management (Backend)
- [ ] `POST /api/fees/record` — record payment (admin)
- [ ] `GET /api/fees/:studentId` — student fee history
- [ ] Auto-generate PDF receipt on payment

#### 6. 📝 Assignments Module
- [ ] Teacher: create assignment form → `POST /api/assignments`
- [ ] Student: submit assignment → `PUT /api/assignments/:id/submit`
- [ ] Teacher: grade assignment → `PUT /api/assignments/:id/grade`

#### 7. 📢 Notifications / Broadcast
- [ ] `POST /api/broadcast` — send message to class/role
- [ ] Frontend notification bell shows real alerts

#### 8. 🔒 Security Hardening
- [ ] All API routes validate `schoolId` from JWT
- [ ] Rate limiting on auth routes
- [ ] Input validation with `express-validator`

---

## 🛠️ Commands Cheatsheet

```powershell
# Start everything
cd C:\Users\abhay\OneDrive\Desktop\ultimateschool

# Backend (new terminal)
cd server
npm run dev

# Frontend (new terminal)  
cd client
npm run dev

# Push to GitHub
git add -A
git commit -m "your message"
git push origin main

# Install new package (backend)
cd server && npm install <package-name>

# Install new package (frontend)
cd client && npm install <package-name>
```

---

## 📌 Important Notes

1. **MongoDB IP Whitelist** — If MongoDB connection fails, go to Atlas → Network Access → Add your current IP (or use 0.0.0.0/0 for development)
2. **Port conflicts** — If 5173 is in use, Vite picks 5174 automatically
3. **`.env` file** — Never commit it. If lost, recreate from the values above
4. **Indian formatting** — All currency = ₹, All dates = DD-MM-YYYY, IDs = uppercase
5. **Demo mode** — Frontend works fully offline using mock data when backend is down

---

*Session saved: 30-04-2026 02:05 AM IST*
