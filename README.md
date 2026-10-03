# Sports & Athletics Mobile App for Player Self-Service

A **professional, modern, responsive, full-stack Sports & Athletics Mobile App for Player Self-Service**. This application provides a centralized digital platform where athletes/players can independently manage their sports profile, personal credentials, training schedules, performance statistics, attendance, competitions, achievements, notifications, documents, and communication with coaches and sports administrators.

---

## 🌟 Features Overview

- **Multi-Role Experience**: Custom interfaces for **PLAYER**, **COACH**, **SPORTS_ADMIN**, and **ADMIN**.
- **Player Dashboard**: Welcome banner, statistics widgets, interactive Recharts performance radar, upcoming training timeline, and real-time activity stream.
- **Player Self-Service Profile**: Sports & personal credentials, avatar photo selector, profile completion score indicator, and editable details.
- **Performance Analytics Module**: Metric tracking (Speed, Strength, Endurance, Agility, Flexibility, Reaction Time, Accuracy, Overall Score) with historical trend line charts and coach evaluation logs.
- **Training Management Module**: Training schedules, filterable status badges (Upcoming, Completed, Cancelled), instructions modal, and 1-click attendance RSVP.
- **Attendance Dashboard**: Circular progress percentage meter, present/absent/late counters, monthly progress bar charts, and attendance matrix.
- **Competitions & Tournaments**: Tournament listing, category & location details, 1-click competition registration, and match outcome summaries.
- **Honors & Achievements Showcase**: Gold, Silver, Bronze medals, trophies, certificates, MVP awards showcase with interactive timeline.
- **Physiological Fitness Tracker**: BMI calculator, VO2 Max score tracking, body fat percentage, resting heart rate, and historical line graphs.
- **Document Management Vault**: Upload, view preview, download, and delete permitted documents (ID Proof, Medical Certificate, Sports Certificate, Insurance, Academic).
- **Notification Inbox**: Real-time notifications grouped by category (Training, Competition, Performance, System) with mark-as-read controls.
- **Direct Messaging Chat**: Real-time style direct chat interface between players and coaches/admins with timestamped message bubbles.
- **Administration Control Hub**: Complete CRUD for players, sports branches, team squads, and system-wide statistics.
- **Dark / Light / System Mode**: Persistent theme switcher with custom tailwind sports-tech styling.
- **Quick Demo Switcher**: Instant one-click login preset buttons on the login page for seamless evaluation testing as Player, Coach, Sports Admin, or Admin.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React.js 18 + Vite
- **Styling**: Tailwind CSS, Vanilla CSS, Custom animations & glassmorphism
- **Routing**: React Router DOM (v6)
- **Icons**: Lucide React
- **Data Visualization**: Recharts
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js & Express.js
- **API Architecture**: RESTful API
- **Security**: JWT Authentication, bcrypt password hashing, CORS, dotenv
- **Database Connector**: `mysql2/promise` with automatic SQLite fallback driver (`better-sqlite3`) for zero-friction instant execution in any environment.

### Database
- **Primary Database**: MySQL 8.0+ (`database/schema.sql` and `database/seed.sql`)
- **Tables**: `users`, `sports`, `coaches`, `teams`, `players`, `player_teams`, `training_sessions`, `training_attendance`, `performance_records`, `fitness_records`, `competitions`, `competition_registrations`, `achievements`, `documents`, `notifications`, `messages`.

---

## 🔑 Test Credentials (Quick Login Presets)

Password for all pre-seeded accounts is **`password123`**:

| Role | Email / Login ID | Password | Key Access |
| :--- | :--- | :--- | :--- |
| **PLAYER** | `vijay@university.edu` or `ATH001` | `password123` | Self-Service Dashboard, Profile, RSVP, Fitness, Achievements |
| **COACH** | `rahul.coach@university.edu` | `password123` | Roster evaluation, Performance logging, Training scheduler |
| **SPORTS ADMIN**| `priya.admin@university.edu` | `password123` | Tournament manager, Document verification, Sports manager |
| **SYSTEM ADMIN** | `admin@university.edu` | `password123` | Full system control, User CRUD, Global analytics |

