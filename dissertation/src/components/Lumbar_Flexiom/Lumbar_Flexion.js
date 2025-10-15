import React, { useState, useCallback } from 'react';
import './Lumbar_Flexion.css';

function LumbarFlexion({ patientName, results }) {
  // All hooks at the top level
  const [positions, setPositions] = useState({
    initialLeft: null,
    initialRight: null,
    extendedLeft: null,
    extendedRight: null,
  });
  const [differences, setDifferences] = useState({
    left: null,
    right: null,
  });
  const [scalingFactor, setScalingFactor] = useState(null);
  const [show, setShow] = useState({
    initial: false,
    leftExtended: false,
    rightExtended: false,
    leftFlexion: false,
    rightFlexion: false,
  });
  const [feedback, setFeedback] = useState('');

  // useCallback hooks always at the top
  const getScalingFactor = useCallback((rightElbow, rightWrist) => {
    const actualDistanceElbowtoWrist = 25; // cm
    const distanceInPixels = Math.hypot(
      rightElbow.x - rightWrist.x,
      rightElbow.y - rightWrist.y
    );
    if (!distanceInPixels) {
      setFeedback('Scaling factor calculation failed: invalid landmark data.');
      return;
    }
    setScalingFactor(actualDistanceElbowtoWrist / distanceInPixels);
    setFeedback('Scaling factor set. Now measure initial positions.');
  }, []);

  const calculateDistance = useCallback(
    (point1, point2, scalingFactor) => {
      if (!scalingFactor) {
        setFeedback('Please set the scaling factor before measuring.');
        return null;
      }
      const distance = Math.hypot(point1.x - point2.x, point1.y - point2.y);
      return +(distance * scalingFactor).toFixed(2); // rounded to 2 decimals
    },
    []
  );

  // Landmarks can be undefined, so always declare hooks above
  const landmarks = results?.poseLandmarks;
  const leftIndexFinger = landmarks?.[19];
  const rightIndexFinger = landmarks?.[20];
  const leftAnkle = landmarks?.[31];
  const rightAnkle = landmarks?.[32];
  const rightElbow = landmarks?.[14];
  const rightWrist = landmarks?.[16];

  if (!landmarks) return null;

  // Button handlers
  const handleSetScalingFactor = () => {
    if (!rightElbow || !rightWrist) {
      setFeedback('Landmarks missing for scaling factor.');
      return;
    }
    getScalingFactor(rightElbow, rightWrist);
  };

  const handleInitialDistance = () => {
    if (!leftIndexFinger || !leftAnkle || !rightIndexFinger || !rightAnkle) {
      setFeedback('Landmarks missing for initial position.');
      return;
    }
    const dLeft = calculateDistance(leftIndexFinger, leftAnkle, scalingFactor);
    const dRight = calculateDistance(rightIndexFinger, rightAnkle, scalingFactor);
    if (dLeft === null || dRight === null) return;
    setPositions((prev) => ({ ...prev, initialLeft: dLeft, initialRight: dRight }));
    setShow((prev) => ({ ...prev, initial: true }));
    setFeedback('');
  };

  const handleLeftExtendedDistance = () => {
    if (!leftIndexFinger || !leftAnkle) {
      setFeedback('Landmarks missing for left extension.');
      return;
    }
    const dLeft = calculateDistance(leftIndexFinger, leftAnkle, scalingFactor);
    if (dLeft === null) return;
    setPositions((prev) => ({ ...prev, extendedLeft: dLeft }));
    setShow((prev) => ({ ...prev, leftExtended: true }));
    setFeedback('');
  };

  const handleRightExtendedDistance = () => {
    if (!rightIndexFinger || !rightAnkle) {
      setFeedback('Landmarks missing for right extension.');
      return;
    }
    const dRight = calculateDistance(rightIndexFinger, rightAnkle, scalingFactor);
    if (dRight === null) return;
    setPositions((prev) => ({ ...prev, extendedRight: dRight }));
    setShow((prev) => ({ ...prev, rightExtended: true }));
    setFeedback('');
  };

  const handleFlexion = (side) => {
    if (side === 'left') {
      if (positions.initialLeft == null || positions.extendedLeft == null) {
        setFeedback('Measure both initial and extended left positions first.');
        return;
      }
      setDifferences((prev) => ({
        ...prev,
        left: +(positions.initialLeft - positions.extendedLeft).toFixed(2),
      }));
      setShow((prev) => ({ ...prev, leftFlexion: true }));
      setFeedback('');
    } else {
      if (positions.initialRight == null || positions.extendedRight == null) {
        setFeedback('Measure both initial and extended right positions first.');
        return;
      }
      setDifferences((prev) => ({
        ...prev,
        right: +(positions.initialRight - positions.extendedRight).toFixed(2),
      }));
      setShow((prev) => ({ ...prev, rightFlexion: true }));
      setFeedback('');
    }
  };

  const saveMeasurement = async () => {
    if (differences.left == null || differences.right == null) {
      setFeedback('Please calculate both flexions before saving.');
      return;
    }
    try {
      const res = await fetch('http://localhost:3001/lumbarflexion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          Name: patientName,
          flexionLeft: differences.left,
          flexionRight: differences.right,
        }),
      });
      if (!res.ok) throw new Error('Failed to save');
      setFeedback('Measurement saved successfully!');
    } catch (err) {
      setFeedback('Error saving measurement.');
    }
  };

  // Helper to display values neatly
  const display = (val) => val ?? '--';

  return (
    <div className='lumbar'>
      <h3>Lumbar Flexion Measurement</h3>
      <button onClick={handleSetScalingFactor}>Set Scaling Factor</button>
      <div className="measureButtons">
        <div className="mbuttons">
          <button onClick={handleInitialDistance}>Set Initial Position (cm)</button>
          {show.initial && (
            <>
              <p>Initial Right Index Position: {display(positions.initialRight)} cm</p>
              <p>Initial Left Index Position: {display(positions.initialLeft)} cm</p>
            </>
          )}
        </div>
        <div className="mbuttons">
          <button onClick={handleLeftExtendedDistance}>Distance after bent to Left Side</button>
          {show.leftExtended && (
            <p>Extended Left Index Position: {display(positions.extendedLeft)} cm</p>
          )}
        </div>
        <div className="mbuttons">
          <button onClick={handleRightExtendedDistance}>Distance after bent to Right Side</button>
          {show.rightExtended && (
            <p>Extended Right Index Position: {display(positions.extendedRight)} cm</p>
          )}
        </div>
        <div className="mbuttons">
          <button onClick={() => handleFlexion('left')}>Flexion Left</button>
          {show.leftFlexion && (
            <p>Flexion Left: {display(differences.left)} cm</p>
          )}
        </div>
        <div className="mbuttons">
          <button onClick={() => handleFlexion('right')}>Flexion Right</button>
          {show.rightFlexion && (
            <p>Flexion Right: {display(differences.right)} cm</p>
          )}
        </div>
      </div>
      <button onClick={saveMeasurement}>Save Flexions</button>
      {feedback && <div style={{ marginTop: 10, color: feedback.includes('success') ? 'green' : 'red' }}>{feedback}</div>}
    </div>
  );
}

export default LumbarFlexion;