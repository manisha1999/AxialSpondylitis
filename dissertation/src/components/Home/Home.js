import React, { useRef, useEffect, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import CervicalRotation from '../Cervical_Rotation/CervicalRotation';
import { Pose, POSE_CONNECTIONS } from "@mediapipe/pose";
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import IntermalleolarDistance from "../IntermalleolarDistance/IntermalleolarDistance";
import LumbarFlexion from '../Lumbar_Flexiom/Lumbar_Flexion';
import Navbar from '../Navbar/Navbar';
import leftImage from './left_cervical_rotation.jpeg';
import rightImage from './right_cervical_rotation.jpeg';
import imDistance from './inter_m_distance.jpeg';
import LSFStraight from './lumbar_flexion_straight.jpeg';
import LSFLeft from './lumbar_side_flexion_left.jpeg';
import LSFRight from './lumbar_side_flexion_right.jpeg';
import InstructionModal from './InstructionModal';
import LumbarFlexionInstruction from './LumbarFlexionInstruction';
import IntermalleolarInstruction from './IntermalleolarInstruction';
import './Home.css';

const poseOptions = {
  modelComplexity: 1,
  smoothLandmarks: true,
  enableSegmentation: true,
  smoothSegmentation: true,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
};

const Home1 = () => {
  const canvasRef = useRef(null);
  const webcamRef = useRef(null);

  // Group UI state into one object for clarity
  const [uiState, setUiState] = useState({
    webcamEnabled: false,
    uploadedImageButton: false,
    activeComponent: null,
    showCervicalInstructions: false,
    showLumbarFlexionInstructions: false,
    showIntermalleolarInstructions: false
  });

  const [patientName, setPatientName] = useState('');
  const [image, setImage] = useState(null);
  const [poseLandmarker, setPoseLandmarker] = useState(null);
  const [results, setResults] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);

  // Consolidated handler for toggling UI sections and instructions
  const setActiveSection = (section) => {
    setUiState({
      webcamEnabled: false,
      uploadedImageButton: false,
      activeComponent: section,
      showCervicalInstructions: false,
      showLumbarFlexionInstructions: false,
      showIntermalleolarInstructions: false
    });
  };

  const handleNameChange = (event) => setPatientName(event.target.value);

  const detectPoseLandmarks = useCallback(
    async (imageSrc) => {
      if (!poseLandmarker) {
        console.log("Pose Landmarker is not loaded yet.");
        return;
      }
      const imageElement = new window.Image();
      imageElement.src = imageSrc;
      imageElement.onload = async () => {
        await poseLandmarker.send({ image: imageElement });
      };
    },
    [poseLandmarker]
  );

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setImage(imageSrc);
      detectPoseLandmarks(imageSrc);
      setUiState((prev) => ({ ...prev, webcamEnabled: false }));
    }
  }, [detectPoseLandmarks]);

  useEffect(() => {
    const loadPoseLandmarker = async () => {
      const pose = new Pose({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
      });
      pose.setOptions(poseOptions);
      pose.onResults(drawPoseLandmarks);
      setPoseLandmarker(pose);
    };
    loadPoseLandmarker();
    // eslint-disable-next-line
  }, []);

  const drawPoseLandmarks = (results) => {
    setResults(results);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (webcamRef.current && webcamRef.current.video) {
      canvas.width = webcamRef.current.video.videoWidth;
      canvas.height = webcamRef.current.video.videoHeight;
    } else if (results.image) {
      canvas.width = results.image.width;
      canvas.height = results.image.height;
    } else {
      return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
    if (results.poseLandmarks) {
      drawConnectors(ctx, results.poseLandmarks, POSE_CONNECTIONS, {
        color: '#00FF00',
        lineWidth: 4
      });
      drawLandmarks(ctx, results.poseLandmarks, {
        color: '#FF0000',
        lineWidth: 2
      });
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageSrc = URL.createObjectURL(file);
      setUploadedImage(imageSrc);
      detectPoseLandmarks(imageSrc);
    }
  };

  // Unified handlers for enabling webcam or upload
  const handleWebcamToggle = (enable) => {
    setUiState((prev) => ({
      ...prev,
      webcamEnabled: enable,
      uploadedImageButton: !enable
    }));
  };

  // Instruction modal handlers
  const handleInstruction = (type) => {
    setUiState((prev) => ({
      ...prev,
      showCervicalInstructions: type === "cervical",
      showLumbarFlexionInstructions: type === "lumbar",
      showIntermalleolarInstructions: type === "intermalleolar"
    }));
  };

  // Recapture logic
  const handleRecapture = () => {
    setImage(null);
    setResults(null);
    setUiState((prev) => ({ ...prev, webcamEnabled: true }));
    capture();
  };

  const clearImage = () => setImage(null);

  const saveImage = () => {
    if (!image) return;
    const img = new window.Image();
    img.src = image;

    img.onload = () => {
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      tempCanvas.width = img.width;
      tempCanvas.height = img.height;
      tempCtx.drawImage(img, 0, 0);
      const imageDataUrl = tempCanvas.toDataURL('image/jpeg');
      const link = document.createElement('a');
      link.href = imageDataUrl;
      link.download = 'captured_image.jpg';
      link.click();
    };
  };

  return (
    <>
      <Navbar />
      <div className='main'>
        <div className='Name'>
          <h3>Enter the Patient Name</h3>
          <input 
            type="text" 
            placeholder="Name" 
            value={patientName} 
            onChange={handleNameChange}
          />
        </div>
        <div className='measurements'>
          <button onClick={() => setActiveSection('CervicalRotation')}>Cervical Rotation</button>
          <button onClick={() => setActiveSection('LumbarFlexion')}>Lumbar Side Flexion</button>
          <button onClick={() => setActiveSection('IntermalleolarDistance')}>Intermalleolar Distance</button>
        </div>
        {!uiState.webcamEnabled && !uiState.uploadedImageButton && (
          <div>
            <button onClick={() => handleWebcamToggle(true)}>Enable Webcam</button>
            <button onClick={() => handleWebcamToggle(false)}>Upload Image</button>
          </div>
        )}
        {uiState.webcamEnabled && (
          <>
            <Webcam
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              style={{ width: '100%', height: '480px' }}
            />
            <div className='cameraButtons' style={{ display: 'flex' }}>
              <button onClick={capture}>Capture Photo</button>
              <button onClick={() => handleWebcamToggle(false)}>Disable Webcam</button>
            </div>
          </>
        )}
        {uiState.uploadedImageButton && (
          <>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            {uploadedImage && (
              <div>
                <img src={uploadedImage} alt="uploaded" style={{ display: 'none' }} />
                <canvas ref={canvasRef} style={{ width: '640px', height: '480px' }} />
                <button onClick={() => handleWebcamToggle(true)}>Enable Webcam</button>
              </div>
            )}
          </>
        )}
        {image && (
          <div>
            <img src={image} alt="captured" style={{ display: 'none' }} />
            <canvas ref={canvasRef} style={{ width: '640px', height: '480px' }} />
            <div className='handlebutton'>
              <button onClick={handleRecapture}>Recapture Image</button>
              <button onClick={clearImage}>Clear Image</button>
              <button onClick={saveImage}>Save Image</button>
            </div>
          </div>
        )}
        {uiState.activeComponent === 'CervicalRotation' && (
          <div>
            <div className='imagesData'>
              <div className='iPoses'>
                <img src={leftImage} alt="Left Cervical Rotation" />
                <p>Pose for Left Rotation</p>
              </div>
              <div className='iPoses'>
                <img src={rightImage} alt="Right Cervical Rotation" />
                <p>Pose for Right Rotation</p>
              </div>
            </div>
            <div className='instruction'>
              <button className='instruction' onClick={() => handleInstruction("cervical")}>See Instructions</button>
            </div>
            {uiState.showCervicalInstructions && <InstructionModal show={uiState.showCervicalInstructions} onClose={() => handleInstruction("")} />}
            <CervicalRotation patientName={patientName} results={results} />
          </div>
        )}
        {uiState.activeComponent === 'IntermalleolarDistance' && (
          <div>
            <div className='imagesData'>
              <div>
                <img src={imDistance} alt="Intermalleolar Distance" />
                <p>Pose for Intermalleolar Distance</p>
              </div>
            </div>
            <div className='instruction'>
              <button className='instruction' onClick={() => handleInstruction("intermalleolar")}>See Instructions</button>
            </div>
            {uiState.showIntermalleolarInstructions && <IntermalleolarInstruction show={uiState.showIntermalleolarInstructions} onClose={() => handleInstruction("")} />}
            <IntermalleolarDistance patientName={patientName} results={results} />
          </div>
        )}
        {uiState.activeComponent === 'LumbarFlexion' && (
          <div>
            <div className='imagesData'>
              <div className='iPoses'>
                <img src={LSFStraight} alt="Lumbar Flexion Straight" />
                <p>Pose for Lumbar Flexion Straight</p>
              </div>
              <div className='iPoses'>
                <img src={LSFLeft} alt="Lumbar flexion Right" />
                <p>Pose for Lumbar Flexion Right</p>
              </div>
              <div className='iPoses'>
                <img src={LSFRight} alt="Lumbar flexion Left" />
                <p>Pose for Lumbar Flexion Left</p>
              </div>
            </div>
            <div className='instruction'>
              <button className='instruction' onClick={() => handleInstruction("lumbar")}>See Instructions</button>
            </div>
            {uiState.showLumbarFlexionInstructions && <LumbarFlexionInstruction show={uiState.showLumbarFlexionInstructions} onClose={() => handleInstruction("")} />}
            <LumbarFlexion patientName={patientName} results={results} />
          </div>
        )}
      </div>
      <footer>
        <p>@ BASMI Detection</p>
      </footer>
    </>
  );
};

export default Home1;