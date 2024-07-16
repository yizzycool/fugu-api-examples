import styles from './index.module.scss';
import { useState } from 'react';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import JoyCon from './joy-con';
import Bluetooth from './bluetooth';

export default function HardwareAPIs() {
  const [hide, setHide] = useState(true);
  const [alignment, setAlignment] = useState('joycon');

  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
  }

  return (
    <div className={styles.container}>
      {!hide && (
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
      )}
      <br />
      <br />
      {alignment === 'joycon' ? (
        <JoyCon />
      ) : alignment === 'bluetooth' ? (
        <Bluetooth />
      ) : null}
    </div>
  )
}