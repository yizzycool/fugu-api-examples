import { useEffect, useRef, useState } from "react";

export default function useFaceDetector(props) {
  const { videoRef } = props;
  const [isFaceDetectorEnabled, setIsFaceDetectorEnabled] = useState(false);
  const [faceDetector, setFaceDetector] = useState(null);
  const [faces, setFaces] = useState([]);
  const timerRef = useRef(null);

  useEffect(() => {
    initFaceDetector();
  }, []);

  const initFaceDetector = () => {
    if (!('FaceDetector' in window)) return;
    setIsFaceDetectorEnabled(true);
    const faceDetector = new window.FaceDetector({
      // (Optional) Hint to try and limit the amount of detected faces
      // on the scene to this maximum number.
      maxDetectedFaces: 5,
      // (Optional) Hint to try and prioritize speed over accuracy
      // by, e.g., operating on a reduced scale or looking for large features.
      fastMode: false
    });
    setFaceDetector(faceDetector);
  }
  
  const startFaceDetection = async () => {
    if (!faceDetector) return;
    const faces = await faceDetector.detect(videoRef.current);
    console.log('Count of detected faces:', faces.length)
    if (faces.length) {
      setFaces(faces);
    } else {
      setFaces([]);
    }
    if (timerRef.current) {
      timerRef.current = setTimeout(startFaceDetection, 10);
    }
  }

  const stoptFaceDetection = async () => {
    if (!faceDetector) return;
    // clear states
    setTimeout(() => setFaces([]), 100);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }

  const initFaceTimer = () => {
    timerRef.current = true;
  }

  return {
    isFaceDetectorEnabled,
    faces,
    startFaceDetection,
    stoptFaceDetection,
    initFaceTimer,
  }
}