const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Route imports
const authRoutes = require('./routes/authRoutes');
const stationRoutes = require('./routes/stationRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const batteryStationRoutes = require('./routes/batteryStationRoutes');
const serviceCenterRoutes = require('./routes/serviceCenterRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const forumRoutes = require('./routes/forumRoutes');
const blogRoutes = require('./routes/blogRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

app.use('/api/auth', authRoutes);
app.use('/api/stations', stationRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/battery-stations', batteryStationRoutes);
app.use('/api/service-centers', serviceCenterRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/forum', forumRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/admin', adminRoutes);

// Root path diagnostic
app.get('/', (req, res) => {
  res.send('EcoRide Connect API is running...');
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
}

module.exports = app;
