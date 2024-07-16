import { useState } from 'react';
import styles from './index.module.scss';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import OldMethod from './old-method';
import NewMethod from './new-method';

export default function WindowManagementAPI() {
  const [alignment, setAlignment] = useState('old');

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
        aria-label="Platform"
      >
        <ToggleButton value="old">Old Method</ToggleButton>
        <ToggleButton value="new">New Method</ToggleButton>
      </ToggleButtonGroup>
      <div className={styles.functionBlock}>
        {alignment === 'old' ? (
          <OldMethod />
        ) : (
          <NewMethod />
        )}
      </div>
    </div>
  )
}