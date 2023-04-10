import React from "react";
import Image from "next/image";
import Container from "../Container/Container";
import NavMenu from "../NavMenu/NavMenu";
import styles from "./Header.module.css";
import cn from 'classnames';

interface HeaderProps {
    onMenuClick: () => void;
    isOpen: boolean;
}

const Header = ({onMenuClick, isOpen}: HeaderProps) => {
  return (
    <header className={styles.navbar}>
      <Container className={styles['navbar-wrapper']}>
        <div className={styles["navbar-logo"]}>
          <Image src="/logo.png" alt="Logo Image" width={150} height={30} />
        </div>
        <nav>
          <NavMenu name="Downloaders" content={'This is it'} />
          <NavMenu name="Hello" content={'What the fuck'} />
        </nav>
        <div onClick={onMenuClick} className={styles["navbar-icon"]}>
          <span className={cn(styles['mobile-icon'], {[styles['mobile-icon_open']]: isOpen, [styles['mobile-icon_close']]: !isOpen})} />
        </div>
      </Container>
    </header>
  );
};

export default Header;
