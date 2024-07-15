import styles from './index.module.scss';
import { useMemo, useRef, useState } from 'react';
import useWebcam from './hooks/use-webcam';
import useBarcodeDetector from './hooks/use-barcode-detector';
import useFaceDetector from './hooks/use-face-detector';
import useTextDetector from './hooks/use-text-detector';
import BarcodeResult from './result/barcode';
import FaceResult from './result/face';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import TextResult from './result/text';

export default function ShapeDetectionAPIs() {
  const [alignment, setAlignment] = useState('face');
  const videoWrapperRef = useRef(null);
  const { videoRef, stream, startWebcam, stopWebcam } = useWebcam();
  const {
    isBarcodeDetectorEnabled,
    barcodes,
    startBarcodeDetection,
    stopBarcodeDetection,
    initBarcodeTimer,
  } = useBarcodeDetector({ videoRef });
  const {
    isFaceDetectorEnabled,
    faces,
    startFaceDetection,
    stopFaceDetection,
    initFaceTimer,
  } = useFaceDetector({ videoRef });
  const {
    isTextDetectorEnabled,
    texts,
    startTextDetection,
    stopTextDetection,
    initTextTimer,
  } = useTextDetector({ videoRef });

  const handleChange = (_, newAlignment) => {
    setAlignment(newAlignment);
  }

  const handleStartWebcam = () => startWebcam();

  const handleStopWebcam = () => {
    stopWebcam();
    if (alignment === 'barcode') {
      stopBarcodeDetection();
    } else if (alignment === 'face') {
      stopFaceDetection();
    } else if (alignment === 'text') {
      stopTextDetection();
    }
  }

  const handleLoadedMetadata = () => {
    videoRef.current.play();
    if (alignment === 'barcode') {
      initBarcodeTimer();
      startBarcodeDetection();
    } else if (alignment === 'face') {
      initFaceTimer();
      startFaceDetection();
    } else if (alignment === 'text') {
      initTextTimer();
      startTextDetection();
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
      <div ref={videoWrapperRef} className={styles.videoWrapper}>
        <video ref={videoRef} className={styles.video} muted={true} onLoadedMetadata={handleLoadedMetadata} />
        {alignment === 'barcode' ? (
          <BarcodeResult barcodes={barcodes} />
        ) : alignment === 'face' ? (
          <FaceResult faces={faces} videoRef={videoRef} videoWrapperRef={videoWrapperRef} />
        ) : alignment === 'text' ? (
          <TextResult texts={texts} videoRef={videoRef} videoWrapperRef={videoWrapperRef} />
        ) : null}
      </div>
      <button className="button" onClick={handleStartWebcam}>Start Webcam</button>
      <button className="button" onClick={handleStopWebcam}>Stop Webcam</button>
    </div>
  )
}