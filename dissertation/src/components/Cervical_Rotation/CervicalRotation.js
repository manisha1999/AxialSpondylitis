import React, { useState, useCallback } from 'react';
import './cervical.css';

function CervicalRotation({ patientName, results }) {
  const [angles, setAngles] = useState({ left: null, right: null });
  const [feedback, setFeedback] = useState('');

  // Always call hooks at top level!
  const calculateAngle = useCallback((ear, shoulder, nose) => {
    const deltaX = ear.x - shoulder.x;
    const deltaY = ear.y - shoulder.y;
    const earShoulderDistance = Math.hypot(deltaX, deltaY);

    const noseEarDistance = Math.hypot(ear.x - nose.x, ear.y - nose.y);
    const noseShoulderDistance = Math.hypot(shoulder.x - nose.x, shoulder.y - nose.y);

    const cosAngle = (
      (noseEarDistance ** 2 + earShoulderDistance ** 2 - noseShoulderDistance ** 2)
      / (2 * noseEarDistance * earShoulderDistance)
    );
    // Clamp to avoid NaN from floating point error
    const clampedCos = Math.max(-1, Math.min(1, cosAngle));
    const angle = Math.acos(clampedCos);
    return (angle * 180) / Math.PI;
  }, []);

  // Get landmarks (do NOT return early, just render null below if data is missing)
  const landmarks = results?.poseLandmarks;
  const nose = landmarks?.[0];
  const leftEar = landmarks?.[3];
  const rightEar = landmarks?.[4];
  const leftShoulder = landmarks?.[11];
  const rightShoulder = landmarks?.[12];

  const handleRotation = (side) => {
    if (!landmarks) {
      setFeedback('Pose landmarks not detected.');
      return;
    }
    let angle;
    if (side === 'left') {
      angle = calculateAngle(rightEar, rightShoulder, nose);
      setAngles((prev) => ({ ...prev, left: angle.toFixed(2) }));
    } else {
      angle = calculateAngle(leftEar, leftShoulder, nose);
      setAngles((prev) => ({ ...prev, right: angle.toFixed(2) }));
    }
    setFeedback('');
  };

  const saveMeasurement = async () => {
    if (!angles.left || !angles.right) {
      setFeedback('Please calculate both rotation angles before saving.');
      return;
    }
    try {
      const res = await fetch('http://localhost:3001/cervicalrotation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          Name: patientName,
          leftRotationAngle: angles.left,
          rightRotationAngle: angles.right
        })
      });
      if (!res.ok) throw new Error('Failed to save');
      setFeedback('Measurement saved successfully!');
    } catch (err) {
      setFeedback('Error saving measurement.');
    }
  };

  // Render null if poseLandmarks are not present
  if (!landmarks) return null;

  return (
    <div>
      <div className='rotations'>
        <h3>Cervical Rotation Angles</h3>
        <div className='measureButtons'>
          <div className='mbuttons'>
            <button onClick={() => handleRotation('left')}>Calculate Left Rotation Angle</button>
            {angles.left && <p>Left Rotation Angle: {angles.left}°</p>}
          </div>
          <div className='mbuttons'>
            <button onClick={() => handleRotation('right')}>Calculate Right Rotation Angle</button>
            {angles.right && <p>Right Rotation Angle: {angles.right}°</p>}
          </div>
        </div>
      </div>
      <button onClick={saveMeasurement}>Save Measurements</button>
      {feedback && (
        <div style={{ marginTop: "10px", color: feedback.includes('success') ? 'green' : 'red' }}>
          {feedback}
        </div>
      )}
    </div>
  );
}

export default CervicalRotation;