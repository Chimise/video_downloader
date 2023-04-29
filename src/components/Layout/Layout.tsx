import React, {useState} from "react";
import Header from "../Header";
import MobileMenu from "../MobileMenu";
import Footer from "../Footer/Footer";
import type { Downloader } from "@/types";

interface LayoutProps {
  children: React.ReactNode;
  downloaders?: Array<Downloader>
}

const Layout = ({ children, downloaders }: LayoutProps) => {
const [isMenuOpen, setIsMenuOpen] = useState(false);
const handleToggleMenu = () => {
    setIsMenuOpen(prevMenu => !prevMenu);
}   

  return (
    <>
      {downloaders && <MobileMenu downloaders={downloaders} isMenuVisible={isMenuOpen} />}
      {downloaders && <Header onMenuClick={handleToggleMenu} isOpen={isMenuOpen} downloaders={downloaders} />}
      <main>{children}</main>
      {downloaders && <Footer downloaders={downloaders} />}
      
    </>
  );
};

export default Layout;
