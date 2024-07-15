import { useEffect, useRef, useState } from "react";

export default function useBarcodeDetector(props) {
  const { videoRef } = props;
  const [isBarcodeDetectorEnabled, setIsBarcodeDetectorEnabled] = useState(false);
  const [barcodeDetector, setBarcodeDetector] = useState(null);
  const [barcodes, setBarcodes] = useState([]);
  const timerRef = useRef(null);

  useEffect(() => {
    initBarcodeDetector();
  }, []);

  const initBarcodeDetector = () => {
    if (!window.BarcodeDetector) return;
    setIsBarcodeDetectorEnabled(true);
    const barcodeDetector = new window.BarcodeDetector({
      // (Optional) A series of barcode formats to search for.
      // Not all formats may be supported on all platforms
      formats: [
        'aztec',
        'code_128',
        'code_39',
        'code_93',
        'codabar',
        'data_matrix',
        'ean_13',
        'ean_8',
        'itf',
        'pdf417',
        'qr_code',
        'upc_a',
        'upc_e'
      ]
    });
    setBarcodeDetector(barcodeDetector)
  }
  
  const startBarcodeDetection = async () => {
    if (!barcodeDetector) return;
    const barcodes = await barcodeDetector.detect(videoRef.current);
    // console.log('Count of detected barcodes:', barcodes.length);
    if (barcodes.length) {
      setBarcodes(barcodes);
    } else {
      setBarcodes([]);
    }
    if (timerRef.current) {
      timerRef.current = setTimeout(startBarcodeDetection, 10);
    }
  }

  const stopBarcodeDetection = async () => {
    if (!barcodeDetector) return;
    // clear states
    setTimeout(() => setBarcodes([]), 100);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }

  const initBarcodeTimer = () => {
    timerRef.current = true;
  }

  return {
    isBarcodeDetectorEnabled,
    barcodes,
    startBarcodeDetection,
    stopBarcodeDetection,
    initBarcodeTimer,
  }
}