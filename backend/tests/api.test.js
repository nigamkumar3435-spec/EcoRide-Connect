const request = require('supertest');
const mongoose = require('mongoose');

// Override MONGO_URI to use a test database before requiring server
process.env.MONGO_URI = 'mongodb://127.0.0.1:27017/ecoride_test';
process.env.NODE_ENV = 'test';

const app = require('../server');
const User = require('../models/User');
const ChargingStation = require('../models/ChargingStation');
const Booking = require('../models/Booking');

describe('EcoRide Connect API Integration Tests', () => {
  let testUserToken = '';
  let testStationId = '';
  let testUserId = '';

  beforeAll(async () => {
    try {
      await User.deleteMany({});
      await ChargingStation.deleteMany({});
      await Booking.deleteMany({});
    } catch (err) {
      console.error('Error in test setup:', err);
    }
  });

  afterAll(async () => {
    await User.deleteMany({});
    await ChargingStation.deleteMany({});
    await Booking.deleteMany({});
    await mongoose.connection.close();
  });

  describe('Authentication Endpoints', () => {
    it('should register a new user successfully', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test Tester',
          email: 'test@example.com',
          password: 'testpassword',
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.email).toBe('test@example.com');
      testUserId = res.body._id;
    });

    it('should fail registration if email already exists', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test Tester',
          email: 'test@example.com',
          password: 'testpassword',
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('User already exists');
    });

    it('should login user and return a token', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'testpassword',
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
      testUserToken = res.body.token;
    });

    it('should fail login with incorrect password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword',
        });

      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Invalid email or password');
    });
  });

  describe('User Profile Endpoints', () => {
    it('should get current logged in user profile', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${testUserToken}`);

      expect(res.status).toBe(200);
      expect(res.body.email).toBe('test@example.com');
    });

    it('should fail getting profile if token is missing', async () => {
      const res = await request(app).get('/api/auth/me');

      expect(res.status).toBe(401);
    });
  });

  describe('Booking & Payment Endpoints', () => {
    beforeAll(async () => {
      // Seed a charging station
      const station = await ChargingStation.create({
        name: 'Test Charger Hub',
        address: '123 Test Street',
        city: 'New Delhi',
        state: 'Delhi',
        contact: '9999999999',
        chargerType: 'DC Fast',
        chargingCost: 150,
        availableSlots: 2,
      });
      testStationId = station._id.toString();
    });

    let testBookingId = '';

    it('should successfully book a slot with mock payment info', async () => {
      const res = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${testUserToken}`)
        .send({
          stationId: testStationId,
          bookingDate: '2026-07-15',
          bookingTime: '10:00 AM - 11:00 AM',
          transactionId: 'TXN_TEST12345',
          paymentStatus: 'Paid',
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('transactionId', 'TXN_TEST12345');
      expect(res.body).toHaveProperty('paymentStatus', 'Paid');
      expect(res.body).toHaveProperty('status', 'Approved');
      testBookingId = res.body._id;

      // Verify slot is decremented
      const stationObj = await ChargingStation.findById(testStationId);
      expect(stationObj.availableSlots).toBe(1);
    });

    it('should successfully cancel a booked slot and trigger a payment refund', async () => {
      const res = await request(app)
        .put(`/api/bookings/${testBookingId}/status`)
        .set('Authorization', `Bearer ${testUserToken}`)
        .send({ status: 'Cancelled' });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('status', 'Cancelled');
      expect(res.body).toHaveProperty('paymentStatus', 'Refunded');
      expect(res.body.transactionId).toMatch(/^REF_/);

      // Verify slot is incremented back
      const stationObj = await ChargingStation.findById(testStationId);
      expect(stationObj.availableSlots).toBe(2);
    });

    it('should fail booking if station has no slots available', async () => {
      // Force availableSlots to 0
      await ChargingStation.findByIdAndUpdate(testStationId, { availableSlots: 0 });

      const res = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${testUserToken}`)
        .send({
          stationId: testStationId,
          bookingDate: '2026-07-15',
          bookingTime: '11:00 AM - 12:00 PM',
          transactionId: 'TXN_TESTFAIL',
          paymentStatus: 'Paid',
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('No slots available at this station');
    });
  });

  describe('Admin Analytics Endpoints', () => {
    it('should forbid a regular user from accessing admin dashboard stats', async () => {
      const res = await request(app)
        .get('/api/admin/dashboard')
        .set('Authorization', `Bearer ${testUserToken}`);

      expect(res.status).toBe(403);
      expect(res.body.message).toBe('Not authorized as an admin');
    });

    it('should allow admin user to access stats and return Recharts analytics compatible arrays', async () => {
      // Upgrade user to admin
      await User.findByIdAndUpdate(testUserId, { role: 'admin' });

      const res = await request(app)
        .get('/api/admin/dashboard')
        .set('Authorization', `Bearer ${testUserToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('counts');
      expect(res.body).toHaveProperty('monthlyUserGrowth');
      expect(res.body).toHaveProperty('bookingAnalytics');
      expect(Array.isArray(res.body.monthlyUserGrowth)).toBe(true);
      expect(Array.isArray(res.body.bookingAnalytics)).toBe(true);
    });
  });

  describe('Admin CRUD Deletion Endpoints', () => {
    let testServiceId = '';
    let testSwapId = '';
    let testBlogId = '';

    beforeAll(async () => {
      const ServiceCenter = require('../models/ServiceCenter');
      const BatteryStation = require('../models/BatteryStation');
      const Blog = require('../models/Blog');

      const service = await ServiceCenter.create({
        name: 'Test Service Center',
        address: 'Test Address',
        contact: '1234567890',
        services: ['Brakes', 'Battery Check'],
      });
      testServiceId = service._id.toString();

      const swap = await BatteryStation.create({
        name: 'Test Swap Station',
        address: 'Test Address',
        batteryType: '72V',
        contact: '1234567890',
        workingHours: '24/7',
      });
      testSwapId = swap._id.toString();

      const blog = await Blog.create({
        title: 'Test Blog Title',
        content: 'Test content here...',
        category: 'EV News',
      });
      testBlogId = blog._id.toString();
    });

    it('should allow admin to delete a service center', async () => {
      const res = await request(app)
        .delete(`/api/service-centers/${testServiceId}`)
        .set('Authorization', `Bearer ${testUserToken}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Service center removed');
    });

    it('should allow admin to delete a battery swap station', async () => {
      const res = await request(app)
        .delete(`/api/battery-stations/${testSwapId}`)
        .set('Authorization', `Bearer ${testUserToken}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Battery swap station removed');
    });

    it('should allow admin to delete a blog article', async () => {
      const res = await request(app)
        .delete(`/api/blogs/${testBlogId}`)
        .set('Authorization', `Bearer ${testUserToken}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Blog removed');
    });
  });
});
