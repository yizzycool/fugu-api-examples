import { useEffect, useRef, useState } from "react";

export default function useTextDetector(props) {
  const { videoRef } = props;
  const [isTextDetectorEnabled, setIsTextDetectorEnabled] = useState(false);
  const [textDetector, setTextDetector] = useState(null);
  const [texts, setTexts] = useState([]);
  const timerRef = useRef(null);

  useEffect(() => {
    initTextDetector();
  }, []);

  const initTextDetector = () => {
    if (!window.TextDetector) return;
    setIsTextDetectorEnabled(true);
    const textDetector = new window.TextDetector();
    setTextDetector(textDetector);
  }
  
  const startTextDetection = async () => {
    if (!textDetector) return;
    const texts = await textDetector.detect(videoRef.current);
    console.log('Count of detected texts:', texts.length, texts.map(text => text.rawValue));
    if (texts.length) {
      setTexts(texts);
    } else {
      setTexts([]);
    }
    if (timerRef.current) {
      timerRef.current = setTimeout(startTextDetection, 10);
    }
  }

  const stopTextDetection = async () => {
    if (!textDetector) return;
    // clear states
    setTimeout(() => setTexts([]), 100);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }

  const initTextTimer = () => {
    timerRef.current = true;
  }

  return {
    isTextDetectorEnabled,
    texts,
    startTextDetection,
    stopTextDetection,
    initTextTimer,
  }
}