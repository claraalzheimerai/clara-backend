import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3000', 10),
  API_VERSION: process.env.API_VERSION || 'v1',

  CORS: {
    ALLOWED_ORIGINS: (process.env.ALLOWED_ORIGINS || 'http://localhost:5500')
      .split(',')
      .map((o) => o.trim()),
  },

  AI_SERVICE: {
    URL: process.env.AI_SERVICE_URL || 'http://localhost:8000',
    TIMEOUT_MS: parseInt(process.env.AI_SERVICE_TIMEOUT_MS || '60000', 10),
  },

  UPLOAD: {
    MAX_SIZE_BYTES: parseInt(process.env.UPLOAD_MAX_SIZE_MB || '50', 10) * 1024 * 1024,
    TEMP_DIR: process.env.UPLOAD_TEMP_DIR || 'uploads/temp',
  },

  LOG: {
    LEVEL: process.env.LOG_LEVEL || 'info',
    DIR: process.env.LOG_DIR || 'logs',
  },

  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
} as const;