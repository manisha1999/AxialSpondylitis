// routes/rotations.js
const express = require('express');
const router = express.Router();
const LumbarFlexion = require('../models/LumbarFlexion'); // Import the model

// POST route to save a new rotation
router.post('/lumbarflexion', async (req, res) => {
  console.log("Received data:", req.body);  // Log the request body to the console first
  

  try {
    const flexion = new LumbarFlexion({
      Name : req.body.Name,
      flexionLeft: req.body.flexionLeft,
      flexionRight: req.body.flexionRight
    });

    const savedFlexion = await flexion.save(); // Save the rotation data
    res.status(201).send(savedFlexion); // Send back the saved rotation data as response

  } catch (error) {
    console.error("Error saving rotation:", error);
    res.status(400).send(error); // Send error response if something goes wrong
  }
});


router.get('/getflexions', async (req, res) => {
  try {
    const flexions = await LumbarFlexion.find({});
    res.status(200).send(flexions);
  } catch (error) {
    console.error("Error fetching flexions:", error);
    res.status(500).send(error);
  }
});


module.exports = router;
