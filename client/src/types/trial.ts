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

export interface IntakeForm {
  nombre?: string;
}

export interface UserProgress {
  chatStats: {
    currentStreak: number;
    totalActiveDays: number;
    lastUsedDate: string | null;
    totalMessages: number;
  };
  trialProgress: {
    daysCompleted: number;
    daysRemaining: number;
    percentComplete: number;
  };
  suggestedActions: string[];
}
