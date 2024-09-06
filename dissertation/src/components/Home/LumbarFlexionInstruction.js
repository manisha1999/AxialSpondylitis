import React from 'react';
import './Home.css'

const LumbarFlexionInstruction = ({ show, onClose }) => {
  return (
    <div className="modal-backdrop">
        <div className="modal-content">
          <h2>Lumbar Flexion Instructions</h2>
          <ul>
        <li>Stand straight with your feet shoulder-width apart.</li>
        <li>Slowly bend forward at the waist, keeping your legs straight.</li>
        <li>Try to reach your hands as far down your legs as possible without bending your knees.</li>
        <li>Hold the position for a moment, then return to the starting position.</li>
        <li>Repeat the movement to measure the maximum lumbar flexion.</li>
      </ul>
      <p>Ensure that your movements are slow and controlled to avoid injury.</p>
          <button onClick={onClose}>Close</button>
        </div>
        </div>
     
      
  )
}

export default LumbarFlexionInstruction