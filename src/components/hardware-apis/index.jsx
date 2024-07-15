import styles from './index.module.scss';
import { useState } from 'react';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import JoyCon from './joy-con';

export default function HardwareAPIs() {
  const [alignment, setAlignment] = useState('joycon');

  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
  }

  return (
    <div className={styles.container}>
      <ToggleButtonGroup
        color="primary"
        value={alignment}
        exclusive
        onChange={handleChange}
      >
        <ToggleButton value="joycon">JoyCon</ToggleButton>
        <ToggleButton value="bluetooth">Bluetooth</ToggleButton>
        <ToggleButton value="usb">USB Device</ToggleButton>
      </ToggleButtonGroup>
      <br />
      <br />
      {alignment === 'joycon' ? (
        <JoyCon />
      ) : null}
    </div>
  )
}