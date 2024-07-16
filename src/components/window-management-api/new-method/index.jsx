import styles from './index.module.scss';
import { useState } from 'react';
import ScreenSizeVisualization from './screen-size-visualization';

export default function NewMethod() {
  const [screenDetails, setScreenDetails] = useState(null);

  // const askPermission = async () => {
  //   if (!window.getScreenDetails) return;
  //   const { state } = await window.navigator.permissions.query({ name: 'window-management' });
  //   const granted = state === 'granted';
  //   console.log('user granted?', granted);
  // }

  const getScreenDetails = async () => {
    // need user permission
    const screenDetails = await window.getScreenDetails();
    setScreenDetails(screenDetails);
    addScreensChangeEventListener(screenDetails);
    addCurrentScreenChangeEventListener(screenDetails);
    console.log('screen details:', screenDetails);
  }

  // trigger if new screen added or any screen removed
  const addScreensChangeEventListener = (screenDetails) => {
    screenDetails.addEventListener('screenschange', (event) => {
      if (screenDetails.screens.length !== cachedScreensLength) {
        console.log(
          `The screen count changed from ${cachedScreensLength} to ${screenDetails.screens.length}`,
        );
        cachedScreensLength = screenDetails.screens.length;
      }
    });
  }

  // trigger if current screen is changed
  const addCurrentScreenChangeEventListener = (screenDetails) => {
    screenDetails.addEventListener('currentscreenchange', async (event) => {
      const details = screenDetails.currentScreen;
      setScreenDetails(screenDetails);
      console.log('The current screen has changed.', event, details);
    });
  }

  const fullscreenTo = async (screen) => {
    try {
      await document.body.requestFullscreen({ screen });
    } catch (err) {
      console.error(err.name, err.message);
    }
  }

  return (
    <div className={styles.container}>
      <div>
        {/* <button className="button" onClick={askPermission}>Require window management permission</button> */}
        <button className="button" onClick={getScreenDetails}>Get screen details</button>
        <br />
        <br />
        {screenDetails?.screens?.map((screen, idx) => (
          <button key={idx} className="button" onClick={() => fullscreenTo(screen)}>Fullscreen to screen {idx + 1}</button>
        ))}
      </div>
      <ScreenSizeVisualization screenDetails={screenDetails} />
    </div>
  )
}