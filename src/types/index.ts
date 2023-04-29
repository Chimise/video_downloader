export interface ExtractedVideo {
    id: string;
    title: string;
    formats: Array<VideoProp>;
    thumbnail?: string;
    origin_url?: string;
}

export interface VideoProp {
    url: string;
    ext: string;
    quality?: string;
    rate?: string;
    width?: number;
    height?: number;
}

export interface StatusData {
    id: number;
    id_str: string;
    full_text: string;
    entities: {
        media: Array<Media>
    },
    extended_entites: {
        media: Array<Media>
    },
    user: TwitterUser

}

interface Media {
    id: number;
    id_str: string;
    media_url: string;
    media_url_https: string;
    display_url: string;
    type: 'photo' | 'video';
    original_info: {
        width: number;
        height: number;
    },
    sizes: {
        [size: string]: ImageSizes
    },
    video_info: {
        aspect_ration: [number, number],
        duration_millis: number,
        variants: Array<VideoVariants>
    }


}

export interface ImageSizes {
    w: number;
    h: number;
    resize: string;

}

export interface VideoVariants {
    content_type: string;
    url: string;
    bitrate?: number;
}

export interface TwitterUser {
    id: number;
    name: string;
    screen_name: string;
}


export interface Downloader {
    iconName: string;
    name: string;
    isReady: boolean;
}