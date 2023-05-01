import _ from 'lodash';
import { ExtractedVideo } from "@/types";
import BaseExtractor from "./base";
import Request from "@/utils/request";
import RequestError from '@/utils/request_error';



const r = String.raw.bind(String);

interface JSONDataSchema {
    require: Array<RequireDeffered | RequiredPrefetched>
}

enum RequireTypes {
    RequireDeferredReference = "RequireDeferredReference",
    RelayPrefetchedStreamCache = "RelayPrefetchedStreamCache"
}

type RequireSchema<T extends RequireTypes, D> = [T, string, [string], D];



type RequireDeffered = RequireSchema<RequireTypes.RequireDeferredReference, [string[], string]>

interface RequiredPrefetchedData {
    __bbox: {
        completed: boolean,
        result: {
            data: Media;
        }
    }
}

interface Media {
    video: {
        story: Story,
        creation_story: Story
    }
}

interface Story {
    attachments: Array<{ media: MediaType }> | { media: MediaType };
    id: string;
}

interface MediaType {
    __typename: string;
    preferred_thumbnail: {
        image: {
            uri: string
        };
        id: string;
    },
    id: string;
    width: number;
    height: number;
    permalink_url: string;
    playable_url: string;
    playable_url_quality_hd: string;
    url: string;
    playable_duration_in_ms: number;
    videoId: string;
    thumbnailImage?: {
        uri: string
    };
    name?: string;
}



type RequiredPrefetched = RequireSchema<RequireTypes.RelayPrefetchedStreamCache, [string, RequiredPrefetchedData]>;




// prettier-ignore
const regex = [
    r`(?:`,
    r`https?:\/\/`,
    r`(?:[\w-]+\.)?(?:facebook\.com|facebookcorewwwi\.onion)\/`,
    r`(?:[^#]*?\#!\/)?`,
    r`(?:`,
    r`(?:`,
    r`video\/video\.php|`,
    r`photo\.php|`,
    r`video\.php|`,
    r`video\/embed|`,
    r`story\.php|`,
    r`watch(?:\/live)?\/?`,
    r`)\?(?:.*?)(?:v|video_id|story_fbid)=|`,
    r`[^\/]+\/videos/(?:[^\/]+\/)?|`,
    r`[^\/]+\/posts\/|`,
    r`groups\/[^\/]+/permalink\/|`,
    r`watchparty\/`,
    r`)|`,
    r`facebook:`,
    r`)`,
    r`(?<id>[0-9]+)`
]

class FaceBookExtractor extends BaseExtractor {
    url: string;
    urlPattern: RegExp = new RegExp(regex.join(''));
    id!: string;

    constructor(url: string) {
        super();
        this.url = url;
    }

    search(pattern: RegExp, data: string, group?: string) {
        const matchedStr = data.match(pattern);
        if (!matchedStr) {
            return null;
        }
        if (!matchedStr.groups) {
            // Return the last matched string in the array
            return matchedStr.slice(-1)[0];
        } else {
            // If a group param exists return the value of the group
            if (group) {
                return matchedStr.groups[group]
            }
            // Return the value of the first matched group
            return Object.values(matchedStr.groups)[0];
        }

    }

    // Fetch the facebook url
    async fetchWebPage() {
        this.id = this.validate();
        console.log(this.id, 'Id if it exists')
        const req = await Request.send(this.url.replace('://m.facebook.com/', '://www.facebook.com/'));
        const text = await req.response.text();
        return text;
    }

    parseVideoGraphqlData(data: { media: MediaType }) {
        let format: ExtractedVideo['formats'][0];
        // Checks if the media resource is of type Video, it can also be and Audio
        const isVideo = _.get(data, 'media.__typename') === 'Video';
        if (!isVideo) {
            return null;
        }
        // Contains video attributes
        const videoAttr = _.get(data, 'media');
        // Get either the playable_url if exist or the playable_url_quality_hd
        let url = _.get(videoAttr, 'playable_url');
        if (url) {
            format = {
                url,
                quality: 'normal',
                ext: 'mp4'
            }

        } else {
            url = _.get(videoAttr, 'playable_url_quality_hd')
            format = {
                url,
                quality: 'hd',
                ext: 'mp4'

            }
        }

        _.assign(format, {
            width: _.get(videoAttr, 'width'),
            height: _.get(videoAttr, 'height'),
            duration: _.round(_.get(videoAttr, 'playable_duration_in_ms', 0) / 1000),
        })
        // Generate the quality from the width if it exists
        format.quality = format.width ? `${format.width}p` : format.quality;

        const id = _.get(videoAttr, 'id') || _.get(videoAttr, 'videoId') || this.id;
        const thumbnail = _.get(videoAttr, 'preferred_thumbnail.image.uri') || _.get(videoAttr, 'thumbnailImage.uri', '');
        let title = _.get(videoAttr, 'name');
        if (!title) {
            title = `Facebook Video ${id}`
        }

        return {
            id,
            thumbnail,
            title,
            formats: [format]
        }

    }

    handleExtractRelayData(videoData: Media) {
        const extractedVideos: ExtractedVideo[] = []
        const video = _.get(videoData, 'video');

        if (!video) {
            return null;
        }

        const attachments: Story['attachments'] = _.get(video, 'story.attachments', _.get(video, 'creation_story.attachments'));
        if (!attachments) {
            return null;
        }

        if (_.isArray(attachments)) {
            for (const attachment of attachments) {
                const extractedVideo = this.parseVideoGraphqlData(attachment);
                if (extractedVideo) {
                    extractedVideos.push(extractedVideo);
                }
            }
            return extractedVideos;
        }

        const extractedVideo = this.parseVideoGraphqlData(attachments);
        if (extractedVideo) {
            extractedVideos.push(extractedVideo);
        }

        return extractedVideos;
    }

    handleExtract(webPage: string) {
        let pattern = /handleWithCustomApplyEach\([^,]+,\s*(?<data>{.*?\"(?:dash_manifest|(?:playable_url(?:_quality_hd)?))\"\s*?\:.*?})\);/;
            let extractedVideoData: ExtractedVideo[] | null = null;
            let data = this.search(pattern, webPage, 'data');
        try {
            if (data) {
                const relayVideoData: JSONDataSchema = JSON.parse(data);
                for (const require of (_.get(relayVideoData, 'require')) || []) {
                    if (require[0] === RequireTypes.RelayPrefetchedStreamCache) {
                        const videoData = _.get(require[3]?.[1], '__bbox.result.data') || {};
                        extractedVideoData = this.handleExtractRelayData(videoData);
                        break;
                    }
                }
            }

            if(!extractedVideoData) {
                throw new RequestError('Facebook Video could not be found', 404);
            }

            return extractedVideoData;
        } catch (error) {

            throw error instanceof RequestError ? error : new RequestError('Error occured while fetching video', 500);
        }
    }

    async extractVideo(): Promise<ExtractedVideo | ExtractedVideo[]> {
        const page = await this.fetchWebPage();
        const extractedVideos = this.handleExtract(page);
        return extractedVideos;
    }
}


export default FaceBookExtractor;
