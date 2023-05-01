import LinkedInExtractor from "@/extractors/linkedin";
import { getVideoMetaData } from "@/controllers/media";
import RateLimiter from "@/services/ratelimiter";


export default RateLimiter.applyRateLimiting(getVideoMetaData(LinkedInExtractor));