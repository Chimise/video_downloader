import _ from 'lodash';
import { ExtractedVideo } from '../types';
import RequestError from '@/utils/request_error';

abstract class BaseExtractor {
    abstract urlPattern: RegExp;
    abstract url: string;


    validate() {
        const matches = this.url.match(this.urlPattern);
        if(!matches) {
            throw new RequestError('Please enter a valid url', 400);
        }

        return _.get(matches.groups, 'id') || matches[1];
    }

    abstract extractVideo(): Promise<ExtractedVideo | ExtractedVideo[]>
}


export default BaseExtractor;