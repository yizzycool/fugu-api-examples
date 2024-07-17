import { useMemo, useRef } from 'react';
import styles from './screen-size-visualization.module.scss';
import _get from 'lodash/get';
import _sortBy from 'lodash/sortBy';
import _maxBy from 'lodash/maxBy';

// Only deal with 2 monitors and align horizontally
export default function ScreenSizeVisualization(props) {
  const { screenDetails } = props;
  const ref = useRef(null);

  const screens = useMemo(() => {
    return _get(screenDetails, 'screens', []);
  }, [screenDetails]);

  const sortedScreens = useMemo(() => {
    return _sortBy(screens, ['left', 'top']);
  }, [screens]);

  const maxWidth = useMemo(() => {
    return _get(_maxBy(screens, 'width'), 'width', 0);
  }, [screens]);

  const scale = useMemo(() => {
    const containerWidth = ref?.current?.clientWidth;
    return containerWidth / 2 / maxWidth;
  }, [maxWidth]);

  const getScreenStyle = (screen) => {
    const { width, height, top, left } = screen;
    return {
      width: width * scale,
      height: height * scale,
      top: top * scale,
      left: left * scale,
    }
  };

  return (
    <div ref={ref} className={styles.container}>
      {sortedScreens.map((screen, idx) => (
        <div key={idx} className={styles.screen} style={getScreenStyle(screen)}>
          <div className={styles.screenTitle}>Screen {idx}</div>
          <div className={styles.screenSize}>{_get(screen, 'width')} X {_get(screen, 'height')}</div>
        </div>
      ))}
    </div>
  )
}