
const mongoose = require('mongoose');

const InvoiceMblSchema = new mongoose.Schema({
  Amount: Number,
  Payer_Name: String,
  Bank_Transaction_No: String, // Corresponds to UTR
  Remark: String,
  BL_No: String,               // Corresponds to MBL NO
  Invoice_No: String           // Corresponds to Invoice No
}, { collection: 'invoice_mbl' }); // Explicitly bind to existing collection

module.exports = mongoose.model('InvoiceMbl', InvoiceMblSchema);
