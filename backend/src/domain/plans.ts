export type Plan = 'FREE' | 'PRO' | 'ENTERPRISE';

export interface PlanPolicy {
  /** Null means the plan has no active-link cap. */
  maxActiveUrls: number | null;
  customAlias: boolean;
  customDomains: boolean;
}

export const PLAN_POLICIES: Record<Plan, PlanPolicy> = {
  FREE: { maxActiveUrls: 10, customAlias: false, customDomains: false },
  PRO: { maxActiveUrls: null, customAlias: true, customDomains: true },
  ENTERPRISE: { maxActiveUrls: null, customAlias: true, customDomains: true },
};

export function planPolicy(plan: Plan): PlanPolicy {
  return PLAN_POLICIES[plan];
}

export function hasReachedUrlLimit(plan: Plan, activeUrls: number): boolean {
  const max = PLAN_POLICIES[plan].maxActiveUrls;
  return max !== null && activeUrls >= max;
}
