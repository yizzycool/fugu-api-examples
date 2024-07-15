import styles from './index.module.scss';
import { useState } from 'react';
import useWebcam from './hooks/use-webcam';
import useBarcodeDetector from './hooks/use-barcode-detector';
import useFaceDetector from './hooks/use-face-detector';
import BarcodeResult from './result/barcode';
import FaceResult from './result/face';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';

export default function ShapeDetection() {
  const [alignment, setAlignment] = useState('face');
  const { videoRef, stream, startWebcam, stopWebcam } = useWebcam();
  const {
    isBarcodeDetectorEnabled,
    barcodes,
    startBarcodeDetection,
    stoptBarcodeDetection,
    initBarcodeTimer,
  } = useBarcodeDetector({ videoRef });
  const {
    isFaceDetectorEnabled,
    faces,
    startFaceDetection,
    stoptFaceDetection,
    initFaceTimer,
  } = useFaceDetector({ videoRef });

  const handleChange = (_, newAlignment) => {
    setAlignment(newAlignment);
  }

  const handleStartWebcam = () => startWebcam();

  const handleStopWebcam = () => {
    stopWebcam();
    if (alignment === 'barcode') {
      stoptBarcodeDetection();
    } else if (alignment === 'face') {
      stoptFaceDetection();
    } else if (alignment === 'text') {
      // TODO: stop text detection
    }
  }

  const handleLoadedMetadata = () => {
    videoRef.current.play();
    if (alignment === 'barcode') {
      initBarcodeTimer();
      detectBarcode();
    } else if (alignment === 'face') {
      initFaceTimer();
      startFaceDetection();
    } else if (alignment === 'text') {
      // TODO: stop text detection
    }
  }

  return (
    <div className={styles.container}>
      <ToggleButtonGroup
        color="primary"
        value={alignment}
        exclusive
        onChange={handleChange}
        aria-label="Platform"
      >
        <ToggleButton value="barcode">Barcode Detector</ToggleButton>
        <ToggleButton value="face">Face Detector</ToggleButton>
        <ToggleButton value="text">Text Detector</ToggleButton>
      </ToggleButtonGroup>
      <div className={styles.videoWrapper}>
        <video ref={videoRef} className={styles.video} muted={true} onLoadedMetadata={handleLoadedMetadata} />
        {alignment === 'barcode' ? (
          <BarcodeResult barcodes={barcodes} />
        ) : alignment === 'face' ? (
          <FaceResult faces={faces} />
        ) : alignment === 'text' ? (
          <div />
        ) : null}
      </div>
      <button className="button" onClick={handleStartWebcam}>Start Webcam</button>
      <button className="button" onClick={handleStopWebcam}>Stop Webcam</button>
    </div>
  )
}