import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar/Navbar';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';
import './ResultScreen.css';

function ResultScreen() {
  const [cervicalRotations, setCervicalRotations] = useState([]);
  const [lumbarFlexions, setLumbarFlexions] = useState([]);
  const [intermalleolarDistances, setIntermalleolarDistances] = useState([]);

  const [cervicalbasmiScores, setCervicalBasmiScores] = useState([]);
  const [flexionbasmiScores, setFlexionBasmiScores] = useState([]);
  const [intermalleolarbasmiScores, setintermalleolarBasmiScores] = useState([]);
  const [overallBasmiScores, setOverallBasmiScores] = useState([]);

  function getCervicalRotationScore(angle) {
    if (angle >= 85) return 0;
    if (angle >= 76.6) return 1;
    if (angle >= 68.1) return 2;
    if (angle >= 59.6) return 3;
    if (angle >= 51.1) return 4;
    if (angle >= 42.6) return 5;
    if (angle >= 34.1) return 6;
    if (angle >= 25.6) return 7;
    if (angle >= 17.1) return 8;
    if (angle >= 8.6) return 9;
    return 10;
  }

  function getLumbarSideFlexionScore(flexion) {
    if (flexion >= 20) return 0;
    if (flexion >= 18) return 1;
    if (flexion >= 15.9) return 2;
    if (flexion >= 13.8) return 3;
    if (flexion >= 11.7) return 4;
    if (flexion >= 9.6) return 5;
    if (flexion >= 7.5) return 6;
    if (flexion >= 5.4) return 7;
    if (flexion >= 3.3) return 8;
    if (flexion >= 1.2) return 9;
    return 10;
  }

  function getIntermalleolarDistanceScore(distance) {
    if (distance >= 120) return 0;
    if (distance >= 110) return 1;
    if (distance >= 100) return 2;
    if (distance >= 90) return 3;
    if (distance >= 80) return 4;
    if (distance >= 70) return 5;
    if (distance >= 60) return 6;
    if (distance >= 50) return 7;
    if (distance >= 40) return 8;
    if (distance >= 30) return 9;
    return 10;
  }

  useEffect(() => {
    const fetchData = async () => {
      const fetchCervical = await fetch('http://localhost:3001/getcervicalrotation');
      const cervicalData = await fetchCervical.json();
      setCervicalRotations(cervicalData);

      const fetchLumbar = await fetch('http://localhost:3001/getflexions');
      const lumbarData = await fetchLumbar.json();
      setLumbarFlexions(lumbarData);

      const fetchIntermalleolar = await fetch('http://localhost:3001/intermalleolardistances');
      const intermalleolarData = await fetchIntermalleolar.json();
      setIntermalleolarDistances(intermalleolarData);

      // Calculate BASMI scores
      const computedScores = cervicalData.map((item, index) => {
        const cervicalScore = getCervicalRotationScore((item.leftRotationAngle + item.rightRotationAngle) / 2);
        const lumbarScore = getLumbarSideFlexionScore((lumbarData[index].flexionLeft + lumbarData[index].flexionRight) / 2);
        const intermalleolarScore = getIntermalleolarDistanceScore(intermalleolarData[index].IntermalleolarDistance);
        const overallScore = ((cervicalScore + lumbarScore + intermalleolarScore) / 3).toFixed(2);
        return {
          name: item.Name,
          cervical: cervicalScore,
          lumbar: lumbarScore,
          intermalleolar: intermalleolarScore,
          overall: overallScore,
        };
      });
      setCervicalBasmiScores(computedScores.cervical);
      setFlexionBasmiScores(computedScores.lumbar);
      setintermalleolarBasmiScores(computedScores.intermalleolar);
      setOverallBasmiScores(computedScores);
    };

    fetchData();
  }, []);

  return (
    <div>
      <Navbar />
      <div className='resultScreen'>
        <h1>Measurement Results</h1>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1-content" id="panel1-header">
            <Typography>Cervical Rotation Results</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {cervicalRotations.map((rotation, index) => (
              <Typography key={index}>
                Name: {rotation.Name}, Left: {rotation.leftRotationAngle}°, Right: {rotation.rightRotationAngle}°
              </Typography>
            ))}
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel2-content" id="panel2-header">
            <Typography>Lumbar Flexion Results</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {lumbarFlexions.map((flexion, index) => (
              <Typography key={index}>
                Name: {flexion.Name}, Left Flexion: {flexion.flexionLeft} cm, Right Flexion: {flexion.flexionRight} cm
              </Typography>
            ))}
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel3-content" id="panel3-header">
            <Typography>Intermalleolar Distance Results</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {intermalleolarDistances.map((distance, index) => (
              <Typography key={index}>
                Name: {distance.Name}, Distance: {distance.IntermalleolarDistance} cm
              </Typography>
            ))}
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel4-content" id="panel4-header">
            <Typography>Overall BASMI Results</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div className="accordionBox">
            <div className="dataContainer">
              {overallBasmiScores.map((score, index) => (
                <div key={index} className="dataBox">
                  <p><strong>Name:</strong> {score.name}</p>
                  <p><strong>Cervical Score:</strong> {score.cervical}</p>
                  <p><strong>Lumbar Score:</strong> {score.lumbar}</p>
                  <p><strong>Intermalleolar Score:</strong> {score.intermalleolar}</p>
                  <p><strong>Overall BASMI Score:</strong> {score.overall}</p>
                </div>
              ))}
            </div>
    </div>
          </AccordionDetails>
        </Accordion>
      </div>
    </div>
  );
}

export default ResultScreen;
