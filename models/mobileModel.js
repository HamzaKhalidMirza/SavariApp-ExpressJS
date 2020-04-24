const mongoose = require('mongoose');
const crypto = require('crypto');
const randomGenerator = require("randomatic");

const mobileSchema = new mongoose.Schema(
    {
        phone: {
            type: String,
            required: [true, 'Please provide your phone'],
            unique: true
        },
        mobileCodeToken: String,
        mobileCodeExpires: Date,
        countryCode: String
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

mobileSchema.methods.createMobileCode = function () {
    const verificationCode = randomGenerator("0", 6);

    this.mobileCodeToken = crypto
        .createHash('sha256')
        .update(verificationCode)
        .digest('hex');

    this.mobileCodeExpires = Date.now() + 10 * 60 * 1000;

    return verificationCode;
};

const Mobile = mongoose.model('Mobile', mobileSchema);

module.exports = Mobile;