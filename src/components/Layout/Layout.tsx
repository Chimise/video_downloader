import React, {useState} from "react";
import Header from "../Header";
import MobileMenu from "../MobileMenu";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
const [isMenuOpen, setIsMenuOpen] = useState(false);
const handleToggleMenu = () => {
    setIsMenuOpen(prevMenu => !prevMenu);
}   
  return (
    <>
      <MobileMenu isMenuVisible={isMenuOpen} />
      <Header onMenuClick={handleToggleMenu} isOpen={isMenuOpen} />
      <main>{children}</main>
      <footer></footer>
    </>
  );
};

export default Layout;
