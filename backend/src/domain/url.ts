import { z } from 'zod';

export function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export const httpUrlSchema = z.string().trim().refine(isHttpUrl, {
  message: 'URL must use http or https',
});

export function toIsoDateTime(value: string): string | null {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return date.toISOString();
}

export const optionalTimestampSchema = z
  .string()
  .trim()
  .optional()
  .transform((value, ctx) => {
    if (!value) {
      return undefined;
    }

    const iso = toIsoDateTime(value);
    if (!iso) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Invalid date' });
      return z.NEVER;
    }

    return iso;
  });
