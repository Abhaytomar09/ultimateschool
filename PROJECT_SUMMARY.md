# 🏫 UltimateSchool — Complete Project Summary
**Last Updated:** 30 April 2026 · 02:05 AM IST

---

## What Is UltimateSchool?

A **web-based School ERP platform** built specifically for Indian schools.  
Multi-tenant · Role-based · Dark futuristic UI · Indian localization (₹, DD-MM-YYYY)

---

## Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | React 18 + Vite 8                 |
| Backend   | Node.js + Express.js              |
| Database  | MongoDB Atlas (Mongoose)          |
| Auth      | JWT (JSON Web Tokens) + bcryptjs  |
| CI/CD     | GitHub Actions                    |
| Hosting   | Local dev (Netlify/Vercel — Phase 3) |

---

## 4 User Roles

| Role    | ID Format | What They Can Do |
|---------|-----------|-----------------|
| Admin   | `AD0001`  | Manage school, users, fees, classes, notices |
| Teacher | `TH0001`  | Take attendance, upload notes, grade assignments, broadcast |
| Student | `ST0001`  | View schedule, submit assignments, check fees & performance |
| Parent  | `PF0001`  | Monitor child's attendance, performance, pay fees |

---

## Indian Localization Rules (Always Enforce)

- ✅ Currency: **₹ (Indian Rupees)** — Never $, €
- ✅ Date: **DD-MM-YYYY** — Never MM/DD/YYYY
- ✅ IDs: **UPPERCASE** (stored lowercase, displayed uppercase)
- ✅ Terminology: **Class** (not Grade), **Section** (10A, 10B), **Academic Year** (2025–2026)

---

## Database Models (8 Total)

| Model        | Purpose                                          |
|--------------|--------------------------------------------------|
| `User`       | All users with role, schoolId, customId          |
| `School`     | Multi-tenant school records                      |
| `Class`      | Class + section (10A, 10B etc.)                  |
| `Timetable`  | Weekly period schedule per class                 |
| `Attendance` | Session-based per student per period             |
| `Assignment` | Create → Submit → Grade lifecycle                |
| `ReportCard` | Subject scores + topic-level breakdown           |
| `FeePayment` | Online + offline payments with receipt           |

---

## ID System

Auto-generated, sequential, per school:

| Role    | Format  | Example  |
|---------|---------|----------|
| Student | `ST` + 4 digits | `ST0001` |
| Teacher | `TH` + 4 digits | `TH0001` |
| Father  | `PF` + 4 digits | `PF0001` |
| Mother  | `PM` + 4 digits | `PM0001` |
| Admin   | `AD` + 4 digits | `AD0001` |

---

## Ranking Formula

```
Final Score = (Exam Score × 60%) + (Assignment Score × 25%) + (Attendance × 15%)
```
Ranks are calculated across all sections of a class (e.g., all Class 10 sections combined).

---

## Key Features Built

### Student Dashboard
- Today's class schedule (timeline with live pulse dot)
- "Next class in X minutes" countdown timer
- Attendance % with 75% threshold warning
- Kanban assignment board (Pending / Submitted / Graded)
- Subject performance with circular progress rings
- Topic-level heatmap (Strong / Average / Weak)
- AI Focus Zone — 3 auto-picked weak topics to study today
- Fee management with payment history + transaction IDs
- Animated count-up numbers on all stats

### Teacher Dashboard
- Live class list with "Start" button
- Low attendance alert panel (students below 75%)
- Assignment review tracker (submitted / total per class)
- One-click attendance marking with bulk status
- Rich broadcast message composer (class + audience targeting)

### Parent Dashboard
- Child snapshot card with live alerts
- Monthly attendance calendar (color-coded P/A/L days)
- Attendance circular progress ring with 75% threshold
- Subject performance drill-down with topic bars
- Fee timeline with pending highlight
- Direct message to teacher form

### Admin Dashboard
- School stats: students, teachers, parents count (animated)
- Recent users table with role badges
- Fee pending alert list with urgency (days left)
- Add user form with auto-generated ID preview
- Offline payment entry (Cash/UPI/Cheque/NEFT/DD)
- Classes performance grid
- School notice broadcaster

---

## Design System (Dark "Future School" Theme)

- **Background:** Deep navy `#0A0E1A` with animated radial gradient mesh
- **Cards:** Glassmorphism — `rgba(255,255,255,0.04)` + `backdrop-filter: blur(12px)`
- **Sidebar:** Dark with glow active indicator pill + live online status dot
- **Topbar:** Sticky, ticking live clock, notification bell with red dot
- **Fonts:** Space Grotesk (headings) · Inter (body) · JetBrains Mono (IDs/numbers)
- **Animations:** `fade-up` entrance, stagger children, count-up numbers, pulse dot for live classes

---

## GitHub

- **Repo:** https://github.com/Abhaytomar09/ultimateschool.git
- **Branch:** `main`
- **CI/CD:** GitHub Actions on every push — builds frontend + starts backend

---

## What's Next (Phase 2)

1. **API Integration** — Connect all forms to real backend endpoints
2. **Timetable Engine** — Generate schedule from MongoDB
3. **Live Classes** — Google Meet / Jitsi links per period
4. **Real Performance Data** — Pull from DB, calculate ranks server-side
5. **Fee PDF Receipts** — Auto-generate on payment
6. **Assignments Module** — Full create → submit → grade flow
7. **Real Notifications** — Server-sent events or WebSocket
8. **Security** — Input validation, rate limiting, schoolId enforcement

---

*Built with ❤️ for Indian schools · UltimateSchool ERP*
