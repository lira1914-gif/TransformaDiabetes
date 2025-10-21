export interface TrialStatus {
  hasAccess: boolean;
  isTrialing: boolean;
  isActive: boolean;
  isCanceled: boolean;
  trialExpired: boolean;
  trialEnded: boolean;
  daysRemaining: number;
  daysSinceStart: number;
  subscriptionStatus: string | null;
  startDate: string;
}
