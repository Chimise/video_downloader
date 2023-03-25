import BaseExtractor from "./base_extractor";
import type { ExtractedVideo } from "@/types";

class LinkedInExtractor extends BaseExtractor {
    url: string;
    urlPattern: RegExp = /hello/;
    isMatch: boolean;
    constructor(url: string) {
        super()
        this.url = url;
        this.isMatch = this.urlPattern.test(this.url);
    }

    extractVideo(): ExtractedVideo {
        
    }
    
}


export default LinkedInExtractor;