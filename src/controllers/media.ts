import { NextApiRequest,  NextApiResponse} from "next";
import BaseExtractor from "@/extractors/base";
import { getQuery} from "@/utils";
import RequestError from "@/utils/request_error";
import ErrorManager from "@/services/error-manager";

export const getVideoMetaData = <T extends BaseExtractor>(Extractor: new (url: string) => T) => async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        switch (req.method) {
            case 'GET':
                const url = getQuery(req, 'url');
                if (!url) {
                    throw new RequestError('Url query missing', 400);
                }
                
                const extractor = new Extractor(url);
                const videoProps = await extractor.extractVideo();
                return res.json(videoProps);
            default:
                throw new RequestError('Method not allowed', 405);

        }

    } catch (err) {
        return ErrorManager.handleError(res, err);
    }
}