import { useEffect, useRef, useState } from 'react';
import styles from './index.module.scss';

const constraintObj = {
  audio: false,
  video: {
      facingMode: "user",
      width: { min: 640, ideal: 1280, max: 1920 },
      height: { min: 480, ideal: 720, max: 1080 }
  }
}

export default function ShapeDetection() {
  const [stream, setStream] = useState(null);
  const [barcodeDetector, setBarcodeDetector] = useState(null);
  const [barcodes, setBarcodes] = useState([]);
  const videoRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    setBarcodeDetector(new BarcodeDetector());
  }, []);

  const handleStartWebcam = async () => {
    const stream = await navigator.mediaDevices.getUserMedia(constraintObj);
    if ("srcObject" in videoRef.current) {
      videoRef.current.srcObject = stream;
    } else {
      videoRef.current.src = window.URL.createObjectURL(stream);
    }
    setStream(stream);
  }

  const handleStopWebcam = () => {
    if (!stream) return;
    stream.getTracks().forEach(function(track) {
      track.stop();
    });
    videoRef.current.pause();
    // clear states
    setStream(null);
    setBarcodes([]);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }

  const handleLoadedMetadata = () => {
    videoRef.current.play();
    timerRef.current = true;
    detectBarcode();
  }

  const detectBarcode = async () => {
    const barcodes = await barcodeDetector.detect(videoRef.current);
    console.log('length', barcodes.length)
    if (barcodes.length) {
      setBarcodes(barcodes);
      // barcodes.forEach((barcode) => {
      //   const rawValue = barcode.rawValue;
      //   console.log(rawValue);
      // });
    } else {
      setBarcodes([]);
    }
    if (timerRef.current) {
      timerRef.current = setTimeout(detectBarcode, 100);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.videoWrapper}>
        <video ref={videoRef} className={styles.video} muted={true} onLoadedMetadata={handleLoadedMetadata} />
        <div className={styles.barcodes}>
          {barcodes.map((barcode, idx) => (
            <div key={idx} className={styles.barcode}>{barcode.rawValue}</div>
          ))}
        </div>
      </div>
      <button className="button" onClick={handleStartWebcam}>Start Webcam</button>
      <button className="button" onClick={handleStopWebcam}>Stop Webcam</button>
    </div>
  )
}