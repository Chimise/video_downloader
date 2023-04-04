import crypto from 'node:crypto';
import logger from "./logger";


class Encrypter {
    private key: string;
    private encryptIV: string;
    private encryptMethod: string;

    constructor() {
        const { SECRET_KEY, SECRET_IV, ENCRYPT_METHOD } = process.env;
        if (!SECRET_KEY || !SECRET_IV || !ENCRYPT_METHOD) {
            logger.error('Please provide a SECRET_KEY, SECRET_IV and ENCRYPT_METHOD env variable to use Encoder');
            throw new Error('Please provide a SECRET_KEY, SECRET_IV and ENCRYPT_METHOD env variable');
        }

        this.encryptMethod = ENCRYPT_METHOD;
        this.key = crypto
            .createHash('sha512')
            .update(SECRET_KEY)
            .digest('hex')
            .substring(0, 32)
        this.encryptIV = crypto
            .createHash('sha512')
            .update(SECRET_IV)
            .digest('hex')
            .substring(0, 16)
    }

    encryptObj(objData: object) {
        const jsonData = JSON.stringify(objData);
        return this.encrypt(jsonData);
    }

    decryptObj<T extends object>(encryptedData: string) {
        const jsonData = this.decrypt(encryptedData);
        try {
            const obj = JSON.parse(jsonData) as T;
            return obj;
            
        } catch (error) {
            throw new Error('Invalid Data');
        }
    }

    encrypt(data: string) {
        const cipher = crypto.createCipheriv(this.encryptMethod, this.key, this.encryptIV);
        // Encrypts data and converts to hex and then to base64
        return Buffer.from(
            cipher.update(data, 'utf8', 'hex') + cipher.final('hex')
        ).toString('base64')
    }

    decrypt(encryptedData: string) {
        const buff = Buffer.from(encryptedData, 'base64')
        const decipher = crypto.createDecipheriv(this.encryptMethod, this.key, this.encryptIV);
        // Decrypts encrypted data and converts it to utf8
        return (
            decipher.update(buff.toString('utf8'), 'hex', 'utf8') +
            decipher.final('utf8')
        ) 
    }

}

export default new Encrypter();