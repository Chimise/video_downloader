import React from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import type { IconType } from "react-icons";
import styles from "./Downloader.module.css";

interface DownloaderLinkProps {
  iconName: string;
  name: string;
  className?: string;
  onClick?: (evt?: React.MouseEvent<HTMLElement>) => void;
}


const DownloaderLink = ({ iconName, name, onClick }: DownloaderLinkProps) => {

  const Icon = dynamic(() => import("react-icons/fa").then(icons => icons[iconName] as IconType || icons['FaPenAlt']));

  return (
    <Link onClick={onClick && onClick} className={styles['download-link']} href={`/downloaders/${name}`}>
      {Icon && (
        <span className={styles["download-icon"]}>
          <Icon />
        </span>
      )}
      <span className={styles["download-text"]}>{name}</span>
    </Link>
  );
};


export default DownloaderLink;
