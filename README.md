# HopeHarbor Initiative — NGO Management System

A full-stack, beginner-friendly **NGO Management System** built with **Node.js, Express, PostgreSQL, React, and Tailwind CSS** for a college DBMS academic project.

The application features full CRUD operations using raw SQL queries, foreign key relational constraints, JWT access & refresh token authentication (stored in `httpOnly` cookies), Role-Based Access Control (RBAC) separating regular members from administrators, and an automated donation attribution mechanism.

---

## 📋 Table of Contents
- [System Architecture](#system-architecture)
- [Key Features](#key-features)
- [Database Collections (Schema)](#database-collections-schema)
- [Role-Based Access Control (RBAC)](#role-based-access-control-rbac)
- [API Reference](#api-reference)
- [Design System](#design-system)
- [Project Directory Structure](#project-directory-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Setup](#environment-setup)
  - [Running the Project](#running-the-project)
- [License](#license)

---

## 🏛️ System Architecture

- **Backend**: Node.js & Express REST API with modular architecture (`/controllers`, `/routes`, `/middleware`, `db.js`, `schema.sql`).
- **Database**: PostgreSQL with raw SQL queries via `pg` (node-postgres), featuring primary keys, foreign keys (`REFERENCES donors(id)`), checks, and automatic schema initialization.
- **Frontend**: React (Vite) styled with Tailwind CSS v3 and routed using `react-router`.
- **Security & Session Handling**:
  - Passwords hashed using `bcryptjs` (salt factor 10).
  - Short-lived Access Tokens (15 minutes) sent in response body.
  - Long-lived Refresh Tokens (7 days) saved in PostgreSQL `users` table and issued via `httpOnly` secure cookies.
  - Automatic 401 token refresh retry mechanism built into the client API wrapper.

---

## ✨ Key Features

### 👤 Regular Member ("user" role)
- **Mission Landing Page**: Overview of NGO initiatives, operational pillars, and public event previews.
- **Member Dashboard**:
  - Simple, streamlined donation form (enter amount & payment mode; automatically credits the contribution to the logged-in user without asking for database reference IDs).
  - Read-only directory access to registered volunteers, community events, and benefactor records.
  - Transparent access to the public donations ledger with live total calculations.

### 🛡️ Administrator ("admin" role)
- **Admin Console**:
  - Complete CRUD (Create, Read, Update, Delete) management for:
    - **Volunteers**: Register new volunteers, update skills, or remove inactive members.
    - **Donors**: Manage individual and corporate benefactor records.
    - **Events**: Schedule community programs and assign volunteers with specific roles (e.g. *Logistics Lead, First Aid*).
    - **Donation Audit Ledger**: Review all contributions, update amounts/modes, or remove erroneous entries.
  - **Flexible Offline/External Donation Entry**: Admins can record cash or external donations under *any* contributor name (walk-in donors, CSR partners).

---

## 🗄️ Database Tables (SQL Schema)

| Table | Columns / Data Types | Descriptions, Keys & Constraints |
|---|---|---|
| **users** | `id SERIAL PRIMARY KEY`, `name VARCHAR(255)`, `email VARCHAR(255) UNIQUE`, `password VARCHAR(255)`, `role VARCHAR(50)`, `refresh_token TEXT`, `created_at TIMESTAMP` | User authentication table. `role` CHECK constraint (`user`, `admin`), hashed password. |
| **volunteers** | `id SERIAL PRIMARY KEY`, `name VARCHAR(255)`, `email VARCHAR(255)`, `phone VARCHAR(50)`, `skills TEXT[]`, `joined_date TIMESTAMP` | Field volunteers. `skills` stored as PostgreSQL array `TEXT[]`. |
| **donors** | `id SERIAL PRIMARY KEY`, `name VARCHAR(255)`, `email VARCHAR(255)`, `phone VARCHAR(50)`, `type VARCHAR(50)`, `created_at TIMESTAMP` | Benefactors. `type` CHECK constraint (`individual`, `corporate`). |
| **donations** | `id SERIAL PRIMARY KEY`, `donor_id INTEGER REFERENCES donors(id) ON DELETE SET NULL`, `amount NUMERIC(12, 2)`, `mode VARCHAR(50)`, `date TIMESTAMP` | Relational table. Foreign key to `donors`, `amount >= 1`, `mode` CHECK (`cash`, `online`, `cheque`). |
| **events** | `id SERIAL PRIMARY KEY`, `title VARCHAR(255)`, `date TIMESTAMP`, `location VARCHAR(255)`, `volunteers_assigned JSONB`, `created_at TIMESTAMP` | Community programs. `volunteers_assigned` stored as structured `JSONB`. |

---

## 🔐 Role-Based Access Control (RBAC)

| Route / Resource | Method | Allowed Roles | Description |
|---|---|---|---|
| `/api/auth/register` | `POST` | Public | Register new user or admin account |
| `/api/auth/login` | `POST` | Public | Authenticate and obtain tokens |
| `/api/auth/refresh` | `POST` | Public (Cookie) | Rotate & generate fresh access token |
| `/api/auth/logout` | `POST` | Public (Cookie) | Invalidate refresh token session |
| `/api/donations` | `POST` | `user`, `admin` | Submit a donation record |
| `/api/volunteers`, `/donors`, `/donations`, `/events` | `GET` | `user`, `admin` | View collection records |
| `/api/volunteers`, `/donors`, `/events` | `POST` | `admin` only | Create new records |
| All collections | `PUT /:id` | `admin` only | Update existing record |
| All collections | `DELETE /:id` | `admin` only | Delete record |

---

## 🎨 Design System

The user interface follows a human, warm paper aesthetic designed for community trust:
- **Background**: Warm Paper White (`#FBF7F0`)
- **Primary**: Deep Forest Green (`#1F4B3F`)
- **Accent**: Warm Mustard Gold (`#C9973B`)
- **Text**: Charcoal (`#2B2B28`)
- **Dividers & Borders**: Hairline Muted Sand (`#DCD3C0`)
- **Typography**: `Lora` (Google Fonts, serif) for titles; `Work Sans` for body copy.

---

## 📁 Project Directory Structure

```
d:/postgresql/
├── .env.example               # Example configuration file
├── .gitignore                 # Excluded node_modules, build, and secret files
├── package.json               # Backend dependencies and root scripts
├── server.js                  # Main Express backend server entry point
├── db.js                      # PostgreSQL pool connection & auto-table init
├── schema.sql                 # SQL table definitions, constraints, and keys
├── controllers/               # SQL business logic & CRUD query operations
│   ├── authController.js
│   ├── volunteerController.js
│   ├── donorController.js
│   ├── donationController.js
│   └── eventController.js
├── routes/                    # API route definitions
│   ├── authRoutes.js
│   ├── volunteerRoutes.js
│   ├── donorRoutes.js
│   ├── donationRoutes.js
│   └── eventRoutes.js
│
└── frontend/                  # React client application
    ├── index.html             # HTML template with Google Fonts
    ├── vite.config.js         # Vite configuration with proxy to port 5000
    ├── tailwind.config.js     # Custom design system colors & fonts
    ├── postcss.config.js      # PostCSS configuration
    ├── package.json           # Frontend dependencies
    └── src/
        ├── index.css          # Tailwind base & utilities
        ├── App.jsx            # Main client router (react-router)
        ├── main.jsx           # React DOM mounting
        ├── api/
        │   └── api.js         # Custom fetch wrapper with auto 401 refresh
        ├── context/
        │   └── AuthContext.jsx# Authentication session provider
        ├── components/
        │   ├── Navbar.jsx
        │   ├── ProtectedRoute.jsx
        │   ├── DonationForm.jsx
        │   ├── VolunteerList.jsx
        │   ├── DonorList.jsx
        │   ├── EventList.jsx
        │   └── DonationList.jsx
        └── pages/
            ├── Home.jsx
            ├── Login.jsx
            ├── Register.jsx
            ├── UserDashboard.jsx
            └── AdminDashboard.jsx
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [PostgreSQL](https://www.postgresql.org/) (running locally, e.g. v14–v18)
- [Git](https://git-scm.com/)

### Environment Setup
1. Clone or download the repository.
2. In the root directory, create a `.env` file (you can copy `.env.example`):
   ```bash
   cp .env.example .env
   ```
3. Configure your variables inside `.env`:
   ```env
   PORT=5000
   PG_HOST=localhost
   PG_PORT=5432
   PG_USER=postgres
   PG_PASSWORD=pass123
   PG_DATABASE=ngo_db
   ACCESS_TOKEN_SECRET=my_super_secret_access_key_12345
   REFRESH_TOKEN_SECRET=my_super_secret_refresh_key_67890
   ```

### Running the Project

#### 1. Install Backend Dependencies & Start Server
In the root directory:
```bash
npm install
npm start
```
*Backend starts on `http://localhost:5000`.*

#### 2. Install Frontend Dependencies & Start Client
Open a second terminal window:
```bash
npm run frontend
# or: cd frontend && npm install && npm run dev
```
*Frontend starts on `http://localhost:5173`.*

---

## 🧪 Testing the Application (College Demo Guide)

1. Open `http://localhost:5173` in your browser.
2. Click **Join Us** (`/register`):
   - Register a **User** account (e.g. `rahul@gmail.com`).
   - Register an **Admin** account (e.g. `admin@ngo.org`).
3. **Login as User**:
   - Redirected to `/dashboard`.
   - Submit a test contribution (e.g. ₹500 via Online).
   - Check the **Donation Ledger** tab: the donation appears under Rahul's name.
   - Note that Add/Edit/Delete buttons are hidden, and direct navigation to `/admin` is blocked.
4. **Login as Admin**:
   - Redirected to `/admin`.
   - Add, edit, or delete volunteers, donors, and scheduled events.
   - Edit or delete donation entries in the ledger.
   - Record an offline donation on behalf of any external person or organization.

---

## 📄 License
This project was developed for educational purposes as part of a college DBMS project.
