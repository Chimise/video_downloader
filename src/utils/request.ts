import RequestError from "./request_error";
import randomUserAgent from "./user_agent";


type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS';

interface SendOptions {
    headers?: Record<string, string>;
    method?: Method;
    body?: any;
    retries?: number;
    delay?: number;
    timeout?: number;
}

type RequestOptions = Omit<SendOptions, 'retries' | 'delay' | 'timeout'>

class Request {
    response: Response
    // Default Request headers
    static defaultHeaders: Record<string, string> = {
        'Accept-Charset': 'ISO-8859-1,utf-8;q=0.7,*;q=0.7',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'en-us,en;q=0.5'
    }

    constructor(response: Response) {
        this.response = response;
    }

    contentType() {
        return this.response.headers.get('Content-Type')?.toLowerCase();
    }

    isContentHtml() {
        if (this.contentType()?.includes('text/html')) {
            return true;
        }
        return false;
    }

    isContentText() {
        if (this.contentType()?.includes('text/plain')) {
            return true;
        }
        return false;
    }

    async parseText() {
        if (this.isContentHtml() || this.isContentText()) {
            return this.response.text()
        }
    }

    isContentJSON() {
        if (this.contentType() === 'application/json') {
            return true;
        }
        return false;
    }

    async parseJSON<T = {}>() {
        if (this.isContentJSON()) {
            return this.response.json() as T;
        }
    }



    static send(url: string, { headers = {}, method = "GET", body, retries = 3, delay = 1000, timeout = 5000 }: SendOptions = {}) {
        
        let updatedHeaders = {
            ...this.defaultHeaders,
            ...headers,
            'User-Agent': randomUserAgent()
        }
        return new Promise<Request>((res, rej) => {
            const controller = new AbortController();

            // Start the timeout
            const id = setTimeout(controller.abort, timeout);

            // Abort the Request on timeout
            controller.signal.addEventListener('abort', () => {
                rej(new Error('Time out reached'));
            });

            const wrapper = (retryCount: number) => {
                // Start the Request
                
                this.startRequest(url, { headers: updatedHeaders, method, body }, controller.signal).then((response) => {
                    if (!response.ok) {
                        const error = new RequestError('An error occurred', response.status);
                        // Return an error response
                        if (response.status === 404) {
                            return rej(error)
                        }
                        // Retry again
                        throw error;
                    }
                    clearTimeout(id);
                    res(new Request(response));

                }).catch(err => {
                    if (retryCount > 0) {
                        // Update User-Agent header
                        updatedHeaders = {
                            ...updatedHeaders,
                            'User-Agent': randomUserAgent()
                        }
                        // Retry the request
                        setTimeout(() => wrapper(--retryCount), delay);
                    } else {
                        if (err.name !== 'AbortError') {
                            rej(err);
                        }
                    }
                })
            }

            // Call the wrapper function to start the request
            wrapper(retries);
        })

    }

    static async startRequest(url: string, { headers, method, body }: RequestOptions, signal: AbortSignal) {
        const response = await fetch(url, {
            headers,
            method,
            body: body ? JSON.stringify(body) : undefined,
            signal,
            redirect: 'follow'
        });

        return response;
    }
}


export default Request;



