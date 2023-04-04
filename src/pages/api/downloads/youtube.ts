import type { NextApiRequest, NextApiResponse } from "next";
import ytdl from "ytdl-core";
import encrypter from "@/services/encrypter";
import { getQuery, handleError } from "@/utils";




const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const media = getQuery(req, 'media');
    if (!media) {
        return res.status(400).end();
    }

    try {
        const {video_url, id, ...format} = encrypter.decryptObj<ytdl.videoFormat & {video_url: string, id: string}>(media);

        if (!id || !format.url || !format.container || !format.quality) {
            return res.status(400).end();
        }
            const stream = ytdl(video_url, {
                format,
            })
            
        res.setHeader('Content-Type', format.mimeType || format.hasVideo ? `video/${format.container}` : `audio/${format.container}`)
        res.setHeader('Content-Disposition', `attachment; filename="${id}.${format.container}"`);

        stream.pipe(res);

        stream.on('error', () => {
            res.status(500).end();
        })
    } catch (error) {
        return handleError(error, res);
    }

}

export default handler;