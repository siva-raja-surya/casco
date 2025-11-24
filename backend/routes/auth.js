const router = require('express').Router();
const User = require('../models/User');
const Otp = require('../models/Otp');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// --- ADMIN AUTH ---

// Admin Login
router.post('/admin/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET || 'fallback_secret', 
      { expiresIn: '1d' }
    );
    
    res.json({ 
      token, 
      user: { email: user.email, role: user.role } 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin Register (For setup only - ideally remove or protect this in production)
router.post('/admin/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const newUser = new User({ email, password: hashedPassword });
    const savedUser = await newUser.save();
    
    res.json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- USER OTP AUTH ---

// Send OTP
router.post('/otp/send', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  try {
    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Upsert: Update if exists, Insert if new
    await Otp.findOneAndUpdate(
      { email }, 
      { otp, createdAt: Date.now() }, 
      { upsert: true, new: true }
    );
    
    // In a real application, integrate with Nodemailer/SendGrid here
    console.log(`[MOCK EMAIL SERVICE] OTP for ${email}: ${otp}`); 
    
    res.json({ message: 'OTP sent successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Verify OTP
router.post('/otp/verify', async (req, res) => {
  const { email, otp } = req.body;
  try {
    const validOtp = await Otp.findOne({ email, otp });
    
    if (!validOtp) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }
    
    // Optional: Delete OTP after usage to prevent replay
    // await Otp.deleteOne({ _id: validOtp._id });

    res.json({ message: 'Verification successful', verified: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;