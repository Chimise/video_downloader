import {HiExclamationCircle} from 'react-icons/hi2';
import styles from './VideoDownloadError.module.css';

interface VideoDownloadErrorProps {
    message: string;
}

const VideoDownloadError = ({message}: VideoDownloadErrorProps) => {
    return (<div className={styles.error}>
        <span className={styles['error-icon']}><HiExclamationCircle /></span>
        <span className={styles['error-text']}>{message}</span>
    </div>)
}

export default VideoDownloadError;
