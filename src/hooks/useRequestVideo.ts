import { useReducer, useCallback, useMemo } from "react";
import type { ExtractedVideo } from "@/types";

type Data = Array<ExtractedVideo> | ExtractedVideo;

interface State {
    data: Data | null;
    error: string | null;
    isLoading: boolean;
}

const initialState: State = {
    data: null,
    error: null,
    isLoading: false
}

type actions = { type: 'INIT' } | { type: 'SUCCESS', payload: Data } | { type: 'ERROR', payload: string };

const reducer = (state: State, action: actions): State => {
    switch (action.type) {
        case 'INIT':
            return {
                data: null,
                error: null,
                isLoading: true
            }
        case 'ERROR':
            return {
                data: null,
                error: action.payload,
                isLoading: false
            }
        case 'SUCCESS':
            return {
                data: action.payload,
                error: null,
                isLoading: false
            }
        default:
            return state;
    }
}

const baseUrl = '/api/medias';

const fetcher = async (url: string) => {
    const response = await fetch(url);
    const data = await response.json();
    if (!response.ok) {
        throw new Error((data as Error).message);
    }

    return data;
}


const useRequestVideo = () => {
    const [state, dispatch] = useReducer(reducer, initialState);


    const sendRequest = useCallback(async (downloader: string, url: string) => {
        // If the downloader is an empty string add it like that else add a forwardslash before the downloader
        const path = downloader ? `/${downloader}` : downloader;
        const resourceUrl = `${baseUrl}${path}?url=${encodeURIComponent(url)}`;
        try {

            dispatch({ type: 'INIT' });
            const responseData: Data = await fetcher(resourceUrl);
            dispatch({ type: 'SUCCESS', payload: responseData });

            // Return this function incase you want to access the raw response
            return {
                exec: () => {
                    return responseData;
                }
            }
        } catch (error) {
            dispatch({ type: 'ERROR', payload: (error as Error).message })

            // Return this function incase you want to access the raw error;
            return {
                exec: () => {
                    throw error;
                }
            }
        }
    }, []);

    const { data, error, isLoading } = state;

    const memoizedData = useMemo(() => {
        return {
            data,
            error,
            isLoading
        }
    }, [data, error, isLoading])

    return {
        sendRequest,
        ...memoizedData
    }
}


export default useRequestVideo;