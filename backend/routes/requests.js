const router = require('express').Router();
const Request = require('../models/Request');
const jwt = require('jsonwebtoken');

// Middleware to check JWT
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ message: 'Access Denied' });

  try {
    // Verify the token using the secret from env
    const verified = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid Token' });
  }
};

// Create New Request (Public) - No Middleware needed here
router.post('/', async (req, res) => {
  try {
    const newRequest = new Request(req.body);
    const savedRequest = await newRequest.save();
    res.status(201).json(savedRequest);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get All Requests (Admin Only) - Protected by authMiddleware
router.get('/', authMiddleware, async (req, res) => {
  try {
    const requests = await Request.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Request Status (Admin Only) - Protected by authMiddleware
router.patch('/:id/status', authMiddleware, async (req, res) => {
  const { status } = req.body;
  if (!['Pending', 'Processed', 'Rejected'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  try {
    const updatedRequest = await Request.findByIdAndUpdate(
      req.params.id, 
      { status }, 
      { new: true }
    );
    res.json(updatedRequest);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;