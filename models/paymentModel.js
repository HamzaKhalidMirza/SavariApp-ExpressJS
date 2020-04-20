const mongoose = require('mongoose');
const validator = require('validator');

const paymentSchema = new mongoose.Schema(
    {
        method: {
            type: String,
            require: [true, "Please provide payment method"],
            enum: {
                values: ['Cash', 'Credit Card', 'Debit Card'],
                message: 'Payment Method is either: Cash, Credit or Debit Card'
            }
        },
        isPaid: {
            type: boolean,
            default: false
        },
        totalFare: Number,
        totalPaid: Number,
        createdAt: {
            type: Date,
            default: Date.now(),
            select: false
        }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;