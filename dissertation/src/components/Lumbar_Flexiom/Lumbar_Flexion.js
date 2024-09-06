import React, { useState } from 'react';
import './Lumbar_Flexion.css';

function LumbarFlexion({patientName, results }) {
  const [initialRightIndexPosition, setInitialRightIndexPosition] = useState(null);
  const [extendedRightIndexPosition, setExtendedRightIndexPosition] = useState(null);
  const [initialLeftIndexPosition, setInitialLeftIndexPosition] = useState(null);
  const [extendedLeftIndexPosition, setExtendedLeftIndexPosition] = useState(null);
  const [differenceLeft, setdifferenceLeft] = useState(null);
  const [differenceRight, setdifferenceRight] = useState(null);
  const [scalingFactor,setScalingFactor] = useState(null);

  const [showInitialPosition, setShowInitialPosition] = useState(false);
  const [showExtendedLeftPosition, setShowExtendedLeftPosition] = useState(false);
  const [showExtendedRightPosition, setShowExtendedRightPosition] = useState(false);
  const [showFlexionLeft, setShowFlexionLeft] = useState(false);
  const [showFlexionRight, setShowFlexionRight] = useState(false);

  if (!results?.poseLandmarks) {
    return null;
  }

  const landmarks = results.poseLandmarks;

  const leftIndexFinger = landmarks[19];
  const rightIndexFinger = landmarks[20];
  const leftAnkle = landmarks[31];
  const rightAnkle = landmarks[32];
  const rightElbow = landmarks[14];
  const rightWrist = landmarks[16]; 

  function getScalingFactor() {
    // actual Distance from elbow to Wrist will be different for different persons
    const actualDistanceElbowtoWrist = 25
    const distanceinpixels = Math.sqrt(
      Math.pow(rightElbow.x - rightWrist.x, 2) + 
      Math.pow(rightElbow.y - rightWrist.y, 2)
    );
    console.log("distanceinpixelsofelbowwrist", distanceinpixels)
    setScalingFactor(actualDistanceElbowtoWrist/distanceinpixels);
  }

  function calculateDistance(point1, point2) {
    const distance = Math.sqrt(
      Math.pow(point1.x - point2.x, 2) + 
      Math.pow(point1.y - point2.y, 2)
    );
    const distanceInCm = distance * scalingFactor; 
    return distanceInCm;
  }

  function handleInitialDistance() {
    const d_left = calculateDistance(leftIndexFinger, leftAnkle);
    const d_right = calculateDistance(rightIndexFinger, rightAnkle);
    setInitialLeftIndexPosition(d_left);
    setInitialRightIndexPosition(d_right);
    setShowInitialPosition(true);
  }

  function handleLeftExtendedDistance() {
    const d_left = calculateDistance(leftIndexFinger, leftAnkle);
    setExtendedLeftIndexPosition(d_left);
    setShowExtendedLeftPosition(true);
  }

  function handleRightExtendedDistance() {
    const d_right = calculateDistance(rightIndexFinger, rightAnkle);
    setExtendedRightIndexPosition(d_right);
    setShowExtendedRightPosition(true);
  }

  function diffLeft() {
    const ldiff = initialLeftIndexPosition - extendedLeftIndexPosition;
    setdifferenceLeft(ldiff);
    setShowFlexionLeft(true);
  }

  function diffRight() {
    const rdiff = initialRightIndexPosition - extendedRightIndexPosition;
    setdifferenceRight(rdiff);
    setShowFlexionRight(true);
  }

  function saveMeasurement() {
    const data = {
      Name : patientName,
      flexionLeft: differenceLeft,
      flexionRight: differenceRight,
    };

    fetch('http://localhost:3001/lumbarflexion', {
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
    <div className='lumbar'>
      <h3>Lumbar Flexion Measurement</h3>
      <button onClick={getScalingFactor}>Set Scaling Factor</button>
      <div className="measureButtons">
        <div className="mbuttons">
          <button onClick={handleInitialDistance}>Set Initial Position(cm)</button>
          {showInitialPosition && (
            <>
              <p>Initial Right Index Position: {initialRightIndexPosition} cm</p>
              <p>Initial Left Index Position: {initialLeftIndexPosition} cm</p>
            </>
          )}
        </div>
        <div className="mbuttons">
          <button onClick={handleLeftExtendedDistance}>Distance after bent to Left Side</button>
          {showExtendedLeftPosition && (
            <>
              <p>Extended Left Index Position: {extendedLeftIndexPosition} cm</p>
            </>
          )}
        </div>
        <div className="mbuttons">
          <button onClick={handleRightExtendedDistance}>Distance after bent to Right Side</button>
          {showExtendedRightPosition && (
            <>
              <p>Extended Right Index Position: {extendedRightIndexPosition} cm</p>
            </>
          )}
        </div>
        <div className="mbuttons">
          <button onClick={diffLeft}>Flexion Left</button>
          {showFlexionLeft && (
            <>
              <p>Flexion Left: {differenceLeft} cm</p>
            </>
          )}
        </div>
        <div className="mbuttons">
          <button onClick={diffRight}>Flexion Right</button>
          {showFlexionRight && (
            <>
              <p>Flexion Right: {differenceRight} cm</p>
            </>
          )}
        </div>
      </div>
      <button onClick={saveMeasurement}>Save Flexions</button>
    </div>
  );
}

export default LumbarFlexion;