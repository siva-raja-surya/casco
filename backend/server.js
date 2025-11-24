const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cosco_receipts')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/requests', require('./routes/requests'));

// Health Check
app.get('/', (req, res) => {
  res.send('COSCO Receipt Portal API is running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});