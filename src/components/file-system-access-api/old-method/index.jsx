import { useRef, useState } from 'react';
import styles from './index.module.scss';
import imageUtils from '../utils/image-utils';

export default function OldMethod() {
  const [blob, setBlob] = useState(null);
  const [texts, setTexts] = useState('');
  const inputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    e.target.value = null;
    setBlob(file);
  }

  const handleFlip = async () => {
    const image = await imageUtils.newImage(blob);
    const flipBlob = await imageUtils.flipImage(image, false, true);
    setBlob(flipBlob);
  }

  const handleDownload = () => {
    const a = document.createElement('a');
    a.setAttribute('download', 'image');
    a.href = window.URL.createObjectURL(blob);
    a.click();
    window.URL.revokeObjectURL(a.href);
  }

  const handleDelete = () => {
    setBlob(null);
  }

  const handleDownloadTexts = () => {
    // create file blob that contains texts
    const file = new Blob([texts], { type: 'text/plain' });
    const a = document.createElement('a');
    a.setAttribute('download', 'texts.txt');
    a.href = window.URL.createObjectURL(file);
    a.click();
    window.URL.revokeObjectURL(a.href);
  }

  return (
    <div className={styles.flex}>
      <h3>Upload/Download Image</h3>
      <br />
      <button className={styles.button} onClick={() => inputRef.current.click()}>Upload an image</button>
      <input ref={inputRef} className={styles.hiddenInput} type="file" accept="image/*" onChange={handleFileChange} />
      {!!blob && (
        <>
          <button className="button" onClick={handleFlip}>Flip image</button>
          <button className="button" onClick={handleDownload}>Save image</button>
          <button className="button" onClick={handleDelete}>Delete image</button>
          <br />
          <img className={styles.originalImg} src={window.URL.createObjectURL(blob)} />
        </>
      )}
      <br />
      <br />
      <hr />
      <br />
      <h3>Save Modified Texts</h3>
      <br />
      <textarea className={styles.textArea} value={texts} onChange={(e) => setTexts(e.target.value)}  />
      <button className="button" onClick={handleDownloadTexts}>Save Texts</button>
    </div>
  )
}