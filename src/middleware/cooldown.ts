const cooldowns = new Map<string, number>();
export const remainingCooldown = (key: string, duration: number): number => { const now = Date.now(); const until = cooldowns.get(key) ?? 0; if (until > now) return until - now; cooldowns.set(key, now + duration); return 0; };
