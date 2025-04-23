const mongoose = require('mongoose');

const IntermalleolarSchema = new mongoose.Schema({
  Name :{
    type: String,
    required: true
  },
  IntermalleolarDistance: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const Intermalleolar = mongoose.model('Intermalleolar', IntermalleolarSchema);

module.exports = Intermalleolar;
