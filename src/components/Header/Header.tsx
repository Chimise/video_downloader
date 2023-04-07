import React from "react";
import Image from "next/image";
import Link from "next/link";
import Container from "../Container/Container";
import NavMenu from "../NavMenu/NavMenu";
import styles from "./Header.module.css";
import { HiBars3 } from "react-icons/hi2";

const Header = () => {
  return (
    <header className={styles.navbar}>
      <Container className={styles['navbar-wrapper']}>
        <div className={styles["navbar-logo"]}>
          <Image src="/logo.png" alt="Logo Image" width={131} height={26} />
        </div>
        <nav>
          <NavMenu name="Downloaders" content={'This is it'} />
          <NavMenu name="Hello" content={'What the fuck'} />
        </nav>
        <div className={styles["navbar-icon"]}>
          <HiBars3 className={styles.icon} />
        </div>
      </Container>
    </header>
  );
};

export default Header;
