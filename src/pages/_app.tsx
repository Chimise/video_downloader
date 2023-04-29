import "@/styles/variable.css";
import "@/styles/globals.css";
import "video.js/dist/video-js.css";
import Layout from "@/components/Layout";
import { VideoContextProvider } from "@/store/VideoContext";

import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <VideoContextProvider>
      <Layout {...pageProps}>
        <Component {...pageProps} />
      </Layout>
    </VideoContextProvider>
  );
}
