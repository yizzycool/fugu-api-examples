import styles from './index.module.scss';
import { useState } from 'react';

export default function OldMethod() {
  const [popup, setPopup] = useState(null);

  const timeTestedOpen = () => {
    const popup = window.open(
      '/window-management-api',
      'My Popup Window',
      'left=500,top=50,width=400,height=300',
    );
    setPopup(popup);
  }

  const movePopupWindow = (left, top) => {
    if (!popup) return;
    popup.moveTo(left, top);
  }

  const closePopupWindow = () => {
    if (!popup) return;
    popup.close();
    setPopup(null);
  }

  return (
    <div className={styles.container}>
      <button className="button" onClick={timeTestedOpen}>Open new window</button>
      <button className="button" onClick={() => movePopupWindow(300, 50)}>Move left</button>
      <button className="button" onClick={() => movePopupWindow(1000, 50)}>Move right</button>
      <button className="button" onClick={closePopupWindow}>Close window</button>
    </div>
  )
}