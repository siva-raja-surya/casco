
const router = require('express').Router();
const Request = require('../models/Request');
const InvoiceMbl = require('../models/InvoiceMbl');
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

// Create New Request (Public) - Includes Validation against InvoiceMbl
router.post('/', async (req, res) => {
  try {
    const { mblNo, invoiceNo, utrNo } = req.body;

    // --- 1. BLOCKING VALIDATION: MBL NO ---
    // If MBL is provided, every slash-separated value must exist in invoice_mbl.BL_No
    if (mblNo) {
      const mbls = mblNo.split('/').map(s => s.trim()).filter(s => s);
      if (mbls.length > 0) {
        // Find documents where BL_No matches any of the provided MBLs
        const foundDocs = await InvoiceMbl.find({ BL_No: { $in: mbls } }).select('BL_No');
        const foundSet = new Set(foundDocs.map(d => d.BL_No));

        // Identify which ones are missing
        const missingMbls = mbls.filter(m => !foundSet.has(m));
        
        if (missingMbls.length > 0) {
          return res.status(400).json({ 
            error: `Wrong number: The following MBL Numbers were not found in our records: ${missingMbls.join(', ')}` 
          });
        }
      }
    }

    // --- 2. BLOCKING VALIDATION: INVOICE NO ---
    // If Invoice is provided, every slash-separated value must exist in invoice_mbl.Invoice_No
    if (invoiceNo) {
      const invs = invoiceNo.split('/').map(s => s.trim()).filter(s => s);
      if (invs.length > 0) {
        const foundDocs = await InvoiceMbl.find({ Invoice_No: { $in: invs } }).select('Invoice_No');
        const foundSet = new Set(foundDocs.map(d => d.Invoice_No));

        const missingInvs = invs.filter(i => !foundSet.has(i));
        
        if (missingInvs.length > 0) {
          return res.status(400).json({ 
            error: `Wrong number: The following Invoice Numbers were not found in our records: ${missingInvs.join(', ')}` 
          });
        }
      }
    }

    // --- 3. STATUS DETERMINATION: UTR NO ---
    // Check UTRs against Bank_Transaction_No.
    // If ALL exist -> Status: 'Processed'
    // If ANY missing -> Status: 'In Progress'
    let initialStatus = 'In Progress'; 
    
    if (utrNo) {
      const utrs = utrNo.split('/').map(s => s.trim()).filter(s => s);
      if (utrs.length > 0) {
        const foundDocs = await InvoiceMbl.find({ Bank_Transaction_No: { $in: utrs } }).countDocuments();
        
        // If the count of found documents matches the number of provided UTRs, all are valid.
        if (foundDocs === utrs.length) {
          initialStatus = 'Processed';
        } else {
          initialStatus = 'In Progress';
        }
      }
    }

    // Create request with derived status
    const newRequest = new Request({
      ...req.body,
      status: initialStatus
    });

    const savedRequest = await newRequest.save();
    res.status(201).json(savedRequest);

  } catch (err) {
    console.error("Request creation error:", err);
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
  if (!['Pending', 'Processed', 'Rejected', 'In Progress'].includes(status)) {
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
