import { NextApiRequest} from "next";
import _ from 'lodash';


class IpAddr {
    static getIpAdrr(req: NextApiRequest): string | undefined {
        if(process.env.NODE_ENV === 'development') {
            return '127.0.0.1';
        }
        //@ts-ignore
        return this.getIpFromHeader(req.headers) || req.connection.remoteAddress;
    }

    static getIpFromHeader(headers: NextApiRequest['headers']) {
        let possibleIps = _.filter([headers['x-forwarded-for'], headers['x-real-ip']], Boolean);
        let ips = _.flatMap(possibleIps);
        return ips[0];
    }
}


export default IpAddr;