import HTMLParser from './base_parser';
import _ from 'lodash';
import type { LinkedInVideo } from '@/types';

// Parser for LinkedIn web pages

class LinkedInParser extends HTMLParser {
    constructor(html: string) {
        super(html);
    }

    getVideoJSONld () {
        const data = this.getJsonLD();
        if(!data) {
            return null;
        }

        const videoData = _.get(data, 'video');
        // Check if video field exist and it is a valid VideoObject type
        if(!videoData || _.get(videoData, '@type') !== 'VideoObject') {
            return null;
        }

        return videoData as LinkedInVideo;
    }

}

export default LinkedInParser;