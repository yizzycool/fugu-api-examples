import { useEffect, useState } from 'react';
import styles from './index.module.scss';

export default function AppBadgingAPI() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then(() => { console.log('Service Worker Registered'); });
    }
  }, [])

  const handleAddToHome = () => {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((res) => {
      console.log(JSON.stringify(res));
    });
  }

  const handleInputChanged = (e) => {
    const count = !e.target.value ? 0 : parseInt(e.target.value);
    setUnreadCount(count);
  }

  const setAppBadge = () => {
    navigator.setAppBadge(unreadCount);
  }

  const clearAppBadge = () => {
    navigator.clearAppBadge();
  }

  return (
    <div className={styles.container}>
      <button className="button" onClick={handleAddToHome} disabled={!deferredPrompt}>Add to home screen</button>
      <br />
      <br />
      <br />
      <div className={styles.label}>
        <div>Set unread count</div>
        <input className={styles.input} type="number" min="0" max="9999999" value={unreadCount} onChange={handleInputChanged} />
      </div>
      <br />
      <button className="button" onClick={setAppBadge}>Set</button>
      <button className="button" onClick={clearAppBadge}>Clear</button>
      </div>
  )
}