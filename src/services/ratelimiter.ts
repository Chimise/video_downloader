import { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import rateLimit, { Options, MemoryStore } from 'express-rate-limit';
import RequestError from "@/utils/request_error";
import IpAddr from './ipaddr';




class RateLimiter {
    // This function allow next.js to use express specific middlewares
    static applyMiddleware<Req extends object, Res extends object>(middleware: (req: Req, res: Res, next: (result: unknown) => void) => any) {
        return (req: NextApiRequest, res: NextApiResponse) => new Promise((resolve, reject) => {
            // @ts-ignore
            middleware(req, res, (value => {
                value instanceof Error ? reject(value) : resolve(value);
            }))
        })
    }


    // We apply the ratelimiting in this function
    static applyRateLimiting(handler: NextApiHandler, options?: Options) {
        const store = new MemoryStore();
        // The middleware should be configured here, configuring it inside the wrapper function lead to a sort of bug
        const errorHandler = (req: NextApiRequest, res: NextApiResponse) => res.status(429).json(new RequestError('Too many requests, please try again', 429));
        //@ts-ignore
        const rateMiddleware = rateLimit({ max: 10, keyGenerator: IpAddr.getIpAdrr.bind(IpAddr), windowMs: 5 * 60 * 1000, standardHeaders: true, legacyHeaders: false, message: errorHandler, store, ...(options || {}) });
        return async (req: NextApiRequest, res: NextApiResponse) => {

            try {
                await this.applyMiddleware(rateMiddleware)(req, res);
            } catch (error) {
                return errorHandler(req, res);
            }

            return handler(req, res);
        }
    }
}

export default RateLimiter;