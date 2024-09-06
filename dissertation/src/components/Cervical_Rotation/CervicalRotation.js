import React, { useState } from 'react';
import './cervical.css'

function CervicalRotation({ patientName,results }) {
  // Initialize state at the top level of your component
  const [leftRotationAngle, setLeftRotationAngle] = useState(null);
  const [rightRotationAngle, setRightRotationAngle] = useState(null);

  if (!results?.poseLandmarks) {
    return ; // Handle the case when landmarks are not available
  }

  const landmarks = results.poseLandmarks;
  const nose = landmarks[0];
  const leftEar = landmarks[3];
  const rightEar = landmarks[4];
  const leftShoulder = landmarks[11];
  const rightShoulder = landmarks[12];

  function calculateAngle(ear, shoulder, nose) {
    const deltaX = ear.x - shoulder.x;
    const deltaY = ear.y - shoulder.y;
    const earShoulderDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    const noseEarDistance = Math.sqrt(Math.pow(ear.x - nose.x, 2) + Math.pow(ear.y - nose.y, 2));
    const noseShoulderDistance = Math.sqrt(Math.pow(shoulder.x - nose.x, 2) + Math.pow(shoulder.y - nose.y, 2));

    // find the angle at the ear
    const angle = Math.acos((Math.pow(noseEarDistance, 2) + Math.pow(earShoulderDistance, 2) - Math.pow(noseShoulderDistance, 2)) / (2 * noseEarDistance * earShoulderDistance));
    return angle * (180 / Math.PI);  // Convert radians to degrees

  }

  function handleRightRotation() {
    // const angle = calculateAngle(rightEar, rightShoulder, nose);
    // setRightRotationAngle(angle.toFixed(2));
    const angle = calculateAngle(leftEar, leftShoulder, nose);
    setLeftRotationAngle(angle.toFixed(2));
  }

  function handleLeftRotation() {
    const angle = calculateAngle(rightEar, rightShoulder, nose);
    setRightRotationAngle(angle.toFixed(2));
    // const angle = calculateAngle(leftEar, leftShoulder, nose);
    // setLeftRotationAngle(angle.toFixed(2));
  }
  

  function saveMeasurement() {
    const data = {
      Name : patientName,
      leftRotationAngle: leftRotationAngle,
      rightRotationAngle: rightRotationAngle
    };

    fetch('http://localhost:3001/cervicalrotation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
      alert('Measurement saved successfully');
      console.log('Success:', data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }

  return (
    <div>
      <div className='rotations'>
      <h3>Cervical Rotation Angles</h3>
      <div className='measureButtons'>
      <div className='mbuttons'>
      <button onClick={handleLeftRotation}>Calculate Left Rotation Angle</button>
      {rightRotationAngle && <p>Left Rotation Angle: {rightRotationAngle}°</p>}
      </div>  
      <div className='mbuttons'>
      <button onClick={handleRightRotation}>Calculate Right Rotation Angle</button>
      {leftRotationAngle && <p>Right Rotation Angle: {leftRotationAngle}°</p>}
      </div>
      </div>
      </div>
      <button onClick={saveMeasurement}>Save Measurements</button>
    </div>
  );
}

export default CervicalRotation;
