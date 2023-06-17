import Layout from "@/components/Layout";
import { VideoContextProvider } from "@/store/VideoContext";
import ErrorBoundary from "@/components/ErrorBoundary/ErrorBoundary";
import { NextPage } from "next";

import "@/styles/variable.css";
import "@/styles/globals.css";
import "video.js/dist/video-js.css";

import '@fontsource/open-sans/400.css';
import '@fontsource/open-sans/500.css';
import '@fontsource/open-sans/600.css';
import '@fontsource/open-sans/700.css';
import '@fontsource/poppins/300.css';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/600.css';

import type { AppProps } from "next/app";

type Page = {
  getLayout?: (children: NextPage, pageProps: any) => JSX.Element;
} & NextPage;

type App = {
  Component: Page;
} & AppProps;


// Default layout incase no layout exist for the page
const defaultLayout = (Component: NextPage, pageProps: any = {}) => (
  <Layout {...pageProps}>
    <Component {...pageProps} />
  </Layout>
);


export default function App({ Component, pageProps }: App) {
  const layout = Component.getLayout || defaultLayout;

  return (
    <ErrorBoundary>
      <VideoContextProvider>
        {layout(Component, pageProps)};
      </VideoContextProvider>
    </ErrorBoundary>
  );
}
