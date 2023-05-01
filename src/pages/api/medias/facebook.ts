import FaceBookExtractor from "@/extractors/facebook";
import { getVideoMetaData } from "@/controllers/media";
import RateLimiter from "@/services/ratelimiter";

export default RateLimiter.applyRateLimiting(getVideoMetaData(FaceBookExtractor));