const Payment = require('../models/Payment');

// Process payment
exports.processPayment = async (req, res) => {
  const { userId, reservationId, amount, method } = req.body;
  try {
    const payment = new Payment({ userId, reservationId, amount, method, status: 'pending' });
    await payment.save();

    // Here, integrate with a payment gateway (e.g., Stripe, PayPal)

    // On successful payment
    payment.status = 'paid';
    await payment.save();

    res.status(200).json({ message: 'Payment successful', payment });
  } catch (err) {
    res.status(500).json({ message: 'Error processing payment.', error: err });
  }
};
