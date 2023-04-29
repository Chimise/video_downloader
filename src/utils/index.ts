import fs from 'node:fs';
import path from 'node:path';
import { promisify } from 'node:util';
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
    const readFile = promisify(fs.readFile);
    const jsonPath = path.join(process.cwd(), 'downloaders.json');
    console.log(jsonPath);
    const jsonData = await readFile(jsonPath, 'utf8');
    return JSON.parse(jsonData) as Array<Downloader>;
}

export const capitalizeWord = (word: string) => {
    return word.slice(0, 1).toUpperCase() + word.slice(1);
}