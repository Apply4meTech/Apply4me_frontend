export const MAIN_PLANS = ['Starter', 'Standard', 'Pro', 'Premium'];

export function getPlanRank(planName) {
  return MAIN_PLANS.indexOf(planName);
}

export function isActiveUnexpiredSubscription(subscription) {
  if (!subscription?.planName || subscription.status !== 'active') return false;
  if (subscription.endDate && new Date(subscription.endDate) < Date.now()) return false;
  return true;
}

export function canPurchaseMainPlan(subscription, newPlanName) {
  const newRank = getPlanRank(newPlanName);
  if (newRank < 0) {
    return { allowed: false, isUpgrade: false, isRepurchase: false, message: 'Invalid plan' };
  }

  if (!isActiveUnexpiredSubscription(subscription)) {
    return { allowed: true, isUpgrade: false, isRepurchase: false };
  }

  const currentRank = getPlanRank(subscription.planName);
  if (newRank === currentRank) {
    return { allowed: true, isUpgrade: false, isRepurchase: true };
  }
  if (newRank < currentRank) {
    return {
      allowed: false,
      isUpgrade: false,
      isRepurchase: false,
      message: `You already have a higher plan (${subscription.planName}). Downgrades are not available.`
    };
  }

  return { allowed: true, isUpgrade: true, isRepurchase: false };
}
