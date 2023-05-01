import { NextApiResponse } from 'next';
import * as sentry from '@sentry/node';
import logger from './logger';
import RequestError from '@/utils/request_error';

class ErrorManager {
    isProd: boolean = process.env.NODE_ENV === 'production';

    constructor() {
        if (this.isProd) {
            sentry.init({ dsn: process.env.SENTRY_DNS });
        }
    }

    public async report(err: any) {
        if (this.isProd) {
            // If error is an instance of RequestError with code 500 or error is generic, report error
            if (err instanceof RequestError && err.code === 500 || !(err instanceof RequestError)) {
                sentry.captureException(err);
                await sentry.flush(2000);
            }
        }
        logger.error(`Caught exception: ${JSON.stringify(err, Object.getOwnPropertyNames(err))}`);
    }

    static async handleError(res: NextApiResponse, err: any) {
        const error = err instanceof RequestError ? err : new RequestError('An error occurred');
        const errorManager = new ErrorManager();
        await errorManager.report(error);
        return res.status(error.code).json(error);
    }
}


export default ErrorManager;