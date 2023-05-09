import React from "react";
import Head from "next/head";
import type { GetServerSideProps, GetStaticPaths, GetStaticProps } from "next";
import { getSupportedDownloaders } from "@/utils";
import type { Downloader } from "@/types";
import Container from "@/components/Container";
import styles from "../../styles/Downloader.module.css";
import VideoSearch from "@/components/VideoSearch";
import Loader from "@/components/Loader";
import VideoDownloadError from "@/components/VideoDownloadError";
import VideoDownloadList from "@/components/VideoDownloadList";
import useRequestVideo from "@/hooks/useRequestVideo";

interface DownloaderPageProps {
  downloader: Downloader;
}

export const capitalizeWord = (word: string) => {
  return word.slice(0, 1).toUpperCase() + word.slice(1);
};



const DownloaderPage = ({ downloader }: DownloaderPageProps) => {

const {sendRequest, isLoading, error, data} = useRequestVideo();

const handleRequest = async (url: string) => {
// If the downloader is still being implemented or not yet functional do not send any request
  if(!downloader.isReady) {
    return;
  }

  await sendRequest(downloader.name, url);
}


const downloaderName = capitalizeWord(downloader.name);
  return (
    <>
      <Head>
        <title>{`${downloaderName} Video Downloader`}</title>
      </Head>
      <section className={styles.hero}>
        <Container>
        <h2 className={styles["hero-title"]}>
            Download Videos From <br /> {downloaderName}
          </h2>
          <p className={styles["hero-description"]}>
            Choose any supported video format of your choice.{" "}
          </p>
          <div className={styles['hero-input']}>
              <VideoSearch placeholder={`Enter a valid ${downloader.name} url`} onSubmit={handleRequest} />
          </div>
          <div>
          <div className={styles['hero-video']}>
            {isLoading && <div className={styles['hero-loading']}>
              <Loader />
              </div>}
            {!downloader.isReady && <div className={styles['hero-error']}>
              <VideoDownloadError message={`${downloaderName} video downloader is not yet functional`} />
              </div>}
            {error && <div className={styles['hero-error']}>
              <VideoDownloadError message={error} />
              </div>}
            {data && <VideoDownloadList videoData={data} />}
          </div>
          </div>
        </Container>
      </section>
    </>
  );
};

export default DownloaderPage;


export const getStaticProps: GetStaticProps = async (ctx) => {
  let downloaderName = ctx.params?.downloader;

  if (!downloaderName) {
    throw new Error("An error occured");
  }

  if (Array.isArray(downloaderName)) {
    downloaderName = downloaderName[0];
  }

  const downloaders = await getSupportedDownloaders();

  const downloader = downloaders.find(
    (downloader) => downloader.name === downloaderName
  );

  if (!downloader) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      downloaders,
      downloader,
    },
  };
}


export const getStaticPaths: GetStaticPaths = async () => {
  const downloaders = await getSupportedDownloaders();
  const paths = downloaders.map(downloader => ({
    params: {
      downloader: downloader.name
    }
  }))

  return {
    paths,
    fallback: 'blocking'
  }
}