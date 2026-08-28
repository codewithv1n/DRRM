
import { decryptResponse, isEncryptedResponse } from './crypto';

const cache = new Map<string, { data: string; timestamp: number }>();
const CACHE_DURATION_MS = 30000; 
export async function encryptedFetch(
    input: RequestInfo | URL,
    init?: RequestInit
): Promise<Response> {
    const method = init?.method?.toUpperCase() || 'GET';
    const cacheKey = typeof input === 'string' ? input : input.toString();

   
    if (method === 'GET') {
        const cached = cache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < CACHE_DURATION_MS) {
           
            return new Response(cached.data, {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        }
    }

   
    const response = await fetch(input, init);
    const cloned = response.clone();

    try {
        const body = await cloned.json();

        if (isEncryptedResponse(body)) {
            
            const decrypted = await decryptResponse(body.data);
            const decryptedString = JSON.stringify(decrypted);

            
            if (method === 'GET' && response.ok) {
                cache.set(cacheKey, { data: decryptedString, timestamp: Date.now() });
            }

           
            return new Response(decryptedString, {
                status: response.status,
                statusText: response.statusText,
                headers: response.headers,
            });
        }
    } catch {
        
    }

    return response;
}
