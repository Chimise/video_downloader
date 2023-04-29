import React from 'react';
import cn from 'classnames';
import styles from './Loader.module.css';

interface LoaderProps {
    className?: string;
}

const Loader = ({className}: LoaderProps) => {
    return (<div className={cn(styles.loader, className)}>
        <span />
        <span />
        <span />
    </div>)
}

export default Loader;