import React, { useEffect, useState } from "react";
import cn from 'classnames';
import Link from "next/link";
import type { IconType } from "react-icons";
import styles from "./Downloader.module.css";

interface DownloaderLinkProps {
  iconName: string;
  name: string;
  className?: string;
}

const getIcon = async (iconName: string) => {
  const Icons = await import("react-icons/fa");
  //@ts-ignore
  return (Icons[iconName] as IconType) || Icons["FaPenAlt"];
};


const DownloaderLink = ({ iconName, name }: DownloaderLinkProps) => {
  const [FaIcon, setFaIcon] = useState<JSX.Element | null>(null);

  useEffect(() => {
    async function getLinkIcon() {
      const Icon = await getIcon(iconName);
      //@ts-ignore
      setFaIcon(Icon);
    }

    getLinkIcon();
  }, [iconName]);

  return (
    <Link className={styles['download-link']} href={`/downloaders/${name}`}>
      {FaIcon && (
        <span className={styles["download-icon"]}>
          {FaIcon}
        </span>
      )}
      <span className={styles["download-text"]}>{name}</span>
    </Link>
  );
};


export default DownloaderLink;
