import React, { useState } from 'react';
import './Distance.css'

function IntermalleolarDistance({ patientName, results }) {
  const [idistance, setIdistance] = useState(null);

  if (!results?.poseLandmarks) {
    return null; // Return null if landmarks are not available
  }

  const landmarks = results.poseLandmarks;

  const rightAnkle = landmarks[28]; 
  const leftAnkle = landmarks[27]; 
  const rightElbow = landmarks[14];
  const rightWrist = landmarks[16]; 


  function getScalingFactor() {
    // actual Distance from elbow to Wrist will be different for different persons
    const actualDistanceElbowtoWrist = 26
    const distanceinpixels = Math.sqrt(
      Math.pow(rightElbow.x - rightWrist.x, 2) + 
      Math.pow(rightElbow.y - rightWrist.y, 2)
    );
    console.log("distanceinpixelsofelbowwrist", distanceinpixels)
    // const sc = actualDistanceElbowtoWrist/distanceinpixels
    return actualDistanceElbowtoWrist/distanceinpixels;

  }

  function calculateDistance() {
    // Calculate the Euclidean distance between the two ankle landmarks
    const distance = Math.sqrt(
      Math.pow(rightAnkle.x - leftAnkle.x, 2) + 
      Math.pow(rightAnkle.y - leftAnkle.y, 2)
    );
    const sc = getScalingFactor();
    console.log(sc)
    const distanceInCm = distance * sc; // scaling factor 
    console.log("distanceinCm", distanceInCm)

    setIdistance(distanceInCm.toFixed(2)); // Set the distance with two decimal places
  }
  
  function saveMeasurement() {
    const data = {
      Name : patientName,
      intermalleolar: idistance,
    };

    fetch('http://localhost:3001/intermalleolar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        alert('Measurement saved successfully');
        console.log('Success:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  return (
    <div className='intermalleolarpage'>
      <h3>Intermalleolar Distance</h3>
      <div className='measureButtons'>
        <div className='mbuttons'>
        <button onClick={calculateDistance}>Calculate Intermalleolar Distance</button>
        {idistance &&  <p>Intermalleolar Distance: {idistance} cm</p>}
        {/* <p>Intermalleolar Distance: {idistance}</p>  */}
        </div>
      </div>
      <button onClick={saveMeasurement} disabled={!idistance}>Save Measurement</button>
    </div>
  );
}

export default IntermalleolarDistance;