import styles from './index.module.scss';
import { useState } from 'react';

export default function Bluetooth() {
  const [device, setDevice] = useState(null);
  const [server, setServer] = useState(null);

  const onPair = async () => {
    if (!window?.navigator?.bluetooth) return;
    const device = await navigator.bluetooth.requestDevice({
      // acceptAllDevices: true,
      filters: [{
      //   // namePrefix: 'prefix name',
        services: ['battery_service'],
      //   // name: 'full name',
      //   // manufacturerData: [{
      //   //   companyIdentifier: 0x00e0,
      //   //   dataPrefix: new Uint8Array([0x01, 0x02])
      //   // }],
      // }],
      // exclusionFilters: [{
      //   name: "Created by Francois"
      }],
      // optionalServices: ['battery_service'] // Required to access service later.
    });
    setDevice(device);
    console.log(device, device.name);
  }

  const onConnect = async () => {
    if (!device) return;
    const server = await device.gatt.connect();
    setServer(server);
  }

  const getBatteryInfo = async () => {
    if (!server) return;
    // Getting Battery Service…
    const batteryService = await server.getPrimaryService('battery_service');
    const characteristic = await batteryService.getCharacteristic('battery_level');
    const value = await characteristic.readValue();
    const percentage = value.getUint8(0);
    console.log('value:', value, percentage)
  }

  return (
    <div>
      <div>
      <button className="button" onClick={onPair}>Pair Bluetooth Device</button>
      <button className="button" onClick={onConnect}>Connect to Paired Device</button>
      <button className="button" onClick={getBatteryInfo}>Get Battery Info</button>
      </div>
    </div>
  )
}