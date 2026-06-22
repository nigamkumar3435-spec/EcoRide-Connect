# ⚡ EcoRide Connect - India's Smart EV Ecosystem Platform

![React](https://img.shields.io/badge/Frontend-React.js-61DAFB?style=for-the-badge\&logo=react)
![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?style=for-the-badge\&logo=node.js)
![Express](https://img.shields.io/badge/API-Express.js-000000?style=for-the-badge\&logo=express)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?style=for-the-badge\&logo=mongodb)
![JWT](https://img.shields.io/badge/Auth-JWT-orange?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Production%20Ready-success?style=for-the-badge)

# 🚗 EcoRide Connect

**EcoRide Connect** is a production-ready, full-stack MERN platform designed to simplify and enhance the Electric Vehicle (EV) ownership experience in India.

The platform enables EV owners to:

⚡ Discover nearby charging stations

🔋 Reserve charging slots

🔄 Find battery swapping stations

🛠️ Locate multi-brand service centers

📰 Read EV-related publications and updates

👥 Connect with other EV enthusiasts through a community forum

The application features a premium dark-first interface with separate dashboards for users and administrators.

---

# 🌟 Key Features

## ⚡ EV Charging Station Finder

* Search charging stations by city and station name
* Filter by charger type
* Check charger availability
* View station details and ratings
* Sort stations by charging cost

---

## 📅 Slot Booking System

* Book charging slots
* Select date and time
* Manage reservations
* Cancel bookings
* Admin booking management

---

## 🔋 Battery Swapping Network

* Find nearby battery swapping locations
* View station information
* Admin CRUD management

---

## 🛠️ Multi-Brand Service Centers

* Locate certified mechanics
* View service center ratings
* Find maintenance facilities
* Admin CRUD operations

---

## 👥 EV Community Forum

* Create discussion threads
* Like posts
* Comment on discussions
* Edit and delete posts
* Community engagement features

---

## 📰 Publications & Blogs

* Read EV news and updates
* Access educational content
* Admin blog management system

---

## 🔐 Authentication & Security

* JWT Authentication
* Password Hashing using bcryptjs
* Protected Routes
* Role-Based Access Control
* Admin Authorization Middleware
* Secure API Endpoints

---

# 🛠️ Tech Stack

## Frontend

* React.js
* React Router DOM
* Axios
* Context API
* Tailwind CSS
* React Icons

## Backend

* Node.js
* Express.js
* JWT Authentication
* bcryptjs

## Database

* MongoDB
* Mongoose ODM

---

# 📂 Project Structure

```text
EcoRide-Connect/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   ├── utils/
│   ├── .env
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── context/
    │   ├── pages/
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    │
    ├── index.html
    ├── tailwind.config.js
    └── postcss.config.js
```

---

# 🚀 System Architecture

```text
React Frontend
        │
        ▼
Express REST APIs
        │
        ▼
Authentication Middleware
        │
        ▼
Controllers
        │
        ▼
MongoDB Database
```

---

# ⚙️ Getting Started

## Prerequisites

* Node.js v18+
* npm
* MongoDB Local Instance or MongoDB Atlas

---

# Backend Setup

## Install Dependencies

```bash
cd backend
npm install
```

## Configure Environment Variables

Create `.env`

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/ecoride
JWT_SECRET=your_secret_key
NODE_ENV=development
```

## Seed Database

```bash
npm run seed
```

## Start Backend

```bash
npm run dev
```

Server runs on:

```text
http://localhost:5000
```

---

# Frontend Setup

## Install Dependencies

```bash
cd frontend
npm install
```

## Start Development Server

```bash
npm run dev
```

Application runs on:

```text
http://localhost:5173
```

---

# Demo Credentials

## Admin

Email:

```text
admin@ecoride.com
```

Password:

```text
adminpassword
```

---

## User

Email:

```text
user@ecoride.com
```

Password:

```text
userpassword
```

---

# API Endpoints

## Authentication

```text
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
PUT    /api/auth/profile
POST   /api/auth/forgot-password
```

## Charging Stations

```text
GET    /api/stations
GET    /api/stations/:id
POST   /api/stations
PUT    /api/stations/:id
DELETE /api/stations/:id
```

## Bookings

```text
POST   /api/bookings
GET    /api/bookings/user
GET    /api/bookings
PUT    /api/bookings/:id/status
```

## Battery Stations

```text
GET    /api/battery-stations
POST   /api/battery-stations
PUT    /api/battery-stations/:id
DELETE /api/battery-stations/:id
```

## Service Centers

```text
GET    /api/service-centers
POST   /api/service-centers
PUT    /api/service-centers/:id
DELETE /api/service-centers/:id
```

## Reviews & Forum

```text
POST   /api/reviews
PUT    /api/reviews
DELETE /api/reviews

GET    /api/forum
POST   /api/forum
PUT    /api/forum
DELETE /api/forum
POST   /api/forum/like
POST   /api/forum/comment
```

---

# ✨ Core Functionalities

✔ Authentication System

✔ User Dashboard

✔ Admin Dashboard

✔ EV Charging Discovery

✔ Charging Slot Reservation

✔ Battery Swapping Stations

✔ Service Center Management

✔ Review System

✔ Community Forum

✔ Blog Management

✔ Role-Based Authorization

✔ Responsive Design

---

# 🎯 Future Enhancements

* Real-Time Charger Availability
* Payment Gateway Integration
* Live Location Tracking
* Push Notifications
* AI-Based Route Planning
* EV Recommendation System
* Mobile Application
* PWA Support
* Google Maps Integration
* Analytics Dashboard

---

# 📸 Screenshots

### Home Page

![Home](screenshots/home.png)

### Dashboard

![Dashboard](screenshots/dashboard.png)

### Charging Stations

![Stations](screenshots/stations.png)

### Community Forum

![Forum](screenshots/forum.png)

---

# 🎓 Learning Outcomes

This project demonstrates practical knowledge of:

* Full Stack MERN Development
* REST API Development
* JWT Authentication
* Database Design
* State Management
* Role-Based Access Control
* Responsive UI Development
* MVC Architecture
* Production-Level Project Structuring

---

# 👨‍💻 Author

**Nigam Kumar**

🎓 B.Tech – Computer Science Engineering
🏫 Indore Institute of Science and Technology, Indore
📍 Madhya Pradesh, India

GitHub: https://github.com/nigamkumar3435-spec

LinkedIn: https://www.linkedin.com/in/nigam-kumar01

---

# ⭐ Support

If you found this project useful, please consider giving it a ⭐ on GitHub.

### ⚡ Empowering India's Electric Mobility Ecosystem with Smart Technology 🚗🔋
