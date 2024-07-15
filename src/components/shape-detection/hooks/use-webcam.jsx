import { useRef, useState } from "react";

const constraintObj = {
  audio: false,
  video: {
      facingMode: "user",
      width: { min: 640, ideal: 1280, max: 1920 },
      height: { min: 480, ideal: 720, max: 1080 }
  }
}

export default function useWebcam () {
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);

  const startWebcam = async () => {
    const stream = await navigator.mediaDevices.getUserMedia(constraintObj);
    if ("srcObject" in videoRef.current) {
      videoRef.current.srcObject = stream;
    } else {
      videoRef.current.src = window.URL.createObjectURL(stream);
    }
    setStream(stream);
  }

  const stopWebcam = () => {
    if (!stream) return;
    stream.getTracks().forEach(function(track) {
      track.stop();
    });
    videoRef.current.pause();
    videoRef.current.srcObject = null;
    // clear states
    setStream(null);
  }

  return {
    videoRef,
    stream,
    startWebcam,
    stopWebcam,
  }
}