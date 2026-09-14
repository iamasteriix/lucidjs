const requiredEnvVar = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
  return value;
}


export const env = {
  // app
  PORT: parseInt(requiredEnvVar('PORT')),
  ENDPOINT: requiredEnvVar('ENDPOINT'),
  NODE_ENV: requiredEnvVar('NODE_ENV'),

  // logging
  LOG_LEVEL: requiredEnvVar('LOG_LEVEL'),
} as const;
