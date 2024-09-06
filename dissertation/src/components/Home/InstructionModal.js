import './Home.css';

const InstructionModal = ({ show, onClose }) => {
    if (!show) return null;
  
    return (
      <div className="modal-backdrop">
        <div className="modal-content">
          <h2>Cervical Rotation Instructions</h2>
          <ul>
            <li>Sit upright with your back straight.</li>
            <li>Start with your head in a neutral position, looking straight ahead.</li>
            <li>Slowly turn your head to the left as far as comfortable, ensuring your shoulders remain still.</li>
            <li>Return to the center position and then turn your head to the right to the same extent.</li>
            <li>Do not force your neck beyond its natural range of motion, and stop if you feel any discomfort.</li>
          </ul>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    );
};

export default InstructionModal;
