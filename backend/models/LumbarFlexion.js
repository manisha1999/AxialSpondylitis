const mongoose = require('mongoose');

const FlexionSchema = new mongoose.Schema({
  Name :{
    type: String,
    required: true
  },
  flexionLeft: {
    type: Number,
    required: true
  },
  flexionRight: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const Flexion = mongoose.model('Flexion', FlexionSchema);

module.exports = Flexion;
