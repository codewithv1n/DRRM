const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY as string;


function hexToBytes(hex: string): Uint8Array {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
        bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
    }
    return bytes;
}


async function getKey(): Promise<CryptoKey> {
    const keyBytes = hexToBytes(ENCRYPTION_KEY);
    return crypto.subtle.importKey(
        'raw',
        keyBytes.buffer as ArrayBuffer,
        { name: 'AES-CBC' },
        false,
        ['decrypt']
    );
}


export async function decryptResponse<T = any>(encryptedData: string): Promise<T> {
    const [ivHex, encryptedHex] = encryptedData.split(':');
    
    const iv = hexToBytes(ivHex);
    const encryptedBytes = hexToBytes(encryptedHex);
    const key = await getKey();

    const decryptedBuffer = await crypto.subtle.decrypt(
        { name: 'AES-CBC', iv: iv.buffer as ArrayBuffer },
        key,
        encryptedBytes.buffer as ArrayBuffer
    );

    const decoder = new TextDecoder();
    const decryptedText = decoder.decode(decryptedBuffer);

    return JSON.parse(decryptedText) as T;
}


export function isEncryptedResponse(body: any): body is { encrypted: true; data: string } {
    return body && body.encrypted === true && typeof body.data === 'string';
}
