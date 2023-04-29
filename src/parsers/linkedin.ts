import HTMLParser from './base';
import _, { at } from 'lodash';

interface VideoData {
    '@type': string;
    name: string;
    description: string;
    thumbnailUrl: string;
    contentUrl: string;
}

// Parser for LinkedIn web pages

class LinkedInParser extends HTMLParser {
    constructor(html: string) {
        super(html);
    }

    getVideoAttrFromUrl(url: string) {
        const pattern = /\/(?<ext>\w*?)-(?<quality>\w*?)-(?<rate>\w*?)-/;
        const matches = url.match(pattern);
        if(!matches || !matches.groups) {
            return null;
        }
        
        return {
            ext: _.get(matches.groups, 'ext'),
            quality: _.get(matches.groups, 'quality'),
            rate: _.get(matches.groups, 'rate')
        }
    }

    getVideoJSONld () {
        const data = this.getJsonLD<{video: VideoData}>();
        if(!data) {
            return null;
        }

        // Get the video field in the JSONld field
        const videoData = _.get(data, 'video');

        // Check if video field exist and it is a valid VideoObject type
        if(!videoData || _.get(videoData, '@type') !== 'VideoObject') {
            return null;
        }

        

        const videoProps = this.getVideoAttrFromUrl(videoData.contentUrl || '');

        return {
            title: videoData.description,
            thumbnail: videoData.thumbnailUrl,
            url: videoData.contentUrl,
            ext: videoProps?.ext,
            quality: videoProps?.quality,
            rate: videoProps?.rate
        }


    }

    getId() {
        const url = this.getMetaOgContent('url') || this.getMetaContent('lnkd:url') || _.get(this.getJsonLD(), '@id');
        if(!url) {
            return null;
        }
        // Extract the Id from the article url
        const pattern = /[:-](?<id>\d{5,})[:-]?.*$/;

        const id = _.get(url.match(pattern)?.groups, 'id');
        
        return id || null;
    }

    getVideoProps() {
        const videoElem = this.root.querySelector('video[data-sources]');
        if(!videoElem) {
            return null;
        }

        const data = this.unescape(videoElem.getAttribute('data-sources') || '');

        try {
            const videoData: Array<{src: string; type: string; 'data-bitrate': string}>  = JSON.parse(data);
            const thumbnail = this.unescape(videoElem.getAttribute('data-poster-url') || '');
            return {
                formats: videoData.map(data => {
                    const attr = this.getVideoAttrFromUrl(data.src);
                    return {
                        url: data.src,
                        ext: data.type.replace('video/', '') || attr?.ext,
                        rate: data['data-bitrate'] || attr?.rate,
                        quality: attr?.quality || 'unknown'
                    }
                }),
                thumbnail
            }
        } catch (error) {
            return null;
        };
    }
}

export default LinkedInParser;