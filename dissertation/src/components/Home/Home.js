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

const Home1 = () => {
  const canvasRef = useRef(null);
  const webcamRef = useRef(null);
  const [patientName, setPatientName] = useState('');
  const [image, setImage] = useState(null);
  const [poseLandmarker, setPoseLandmarker] = useState(null);
  const [results, setResults] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [webcamEnabled, setWebcamEnabled] = useState(false);
  const [uploadedImageButton, setUploadedImageButton] = useState(false);
  const [activeComponent, setActiveComponent] = useState(null);
  const [showCervicalInstructions, setShowCervicalInstructions] = useState(false);
  const [showLumbarFlexionInstructions, setShowLumbarFlexionInstructions] = useState(false);
  const [showIntermalleolarInstructions, setShowIntermalleolarInstructions] = useState(false);

  const handleNameChange = (event) => {
    setPatientName(event.target.value); // Update the state with the input value
  };

  const detectPoseLandmarks = useCallback(
    async (imageSrc) => {
      if (!poseLandmarker) {
        console.log("Pose Landmarker is not loaded yet.");
        return;
      }

      const imageElement = new Image();
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
      setWebcamEnabled(false); 
    }
  }, [webcamRef, detectPoseLandmarks]);

  useEffect(() => {
    const loadPoseLandmarker = async () => {
      const pose = new Pose({
        locateFile: (file) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
        }
      });

      pose.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        enableSegmentation: true,
        smoothSegmentation: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      });

      pose.onResults((results) => {
        drawPoseLandmarks(results);
      });

      setPoseLandmarker(pose);
    };

    loadPoseLandmarker();
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

  const handleEnableWebcam = () => {
    setWebcamEnabled(true);
    setUploadedImageButton(false);
  };

  const handleDisableWebcam = () => {
    setWebcamEnabled(false);
  };

  const handleUploadedImageButton = () => {
    setUploadedImageButton(true);
    setWebcamEnabled(false);
  };

  const handleCervicalRotation = () => {
    setActiveComponent(activeComponent === 'CervicalRotation' ? null : 'CervicalRotation');
    setWebcamEnabled(false);
    setUploadedImageButton(false);
    setShowCervicalInstructions(false);
    setShowLumbarFlexionInstructions(false);
    setShowIntermalleolarInstructions(false);
  };
  const handleIntermalleolarDistance = () => {
    setActiveComponent(activeComponent === 'IntermalleolarDistance' ? null : 'IntermalleolarDistance');
    setWebcamEnabled(false);
    setUploadedImageButton(false);
    setShowCervicalInstructions(false);
    setShowLumbarFlexionInstructions(false);
    setShowIntermalleolarInstructions(false);
  };
  const handleLumbarFlexion = () => {
    setActiveComponent(activeComponent === 'LumbarFlexion' ? null : 'LumbarFlexion');
    setWebcamEnabled(false);
    setUploadedImageButton(false);
    setShowCervicalInstructions(false);
    setShowLumbarFlexionInstructions(false);
    setShowIntermalleolarInstructions(false);
  };

  // New function to handle recapture
  const handleRecapture = () => {
    setImage(null);
    setResults(null);
    setWebcamEnabled(true);
    capture();
  };

  const clearImage = () => {
    setImage(null);
  };

  const handleCervicalInstruction = () => {
    setShowCervicalInstructions(true);
    setShowLumbarFlexionInstructions(false);
    setShowIntermalleolarInstructions(false);
  };

  const handleLumbarFlexionInstruction = () => {
    setShowCervicalInstructions(false);
    setShowLumbarFlexionInstructions(true);
    setShowIntermalleolarInstructions(false);
  };

  const handleIntermalleolarInstruction = () => {
    setShowCervicalInstructions(false);
    setShowLumbarFlexionInstructions(false);
    setShowIntermalleolarInstructions(true);
  };

  const saveImage = () => {
    if (!image) return;

    // Create an image element to hold the captured image
    const img = new Image();
    img.src = image;

    img.onload = () => {
      // Create a temporary canvas to draw the image onto
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');

      // Set canvas size to match the image size
      tempCanvas.width = img.width;
      tempCanvas.height = img.height;

      // Draw the image onto the temporary canvas
      tempCtx.drawImage(img, 0, 0);

      // Get the data URL of the canvas content (image without landmarks)
      const imageDataUrl = tempCanvas.toDataURL('image/jpeg');

      // Create a link element to trigger the download
      const link = document.createElement('a');
      link.href = imageDataUrl;
      link.download = 'captured_image.jpg'; // Name of the saved file

      // Programmatically trigger a click on the link to download the image
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
            onChange={handleNameChange}  // Capture the input value
          />
        </div>
        <div className='measurements'>
          <button onClick={handleCervicalRotation}>Cervical Rotation</button>
          <button onClick={handleLumbarFlexion}>Lumbar Side Flexion</button>
          <button onClick={handleIntermalleolarDistance}>Intermalleolar Distance</button>
        </div>
        {!webcamEnabled && !uploadedImageButton && (
          <div>
            <button onClick={handleEnableWebcam}>Enable Webcam</button>
            <button onClick={handleUploadedImageButton}>Upload Image</button>
          </div>
        )}
        {webcamEnabled && (
          <>
            <Webcam
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              style={{ width: '100%', height: '480px' }}
            />
            <div className='cameraButtons' style={{ display: 'flex' }}>
              <div>
                <button onClick={capture}>Capture Photo</button>
              </div>
              <div>
                <button onClick={handleDisableWebcam}>Disable Webcam</button>
              </div>
            </div>
          </>
        )}
        {uploadedImageButton && (
          <>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            {uploadedImage && (
              <div>
                <img src={uploadedImage} alt="uploaded" style={{ display: 'none' }} />
                <canvas ref={canvasRef} style={{ width: '640px', height: '480px' }} />
                <button onClick={handleEnableWebcam}>Enable Webcam</button>
                {/* <button onClick={clearImage}>clearImage</button> */}
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
        {activeComponent === 'CervicalRotation' && (
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
            <button className='instruction' onClick={handleCervicalInstruction}>See Instructions</button>
            </div>
            {showCervicalInstructions && <InstructionModal show={showCervicalInstructions} onClose={() => setShowCervicalInstructions(false)} />}
            <CervicalRotation patientName={patientName} results={results} />
          </div>
        )}

        {activeComponent === 'IntermalleolarDistance' && (
          <div>
            <div className='imagesData'>
              <div>
                <img src={imDistance} alt="Intermalleolar Distance" />
                <p>Pose for Intermalleolar Distance</p>
              </div>
            </div>
            <div className='instruction'>
            <button className='instruction' onClick={handleIntermalleolarInstruction}>See Instructions</button>
            </div>
            {showIntermalleolarInstructions && <IntermalleolarInstruction show={showIntermalleolarInstructions} onClose={() => setShowIntermalleolarInstructions(false)} />}
            <IntermalleolarDistance patientName={patientName} results={results} />
          </div>
        )}

        {activeComponent === 'LumbarFlexion' && (
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
            <button className='instruction' onClick={handleLumbarFlexionInstruction}>See Instructions</button>
            </div>
            {showLumbarFlexionInstructions && <LumbarFlexionInstruction show={showLumbarFlexionInstructions} onClose={() => setShowLumbarFlexionInstructions(false)} />}
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
