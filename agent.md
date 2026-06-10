# EcoRide Connect - AI Agent Onboarding & Developer Guide

Welcome, Agent! This guide will help you understand, run, develop, and maintain the **EcoRide Connect** codebase.

---

## 1. Project Overview

**EcoRide Connect** is a MERN stack EV ecosystem platform built for EV owners in India. It enables users to:
* Discover EV charging stations, battery swap hubs, and certified service centers.
* Check real-time slot availability and reserve charging slots.
* Manage charging bookings with simulated payment confirmation and cancellation/refunds.
* Participate in a community forum and read expert EV blogs.
* Access dashboards (User dashboard for tracking bookings/reviews/posts, Admin control panel for managing stations/swaps/services/users/reviews and viewing Recharts-based analytics).

---

## 2. Directory Structure

```text
Project2/
├── backend/
│   ├── config/             # DB connectivity (db.js) & Swagger configuration (swagger.js)
│   ├── controllers/        # REST Controllers (auth, bookings, stations, admin, etc.)
│   ├── middleware/         # Auth guarding, role check, and error handlers
│   ├── models/             # Mongoose schemas (User, ChargingStation, Booking, Review, etc.)
│   ├── routes/             # REST Route mappings
│   ├── scripts/            # Database seed (`seed.js`) & integration verify API scripts
│   ├── utils/              # Email simulation and JWT token generation
│   ├── tests/              # Jest integration tests (`api.test.js`)
│   ├── .env                # Port, MongoDB URI, JWT Secret keys
│   └── server.js           # Express App setup and server listener
│
└── frontend/
    ├── src/
    │   ├── assets/         # SVG icons and static assets
    │   ├── components/     # Reusable layout/UI cards, sidebar, map components
    │   ├── context/        # React Auth session and Theme configuration states
    │   ├── pages/          # Home, Auth, Details, Forum, and Dashboard pages
    │   ├── App.jsx         # Route declarations
    │   └── index.css       # Tailwind directives & glassmorphic custom utilities
    ├── index.html          # HTML Entrypoint
    ├── vite.config.js      # Vite build configuration (and PWA integration)
    ├── tailwind.config.js  # Styling guidelines
    └── postcss.config.js   # Style compiler
```

---

## 3. Tech Stack

* **Frontend**: React (v19), React Router DOM (v7), Axios, Tailwind CSS (v3), React Icons, Recharts (for dashboards), Leaflet & React Leaflet (for geolocation mapping).
* **Backend**: Node.js, Express, Mongoose ODM, JWT Authentication (`jsonwebtoken`), password hashing (`bcryptjs`), `nodemailer` (simulated emails).
* **Database**: MongoDB (runs locally on port `27017` or Atlas connection).
* **Tests**: Jest, Supertest.

---

## 4. Setup and Run Guide

### Database Setup
Ensure MongoDB is running locally at:
`mongodb://127.0.0.1:27017/ecoride`

### Backend Setup
1. Change directory to `backend/`.
2. Ensure environment keys are configured in `backend/.env`:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/ecoride
   JWT_SECRET=ecoride_super_secret_jwt_key_991823
   NODE_ENV=development
   ```
3. Run database seed to populate default collections:
   ```bash
   npm run seed
   ```
   * *Seeded Credentials (for testing)*:
     * **Admin User**: `admin@ecoride.com` / `adminpassword`
     * **Regular User**: `user@ecoride.com` / `userpassword`
4. Start the Express server:
   ```bash
   npm run dev
   ```
   * Serves API at `http://localhost:5000`
   * Serves Swagger API Documentation at `http://localhost:5000/api-docs`

### Frontend Setup
1. Change directory to `frontend/`.
2. Start the Vite local server:
   ```bash
   npm run dev
   ```
   * Serves frontend at `http://localhost:5173/`

---

## 5. API Endpoints Reference

### Authentication (`/api/auth`)
* `POST /register` - Registers a new user.
* `POST /login` - User login. Returns JWT.
* `POST /forgot-password` - Mocks password reset by updating password for registered email.
* `GET /me` *(Protected)* - Returns current logged-in user profile.
* `PUT /profile` *(Protected)* - Updates profile fields (name, email, profile image, password; requires `currentPassword`).

### Charging Stations (`/api/stations`)
* `GET /` - List all stations. Supports filters (`city`, `chargerType`, `search`, `availableOnly`) and sorting.
* `GET /:id` - Station details, including reviews.
* `POST /` *(Admin)* - Create new station.
* `PUT /:id` *(Admin)* - Update station details.
* `DELETE /:id` *(Admin)* - Remove station and clean up its bookings/reviews.

### Bookings (`/api/bookings`)
* `POST /` *(Protected)* - Reserves a charging slot. Decrements station available slots. Sends simulation confirmation email.
* `GET /user` *(Protected)* - Retrieve bookings for currently logged-in user.
* `GET /` *(Admin)* - Retrieve all system bookings.
* `PUT /:id/status` *(Protected)* - Update booking status (e.g., set to "Cancelled" which refunds payment, increments available slots, and sends simulation email).

### Swap Hubs (`/api/battery-stations`)
* `GET /` - List all battery swap locations.
* `POST /` / `PUT /:id` / `DELETE /:id` *(Admin)* - CRUD operations.

### Service Centers (`/api/service-centers`)
* `GET /` - List certified mechanics.
* `POST /` / `PUT /:id` / `DELETE /:id` *(Admin)* - CRUD operations.

### Social & Community (`/api/forum`, `/api/blogs`, `/api/reviews`)
* `/api/reviews` *(Protected)* - Add/edit/delete reviews.
* `/api/forum` *(Protected)* - Create, edit, delete, like posts, and add comments.
* `/api/blogs` - Public GET blogs, Admin-protected POST/PUT/DELETE blogs.

---

## 6. Testing

Run integration tests using Jest:
```bash
cd backend
npm test
```

Tests run in memory or against a separate test database `mongodb://127.0.0.1:27017/ecoride_test` so seeding data remains untouched.

---

## 7. Guidelines for Agents

* **Environment Variables**: Always ensure `.env` is loaded using `dotenv.config()`. Never commit `.env` files.
* **Component Styling**: Styled using Tailwind CSS. Maintain dark-first glassmorphic themes (look at classes like `glass-panel` in `frontend/src/index.css`).
* **State Management**: Use the React Context APIs (`AuthContext`, `ThemeContext`) for shared state.
* **Database Updates**: When adding model fields, update Mongoose schemas under `backend/models/` and ensure the database seed script is updated if needed.
