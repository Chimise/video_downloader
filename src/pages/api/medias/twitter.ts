import TwitterExtractor from '@/extractors/twitter';
import { getVideoMetaData } from '@/controllers/media';
import RateLimiter from '@/services/ratelimiter';


export default RateLimiter.applyRateLimiting(getVideoMetaData(TwitterExtractor));