# 🌿 AgriLens — AI-Powered Cotton Disease Detection & Advisory System

**AgriLens** is a modern, production-grade Progressive Web Application (PWA) designed for cotton farmers and agricultural experts. It delivers instant, AI-driven crop pathology diagnostics, treatment advisory protocols, and field telemetry tracking.

---

## 🎯 Problem Statement
Cotton farming faces severe yield losses due to rapid disease propagation (e.g., Bacterial Blight, Leaf Curl Virus, Fusarium Wilt). AgriLens provides real-time disease identification and treatment advisory directly to farmers in the field, working both online and offline.

---

## 🛠️ Tech Stack & Architecture

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 19, Vite, TypeScript, Tailwind CSS v4, Framer Motion, Lucide Icons, Recharts, Vite PWA |
| **Backend** | Python 3.13, FastAPI, Motor (Async MongoDB Driver), Pydantic v2, PyJWT, Passlib (Bcrypt) |
| **Database** | MongoDB Atlas (Cloud ReplicaSet with GeoSpatial Indexing) |
| **Testing & Quality** | Oxlint, TypeScript compiler (`tsc`), Custom End-to-End Async Test Suite (`httpx`) |

---

## 📁 Repository Structure

```text
AgriLens/
├── backend/                  # FastAPI Application Layer
│   ├── app/
│   │   ├── config.py         # Type-validated Pydantic Settings
│   │   ├── database.py       # Async Motor Connection Pool & Lifespan
│   │   ├── dependencies/     # Auth & RBAC Dependency Injection
│   │   ├── middleware/       # Rate Limiting & Security Middlewares
│   │   ├── models/           # MongoDB ODM Schemas
│   │   ├── routes/           # REST API Routers (Auth, Crops, Diseases, Treatments, Scans)
│   │   ├── schemas/          # Input/Output DTO Validation Schemas
│   │   ├── services/         # Business & Database Service Layer
│   │   └── utils/            # Security, Hashing & Exception Handlers
│   ├── scripts/
│   │   └── seed.py           # Idempotent Database Seeder
│   └── requirements.txt      # Python Dependencies
├── frontend/                 # React 19 Production PWA
│   ├── src/
│   │   ├── app/              # ErrorBoundary & NotFound Handler
│   │   ├── components/       # Reusable Design System (UI, Animations, Layouts)
│   │   ├── context/          # AuthContext, ThemeContext, ToastContext
│   │   ├── features/         # Feature-Based Modules (Auth, Dashboard, Crops, Diseases, Scans, Admin)
│   │   ├── hooks/            # Custom Hooks (useAuth, useToast, useTheme, useOnlineStatus)
│   │   ├── services/         # Axios API Services (Auth, Crops, Diseases, Treatments, Scans)
│   │   └── styles/           # Tailwind CSS v4 Token Architecture
│   └── package.json
├── tools/                    # Automated Verification & E2E Test Suites
└── ai_training/              # AI Pipeline Notebooks & Training Datasets
```

---

## 🔑 Evaluator Demo Credentials

The database contains seeded demo accounts for testing:

| User Type | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Admin Evaluator** | `admin@agrilens.com` | `Admin@123` | Full CRUD Access (Crops, Diseases, Treatments, Admin Panel) |
| **Farmer Evaluator** | `farmer@agrilens.com` | `Farmer@123` | Scan Upload, History Logs, Profile, Advisory Catalogues |

---

## 🚀 Local Run Guide

### 1. Backend Setup

```bash
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt

# Seed Demo Database
python -m scripts.seed

# Start FastAPI Server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
- Interactive OpenAPI Docs: `http://localhost:8000/docs`

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```
- Web Application: `http://localhost:5173`

---

## 🧪 Verification & Auditing

To run all automated quality assurance checks:

```bash
# Frontend Type Check & Linting
cd frontend
npm run lint
npx tsc --noEmit
npm run build

# Backend End-to-End Integration Suite
cd ..
python tools/test_auth.py
python tools/verify_urls.py
```

---

## 📄 License
This repository is developed as a Final Year Engineering Project for educational and agricultural research purposes.
