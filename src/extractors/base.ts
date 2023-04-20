import _ from 'lodash';
import { ExtractedVideo } from '../types';
import RequestError from '@/utils/request_error';

/**
 * An extractor is a Javascript class that when given a url return video data of type ExtractedVideo or ExtractedVideo array
 * All extractors should implement this base extractor
 */

abstract class BaseExtractor {
    abstract urlPattern: RegExp;
    abstract url: string;


    validate(errorMessage: string = 'Please enter a valid url') {
        const matches = this.url.match(this.urlPattern);
        if(!matches) {
            throw new RequestError(errorMessage, 400);
        }

        return _.get(matches.groups, 'id') || matches[1];
    }

    abstract extractVideo(): Promise<ExtractedVideo | ExtractedVideo[]>
}


export default BaseExtractor;