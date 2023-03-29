import { NextApiRequest, NextApiResponse } from "next"
import RequestError from "./request_error";


export const getQuery = (request: NextApiRequest, name: string) => {
    const query = request.query[name];
    if(!query) {
        return null;
    }

    return Array.isArray(query) ? query[0] : query;
}

export const handleError = (err: unknown, res:NextApiResponse ) => {
    const error = err instanceof RequestError ? err : new RequestError('An error occurred');
    res.status(error.code).json(error);
}