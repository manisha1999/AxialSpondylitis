// routes/rotations.js
const express = require('express');
const router = express.Router();
const CervicalRotation = require('../models/CervicalRotation'); // Import the model

// POST route to save a new rotation
router.post('/cervicalrotation', async (req, res) => {
  console.log("Received data:", req.body);  // Log the request body to the console first
  

  try {
    const rotation = new CervicalRotation({
      Name : req.body.Name,
      leftRotationAngle: req.body.leftRotationAngle,
      rightRotationAngle: req.body.rightRotationAngle
    });

    const savedRotation = await rotation.save(); // Save the rotation data
    res.status(201).send(savedRotation); // Send back the saved rotation data as response

  } catch (error) {
    console.error("Error saving rotation:", error);
    res.status(400).send(error); // Send error response if something goes wrong
  }
});

// GET route to fetch all cervical rotations
router.get('/getcervicalrotation', async (req, res) => {
  try {
    const rotations = await CervicalRotation.find({});
    res.status(200).send(rotations);
  } catch (error) {
    console.error("Error fetching rotations:", error);
    res.status(500).send(error);
  }
});


module.exports = router;
