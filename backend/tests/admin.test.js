const request = require('supertest');
const app = require('../app');
const mongoose = require("mongoose");

const User = require("../models/User");
const ParkingLocation = require('../models/ParkingLocation');

describe('Admin Endpoints', () => {
  let token;

  const userData = {
    name: "User",
    email: 'admin@admin.com',
    password: 'adminpassword',
    vehiclePlate: "AB-1234"
  };
  
  beforeAll(async () => {
    // Clean up the test user from the database
    await User.deleteMany({}); 

    // Create an admin
    user = new User({ ...userData, role:'admin' });
    await user.save();

    const loginRes = await request(app).post('/api/auth/login').send(userData);

    token = loginRes.body.token;
  });

  afterAll(async () => {
    await mongoose.connection.close();    
  });

  it('should failed due to validation rules', async () => {
    const res = await request(app)
      .post('/api/admin/locations')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Main Street Parking',
        address: '123 Main St',
        capacity: 100,
        // hourlyRate: 2.5,
        latitude:45.5,
        longitude:24.5
      });
      
    expect(res.statusCode).toEqual(403);
    expect(res.body).toHaveProperty('status', 'error');
    expect(res.body).toHaveProperty('errors');
  });

  it('should add a new parking location', async () => {
    const res = await request(app)
      .post('/api/admin/locations')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Main Street Parking',
        address: '123 Main St',
        capacity: 100,
        hourlyRate: 2.5,
        latitude:45.5,
        longitude:24.5
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('name', 'Main Street Parking');
  });

  it('should update pricing for a location', async () => {

    const location = new ParkingLocation({
      name: 'Main Street Parking',
      address: '123 Main St',
      capacity: 100,
      hourlyRate: 2.5,
      latitude:45.5,
      longitude:24.5
    });

    const savedLocation = await location.save();
    
    const res = await request(app)
      .put(`/api/admin/locations/${savedLocation.id}/pricing`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        hourlyRate: 3.0
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('hourlyRate', 3);
  });

});
