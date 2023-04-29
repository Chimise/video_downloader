import { NextApiRequest, NextApiResponse } from "next";
import _ from 'lodash';


class IpAddr {
    static getIpAdrr(req: NextApiRequest): string | undefined {
        //@ts-ignore
        return req.headers['x-forwarded-for'] || this.getIpFromHeader(req.headers) || req.connection.remoteAddress;
    }

    static getIpFromHeader(headers: NextApiRequest['headers']) {
        let possibleIps = _.filter([headers['x-forwarded-for'], headers['x-real-ip']], Boolean);
        let ip = _.flatMap(possibleIps);
        return ip[0];
    }
}


export default IpAddr;