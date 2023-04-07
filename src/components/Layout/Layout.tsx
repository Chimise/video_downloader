import React from "react";
import Header from "../Header";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <Header />
      <main>{children}</main>
      <footer></footer>
    </>
  );
};

export default Layout;
