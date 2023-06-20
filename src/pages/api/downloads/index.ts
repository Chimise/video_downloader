import { NextApiRequest, NextApiResponse } from 'next';
import { pipeline } from 'node:stream';
import { promisify } from 'node:util';
import download from 'download';
import RequestError from '@/utils/request_error';
import { getQuery } from '@/utils';
import ErrorManager from '@/services/error-manager';
import randomUserAgent from '@/utils/user_agent';
import RateLimiter from '@/services/ratelimiter';

const streamPipeline = promisify(pipeline);

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
                
                res.setHeader('Content-Disposition', `attachment; filename="video.${ext}"`);

                try {
                    const headers = {
                        'Accept-Charset': 'ISO-8859-1,utf-8;q=0.7,*;q=0.7',
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                        'Accept-Encoding': 'gzip, deflate',
                        'Accept-Language': 'en-us,en;q=0.5',
                        'User-Agent': randomUserAgent()
                    }
                    //@ts-ignore
                    await streamPipeline(download(url, {headers, retry: 2, followRedirect: true}), res);
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
