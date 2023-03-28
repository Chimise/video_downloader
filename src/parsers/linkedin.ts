import HTMLParser from './base';
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

    getVideoProps() {
        const videoElem = this.root.querySelector('video[data-sources]');
        if(!videoElem) {
            return null;
        }

        const data = this.unescape(videoElem.getAttribute('data-sources') || '');

        try {
            const videoObj: Array<{src: string; type: string; 'data-bitrate': string}>  = JSON.parse(data);
            const thumbnailUrl = this.unescape(videoElem.getAttribute('data-poster-url') || '');
        } catch (error) {
            return null;
        };
    }
}

export default LinkedInParser;