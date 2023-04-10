import { Fragment } from "react";
import { Transition } from "@headlessui/react";
import styles from "./MobileMenu.module.css";
import Accordion from "../Accordion/Accordion";

interface MobileMenuProps {
  isMenuVisible: boolean;
}

const MobileMenu = ({ isMenuVisible }: MobileMenuProps) => {
  return (
    <Transition as={Fragment} show={isMenuVisible}>
      <nav className={styles.menu}>
        <Transition.Child
          className={styles["menu-wrapper"]}
          enter={styles["menu-enter"]}
          enterFrom={styles["menu-enter_from"]}
          enterTo={styles["menu-enter_to"]}
          leave={styles["menu-leave"]}
          leaveFrom={styles["menu-leave_from"]}
          leaveTo={styles["menu-leave-to"]}
        >
        <Accordion title='Downloaders' content={<div>Hello</div>} />
        </Transition.Child>
      </nav>
    </Transition>
  );
};

export default MobileMenu;
