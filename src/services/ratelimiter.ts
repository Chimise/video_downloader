import { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';
import RequestError from "@/utils/request_error";
import IpAddr from './ipaddr';

interface RatingLimitingOptions {
    limit?: number; 
    windowMs?: number; 
    delayAfter?: number;
    delayMs?: number
}

class RateLimiter {
    static applyMiddleware<Req extends object, Res extends object>(middleware: (req: Req, res: Res, next: (result: unknown) => void) => any) {
        return (req: NextApiRequest, res: NextApiResponse) => new Promise((reject, resolve) => {
            // @ts-expect-error
            middleware(req, res, (value => {
                value instanceof Error ? reject(value) : resolve(value);
            }))
        })
    }

    static getRateLimitMiddlewares({ limit = 10, windowMs = 60 * 1000, delayAfter = Math.round(10 / 2), delayMs = 500 }: RatingLimitingOptions = {}) {
        // @ts-ignore
        return [slowDown({ keyGenerator: IpAddr.getIpAdrr, windowMs, delayAfter, delayMs }), rateLimit({ keyGenerator: IpAddr.getIpAdrr, windowMs, max: limit })]
    }


    static async applyRateLimiting(req: NextApiRequest, res: NextApiResponse, handler: NextApiHandler) {
        try {
            await Promise.all(this.getRateLimitMiddlewares().map(this.applyMiddleware).map(middleware => middleware(req, res)));
        } catch (error) {
            res.status(429).json(new RequestError('Too many requests', 429));
        }

        return handler(req, res);
    }
}

export default RateLimiter;