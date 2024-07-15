import { useMemo } from 'react';
import styles from './face.module.scss';

export default function FaceResult(props) {
  const { faces } = props;

  const getFaceRectStyle = (face) => {
    const { boundingBox, landmarks } = face;
    const { width, height, left, right, bottom, top, x, y } = boundingBox;
    return {
      width: `${width}px`,
      height: `${height}px`,
      left: `${left}px`,
      top: `${top}px`,
    }
  };

  return (
    <div className={styles.container}>
      {faces.map((face, idx) => (
        <div key={idx} className={styles.face} style={getFaceRectStyle(face)} />
      ))}
    </div>
  )
}