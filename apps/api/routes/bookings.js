const express = require('express');
const { authProtect, adminProtect } = require('../middlewares/auth');
const Booking = require('../models/Booking');

const router = express.Router();

// Get Current User Bookings
router.get('/mybookings', authProtect, async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id }).populate('service', 'name description duration price');
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Admin: Get All Bookings
router.get('/allbookings', authProtect, adminProtect, async (req, res) => {
    try {
        const bookings = await Booking.find({}).populate('user', 'name email').populate('service', 'name description duration price');
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create Booking
router.post('/', authProtect, async (req, res) => {
    const { service, date } = req.body;

    try {
        const booking = await Booking.create({
            user: req.user._id,
            service,
            date,
        });

        res.status(201).json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Cancel Booking
router.put('/:id/cancel', authProtect, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (booking && booking.user.toString() === req.user._id.toString()) {
            booking.status = 'canceled';
            const updatedBooking = await booking.save();
            res.json(updatedBooking);
        } else {
            res.status(404).json({ message: 'Booking not found or unauthorized' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Admin: Manage Booking Status
router.put('/:id/status', authProtect, adminProtect, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (booking) {
            booking.status = req.body.status || booking.status;
            const updatedBooking = await booking.save();
            res.json(updatedBooking);
        } else {
            res.status(404).json({ message: 'Booking not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
