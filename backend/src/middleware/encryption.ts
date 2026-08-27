import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';

const ALGORITHM = 'aes-256-cbc';

function getEncryptionKey(): Buffer {
    const key = process.env.ENCRYPTION_KEY;
    if (!key) {
        throw new Error('ENCRYPTION_KEY is not defined in environment variables');
    }
   
    return Buffer.from(key, 'hex');
}


function encrypt(text: string): string {
    const key = getEncryptionKey();
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
}


export function encryptResponse(req: Request, res: Response, next: NextFunction): void {
    const originalJson = res.json.bind(res);

    res.json = function (body: any): Response {
        try {
            
            const plainText = JSON.stringify(body);
            const encryptedData = encrypt(plainText);

            
            return originalJson({
                encrypted: true,
                data: encryptedData
            });
        } catch (error) {
            console.error('Encryption error:', error);
          
            return originalJson(body);
        }
    };

    next();
}
