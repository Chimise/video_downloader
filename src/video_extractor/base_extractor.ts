import {ExtractedVideo} from '../types';
import _ from 'lodash';

abstract class BaseExtractor {
    abstract urlPattern: RegExp;
    abstract url: string;
    abstract isMatch: boolean;


    extractId() {
        if(!this.isMatch) {
            throw new Error('Pattern was not matched');
        }
        const matches = this.url.match(this.urlPattern);
        if(!matches || !matches.groups) {
            throw new Error('The pattern was not matched or no id group was matched');
        }
        
        return _.get(matches.groups, 'id');
    }

    abstract extractVideo(): ExtractedVideo
}


export default BaseExtractor;