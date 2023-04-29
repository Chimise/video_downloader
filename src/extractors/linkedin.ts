import _ from 'lodash';
import BaseExtractor from "./base";
import type { ExtractedVideo } from "@/types";
import LinkedInParser from "@/parsers/linkedin";
import Request from "@/utils/request";
import RequestError from "@/utils/request_error";


class LinkedInExtractor extends BaseExtractor {
    url: string;
    urlPattern: RegExp = /^https?:\/\/(?:www\.)?linkedin\.com\/(?:posts|feed\/update)\/[^\/]+?(?<id>\d{10,})/;
    id!: string;
    urlSamples = ['https://www.linkedin.com/posts/mrdavidorok_africa-nocode-mobileappdevelopment-activity-7046318506119688192-kGWZ', 'https://www.linkedin.com/posts/future-electronics%27%E2%80%8B-ftm-board-club_wireless-just-got-better-again-activity-7040993763980144640-To5Y', 'https://www.linkedin.com/posts/tanvir1407_frontend-development-ugcPost-7044714431708098561-fZ5W', "https://www.linkedin.com/feed/update/urn:li:activity:7045067314035052544"]

    constructor(url: string) {
        super();
        this.url = url.replace(/\?.*/, '');
    }

    async fetchHtml() {
        // Validate the url and extract the id
        this.id = this.validate();

        // Fetch the linkedin website    
        const res = await Request.send(this.url);

        // Parse the response as text
        const html = await res.parseText()

        if (!html) {
            throw new RequestError('Invalid Content');
        }

        return html
    }



    async extractVideo(): Promise<ExtractedVideo> {

        const html = await this.fetchHtml();

        const parser = new LinkedInParser(html);

        // Extract json data inside script tag of type application/ld+json
        const jsonld = parser.getVideoJSONld();

        // Extract and parse data in the video tag
        const videoData = parser.getVideoProps();

        if (!jsonld && !videoData) {
            throw new RequestError('Video could not be found');
        }

        // Extract the video title from multiple sources to avoid any failure
        const title = _.get(jsonld, 'title') || parser.getOgDescription() || parser.getMetaContent('description') || '';

        // Extract the video properties from multiple sources
        const formats = _.get(videoData, 'formats') || [_.pick(jsonld, ['url', 'ext', 'rate'])];

        // Check whether video is empty or has no url
        if (_.isEmpty(formats) || !_.get(formats[0], 'url')) {
            throw new RequestError('Video could not be found');
        }

        // Get thumbnail from multiple sources
        const thumbnail = _.get(videoData, 'thumbnail') || parser.getOgThumbnail() || _.get(jsonld, 'thumbnail');

        return {
            id: this.id,
            title,
            //@ts-ignore
            formats,
            thumbnail,
            origin_url: this.url
        }
    }

}


export default LinkedInExtractor;