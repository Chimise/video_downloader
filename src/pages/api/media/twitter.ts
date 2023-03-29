import {NextApiRequest, NextApiResponse} from 'next';
import { getQuery, handleError } from '@/utils';
import RequestError from '@/utils/request_error';
import TwitterExtractor from '@/extractors/twitter';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        switch (req.method) {
            case 'GET':
                const url = getQuery(req, 'url');
                if (!url) {
                    throw new RequestError('Url query missing', 400);
                }

                const extractor = new TwitterExtractor(url);
                const videoProps = await extractor.extractVideo();
                return res.json(videoProps);
            default:
                throw new RequestError('Method not allowed', 405);

        }

    } catch (err) {
        return handleError(err, res);
    }
}

export default handler;