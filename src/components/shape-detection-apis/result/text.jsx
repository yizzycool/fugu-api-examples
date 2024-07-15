import { useMemo } from 'react';
import styles from './text.module.scss';

export default function TextResult(props) {
  const { texts, videoRef, videoWrapperRef } = props;

  const getVideoRatio = () => {
    const videoWidth = videoRef?.current?.videoWidth || 1;
    const videoWrapperWidth = videoWrapperRef?.current?.clientWidth || 1;
    return videoWrapperWidth / videoWidth;
  };

  const getTextRectStyle = (text) => {
    const { boundingBox, cornerPoints, rawValue } = text;
    const { width, height, left, right, bottom, top, x, y } = boundingBox;
    const videoRatio = getVideoRatio();
    return {
      width: `${width * videoRatio}px`,
      height: `${height * videoRatio}px`,
      left: `${left * videoRatio}px`,
      top: `${top * videoRatio}px`,
    }
  };

  return (
    <div className={styles.container}>
      {texts.map((text, idx) => (
        <div key={idx} className={styles.text} style={getTextRectStyle(text)} />
      ))}
    </div>
  )
}