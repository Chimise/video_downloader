import { NextPage } from "next"
import Link from "next/link"
import Head from "next/head";
import styles from '../styles/500.module.css';

const ServerErrorPage = () => {
    return (<main className={styles.error}>
        <Head>
            <title>Server Error</title>
        </Head>
        <div className={styles['error-container']}>
            <p className={styles['error-text']}>An error occurred on the server</p>
            <Link className={styles['error-link']} href='/'>Go to Homepage</Link>
        </div>
    </main>)
}

ServerErrorPage.getLayout = (Page: NextPage, pageProps: any = {}) => {
    return (<Page {...pageProps} />)
}

export default ServerErrorPage;