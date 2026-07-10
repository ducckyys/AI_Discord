const buckets = new Map<string, number[]>();
export const isRateLimited = (key: string, max: number, windowMs: number): boolean => { const now = Date.now(); const values = (buckets.get(key) ?? []).filter((time) => time > now - windowMs); if (values.length >= max) return true; values.push(now); buckets.set(key, values); return false; };
