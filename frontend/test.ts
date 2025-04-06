const isValidUrl = async (url: string): Promise<boolean> => {
    try {
        // Step 1: Basic format and protocol check
        const parsed = new URL(url);
        if (!["http:", "https:"].includes(parsed.protocol)) return false;

        // Step 2: Regex check for stricter domain validation
        const domainRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/;
        if (!domainRegex.test(url)) return false;

        // Step 3: Filter out obviously invalid or internal URLs
        const hostname = parsed.hostname.toLowerCase();
        const blockedHosts = ["localhost", "127.0.0.1", "example.com", "example.invalid"];
        if (blockedHosts.includes(hostname)) return false;

        // Step 4: Attempt to reach the URL (CORS might block reading the result)
        const response = await fetch(parsed.href, {
            method: "HEAD",
            mode: "cors",
        });

        // Step 5: Check status code (must be 2xx)
        return response.ok;
    } catch (err) {
        return false;
    }
};

console.log(isValidUrl("bdsjbjsdfkl jrfdjhd jhds;ln"))