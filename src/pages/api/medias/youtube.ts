import YoutubeExtractor from "@/extractors/youtube";
import { getVideoMetaData } from "@/controllers/media";
import RateLimiter from "@/services/ratelimiter";


export default RateLimiter.applyMiddleware(getVideoMetaData(YoutubeExtractor));