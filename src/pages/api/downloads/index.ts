import { NextApiRequest, NextApiResponse } from 'next';
import { pipeline } from 'node:stream';
import { promisify } from 'node:util';
import RequestError from '@/utils/request_error';
import { getQuery } from '@/utils';
import ErrorManager from '@/services/error-manager';
import Request from '@/utils/request';

const streamPipeline = promisify(pipeline);

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        switch (req.method) {
            case 'GET':
                const url = getQuery(req, 'url');
                if (!url) {
                    throw new RequestError('Invalid args provided, must have a url query');
                }

                let request: Request;

                try {
                    request = await Request.send(url);
                } catch (error) {
                    return res.status(500).end();
                }

                if (!request.response.body) {
                    return res.status(404).end();
                }

                let contentDisposition = request.response.headers.get('content-disposition');

                if (contentDisposition) {
                    contentDisposition = contentDisposition.replace('inline', 'attachment').toLowerCase();
                }
                else {
                    const contentType = request.response.headers.get('content-type') || 'video/mp4';
                    const ext = contentType.split('; ')[0].split('/').slice(-1)[0];
                    contentDisposition = `attachment; filename="video.${ext}"`;
                }

                res.setHeader('Content-Disposition', contentDisposition);

                try {
                    //@ts-ignore
                    await streamPipeline(request.response.body, res);
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


export default handler;
