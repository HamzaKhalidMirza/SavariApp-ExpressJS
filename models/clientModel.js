const mongoose = require('mongoose');
const validator = require('validator');

const clientSchema = new mongoose.Schema({
  username: {
        type: String,
        trim: true,
        maxlength: [30, 'Username must have less or equal then 30 characters'],
        minlength: [5, 'Username must have more or equal then 5 characters'],
        validate: [validator.isAlphanumeric, 'Please provide a valid username. Only characters and numbers are allowed.']
    }
});
