import styles from './barcode.module.scss';

export default function BarcodeResult(props) {
  const {barcodes} = props;

  return (
    <div className={styles.container}>
      {barcodes.map((barcode, idx) => (
        <div key={idx} className={styles.barcode}>{barcode.rawValue}</div>
      ))}
    </div>
  )
}