import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import styles from "../styles/404.module.css";

const NotFoundPage = () => {
  return (
      <main className={styles["notfound"]}>
      <Head>
        <title>Page Not Found</title>
      </Head>
      <div className={styles["notfound-container"]}>
        <div className={styles["notfound-status"]}>404</div>
        <div className={styles['notfound-content']}>
          <h1 className={styles["notfound-text"]}>Page not found</h1>
          <Link href="/" className={styles["notfound-link"]}>
            Back to Homepage
          </Link>
        </div>
      </div>
    </main>
  );
};

NotFoundPage.getLayout = (Page: NextPage, pageProps: any = {}) => {
  return <Page {...pageProps} />;
};

export default NotFoundPage;
