import React, { useState, useCallback } from 'react';
import './Distance.css';

function IntermalleolarDistance({ patientName, results }) {
  const [distanceCm, setDistanceCm] = useState(null);
  const [feedback, setFeedback] = useState('');

  // Always declare hooks at the top, before any early return!
  const getScalingFactor = useCallback((rightElbow, rightWrist) => {
    const actualDistanceElbowtoWrist = 26; // cm
    const distanceInPixels = Math.hypot(
      rightElbow.x - rightWrist.x,
      rightElbow.y - rightWrist.y
    );
    if (!distanceInPixels) {
      setFeedback('Scaling factor calculation failed (bad landmarks)');
      return null;
    }
    return actualDistanceElbowtoWrist / distanceInPixels;
  }, []);

  const calculateDistance = useCallback((leftAnkle, rightAnkle, rightElbow, rightWrist) => {
    const sc = getScalingFactor(rightElbow, rightWrist);
    if (!sc) return;
    const ankleDistPx = Math.hypot(
      rightAnkle.x - leftAnkle.x,
      rightAnkle.y - leftAnkle.y
    );
    const distanceInCm = +(ankleDistPx * sc).toFixed(2);
    setDistanceCm(distanceInCm);
    setFeedback('');
  }, [getScalingFactor]);

  const saveMeasurement = useCallback(async () => {
    if (!distanceCm) {
      setFeedback('Please calculate the distance before saving.');
      return;
    }
    try {
      const res = await fetch('http://localhost:3001/intermalleolar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          Name: patientName,
          intermalleolar: distanceCm,
        }),
      });
      if (!res.ok) throw new Error('Failed to save');
      setFeedback('Measurement saved successfully!');
    } catch (error) {
      setFeedback('Error saving measurement.');
    }
  }, [distanceCm, patientName]);

  // Get landmarks only after hooks
  const landmarks = results?.poseLandmarks;
  const rightAnkle = landmarks?.[28];
  const leftAnkle = landmarks?.[27];
  const rightElbow = landmarks?.[14];
  const rightWrist = landmarks?.[16];

  // Early return is now AFTER all hooks
  if (!landmarks || !rightAnkle || !leftAnkle || !rightElbow || !rightWrist) return null;

  const onCalculateDistance = () => {
    calculateDistance(leftAnkle, rightAnkle, rightElbow, rightWrist);
  };

  return (
    <div className='intermalleolarpage'>
      <h3>Intermalleolar Distance</h3>
      <div className='measureButtons'>
        <div className='mbuttons'>
          <button onClick={onCalculateDistance}>Calculate Intermalleolar Distance</button>
          {distanceCm !== null && (
            <p>Intermalleolar Distance: {distanceCm} cm</p>
          )}
        </div>
      </div>
      <button onClick={saveMeasurement} disabled={distanceCm === null}>
        Save Measurement
      </button>
      {feedback && (
        <div style={{ marginTop: 10, color: feedback.includes('success') ? 'green' : 'red' }}>
          {feedback}
        </div>
      )}
    </div>
  );
}

export default IntermalleolarDistance;