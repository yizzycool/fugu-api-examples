import { Fragment } from 'react';
import styles from './face.module.scss';

export default function FaceResult(props) {
  const { faces, videoRef, videoWrapperRef } = props;

  const getVideoRatio = () => {
    const videoWidth = videoRef?.current?.videoWidth || 1;
    const videoWrapperWidth = videoWrapperRef?.current?.clientWidth || 1;
    return videoWrapperWidth / videoWidth;
  };

  const getFaceRectStyle = (face) => {
    const { boundingBox, landmarks } = face;
    const { width, height, left, right, bottom, top, x, y } = boundingBox;
    const videoRatio = getVideoRatio();
    return {
      width: `${width * videoRatio}px`,
      height: `${height * videoRatio}px`,
      left: `${left * videoRatio}px`,
      top: `${top * videoRatio}px`,
    }
  };

  const getLocationStyle = (location) => {
    const { x, y } = location;
    const videoRatio = getVideoRatio();
    return {
      left: `${x * videoRatio}px`,
      top: `${y * videoRatio}px`,
    }
  };

  return (
    <div className={styles.container}>
      {faces.map((face, idx) => (
        <Fragment key={idx}>
          <div key={idx} className={styles.face} style={getFaceRectStyle(face)} />
          {face.landmarks.map((landmark, subIdx) => (
            <Fragment key={subIdx}>
              {landmark.locations.map((location, tinyIdx) => (
                <div key={tinyIdx} className={styles.location} style={getLocationStyle(location)} />
              ))}
            </Fragment>
          ))}
        </Fragment>
      ))}
    </div>
  )
}