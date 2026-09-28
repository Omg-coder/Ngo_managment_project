# HopeHarbor Initiative — NGO Management System

A full-stack, beginner-friendly **NGO Management System** built with **Node.js, Express, MongoDB (Mongoose), React, and Tailwind CSS** for a college DBMS academic project.

The application features full CRUD operations, JWT access & refresh token authentication (stored in `httpOnly` cookies), Role-Based Access Control (RBAC) separating regular members from administrators, and an automated donation attribution mechanism.

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

- **Backend**: Node.js & Express REST API with modular MVC architecture (`/models`, `/controllers`, `/routes`, `/middleware`).
- **Database**: MongoDB with Mongoose object modeling and schema validation.
- **Frontend**: React (Vite) styled with Tailwind CSS v3 and routed using `react-router`.
- **Security & Session Handling**:
  - Passwords hashed using `bcryptjs` (salt factor 10).
  - Short-lived Access Tokens (15 minutes) sent in response body.
  - Long-lived Refresh Tokens (7 days) saved in MongoDB and issued via `httpOnly` secure cookies.
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

## 🗄️ Database Collections (Schema)

| Collection | Key Fields | Descriptions & Validations |
|---|---|---|
| **users** | `name`, `email`, `password`, `role`, `refreshToken` | `role` enum (`user`, `admin`), hashed password, unique lowercase email. |
| **volunteers** | `name`, `email`, `phone`, `skills`, `joinedDate` | `skills` stored as array of strings, default join date `Date.now`. |
| **donors** | `name`, `email`, `phone`, `type` | `type` enum (`individual`, `corporate`). |
| **donations** | `donorId`, `amount`, `mode`, `date` | Ref to `Donor`, `amount` min 1, `mode` enum (`cash`, `online`, `cheque`). |
| **events** | `title`, `date`, `location`, `volunteersAssigned` | Subdocument array containing `{ name, role }`. |

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
├── models/                    # Mongoose database schemas
│   ├── User.js
│   ├── Volunteer.js
│   ├── Donor.js
│   ├── Donation.js
│   └── Event.js
├── middleware/                # JWT verify and RBAC middlewares
│   └── authMiddleware.js
├── controllers/               # Business logic & database operations
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
- [MongoDB](https://www.mongodb.com/) (running locally or MongoDB Atlas URI)
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
   MONGO_URI=mongodb://127.0.0.1:27017/ngo_db
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
