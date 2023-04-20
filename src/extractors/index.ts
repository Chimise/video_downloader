import BaseExtractor from './base';
import FaceBookExtractor from './facebook';
import LinkedInExtractor from './linkedin';
import TwitterExtractor from './twitter';
import YoutubeExtractor from './youtube';

/**All extractors that implements the BaseExtractor should be registered here
 * The extractors will be used in the /api/medias route.
**/

export {BaseExtractor};


export default [FaceBookExtractor, LinkedInExtractor, TwitterExtractor, YoutubeExtractor] as Array<new (url: string) => BaseExtractor>;