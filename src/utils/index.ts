import fs from 'node:fs/promises';
import path from 'node:path';
import { NextApiRequest, NextApiResponse } from "next"
import RequestError from "./request_error";
import { Downloader } from '@/types';


export const getQuery = (request: NextApiRequest, name: string) => {
    const query = request.query[name];
    if (!query) {
        return null;
    }

    return Array.isArray(query) ? query[0] : query;
}

export const handleError = (err: unknown, res: NextApiResponse) => {
    const error = err instanceof RequestError ? err : new RequestError('An error occurred');
    res.status(error.code).json(error);
}

export const getSupportedDownloaders = async () => {
    const jsonPath = path.join(process.cwd(), 'downloaders.json');
    const jsonData = await fs.readFile(jsonPath, 'utf-8');
    return JSON.parse(jsonData) as Array<Downloader>;
}