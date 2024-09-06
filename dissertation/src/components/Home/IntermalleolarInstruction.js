import React from 'react';
import './Home.css'

const IntermalleolarInstruction = ({ show, onClose }) => {
  return (
    <div className="modal-backdrop">
        <div className="modal-content">
          <h2>Intermalleolar Distance Instructions</h2>
          <ul>
      <li>Stand with your feet as close together as possible, ensuring that both heels are touching.</li>
      <li>Keep your legs straight, but do not force them to touch if there's discomfort.</li>
      <li>The intermalleolar distance is the distance between the medial (inner) sides of your ankles.</li>
      <li>Ensure you are standing straight and balanced while the measurement is taken.</li>
      <li>A camera or other measuring tools can be used to measure the distance.</li>

    <p>This measurement is often used in clinical settings to assess the degree of leg alignment.</p>
    </ul>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
  )
}

export default IntermalleolarInstruction