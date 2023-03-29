import _ from 'lodash';
import { ExtractedVideo, StatusData, VideoVariants } from "@/types";
import BaseExtractor from "./base";
import Request from "@/utils/request";
import RequestError from "@/utils/request_error";

const defaultHeader = {
    'Authorization': `Bearer ${process.env.TWITTER_API_KEY}`
}

class TwitterExtractor extends BaseExtractor {
    urlPattern: RegExp = /https?:\/\/(?:(?:www|m(?:obile)?)\.)?twitter\.com\/(?:(?:i\/web|[^\/]+)\/status|statuses)\/(?<id>\d+)/;

    urlSamples = ['https://twitter.com/Naija_PR/status/1640800506703659009?s=20', 'https://twitter.com/Sports_Doctor2/status/1640729074644467712?s=20', 'https://twitter.com/kairokun2010/status/1634388496852058112?s=20', 'https://twitter.com/chimisep/status/1599464555314151424?t=5BNfS5ZZxffJ69j1xnToOA&s=19']
    id!: string;
    url: string;

    constructor(url: string) {
        super()
        this.url = url
    }

    // Get the guest token from twitter and use in subsequent requests
    async fetchGuestToken() {
        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            ...defaultHeader
        }
        const req = await Request.send(this.genUrl('/guest/activate.json'), { headers, method: 'POST', timeout: 8000 });

        const data = await req.parseJSON<{ guest_token: string }>();

        if (!data || !data?.guest_token) {
            throw new RequestError('An error occurred, please try again');
        }
        return data.guest_token;
    }

    genUrl(path: string) {
        const baseApiUrl = 'https://api.twitter.com/1.1';
        return `${baseApiUrl}${path}`;
    }

    async fetchStatusInfo() {
        // Validate the input url and extract an id
        this.id = this.validate();
        const token = await this.fetchGuestToken();
        const headers = {
            'x-guest-token': token,
            ...defaultHeader
        }
        //Add the query to the request
        //@ts-ignore
        const query = new URLSearchParams({
            cards_platform: 'Web-12',
            include_cards: 1,
            include_reply_count: 1,
            include_user_entities: 0,
            tweet_mode: 'extended'
        }).toString();

        // Send request to retrieve the video details
        const res = await Request.send(this.genUrl(`/statuses/show/${this.id}.json?${query}`), { headers });
        // Parse the response
        const data = await res.parseJSON<StatusData>();

        if (!data) {
            throw new RequestError('Could not get video data');
        }

        return data;
    }

    getAttrFromUrl(url: string) {
        // Extract the dimensions from the video url
        const pattern = /\/(?<width>\d+)x(?<height>\d+)\//;
        const matches = url.match(pattern);
        if (!matches || !matches.groups) {
            return null;
        }

        return {
            width: parseInt(_.get(matches.groups, 'width', '0')),
            height: parseInt(_.get(matches.groups, 'height', '0')),
            quality: _.get(matches.groups, 'width') + 'p'
        }

    }

    parseVideoVariants(variants: Array<VideoVariants>) {

        const formats: ExtractedVideo['formats'] = [];

        // Extract all avialable different video formats of type mp4

        for (const variant of variants) {
            const type = _.get(variant, 'content_type', '');
            if (type.includes('mp4')) {
                const url = _.get(variant, 'url', '')
                const videoAttr = this.getAttrFromUrl(url);
                const data = {
                    url,
                    ext: type.replace('video/', ''),
                    rate: _.get(variant, 'bitrate', 0).toString(),
                    quality: videoAttr?.quality,
                    width: videoAttr?.width,
                    height: videoAttr?.height
                }
                formats.push(data);
            }
        }

        // Sort the video formats by the width
        return formats.sort(({ width }, { width: otherWidth }) => {
            if (!width || !otherWidth) {
                return 0;
            }

            return width - otherWidth;
        })
    }


    parseStatusInfo(status: StatusData) {
        // Strip out dummy url https://t.co/ToLXmbRB6A and new lines from the title
        const title = _.get(status, 'full_text', '').replace(/\n/g, ' ').replace(/\s+(?:https?:\/\/[^ ]+)/g, '');

        const medias = _.get(status, 'entities.media', []).concat(_.get(status, 'extended_entities.media', []));

        // Get only video media types
        const videoMedias = medias.filter(media => _.get(media, 'type') === 'video');

        if (_.isEmpty(videoMedias)) {
            return null;
        }

        // Extract the import properties from the video media
        const videoInfo = videoMedias.map((media) => {
            return {
                id: this.id,
                title,
                thumbnail: _.get(media, 'media_url_https') || _.get(media, 'media_url', ''),
                formats: this.parseVideoVariants(_.get(media, 'video_info.variants', []))
            }
        })

        return videoInfo;
    }


    async extractVideo(): Promise<ExtractedVideo[]> {
        
        //Get the video details from the Twitter API
        const data = await this.fetchStatusInfo();

        //Parse the response and extract video details
        const videos = this.parseStatusInfo(data);

        if (!videos) {
            throw new RequestError('No video was found by the server', 404);
        }

        if (!videos[0]?.formats[0]?.url) {
            throw new RequestError('No video was found by the server', 404)
        }

        return videos;
    }
}


export default TwitterExtractor;