import { Fragment } from "react";
import { Transition } from "@headlessui/react";
import styles from "./MobileMenu.module.css";
import Accordion from "../Accordion/Accordion";
import Container from "../Container/Container";
import DownloaderLink from "../DownloaderLink/DownloaderLink";
import type { Downloader } from "@/types";

interface MobileMenuProps {
  isMenuVisible: boolean;
  downloaders: Array<Downloader>;
  onToggleMenu: () => void;
}

const MobileMenu = ({ isMenuVisible, downloaders, onToggleMenu }: MobileMenuProps) => {
  return (
    <Transition as={Fragment} show={isMenuVisible}>
      <nav className={styles.menu}>
        <Transition.Child
          as={Fragment}
          enter={styles["menu-enter"]}
          enterFrom={styles["menu-enter_from"]}
          enterTo={styles["menu-enter_to"]}
          leave={styles["menu-leave"]}
          leaveFrom={styles["menu-leave_from"]}
          leaveTo={styles["menu-leave-to"]}
        >
          <div className={styles["menu-wrapper"]}>
            <Container gutter={false}>
              <Accordion title="Downloaders">
                <div className={styles['menu-links']}>
                  {downloaders.map(downloader => (<div className={styles['menu-link']} key={downloader.name}>
                    <DownloaderLink className={styles.link} {...downloader} onClick={onToggleMenu} />
                  </div>))}
                </div>
              </Accordion>
            </Container>
          </div>
        </Transition.Child>
      </nav>
    </Transition>
  );
};

export default MobileMenu;
