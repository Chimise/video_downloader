import { ExtractedVideo, StatusData } from "@/types";
import BaseExtractor from "./base";
import Request from "@/utils/request";
import RequestError from "@/utils/request_error";

const defaultHeader = {
    'Authorization': `Bearer ${process.env.TWITTER_API_KEY}`
}

class TwitterExtractor extends BaseExtractor {
    urlPattern: RegExp = /https?:\/\/(?:(?:www|m(?:obile)?)\.)?twitter\.com\/(?:(?:i\/web|[^\/]+)\/status|statuses)\/(?<id>\d+)/;

    urlSamples = ['https://twitter.com/Naija_PR/status/1640800506703659009?s=20', 'https://twitter.com/Sports_Doctor2/status/1640729074644467712?s=20', 'https://twitter.com/kairokun2010/status/1634388496852058112?s=20', 'https://twitter.com/chimisep/status/1599464555314151424?t=5BNfS5ZZxffJ69j1xnToOA&s=19']

    url: string;

    constructor(url: string) {
        super()
        this.url = url
    }

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
        const statusId = this.validate();
        const token = await this.fetchGuestToken();
        const headers = {
            'x-guest-token': token,
            ...defaultHeader
        }
        //@ts-ignore
        const query  = new URLSearchParams({
            cards_platform: 'Web-12',
            include_cards: 1,
            include_reply_count: 1,
            include_user_entities: 0,
            tweet_mode: 'extended'
        }).toString();

        const res = await Request.send(this.genUrl(`/statuses/show/${statusId}.json?${query}`), {headers});

        const data = await res.parseJSON<StatusData>();

        if(!data) {
            throw new RequestError('Could not get video data');
        }

        return data;
    }







    async extractVideo(): Promise<ExtractedVideo> {
        const data = await this.fetchStatusInfo();
        console.log(data);
        return data;
    }
}


export default TwitterExtractor;