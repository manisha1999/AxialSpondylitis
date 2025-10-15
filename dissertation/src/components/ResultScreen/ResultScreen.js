import React, { useState, useEffect, useMemo } from 'react';
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
  const [overallBasmiScores, setOverallBasmiScores] = useState([]);

  // BASMI scoring utilities
  const getCervicalRotationScore = (angle) => {
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
  };

  const getLumbarSideFlexionScore = (flexion) => {
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
  };

  const getIntermalleolarDistanceScore = (distance) => {
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
  };

  // Data fetching
  useEffect(() => {
    const fetchData = async () => {
      const cervicalRes = await fetch('http://localhost:3001/getcervicalrotation');
      const cervicalData = await cervicalRes.json();
      setCervicalRotations(cervicalData);

      const lumbarRes = await fetch('http://localhost:3001/getflexions');
      const lumbarData = await lumbarRes.json();
      setLumbarFlexions(lumbarData);

      const intermalleolarRes = await fetch('http://localhost:3001/intermalleolardistances');
      const intermalleolarData = await intermalleolarRes.json();
      setIntermalleolarDistances(intermalleolarData);
    };
    fetchData();
  }, []);

  // Compute BASMI scores only where Name is common to all three datasets
  const computedBasmiScores = useMemo(() => {
    if (!cervicalRotations.length || !lumbarFlexions.length || !intermalleolarDistances.length) {
      return [];
    }
    const cervicalNames = new Set(cervicalRotations.map(item => item.Name));
    const lumbarNames = new Set(lumbarFlexions.map(item => item.Name));
    const intermalleolarNames = new Set(intermalleolarDistances.map(item => item.Name));

    const commonNames = [...cervicalNames].filter(
      name => lumbarNames.has(name) && intermalleolarNames.has(name)
    );

    return commonNames.map(name => {
      const cervical = cervicalRotations.find(item => item.Name === name);
      const lumbar = lumbarFlexions.find(item => item.Name === name);
      const intermalleolar = intermalleolarDistances.find(item => item.Name === name);

      const cervicalScore = getCervicalRotationScore(
        ((cervical?.leftRotationAngle ?? 0) + (cervical?.rightRotationAngle ?? 0)) / 2
      );
      const lumbarScore = getLumbarSideFlexionScore(
        ((lumbar?.flexionLeft ?? 0) + (lumbar?.flexionRight ?? 0)) / 2
      );
      const intermalleolarScore = getIntermalleolarDistanceScore(
        intermalleolar?.IntermalleolarDistance ?? 0
      );
      const overallBasmiScores = ((cervicalScore + lumbarScore + intermalleolarScore) / 3).toFixed(2);
      return {
        name,
        cervical: cervicalScore,
        lumbar: lumbarScore,
        intermalleolar: intermalleolarScore,
        overallBasmiScores: overallBasmiScores,
      };
    });
  }, [cervicalRotations, lumbarFlexions, intermalleolarDistances]);

  // Keep scores in state for future extensibility (optional, or remove if unused)
  useEffect(() => {
    setOverallBasmiScores(computedBasmiScores);
  }, [computedBasmiScores]);
  
  return (
    <div>
      <Navbar />
      <div className='resultScreen'>
        <h1>Measurement Results</h1>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
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
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
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
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
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
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Overall BASMI Results</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div className="accordionBox">
              <div className="dataContainer">
                {computedBasmiScores.map((score, index) => (
                  <div key={index} className="dataBox">
                    <p><strong>Name:</strong> {score.name}</p>
                    <p><strong>Cervical Score:</strong> {score.cervical}</p>
                    <p><strong>Lumbar Score:</strong> {score.lumbar}</p>
                    <p><strong>Intermalleolar Score:</strong> {score.intermalleolar}</p>
                    <p><strong>Overall BASMI Score:</strong> {score.overallBasmiScores}</p>
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