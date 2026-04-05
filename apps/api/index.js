const express = require('express');
const cors = require('cors');
const connectDB = require('./utils/db');
require('dotenv').config();

const app = express();

const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/services', require('./routes/services'));
app.use('/api/bookings', require('./routes/bookings'));

// Main Root Route
app.get('/', (req, res) => {
    res.json({ message: 'Service Booking MVP API is running...' });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
