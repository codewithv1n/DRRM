/**
 * Encrypted fetch wrapper.
 * Drop-in replacement for the native fetch() that automatically
 * decrypts AES-256-CBC encrypted responses from the backend.
 */

import { decryptResponse, isEncryptedResponse } from './crypto';

/**
 * A wrapper around the native fetch() that automatically decrypts
 * encrypted API responses. Use this instead of fetch() for all
 * API calls.
 *
 * Usage (identical to fetch):
 *   const res = await encryptedFetch(`${API_URL}/api/inventory`);
 *   const data = await res.json(); // Already decrypted!
 */
export async function encryptedFetch(
    input: RequestInfo | URL,
    init?: RequestInit
): Promise<Response> {
    const response = await fetch(input, init);

    // Clone the response so we can read the body without consuming it
    const cloned = response.clone();

    try {
        const body = await cloned.json();

        if (isEncryptedResponse(body)) {
            // Decrypt the data
            const decrypted = await decryptResponse(body.data);
            const decryptedString = JSON.stringify(decrypted);

            // Create a new Response with the decrypted data
            return new Response(decryptedString, {
                status: response.status,
                statusText: response.statusText,
                headers: response.headers,
            });
        }
    } catch {
        // If JSON parsing fails, return the original response
    }

    // Return original response if not encrypted
    return response;
}
