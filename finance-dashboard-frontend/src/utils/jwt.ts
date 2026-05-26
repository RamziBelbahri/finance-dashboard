export function isTokenExpired(token: string): boolean {
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return (payload.exp * 1000) < Date.now();
    } catch (error) {
        console.error(error);
        return true;
    }
}

export function getTokenExpiration(token: string): number | null {
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.exp ? payload.exp * 1000 : null;

    } catch {
        return null;
    }
}