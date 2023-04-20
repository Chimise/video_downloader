import {HTMLAttributes, ReactNode} from 'react';
import cn from 'classnames';
import styles from './Badge.module.css';


const getColor = (value: string, defaultVal: string) => {
    if(/$\-{2}/.test(value)) {
        return `var(${value}, ${defaultVal})`;
    }

    return value;
}

interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
    className?: string;
    color?: string;
    bg?: string;
    children: ReactNode

}

const defaultColor = '#F0FAF8';
const defaultBg = '#1C1E21';

const Badge = ({className, color = defaultColor, bg = defaultBg, children, ...props}: BadgeProps) => {

    return (<div className={cn(styles.badge, className)} style={{color: getColor(color, defaultColor), backgroundColor: getColor(bg, defaultBg)}} {...props}>
        {children}
    </div>)
}


export default Badge;