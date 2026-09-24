const DEFAULT_PRODUCTION_ORIGINS = ['https://bluey-short-url-frontend.vercel.app'];

export function resolveCorsOrigin(env: NodeJS.ProcessEnv): true | string[] {
  const raw = env.CORS_ORIGIN?.trim();
  if (raw) {
    if (raw === '*') {
      return true;
    }
    return raw.split(',').map((origin) => origin.trim()).filter(Boolean);
  }

  if ((env.NODE_ENV || 'development') !== 'production') {
    return true;
  }

  return DEFAULT_PRODUCTION_ORIGINS;
}

/**
 * Mock verification is a local convenience. Production never honors the flag.
 */
export function resolveAutoVerify(env: NodeJS.ProcessEnv): boolean {
  return env.NODE_ENV !== 'production' && env.DOMAIN_AUTO_VERIFY === 'true';
}
