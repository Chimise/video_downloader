import Image from "next/image";
import Link from 'next/link';
import Container from "../Container";
import styles from "./Footer.module.css";
import { FaTwitter, FaLinkedinIn, FaGithub, FaDiscord } from "react-icons/fa";
import type { Downloader } from "@/types";


const medias = [
  { Icon: FaLinkedinIn, name: "linkedin" },
  { Icon: FaTwitter, name: "twitter" },
  { Icon: FaGithub, name: "github" },
  { Icon: FaDiscord, name: "discord" },
];

interface FooterProps {
  downloaders: Array<Downloader>;
}

const Footer = ({ downloaders }: FooterProps) => {
  return (
    <footer className={styles.footer}>
      <Container>
        <div className={styles.grid}>
          <div className={styles["logo-wrapper"]}>
            <Image
              src="/logo-dark.png"
              alt="Dark logo"
              width={150}
              height={30}
            />
            <p className={styles.description}>
              A powerful video downloader which supports downloading from
              multiple websites built with performance and speed in mind.
            </p>
            <div className={styles.icons}>
              {medias.map(({ Icon, name }) => (
                <div key={name} className={styles.icon}>
                  <Icon />
                </div>
              ))}
            </div>
          </div>
          <div className={styles.links}>
            <h5 className={styles["links-heading"]}>Downloaders</h5>
            <ul className={styles['downloaders']}>
              {downloaders.map((downloader) => (
                <li className={styles['downloader']} key={downloader.name}><Link href={`/downloaders/${downloader.name}`}>{downloader.name}</Link></li>
              ))}
            </ul>
          </div>
        </div>
        <div className={styles.divider}>
          &copy; {new Date().getFullYear()} SaveVideo Inc. All right reserved
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
