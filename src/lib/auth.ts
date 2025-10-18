// Simplified auth for demo purposes - can be replaced with your preferred auth system
export async function verifyAuth(request: Request): Promise<number | null> {
    // For demo purposes, return a mock user ID
    // In production, implement your preferred authentication system
    return 12345;
}

// Helper to get user info
export async function getUserInfo(fid: number) {
    return {
        fid,
        address: '0x1234567890123456789012345678901234567890'
    };
}

// Helper function to make authenticated requests
export async function fetchWithAuth(url: string, options?: RequestInit) {
    try {
        // If options include a body, ensure Content-Type is set
        if (options?.body && !options.headers) {
            options.headers = {
                'Content-Type': 'application/json',
            };
        }

        // Make the request
        const response = await fetch(url, options);

        // Handle non-OK responses
        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }

        return response;
    } catch (error) {
        console.error('fetchWithAuth error:', error);
        throw error; // Re-throw to let the caller handle it
    }
}