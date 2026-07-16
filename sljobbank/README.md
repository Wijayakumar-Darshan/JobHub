# 🇱🇰 SL Job Bank — Career Guidance System

> **Sri Lanka's most comprehensive career guidance platform** — helping students explore 600+ careers, understand A/L requirements, discover institutes and courses, and plan their future.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Deployment](#deployment)
- [Development Phases](#development-phases)

---

## 🎯 Overview

The SL Job Bank & Career Guidance System is a **full-stack, role-based web platform** built for Sri Lankan students, counselors and administrators. It maps 600+ careers to the Sri Lankan Advanced Level education system, showing students exactly which A/L stream and subjects they need, what qualifications are required, which institutes offer relevant courses (with live pricing), and what salary ranges to expect.

### Three User Roles

| Role | Access |
|------|--------|
| **Student** | Browse careers, view A/L requirements, save favourites, subscribe |
| **Counselor** | Manage jobs, institutes, courses; view analytics; generate reports |
| **Super Admin** | Full platform control, subscription mode, user management, analytics |

---

## ✨ Features

### Student Features
- ✅ Register / Login (JWT authenticated, role-based redirect)
- ✅ Browse **16 Career Clusters** (Sri Lanka education system aligned)
- ✅ View 600+ job profiles with full details:
  - A/L stream & subject requirements
  - Salary ranges (LKR)
  - Career pathways
  - Required qualifications
  - Skills required
  - Institutes & courses (with **live pricing**)
  - Industry demand & growth projections
  - Remote / internship availability
- ✅ Save favourite careers
- ✅ Search & filter jobs
- ✅ Download PDF career guides
- ✅ View subscription status & pay via PayHere / Bank Transfer / QR

### Counselor Features
- ✅ Dashboard with analytics charts
- ✅ Add / Edit / Delete job listings
- ✅ Manage institutes and course fees (dynamic pricing)
- ✅ View student engagement analytics
- ✅ Generate monthly reports (PDF / Excel / CSV)

### Super Admin Features
- ✅ Full user management (CRUD)
- ✅ **Toggle paid mode** on/off instantly
- ✅ Configure subscription pricing (monthly / yearly in LKR)
- ✅ View payment history and revenue analytics
- ✅ System health monitoring
- ✅ Platform-wide analytics dashboard

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 + Vite | UI framework |
| Tailwind CSS | Styling |
| React Router v6 | Client-side routing with guards |
| TanStack Query | Server state & caching |
| Zustand | Client state (auth, settings) |
| Recharts | Analytics charts |
| Axios | HTTP client with JWT interceptors |
| React Hook Form | Form validation |
| React Hot Toast | Notifications |

### Backend
| Technology | Purpose |
|------------|---------|
| Spring Boot 3.3 | REST API framework |
| Java 21 | Language (LTS) |
| Spring Security + JWT | Authentication & authorization |
| Spring Data JPA | ORM / database access |
| MySQL 8 | Primary database |
| Lombok | Boilerplate reduction |
| MapStruct | DTO mapping |
| iText PDF | Report generation |
| Apache POI | Excel generation |
| Cloudinary | Image & file storage |

### Infrastructure
| Service | Purpose |
|---------|---------|
| Vercel | Frontend hosting |
| Railway / Render | Backend hosting |
| PlanetScale / Railway MySQL | Database hosting |
| Cloudinary | Media storage |
| PayHere | Sri Lankan payment gateway |
| Brevo / SendGrid | Email service |
| Cloudflare | SSL / CDN |

---

## 📁 Project Structure

```
sljobbank/
├── frontend/                    # React + Vite + Tailwind
│   ├── src/
│   │   ├── api/                 # Axios API service modules
│   │   │   ├── axiosClient.js   # JWT interceptors
│   │   │   └── index.js         # All API endpoints
│   │   ├── components/
│   │   │   ├── common/          # Badge, Modal, StatCard, etc.
│   │   │   └── layout/          # Sidebar, Topbar, AppLayout
│   │   ├── pages/
│   │   │   ├── auth/            # Login, Register, ForgotPassword
│   │   │   ├── student/         # Dashboard, Clusters, Jobs, etc.
│   │   │   ├── counselor/       # Dashboard, ManageJobs, Analytics
│   │   │   └── admin/           # Dashboard, Users, Subscription
│   │   ├── routes/              # React Router with role guards
│   │   ├── store/               # Zustand auth & settings stores
│   │   └── App.jsx
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
│
├── backend/                     # Spring Boot 3 + Java 21
│   ├── src/main/java/com/sljobbank/
│   │   ├── controller/          # REST controllers
│   │   ├── service/             # Business logic
│   │   ├── repository/          # JPA repositories
│   │   ├── entity/              # JPA entities
│   │   ├── dto/                 # Request/Response DTOs
│   │   ├── security/            # JWT filter & Spring Security config
│   │   ├── exception/           # Global exception handler
│   │   └── SLJobBankApplication.java
│   ├── src/main/resources/
│   │   └── application.yml
│   ├── Dockerfile
│   └── pom.xml
│
├── prisma/
│   ├── schema.prisma            # Full database schema (MySQL)
│   └── seed.sql                 # Seed data (16 clusters, jobs, users)
│
├── SLJobBank.jsx                # Complete interactive UI demo
├── docker-compose.yml           # Full stack local dev
├── .env.example                 # All required env variables
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Java 21+
- MySQL 8+ (or Docker)
- Maven 3.9+

### Option A — Docker (Recommended)

```bash
# 1. Clone the repository
git clone https://github.com/yourorg/sl-job-bank.git
cd sl-job-bank

# 2. Copy environment file
cp .env.example .env
# Edit .env with your Cloudinary, PayHere and email credentials

# 3. Start all services
docker-compose up -d

# 4. Open in browser
#    Frontend:   http://localhost:3000
#    Backend:    http://localhost:8080
#    phpMyAdmin: http://localhost:8081
```

### Option B — Manual Setup

#### Database
```bash
mysql -u root -p
CREATE DATABASE sl_job_bank CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'sljobbank'@'localhost' IDENTIFIED BY 'sljobbank123';
GRANT ALL PRIVILEGES ON sl_job_bank.* TO 'sljobbank'@'localhost';
FLUSH PRIVILEGES;

# Run seed data
mysql -u sljobbank -p sl_job_bank < prisma/seed.sql
```

#### Backend
```bash
cd backend
cp ../. env.example .env   # or set env variables directly

# Build and run
./mvnw spring-boot:run

# Backend runs on: http://localhost:8080
```

#### Frontend
```bash
cd frontend
cp ../.env.example .env.local
# Set VITE_API_URL=http://localhost:8080/api

npm install
npm run dev

# Frontend runs on: http://localhost:3000
```

### Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| 👨‍🎓 Student | student@demo.com | demo123 |
| 👩‍💼 Counselor | counselor@demo.com | demo123 |
| ⚙️ Super Admin | admin@demo.com | demo123 |

---

## 🔐 Environment Variables

See `.env.example` for the full list. Key variables:

```env
# Database
DATABASE_URL="mysql://user:pass@host:3306/sl_job_bank"

# JWT (generate with: openssl rand -base64 64)
JWT_SECRET=your_256_bit_secret

# Cloudinary (media storage)
CLOUDINARY_CLOUD_NAME=your_cloud
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret

# PayHere (Sri Lankan payment gateway)
PAYHERE_MERCHANT_ID=your_id
PAYHERE_SECRET=your_secret

# Email
MAIL_USERNAME=your@email.com
MAIL_PASSWORD=your_smtp_key
```

---

## 📡 API Reference

All endpoints prefixed with `/api`. JWT required (except `/auth/**`).

### Authentication
```
POST /api/auth/login          { email, password }
POST /api/auth/register       { fullName, email, password }
POST /api/auth/forgot-password { email }
POST /api/auth/refresh        { refreshToken }
```

### Career Clusters
```
GET  /api/clusters            All 16 clusters
GET  /api/clusters/:id        Cluster with jobs
POST /api/clusters            Create (Counselor/Admin)
PUT  /api/clusters/:id        Update (Counselor/Admin)
```

### Jobs
```
GET  /api/jobs                List (q, clusterId, demand, page, size)
GET  /api/jobs/:id            Job detail with courses
POST /api/jobs                Create (Counselor/Admin)
PUT  /api/jobs/:id            Update (Counselor/Admin)
DELETE /api/jobs/:id          Delete (Counselor/Admin)
GET  /api/jobs/recommended    AI-recommended for logged-in student
```

### Favourites
```
GET    /api/favorites          My saved jobs
POST   /api/favorites          { jobId }
DELETE /api/favorites/:jobId   Remove
```

### Subscriptions
```
GET  /api/subscriptions/me     My subscription status
POST /api/subscriptions/initiate  { plan: monthly|yearly }
POST /api/subscriptions/verify   { paymentId, reference }
GET  /api/subscriptions/history  Payment history
```

### System Settings (Admin)
```
GET   /api/settings            Get current settings
PUT   /api/settings            Update settings
PATCH /api/settings/toggle-paid-mode   Toggle free/paid mode
PATCH /api/settings/pricing    Update prices
```

### Analytics
```
GET /api/analytics/dashboard   Platform overview
GET /api/analytics/monthly     Monthly data (6 months)
GET /api/analytics/jobs/top    Most viewed jobs
GET /api/analytics/revenue     Revenue breakdown
```

### Reports
```
GET /api/reports/users?format=pdf|excel|csv
GET /api/reports/jobs?format=pdf|excel|csv
GET /api/reports/revenue?format=pdf|excel|csv
GET /api/reports/engagement?format=pdf|excel|csv
```

---

## ☁️ Deployment

### Frontend → Vercel
```bash
cd frontend
npm run build

# Or connect GitHub repo to Vercel
# Set environment variables in Vercel dashboard:
# VITE_API_URL=https://your-backend.railway.app/api
```

### Backend → Railway
```bash
# Connect GitHub repo to Railway
# Add environment variables:
# DB_USERNAME, DB_PASSWORD, JWT_SECRET, CLOUDINARY_*, PAYHERE_*, MAIL_*

# Railway auto-detects Spring Boot via pom.xml
```

### Database → PlanetScale or Railway MySQL
```bash
# PlanetScale
pscale database create sl-job-bank --region ap-south
pscale connect sl-job-bank main --port 3309
mysql -u root -h 127.0.0.1 -P 3309 < prisma/seed.sql

# Update DATABASE_URL in backend env vars
```

---

## 📅 Development Phases

| Phase | Focus | Status |
|-------|-------|--------|
| 1 | Authentication & User Management | ✅ Complete |
| 2 | Career Clusters & Job Management | ✅ Complete |
| 3 | Institutes & Courses (Dynamic Pricing) | ✅ Complete |
| 4 | Subscription & Payments (PayHere) | ✅ Complete |
| 5 | Analytics & Reports (PDF/Excel) | 🔄 In Progress |
| 6 | AI Recommendations & Deployment | 📋 Planned |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m 'Add: your feature description'`
4. Push to branch: `git push origin feature/your-feature`
5. Submit a Pull Request

---

## 📄 License

MIT License — © 2024 SL Job Bank. Built for Sri Lanka.

---

> 🇱🇰 **Built with ❤️ for Sri Lankan students and career seekers.**
