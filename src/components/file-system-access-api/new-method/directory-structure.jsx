import styles from './directory-strueture.module.scss';
import _isEmpty from 'lodash/isEmpty';

export default function DirectoryStructure(props) {
  const { directory, handleChooseSubDirectory } = props;

  return (
    !_isEmpty(directory.children) && (
      <div className={styles.directory}>
        <div>
          <img className={styles.icon} src={`/assets/images/${directory.kind}.png`} />
          {directory.name}
        </div>
        <div className={styles.subDirectory}>
          {directory.children.map(({kind, name}, idx) => (
            <div key={idx}>
              <img className={styles.icon} src={`/assets/images/${kind}.png`} />
              <span className={styles.link} onClick={() => handleChooseSubDirectory(kind, name)}>{name}</span>
            </div>
          ))}
        </div>
      </div>
    )
  )
}