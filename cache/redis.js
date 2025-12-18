// cache/redis.js
const Redis = require('ioredis');

const redisEnabled = process.env.REDIS_ENABLED === 'true';

let redisClient = null;

if (redisEnabled) {
  redisClient = new Redis({
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
    db: process.env.REDIS_DB || 0,
    retryStrategy: (times) => {
      if (times > 3) return null; // Stop retrying after 3 attempts
      return Math.min(times * 50, 2000);
    },
    maxRetriesPerRequest: 3
  });

  redisClient.on('connect', () => console.log('✅ Redis client connected'));
  redisClient.on('error', (err) => console.error('❌ Redis error:', err.message));
}

const kundliCache = {
  get: async (cacheKey) => {
    if (!redisEnabled || !redisClient) return null;
    try {
      const data = await redisClient.get(`kundli:${cacheKey}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Redis GET error:', error.message);
      return null;
    }
  },

  set: async (cacheKey, data, ttl = 86400) => {
    if (!redisEnabled || !redisClient) return true;
    try {
      await redisClient.setex(`kundli:${cacheKey}`, ttl, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Redis SET error:', error.message);
      return false;
    }
  },

  delete: async (cacheKey) => {
    if (!redisEnabled || !redisClient) return true;
    try {
      await redisClient.del(`kundli:${cacheKey}`);
      return true;
    } catch (error) {
      return false;
    }
  },

  clearAll: async () => {
    if (!redisEnabled || !redisClient) return true;
    try {
      const keys = await redisClient.keys('kundli:*');
      if (keys.length > 0) await redisClient.del(...keys);
      return true;
    } catch (error) {
      return false;
    }
  }
};

process.on('SIGTERM', () => {
  if (redisClient) {
    redisClient.quit(() => console.log('Redis client disconnected'));
  }
});

module.exports = { redisClient, kundliCache };
