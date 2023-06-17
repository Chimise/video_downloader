import React, { useRef, Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import cn from "classnames";
import styles from "./NavMenu.module.css";
import { HiChevronDown } from "react-icons/hi2";

interface NavMenuProps {
  name: string;
  children: React.ReactNode;
  className?: string;
}

const timeoutDuration = 100;
const NavMenu = ({ name, children, className }: NavMenuProps) => {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const timeOutRef = useRef<NodeJS.Timer>();

  // Opens the panel when hovered and clears timeout set on a previous hover if any
  const handleEnter = (isOpen: boolean) => {
    clearTimeout(timeOutRef.current);
    !isOpen && triggerRef.current?.click();
  };

  // Delays for timeoutDuration and closes the panel
  const handleLeave = (isOpen: boolean) => {
    timeOutRef.current = setTimeout(() => {
      isOpen && triggerRef.current?.click();
    }, timeoutDuration);
  };


  return (
    <Popover className={cn(styles.navmenu, className)}>
      {({ open }) => (
        <div
          onMouseEnter={() => handleEnter(open)}
          onMouseLeave={() => handleLeave(open)}
        >
          <Popover.Button as='div' ref={triggerRef} className={styles.menu}>
            <span className={styles["menu-text"]}>{name}</span>
            <span className={cn(styles["menu-icon"], {[styles['menu-icon_open']]: open, [styles['menu-icon_close']]: !open})}>
              <HiChevronDown />
            </span>
          </Popover.Button>
          <Transition as={Fragment} enter={styles['panel-enter']} enterFrom={styles['panel-enter-from']} enterTo={styles['panel-enter-to']} leave={styles['panel-leave']} leaveFrom={styles['panel-leave-from']} leaveTo={styles['panel-leave-to']}>
            <Popover.Panel className={styles["navmenu-panel"]}>
            <div className={styles['navmenu-divider']} />
              <nav className={styles['navmenu-wrapper']}>
              {children}
              </nav>
            </Popover.Panel>
          </Transition>
        </div>
      )}
    </Popover>
  );
};

export default NavMenu;

