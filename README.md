# EcoRide Connect - India's Smart EV Ecosystem Platform

EcoRide Connect is a production-ready, full-stack MERN platform designed for EV owners to discover facilities, reserve charging slots, buy/swap batteries, locate multi-brand mechanical service centers, read publications, and communicate in a social community hub.

It features a high-end dark-first dashboard interface for users and administrators.

---

## Technical Stack

* **Frontend**: React.js, React Router DOM, Axios, Context API, Tailwind CSS, React Icons
* **Backend**: Node.js, Express.js, JWT Authentication, bcryptjs Hashing
* **Database**: MongoDB (Local or Atlas via URI connection)

---

## Project Directory Layout

```text
Project2/
├── backend/
│   ├── config/             # DB connectivity
│   ├── controllers/        # REST controllers (Auth, Stations, Bookings, Forums, etc.)
│   ├── middleware/         # Security protect & Admin check middlewares
│   ├── models/             # Mongoose schemas (User, ChargingStation, Booking, Review, etc.)
│   ├── routes/             # REST routing routes maps
│   ├── scripts/            # db seed and api testing scripts
│   ├── utils/              # Token signature utilities
│   ├── .env                # Port, Database URI configuration keys
│   └── server.js           # Server runner entrypoint
│
└── frontend/
    ├── src/
    │   ├── components/     # Cards, Sidebars, Modals, Rating controls
    │   ├── context/        # Auth session context provider
    │   ├── pages/          # Home, Auth, Stations details, Swapping hubs, Forum, Dashboards
    │   ├── App.jsx         # App router configuration
    │   ├── main.jsx        # Root mounter
    │   └── index.css       # Tailwind stylesheet and premium glassmorphic helpers
    ├── index.html          # SEO customized HTML entry
    ├── tailwind.config.js  # Tailwind selectors configuration
    └── postcss.config.js   # CSS builder configuration
```

---

## Getting Started

### 1. Prerequisites
- **Node.js**: v18+ (tested on v24.15)
- **MongoDB**: A running local instance (`mongodb://127.0.0.1:27017/ecoride`) or MongoDB Atlas cluster URI.

### 2. Backend Setup
1. Open a terminal in `backend/` and run:
   ```bash
   npm install
   ```
2. Create/edit `backend/.env`:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/ecoride
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   ```
3. Run the database seed script to populate testing assets:
   ```bash
   npm run seed
   ```
4. Start the Express server:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup
1. Open a terminal in `frontend/` and run:
   ```bash
   npm install
   ```
2. Build or start the Vite local server:
   - **Run Dev**: `npm run dev` (starts on `http://localhost:5173`)
   - **Production Build**: `npm run build`

---

## Seed Credentials (for testing)

- **Admin Account**:
  - Email: `admin@ecoride.com`
  - Password: `adminpassword`
- **User Account**:
  - Email: `user@ecoride.com`
  - Password: `userpassword`

---

## API Documentation

### Authentication (`/api/auth`)
- `POST /register`: Register user
- `POST /login`: Log in user
- `GET /me` (Protected): Get logged-in user profile
- `PUT /profile` (Protected): Update profile fields (name, email, password, avatar)
- `POST /forgot-password`: Mock password reset via email lookup

### Charging Stations (`/api/stations`)
- `GET /`: View all charging stations (Supports filtering by city, name, chargerType, available status, and sorting by cost)
- `GET /:id`: Detailed information of a charging station, including reviews
- `POST /` (Admin): Create station
- `PUT /:id` (Admin): Update station details
- `DELETE /:id` (Admin): Remove station and cleanup bookings/reviews

### Slot Bookings (`/api/bookings`)
- `POST /` (Protected): Reserves a charging slot (date, time slot, station)
- `GET /user` (Protected): Retrieve active user's bookings
- `GET /` (Admin): List all bookings in system
- `PUT /:id/status` (Protected): Cancel a booking (users) or change status (admin)

### Swap Stations (`/api/battery-stations`)
- `GET /`: View swapping locations
- `POST /` / `PUT /:id` / `DELETE /:id` (Admin): CRUD

### Service Partners (`/api/service-centers`)
- `GET /`: View certified mechanics and ratings
- `POST /` / `PUT /:id` / `DELETE /:id` (Admin): CRUD

### Reviews & Forum
- `/api/reviews` (Protected): POST review, PUT edit, DELETE review
- `/api/forum` (Protected): GET posts, POST create thread, PUT edit, DELETE, POST like, POST comment
- `/api/blogs`: GET blogs, POST (Admin), PUT (Admin), DELETE (Admin)
