const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

dotenv.config();
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Import routes
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes'); 
const parkingRoutes = require('./routes/parkingRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

// Middleware for routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes); 
app.use('/api/parking', parkingRoutes);
app.use('/api/payment', paymentRoutes);

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Parking app is running' });
});

app.use((req, res) => {
    res.status(404).json({ message: 'Page Not Found'});
});

// Enable Mongoose debug mode
if(process.env.ENV === 'development'){
  mongoose.set('debug', true);
}

mongoose.connect(process.env.MONGO_URI)
  .catch(err => console.log(err));

module.exports = app;
