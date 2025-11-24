
const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
  partyName: { 
    type: String, 
    required: true,
    uppercase: true 
  },
  email: { 
    type: String, 
    required: true 
  },
  utrNo: { 
    type: String, 
    required: true 
  },
  invoiceAmount: { 
    type: Number, 
    required: true 
  },
  caseType: { 
    type: String, 
    enum: ['Export', 'Import', 'Others', 'Security Deposit'], 
    required: true 
  },
  invoiceNo: { 
    type: String 
  },
  mblNo: { 
    type: String,
    // Validate that mblNo is present if caseType is Export
    required: function() { return this.caseType === 'Export'; }
  },
  status: { 
    type: String, 
    enum: ['Pending', 'Processed', 'Rejected'], 
    default: 'Pending' 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Request', RequestSchema);
