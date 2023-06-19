import { NextApiRequest, NextApiResponse } from "next";
import extractors, { BaseExtractor } from "@/extractors";
import RequestError from "@/utils/request_error";
import { getQuery } from "@/utils";
import RateLimiter from "@/services/ratelimiter";
import ErrorManager from "@/services/error-manager";


export const matchExtractor = (url: string) => new Promise<BaseExtractor>((res, rej) => {

    for (const Extractor of extractors) {
        // Create an instance of a Video extractor
        const videoExtractor = new Extractor(url);

        // Extra check, if the current extractor do not have any of this functions, continue to other extractors
        if (!videoExtractor.validate || !videoExtractor.extractVideo || typeof videoExtractor.extractVideo !== 'function' || typeof videoExtractor.validate !== 'function') {
            continue;
        }

        try {
            // Check whether the input url matches this extractor
            videoExtractor.validate();

            return res(videoExtractor)
        } catch (error) {

            // if it throws an error move to other extractors
            if (!(error instanceof RequestError)) {
                return rej(error);
            }
            if (error.code === 400) {
                continue;
            }
            return rej(error);
        }
    }

    rej(new RequestError('Download link could not be found', 404));
})
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    switch (req.method) {
        case 'GET':
            const url = getQuery(req, 'url');
            if (!url) {
                return res.status(400).json({ message: 'Url query is required but is missing' });
            }

            try {
                const extractor = await matchExtractor(url);
                const videoData = await extractor.extractVideo();
                return res.json(videoData);
            } catch (error) {
                return ErrorManager.handleError(res, error);
            }
        default:
            return res.status(405).json({message: 'Method not supported'});
    }
}

export default RateLimiter.applyRateLimiting(handler);