> 💡 **Tip**: On the Login screen, click any of the **Quick Demo One-Click Login** buttons to sign in instantly!

---

## 🚀 Installation & How to Run

### 1. Install Dependencies
Run from the root directory:

```bash
npm run install:all
```

*(This automatically installs dependencies for root, server, and client)*

### 2. Configure Environment Variables (Optional)
Create `.env` file in the root directory (or copy from `.env.example`):

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=super_secret_sports_athletics_jwt_key_2026

# MySQL Database Connection (Optional - defaults to SQLite fallback if MySQL is offline)
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=rootpassword
DB_NAME=sports_athletics_db
```

### 3. Database Initialization (MySQL)
If running standard MySQL:

```bash
& "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p < database/schema.sql
& "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p < database/seed.sql
```

*(Note: The server auto-detects MySQL or initializes an embedded SQLite database with identical schema & seed data if MySQL credentials are not passed, ensuring 100% fail-safe execution out of the box!)*

### 4. Run the Full-Stack Application
From the root directory:

```bash
npm run dev
```

This starts both:
- **Backend API**: `http://localhost:5000`
- **Frontend App**: `http://localhost:3000`

---

## 📡 REST API Reference

### Auth
- `POST /api/auth/login` - Authenticate user & return JWT token
- `POST /api/auth/register` - Create new player account & profile
- `GET  /api/auth/me` - Get current session details
- `POST /api/auth/forgot-password` - Trigger password reset flow

### Players & Profiles
- `GET    /api/players` - List players with search, filter, and sorting
- `GET    /api/players/:id` - Detailed player profile & stats
- `PUT    /api/players/:id` - Update player profile details
- `DELETE /api/players/:id` - Delete player account (Admin)

### Performance & Fitness
- `GET  /api/performance/:playerId` - Fetch performance metrics history
- `POST /api/performance` - Log new performance assessment (Coach)
- `GET  /api/performance/fitness/:playerId` - Fetch fitness & BMI records
- `POST /api/performance/fitness` - Log fitness assessment

### Training & Attendance
- `GET  /api/training` - Get training sessions list
- `POST /api/training` - Schedule new session (Coach/Admin)
- `GET  /api/training/attendance/:playerId` - Get attendance summary & logs
- `POST /api/training/attendance` - Mark attendance / RSVP

### Competitions & Achievements
- `GET  /api/competitions` - List competitions
- `POST /api/competitions` - Create competition fixture
- `POST /api/competitions/:id/register` - Register player for competition
- `GET  /api/competitions/achievements/:playerId` - Fetch player achievements
- `POST /api/competitions/achievements` - Award achievement

### Documents, Notifications & Messages
- `GET    /api/documents/:playerId` - Get player documents
- `POST   /api/documents` - Upload document metadata
- `DELETE /api/documents/:id` - Delete document
- `GET    /api/notifications` - Get user notifications & unread count
- `PUT    /api/notifications/:id/read` - Mark notification as read
- `GET    /api/messages` - Get conversation contacts or chat history
- `POST   /api/messages` - Send direct message

---

## 📁 Project Structure

```text
sports-athletics-app/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   └── Common/ (Toast, Modal, StatusBadge, CircularProgress)
│   │   ├── pages/ (LoginPage, RegisterPage, DashboardPage, ProfilePage, etc.)
│   │   ├── layouts/ (AppLayout shell with Sidebar, Header, Mobile Nav)
│   │   ├── context/ (AuthContext, ThemeContext)
│   │   ├── services/ (Axios api configuration)
│   │   ├── index.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── server/
│   ├── controllers/ (auth, player, performance, training, competition, communication, admin)
│   ├── routes/ (authRoutes, playerRoutes, performanceRoutes, trainingRoutes, etc.)
│   ├── middleware/ (JWT verifyToken, checkRole)
│   ├── config/ (db.js database configuration)
│   ├── server.js
│   └── package.json
├── database/
│   ├── schema.sql
│   └── seed.sql
├── .env.example
├── README.md
└── package.json
```

---
*Created for University Varsity Sports & Athletics Department Demonstration.*
