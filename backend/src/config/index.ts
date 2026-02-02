import dotenv from 'dotenv';

dotenv.config();

// Validate critical environment variables in production
if (process.env.NODE_ENV === 'production') {
  const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET', 'REDIS_URL'];
  const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:', missingVars.join(', '));
    console.error('Please set these variables before starting the application.');
    process.exit(1);
  }
  
  // Warn if using default JWT secret
  if (process.env.JWT_SECRET === 'change-me-in-production') {
    console.warn('⚠️  WARNING: Using default JWT_SECRET. Please change it in production!');
  }
}

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  logLevel: process.env.LOG_LEVEL || 'info',
  
  database: {
    url: process.env.DATABASE_URL || '',
  },
  
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },
  
  jwt: {
    secret: process.env.JWT_SECRET || 'change-me-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  
  rateLimit: {
    max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
    timeWindow: parseInt(process.env.RATE_LIMIT_TIME_WINDOW || '60000', 10),
  },
  
  queue: {
    name: process.env.QUEUE_NAME || 'analytics-queue',
  },
  
  apiUrl: process.env.API_URL || 'http://localhost:3000',
};

