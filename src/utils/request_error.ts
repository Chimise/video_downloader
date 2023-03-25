class RequestError extends Error {
    code: number;
    payload?: any;
    constructor(message: string, code: number = 500, payload?: any) {
        super(message);
        this.code = code;
        this.payload = payload;
    }

    toJSON() {
        const {message, code, payload} = this;
        return {
            message,
            code,
            payload
        }
    }
}

export default RequestError;