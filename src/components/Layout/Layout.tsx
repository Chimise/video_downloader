import React, { useState } from "react";
import Script from "next/script";
import Header from "../Header";
import MobileMenu from "../MobileMenu";
import Footer from "../Footer/Footer";
import type { Downloader } from "@/types";

interface LayoutProps {
  children: React.ReactNode;
  downloaders?: Array<Downloader>;
}

const Layout = ({ children, downloaders }: LayoutProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const handleToggleMenu = () => {
    setIsMenuOpen((prevMenu) => !prevMenu);
  };

  return (
    <>
      {downloaders && (
        <MobileMenu downloaders={downloaders} isMenuVisible={isMenuOpen} onToggleMenu={handleToggleMenu} />
      )}
      {downloaders && (
        <Header
          onMenuClick={handleToggleMenu}
          isOpen={isMenuOpen}
          downloaders={downloaders}
        />
      )}
      <main>{children}</main>
      {downloaders && <Footer downloaders={downloaders} />}
      {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
            page_path: window.location.pathname,
          });
        `}
          </Script>
        </>
      )}
    </>
  );
};

export default Layout;
