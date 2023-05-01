import ytdl from "ytdl-core";
import { ExtractedVideo } from "@/types";
import BaseExtractor from "./base";
import RequestError from "@/utils/request_error";
import _ from 'lodash';


class YoutubeExtractor extends BaseExtractor {
    url: string;
    // Add a dummy Regular Expression
    urlPattern: RegExp = new RegExp('');
    // id of youtube video
    id!: string;

    constructor(url: string) {
        super();
        this.url = url;
    }

    validate(errorMessage: string = 'Invalid Youtube url'): string {
        try {
            const urlIsValid = ytdl.validateURL(this.url);
            if (!urlIsValid) {
                throw new RequestError(errorMessage, 400);
            }
            this.id = ytdl.getURLVideoID(this.url);
            return this.id;
        } catch (error) {
            const err = error instanceof RequestError ? error : new RequestError(errorMessage, 400);
            throw err;
        }
    }

    extractVideoExt(mimeType: string = '') {
        const regex = /video\/(?<ext>\w+?);/;
        const matches = regex.exec(mimeType);
        if (!matches) {
            return '';
        }
        if (!matches.groups || !matches.groups.ext) {
            return '';
        }
        return matches.groups.ext;
    }


    async extractVideo(): Promise<ExtractedVideo> {

        const id = this.validate();
        const { videoDetails, thumbnail_url, formats } = await ytdl.getInfo(this.url);

        const videoFormats = ytdl.filterFormats(formats, 'videoandaudio').map(format => ({
            url: format.url,
            ext: format.container || this.extractVideoExt(format.mimeType),
            width: format.width,
            height: format.height,
            rate: `${format.bitrate || ''}`,
            quality: format.qualityLabel || format.quality
        }))

        return {
            id,
            origin_url: this.url,
            thumbnail: thumbnail_url || _.get(videoDetails, 'thumbnails[0].url') || _.get(videoDetails, 'thumbnail.thumbnails[0].url', ''),
            formats: videoFormats,
            title: _.get(videoDetails, 'title') || _.get(videoDetails, 'description', '')!,
        }
    }
}


export default YoutubeExtractor;






