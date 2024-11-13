const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reservationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Reservation', required: true },
  amount: { type: Number, required: true },
  paymentDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['paid', 'failed', 'pending'], default: 'pending' },
  method: { type: String, enum: ['credit_card', 'paypal'], required: true },
});

module.exports = mongoose.model('Payment', paymentSchema);
