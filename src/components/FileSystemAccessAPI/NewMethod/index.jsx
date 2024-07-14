import { useRef, useState } from 'react';
import styles from './index.module.scss';
import imageUtils from '../utils/imageUtils';

export default function OldMethod() {
  const [fileHandle, setFileHandle] = useState(null);
  const [textFileHandle, setTextFileHandle] = useState(null);
  const [blob, setBlob] = useState(null);
  const [texts, setTexts] = useState('');

  const handleUploadClick = async() => {
    const [fileHandle] = await window.showOpenFilePicker({
      types: [
        {
          description: "Images",
          accept: {
            "image/*": [".png", ".gif", ".jpeg", ".jpg"],
          },
        },
      ],
    });
    const fileData = await fileHandle.getFile();
    setFileHandle(fileHandle);
    setBlob(fileData);
  }

  const handleFlip = async () => {
    const image = await imageUtils.newImage(blob);
    const flipBlob = await imageUtils.flipImage(image, false, true);
    setBlob(flipBlob);
  }

  const handleDownload = async () => {
    const contents = blob;
    const writable = await fileHandle.createWritable();
    await writable.write(contents);
    await writable.close();
  }

  const handleDelete = () => {
    setBlob(null);
    setFileHandle(null);
  }

  const handleDownloadTexts = async (handle = null) => {
    if (!handle && !textFileHandle) {
      return handleDownloadTextsAs();
    }
    const fileHandle = handle ?? textFileHandle;
    console.log('fie:', fileHandle)
    const contents = texts;
    const writable = await fileHandle.createWritable();
    await writable.write(contents);
    await writable.close();
  }

  const handleDownloadTextsAs = async () => {
    const textFileHandle = await self.showSaveFilePicker({
      suggestedName: 'Untitled Text.txt',
      types: [{
        description: 'Text documents',
        accept: {
          'text/plain': ['.txt'],
        },
      }],
    });
    setTextFileHandle(textFileHandle);
    handleDownloadTexts(textFileHandle);
  }


  return (
    <div className={styles.flex}>
      <h3>New Method to Upload/Download Image</h3>
      <br />
      <button className={styles.button} onClick={handleUploadClick}>Upload an image</button>
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
      <h3>Old Method to Download Modified Texts</h3>
      <br />
      <textarea className={styles.textArea} value={texts} onChange={(e) => setTexts(e.target.value)}  />
      <button className="button" onClick={() => handleDownloadTexts()}>Save Texts</button>
      <button className="button" onClick={() => handleDownloadTextsAs()}>Save Texts As</button>
    </div>
  )
}