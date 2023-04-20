import React, {cloneElement} from 'react';
import styles from './Social.module.css';

interface SocialProps {
    icon: JSX.Element;
    text: string;
}

const Social = ({icon, text}: SocialProps) => {
    return (<div className={styles['social']}>
            <span className={styles['social-icon']}>{icon}</span>
            <span className={styles['social-text']}>{text}</span>
    </div>)
}

export default Social;