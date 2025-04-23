const mongoose = require('mongoose');

const RotationSchema = new mongoose.Schema({
  Name :{
    type: String,
    required: true
  },
  
  leftRotationAngle: {
    type: Number,
    required: true
  },
  rightRotationAngle: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const Rotation = mongoose.model('Rotation', RotationSchema);

module.exports = Rotation;
