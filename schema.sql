-- HopeHarbor NGO Management System — PostgreSQL Database Schema
-- College DBMS Project

-- 1. USERS TABLE: For authentication and role-based access control (RBAC)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    refresh_token TEXT DEFAULT '',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. VOLUNTEERS TABLE: Stores field volunteers and their skills
CREATE TABLE IF NOT EXISTS volunteers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    skills TEXT[] DEFAULT '{}',
    joined_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. DONORS TABLE: Stores individual and corporate benefactors
CREATE TABLE IF NOT EXISTS donors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    type VARCHAR(50) CHECK (type IN ('individual', 'corporate')) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. DONATIONS TABLE: Stores contribution records with foreign key link to donors
CREATE TABLE IF NOT EXISTS donations (
    id SERIAL PRIMARY KEY,
    donor_id INTEGER REFERENCES donors(id) ON DELETE SET NULL,
    amount NUMERIC(12, 2) CHECK (amount >= 1) NOT NULL,
    mode VARCHAR(50) CHECK (mode IN ('cash', 'online', 'cheque')) NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. EVENTS TABLE: Stores community outreach programs and assigned volunteers
CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    date TIMESTAMP NOT NULL,
    location VARCHAR(255) NOT NULL,
    volunteers_assigned JSONB DEFAULT '[]',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
