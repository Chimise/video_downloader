export interface ExtractedVideo extends Video {
    id: string;
    title: string;
    formats?: VideoFormat[],
    thumbnail: string;
    origin_url: string;
}

interface Video {
    url: string;
    ext: string;

}

interface VideoFormat extends Video {
    quality: number;
}

export interface LinkedInVideo {
    '@type': string;
    name: string;
    description: string;
    thumbnailUrl: string;
    contentUrl: string;
}
