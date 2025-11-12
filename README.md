# 🔥 Alerta-Fuego - Emergency Incident Reporting System

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [Features Roadmap](#features-roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## 📖 Project Overview

**Alerta-Fuego** is a real-time emergency incident reporting and management system designed for fire departments, police, and emergency responders. It allows users to report incidents on an interactive map, view and filter active incidents, and manage responses through a professional dashboard.

Built with modern web technologies, the project emphasizes speed, reliability, and usability for critical operations. It has evolved from a minimal public reporting MVP to a full featured system with authentication, real-time notifications, and advanced incident management tools, ready for deployment and real-world use.

**Key Objective:** Enable emergency responders to quickly report, track, and manage incidents in real-time across multiple devices and locations.

---

## Features

### Interactive Map
- **Real-time incident visualization** on interactive Leaflet map
- **2D/Satellite view toggle** for different map perspectives
- **Color-coded incident markers** by risk level:
  - 🔴 **High Risk** - Urgent situations
  - 🟠 **Medium Risk** - Important incidents
  - 🟢 **Low Risk** - Standard reports
- **Click-to-report functionality** - Users can click anywhere on the map to create new reports
- **Current location detection** - Auto-detect user's location
- **Zoom controls** and intuitive navigation

### Professional Dashboard
- **Real-time Statistics Cards**:
  - Total incidents count
  - Active incidents (Pending + In Progress)
  - Resolved incidents
  - Incidents reported today
- **Emergency-optimized interface** for quick decision-making
- **Dark Mode support** for night operations and eye comfort
- **Responsive design** - Works flawlessly on desktop, tablet, and mobile

### Advanced Incident Management
- **Comprehensive incidents table** with:
  - Status tracking (Pending, In Progress, Resolved)
  - Risk level categorization
  - Incident descriptions and timestamps
  - GPS coordinates (Latitude/Longitude)
  - Created and updated timestamps
- **Advanced filtering** by status and risk level
- **Search and sort capabilities** for quick incident location
- **Action buttons** to update incident status in real-time
- **Incident count badge** showing current filtered results

### Streamlined Report Creation
- **Intuitive report form** with:
  - Automatic current location detection
  - Manual coordinate input for precise location
  - Risk level selection (High/Medium/Low)
  - Detailed incident description
  - Real-time form validation
- **Direct map integration** - Click on map to set location
- **Pre-filled fields** when available

### 🔐 Secure Authentication
- **Email/Password authentication** via Supabase
- **New user registration** with Sign Up page
- **Protected dashboard routes** - Only authenticated users can access sensitive data
- **Secure session management** - Automatic logout functionality
- **Persistent authentication** across browser sessions

### 🔔 Real-time Notifications
- **Instant alerts** when new incidents are created
- **Toast notifications** for quick user feedback
- **Auto-refresh** of incident table without page reload
- **Real-time synchronization** - Updates reflected across multiple devices simultaneously
- **Zero-delay incident propagation** - Changes visible instantly

### ⚙️ Additional Features
- **Theme Toggle** (Light/Dark mode) with persistent preferences
- **Mobile-optimized navigation** - Specially designed for small screens
- **Error handling** with user-friendly error messages
- **Loading states** for better UX during data fetching
- **Professional branding** and UI throughout the application
- **Skeleton loaders** for better perceived performance

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI framework with hooks
- **TypeScript** - Type safety and better DX
- **Vite** - Lightning-fast build tool
- **React Router v6** - Client-side navigation
- **Tailwind CSS + CSS Modules** - Styling and component styles
- **Leaflet** - Interactive mapping library
- **React Leaflet** - React bindings for Leaflet
- **React Hot Toast** - Beautiful, accessible notifications
- **React Hook Form** - Efficient form management
- **Zod** - Schema validation

### Backend & Database
- **Supabase** - Complete Backend as a Service platform:
  - PostgreSQL relational database
  - Real-time subscriptions (Realtime)
  - Authentication and Authorization (Auth)
  - Row Level Security (RLS) policies
  - API auto-generation

### Deployment & Infrastructure
- **Vercel** - Hosting and CI/CD platform
- **GitHub** - Version control and repository management

---

## Prerequisites

Ensure you have the following installed and configured:

- **Node.js** v18 or higher
- **npm** or **yarn** package manager
- **Git** for version control and cloning
- **Supabase account** (free tier available at supabase.com)
- **GitHub account** (for cloning and deploying)
- **Modern web browser** (Chrome, Safari, Firefox, Edge - latest versions)

---

## Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/Luisal182/Alerta-Fuego.git
cd Alerta-Fuego
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Create Environment File

Create a `.env.local` file in the project root directory:

```env
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

**How to get these values:**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Settings → API**
4. Copy your **Project URL** and **anon public** key
5. Paste into `.env.local`

### Step 4: Start Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` in your browser 🎉

---

## ⚙️ Configuration

### Supabase Database Setup

#### 1. Create the `incidents` Table

Execute this SQL in Supabase SQL Editor:

```sql
CREATE TABLE incidents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  latitude DECIMAL(9, 6) NOT NULL,
  longitude DECIMAL(9, 6) NOT NULL,
  description TEXT NOT NULL,
  risk_level VARCHAR(20) NOT NULL CHECK (risk_level IN ('low', 'medium', 'high')),
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'resolved')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

#### 2. Enable Real-time Subscriptions

1. Go to Supabase Dashboard
2. Navigate to **Replication**
3. Select the `incidents` table
4. Enable **INSERT** and **UPDATE** events
5. Save changes

#### 3. Set up Authentication

1. Go to **Authentication → Providers**
2. Click on **Email**
3. Enable the Email provider
4. (Optional) For development, disable "Confirm email" requirement
5. Configure custom email templates if needed

#### 4. Set up Row Level Security (Production)

For production deployments, configure RLS policies to restrict access:

```sql
-- Allow users to read all incidents
CREATE POLICY "Allow public read access" ON incidents
  FOR SELECT USING (true);

-- Allow authenticated users to insert incidents
CREATE POLICY "Allow authenticated insert" ON incidents
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow users to update their own incidents
CREATE POLICY "Allow update own incidents" ON incidents
  FOR UPDATE USING (auth.uid()::text = auth.uid()::text);
```

---

##  Usage

### Reporting an Incident

1. **Open the Map** page at `/`
2. **Click on the map** at the desired location
3. **Fill in the incident form**:
   - Risk Level: Select High, Medium, or Low
   - Description: Enter incident details
   - Location: Auto-populated or manually adjust
4. **Click "Report Incident"** button
5. ✅ Incident appears on map instantly and is visible to all users

### Accessing the Dashboard

1. **Sign Up** or **Log In**:
   - New users: Go to `/signup` to create account
   - Existing users: Go to `/login`
2. **Access Dashboard** at `/dashboard`
3. **View and manage incidents**:
   - 📊 Real-time statistics at the top
   - 📋 Comprehensive incidents table below
   - 🔍 Filter by status or risk level
   - ✏️ Update incident status as needed

### Map Features

- **Toggle View**: Click "🛰️ Satellite" or "🗺️ 2D" button (top right)
- **View Markers**: Each colored circle represents an incident
- **View Details**: Click on any marker to see incident information in a popup
- **Zoom**: Use scroll wheel or zoom controls

### Dashboard Features

- **Theme Toggle**: Click 🌙/☀️ button to switch between dark and light mode
- **Filter Incidents**: Use dropdown menus to filter by Status and Risk Level
- **Update Status**: Click on incidents in table to update their status
- **Sort & Search**: Table is sortable and searchable
- **Logout**: Click "Logout" button when done

---

## Project Structure

```
Alerta-Fuego/
├── public/
│   └── favicon.ico
├── src/
│   ├── assets/
│   │   └── sounds/
│   │       ├── high-risk.mp3
│   │       ├── medium-risk.mp3
│   │       └── low-risk.mp3
│   ├── components/
│   │   ├── Header/
│   │   │   ├── Header.tsx
│   │   │   └── Header.module.css
│   │   ├── Map/
│   │   │   ├── Map.tsx
│   │   │   └── Map.module.css
│   │   ├── ReportForm/
│   │   │   ├── ReportForm.tsx
│   │   │   └── ReportForm.module.css
│   │   ├── IncidentsTable/
│   │   │   ├── IncidentsTable.tsx
│   │   │   └── IncidentsTable.module.css
│   │   ├── StatsSection/
│   │   │   ├── StatsSection.tsx
│   │   │   ├── StatsSection.module.css
│   │   │   └── StatsSection-animations.module.css
│   │   ├── Layout/
│   │   ├── ProtectedRoute/
│   │   └── Footer/
│   ├── pages/
│   │   ├── LoginPage/
│   │   │   ├── LoginPage.tsx
│   │   │   └── LoginPage.module.css
│   │   ├── SignUpPage/
│   │   │   ├── SignUpPage.tsx
│   │   │   └── SignUpPage.module.css
│   │   └── DashboardPage/
│   │       ├── DashboardPage.tsx
│   │       └── DashboardPage.module.css
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useIncidents.ts
│   │   ├── useDarkMode.ts
│   │   ├── useMapStyle.ts
│   │   ├── useDashboardIncidents.ts
│   │   ├── useRealtimeNotifications.ts
│   │   └── useLocation.ts
│   ├── utils/
│   │   └── alertSounds.ts
│   ├── lib/
│   │   └── supabase.ts
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   ├── App.css
│   └── main.tsx
├── .env.local (not in git)
├── .gitignore
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

---

## 🌐 Deployment

### Deploy on Vercel (Recommended)

#### Step 1: Push to GitHub

```bash
git add .
git commit -m "Ready for production deployment"
git push origin main
```

#### Step 2: Import Project on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Import Project"** or **"New Project"**
3. Select **"Import Git Repository"**
4. Paste your GitHub repository URL
5. Click **"Import"**

#### Step 3: Configure Environment Variables

1. In Vercel project settings, go to **Settings → Environment Variables**
2. Add the following variables:
   - Name: `VITE_SUPABASE_URL` → Value: Your Supabase URL
   - Name: `VITE_SUPABASE_ANON_KEY` → Value: Your Supabase anon key
3. Click **"Save"**

#### Step 4: Deploy

1. Click **"Deploy"**
2. Wait for build to complete (usually 2-3 minutes)
3. ✅ Your app is live! Vercel will provide your production URL

### Production Checklist

- ✅ Environment variables configured in Vercel
- ✅ Email confirmation enabled in Supabase
- ✅ Row Level Security policies configured
- ✅ Database backups enabled
- ✅ Error tracking set up (optional)
- ✅ Custom domain configured (optional)
- ✅ All features tested in production environment

---

## Features Roadmap

### ✅ Completed Features
- ✅ Interactive map with real-time incident markers
- ✅ Authentication system (Login/Sign Up)
- ✅ Incident creation and reporting
- ✅ Comprehensive dashboard with statistics
- ✅ Real-time incident updates
- ✅ Dark mode support
- ✅ Map 2D/Satellite toggle
- ✅ Fully responsive mobile design
- ✅ Advanced filtering and search

### 🚧 In Progress
- 🔄 Real-time notifications with sound alerts
- 🔄 Visual alerts for high-risk incidents

### 📋 Future Features
- [ ] **User Roles & Permissions** - Admin, Responder, Viewer roles
- [ ] **Incident Categories** - Fire, Medical, Traffic, etc.
- [ ] **Resource Dispatch System** - Assign resources to incidents
- [ ] **Push Notifications** - Browser and mobile push alerts
- [ ] **Analytics & Reporting** - Export incident data and statistics
- [ ] **Heatmap Visualization** - Visual density of incidents by area
- [ ] **PWA/Offline Support** - Progressive Web App functionality
- [ ] **Multi-language Support** - Spanish, French, German, etc.
- [ ] **API for Third-party Integration** - REST/GraphQL API
- [ ] **Incident History Timeline** - Detailed incident progression tracking
- [ ] **Performance Metrics** - Response time analytics
- [ ] **Incident Categorization** - Auto-categorize incidents by content

---

## 🤝 Contributing

Contributions are welcome and greatly appreciated!

### How to Contribute

1. **Fork** the repository
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** and commit: `git commit -m 'Add amazing feature'`
4. **Push to your branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request** with a clear description of changes

### Development Standards

- Follow existing code style and conventions
- Use TypeScript for type safety
- Write meaningful commit messages
- Test changes locally before submitting PR
- Update README if adding new features

---

## 📝 License

This project is licensed under the **MIT License** - see the LICENSE file for details.

```
MIT License

Copyright (c) 2025 Luis Arranz

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```

---

## 👨‍💻 Author

**Developed by [Luis Arranz](https://github.com/Luisal182)** as part of a final course project in 2025.

Built with ❤️ using:
- React 18 & TypeScript
- Supabase & PostgreSQL
- Vite & Vercel
- Leaflet 

---

## 📞 Support & Contact

For issues, questions, or suggestions:

- 📧 **Email**: luisal.arranz@hotmail.com
- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/Luisal182/Alerta-Fuego/issues)
- 📋 **Feature Requests**: Create an issue with the `enhancement` label

---

## 🎯 Project Status

**Status**: 🟢 **Active Development**

- Latest Version: **1.0.0**
- Last Updated: **November 2025**
- Production Ready: ✅ Yes
- Actively Maintained: ✅ Yes

---

**Made for emergency responders, by developers who care about reliability and performance.** 🚒👮🏥

---

