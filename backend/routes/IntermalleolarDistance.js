// routes/rotations.js
const express = require('express');
const router = express.Router();
const IntermalleolarDistance = require('../models/IntermalleolarDistance'); // Import the model

// POST route to save a new rotation
router.post('/intermalleolar', async (req, res) => {
   
  try {
    const intermalleolar = new IntermalleolarDistance({
      Name : req.body.Name,
        IntermalleolarDistance: req.body.intermalleolar
    });

    const savedIntermalleolar = await intermalleolar.save(); // Save the rotation data
    res.status(201).send(savedIntermalleolar); // Send back the saved rotation data as response

  } catch (error) {
    console.error("Error saving rotation:", error);
    res.status(400).send(error); // Send error response if something goes wrong
  }
});

// GET route to fetch all intermalleolar distances
router.get('/intermalleolardistances', async (req, res) => {
  try {
    const distance = await IntermalleolarDistance.find({});
    res.status(200).send(distance);
  } catch (error) {
    console.error("Error fetching intermalleolar distances:", error);
    res.status(500).send({ message: "Failed to fetch intermalleolar distances", error: error });
  }
});



module.exports = router;
