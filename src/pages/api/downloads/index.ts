import { NextApiRequest, NextApiResponse } from 'next';
import { pipeline} from 'node:stream';
import { once } from 'node:events';
import { promisify } from 'node:util';
import download from 'download';
import RequestError from '@/utils/request_error';
import { getQuery } from '@/utils';
import ErrorManager from '@/services/error-manager';
import randomUserAgent from '@/utils/user_agent';
import RateLimiter from '@/services/ratelimiter';

const streamPipeline = promisify(pipeline);

const downloadFile = (url: string, res: NextApiResponse, ext: string, timeout: number = 7000) => {
    const headers = {
        'Accept-Charset': 'ISO-8859-1,utf-8;q=0.7,*;q=0.7',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'en-us,en;q=0.5',
        'User-Agent': randomUserAgent()
    }

    return new Promise((resolve, reject) => {
        let isFetching = false;

// Add a timeout after a number of seconds if the download is yet to get a response
        const id = setTimeout(() => {
            if(!isFetching) {
                if(!res.headersSent) {
                    res.removeHeader('Content-Disposition');
                }
                res.status(500).end();
                reject(new Error('Timeout reached'));
            }
        }, timeout);

        const dataStream = download(url, undefined , {headers, followRedirect: true, timeout});

        once(dataStream, 'data').then(() => {
            isFetching = true;
            clearTimeout(id);
        })

        streamPipeline(dataStream, res).then(resolve, reject);
        res.setHeader('Content-Disposition', `attachment; filename="video.${ext}"`);
    })
}


const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        switch (req.method) {
            case 'GET':
                const url = getQuery(req, 'url');
                let ext = getQuery(req, 'ext');
                if (!url) {
                    throw new RequestError('Invalid args provided, must have a url query');
                }

                if(!ext) {
                    ext = 'mp4';
                }

                try {
                    await downloadFile(url, res, ext);
                } catch (error) {
                    const errorManager = new ErrorManager();
                    errorManager.report(error);
                }
                break;
            default:
                throw new RequestError('Method not supported', 405);
        }
    } catch (error) {
        ErrorManager.handleError(res, error);
    }

}


export default RateLimiter.applyRateLimiting(handler);
