import { useState } from 'react';
import styles from './index.module.scss';
import joyConUtils from './joy-con-utils';

export default function JoyCon() {
  const [device, setDevice] = useState(null);
  const [buttonPressed, setButtonPressed] = useState(null);

  const onPair = async () => {
    if (!window?.navigator?.hid) return;
    const filter = joyConUtils.filters;
    const [device] = await navigator.hid.requestDevice({ filters });
    setDevice(device);
    printDebugInfo(device);
    await device.open();
  }

  const onOpen = () => {
    if (!device) return;
    device.addEventListener("inputreport", event => {
      const { data, device, reportId } = event;
      // Handle only the Joy-Con Right device and a specific report ID.
      if (device.productId !== 0x2007 && reportId !== 0x3f) return;
      const value = data.getUint8(0);
      if (value === 0) return;
      if (value in joyConUtils.rightButtonsMap) {
        console.log(value, `User pressed button ${joyConUtils.rightButtonsMap[value]}.`);
        setButtonPressed(joyConUtils.rightButtonsMap[value]);
      }
    });
  }

  const sendVibration = async () => {
    if (!device) return;
    // First, send a command to enable vibration.
    // Magical bytes come from https://github.com/mzyy94/joycon-toolweb
    await device.sendReport(0x01, new Uint8Array(joyConUtils.enableVibrationData));
    // Then, send a command to make the Joy-Con device rumble.
    // Actual bytes are available in the sample below.
    const rumbleData = joyConUtils.getRumbleData();
    await device.sendReport(0x10, new Uint8Array(rumbleData));
  }

  const printDebugInfo = (device) => {
    console.log('device:', device);
    // List device info
    for (let collection of device.collections) {
      // An HID collection includes usage, usage page, reports, and subcollections.
      console.log(`Usage: ${collection.usage}`);
      console.log(`Usage page: ${collection.usagePage}`);
      for (let inputReport of collection.inputReports) {
        console.log(`Input report: ${inputReport.reportId}`);
        // Loop through inputReport.items
      }
      for (let outputReport of collection.outputReports) {
        console.log(`Output report: ${outputReport.reportId}`);
        // Loop through outputReport.items
      }
      for (let featureReport of collection.featureReports) {
        console.log(`Feature report: ${featureReport.reportId}`);
        // Loop through featureReport.items
      }
    }
  }

  return (
    <div>
      <div>
        <button className="button" onClick={onPair}>Pair JoyCon</button>
        <button className="button" onClick={onOpen}>Open JoyCon</button>
        <button className="button" onClick={sendVibration}>Send Vibration</button>
      </div>
      <div className={styles.abxy}>
        <div className={`${styles.x} ${buttonPressed === 'X' ? styles.buttonActive : ''}`}>X</div>
        <div className={styles.ya}>
          <div className={`${styles.y} ${buttonPressed === 'Y' ? styles.buttonActive : ''}`}>Y</div>
          <div className={`${styles.a} ${buttonPressed === 'A' ? styles.buttonActive : ''}`}>A</div>
        </div>
        <div className={`${styles.b} ${buttonPressed === 'B' ? styles.buttonActive : ''}`}>B</div>
      </div>
    </div>
  )
}