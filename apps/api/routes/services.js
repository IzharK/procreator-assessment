const express = require('express');
const { authProtect, adminProtect } = require('../middlewares/auth');
const Service = require('../models/Service');

const router = express.Router();

// List All Services
router.get('/', async (req, res) => {
    try {
        const services = await Service.find({}).populate('admin', 'name email');
        res.json(services);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get Service by ID
router.get('/:id', async (req, res) => {
    try {
        const service = await Service.findById(req.params.id).populate('admin', 'name email');
        if (service) {
            res.json(service);
        } else {
            res.status(404).json({ message: 'Service not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create Service (Admin)
router.post('/', authProtect, adminProtect, async (req, res) => {
    const { name, description, duration, price } = req.body;

    try {
        const service = await Service.create({
            name,
            description,
            duration,
            price,
            admin: req.user._id,
        });

        res.status(201).json(service);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update Service (Admin)
router.put('/:id', authProtect, adminProtect, async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);

        if (service) {
            service.name = req.body.name || service.name;
            service.description = req.body.description || service.description;
            service.duration = req.body.duration || service.duration;
            service.price = req.body.price || service.price;

            const updatedService = await service.save();
            res.json(updatedService);
        } else {
            res.status(404).json({ message: 'Service not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete Service (Admin)
router.delete('/:id', authProtect, adminProtect, async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);

        if (service) {
            await service.deleteOne();
            res.json({ message: 'Service removed' });
        } else {
            res.status(404).json({ message: 'Service not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
