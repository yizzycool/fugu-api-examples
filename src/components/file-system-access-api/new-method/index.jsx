import styles from './index.module.scss';
import { useState } from 'react';
import imageUtils from '../utils/image-utils';
import DirectoryStructure from './directory-structure';

export default function OldMethod() {
  const [fileHandle, setFileHandle] = useState(null);
  const [textFileHandle, setTextFileHandle] = useState(null);
  const [blob, setBlob] = useState(null);
  const [texts, setTexts] = useState('');
  const [directory, setDirectory] = useState({
    handle: null,
    kind: null,
    name: null,
    children: [],
  })

  const handleUploadClick = async() => {
    const [fileHandle] = await window.showOpenFilePicker({
      types: [
        {
          description: "My Images",
          accept: {
            "image/*": [".png", ".gif", ".jpeg", ".jpg"],
          },
        },
      ]
    }).catch();
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
    const textFileHandle = await window.showSaveFilePicker({
      suggestedName: 'Untitled Text.txt',
      types: [{
        description: 'Text documents',
        accept: {
          'text/plain': ['.txt'],
        },
      }],
    }).catch();;
    setTextFileHandle(textFileHandle);
    handleDownloadTexts(textFileHandle);
  }

  const handleShowDirectoryPicker = async () => {
    const dirHandle = await window.showDirectoryPicker();
    console.log('dir handle:', dirHandle);
    updateHandle(dirHandle);
  }

  const handleChooseSubDirectory = async (kind, name) => {
    if (!directory.handle) return;
    if (kind === 'directory') {
      const dirHandle = await directory.handle.getDirectoryHandle(name, {
        create: true,
      });
      updateHandle(dirHandle);
    } else if (kind === 'file') {
      const fileHandle = await directory.handle.getFileHandle(name, { create: true });
      const file = await fileHandle.getFile();
      const contents = await file.text();
      console.log('file contents:', contents);
    }
  }

  const updateHandle = async (dirHandle) => {
    const children = [];
    for await (const entry of dirHandle.values()) {
      children.push({
        handle: null,
        kind: entry.kind,
        name: entry.name,
        children: [],
      });
      console.log(entry.kind, entry.name);
    }
    setDirectory({
      handle: dirHandle,
      kind: dirHandle.kind,
      name: dirHandle.name,
      children,
    });
  }


  return (
    <div className={styles.flex}>
      <h3>Upload/Download Image</h3>
      <br />
      <button className="button" onClick={handleUploadClick}>Upload an image</button>
      {!!blob && (
        <div>
          <button className="button" onClick={handleFlip}>Flip image</button>
          <button className="button" onClick={handleDownload}>Save image</button>
          <button className="button" onClick={handleDelete}>Delete image</button>
          <br />
          <img className={styles.originalImg} src={window.URL.createObjectURL(blob)} alt="" />
        </div>
      )}
      <br /><br /><hr /><br />
      <h3>Save Modified Texts</h3>
      <br />
      <textarea className={styles.textArea} value={texts} onChange={(e) => setTexts(e.target.value)}  />
      <div>
        <button className="button" onClick={() => handleDownloadTexts()}>Save texts</button>
        <button className="button" onClick={() => handleDownloadTextsAs()}>Save texts as</button>
      </div>
      <br /><hr /><br />
      <h3>Directory Operation</h3>
      <br />
      <button className="button" onClick={() => handleShowDirectoryPicker()}>Open a directory</button>
      <DirectoryStructure directory={directory} handleChooseSubDirectory={handleChooseSubDirectory} />
    </div>
  )
}