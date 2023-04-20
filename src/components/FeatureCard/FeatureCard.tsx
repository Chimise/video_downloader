import React from "react";
import cn from "classnames";
import { HiSquaresPlus } from "react-icons/hi2";
import styles from './FeatureCard.module.css';

interface FeatureCardProps {
  title: string;
  description: string;
  className?: string;
}

const FeatureCard = ({ title, description, className }: FeatureCardProps) => {
  return (
    <div className={cn(styles['feature-card'], className)}>
      <div className={styles['feature-card-icon']}>
        <HiSquaresPlus />
      </div>
      <h6 className={styles['feature-card-title']}>{title}</h6>
      <p className={styles['feature-card-description']}>{description}</p>
    </div>
  );
};

export default FeatureCard;
