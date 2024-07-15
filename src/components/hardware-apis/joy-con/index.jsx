import { useEffect, useState } from 'react';
import styles from './index.module.scss';

// Filter on devices with the Nintendo Switch Joy-Con USB Vendor/Product IDs.
const filters = [
  {
    vendorId: 0x057e, // Nintendo Co., Ltd
    productId: 0x2006 // Joy-Con Left
  },
  {
    vendorId: 0x057e, // Nintendo Co., Ltd
    productId: 0x2007 // Joy-Con Right
  }
];

export default function JoyCon() {
  const [device, setDevice] = useState(null);
  const [buttonPressed, setButtonPressed] = useState(null);

  const onPair = async () => {
    if (!window?.navigator?.hid) return;
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
      const someButtons = { 1: "A", 2: "X", 4: "B", 8: "Y" };
      if (value in someButtons) {
        console.log(value, `User pressed button ${someButtons[value]}.`);
        setButtonPressed(someButtons[value]);
      }
    });
  }

  const sendVibration = async () => {
    if (!device) return;
    // First, send a command to enable vibration.
    // Magical bytes come from https://github.com/mzyy94/joycon-toolweb
    const enableVibrationData = [1, 0, 1, 64, 64, 0, 1, 64, 64, 0x48, 0x01];
    await device.sendReport(0x01, new Uint8Array(enableVibrationData));
    // Then, send a command to make the Joy-Con device rumble.
    // Actual bytes are available in the sample below.
    let deviceCounter = 0;
    const hf = 0x0098;
    const lf = 0x46;
    const hfa = 0x1e;
    const lfa = 0x8047;
    const lhf = hf;
    const llf = lf;
    const lhfa = hfa;
    const llfa = lfa;
    const rhf = hf;
    const rlf = lf;
    const rhfa = hfa;
    const rlfa = lfa;
    const rumbleData = [
      deviceCounter++ & 0xff,
      lhf & 0xff,
      lhfa + ((lhf >>> 8) & 0xff),
      llf + ((llfa >>> 8) & 0xff),
      llfa & 0xff,
      rhf & 0xff,
      rhfa + ((rhf >>> 8) & 0xff),
      rlf + ((rlfa >>> 8) & 0xff),
      rlfa & 0xff
    ];
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