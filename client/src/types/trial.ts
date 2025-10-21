export interface TrialStatus {
  hasAccess: boolean;
  isTrialing: boolean;
  isActive: boolean;
  isCanceled: boolean;
  trialExpired: boolean;
  daysRemaining: number;
  daysSinceStart: number;
  subscriptionStatus: string | null;
  startDate: string;
}
