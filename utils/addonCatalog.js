/**
 * Must stay in sync with Apply4me_backend/utils/addonCatalog.js (planName + amounts).
 */
export const ADDON_PLAN_CODES = [
  'ATS_ADDON',
  'ADDON_JOB_SEARCH',
  'ADDON_LINKEDIN',
  'ADDON_INTERVIEW_PREP'
];

export const PRICING_ADDONS = [
  {
    planCode: 'ADDON_JOB_SEARCH',
    storageName: 'job_search',
    name: 'Job Search by Our Team',
    desc: 'We search and shortlist relevant jobs based on role & location.',
    priceAud: 69
  },
  {
    planCode: 'ATS_ADDON',
    storageName: 'resume_rewrite',
    name: 'Custom Resume Rewrite (ATS-Optimised)',
    desc: 'Complete resume rewrite with keyword optimisation.',
    priceAud: 39
  },
  {
    planCode: 'ADDON_LINKEDIN',
    storageName: 'linkedin_optimisation',
    name: 'LinkedIn Profile Optimisation',
    desc: 'Headline, summary & recruiter keyword optimisation.',
    priceAud: 29
  },
  {
    planCode: 'ADDON_INTERVIEW_PREP',
    storageName: 'interview_prep',
    name: 'Interview Prep',
    desc: 'Preparation session for your interviews.',
    priceAud: 20
  }
];

export function isAddonPlanCode(planName) {
  return typeof planName === 'string' && ADDON_PLAN_CODES.includes(planName);
}

/** Display name for User.purchasedAddons[].name (storage keys). */
export function getAddonDisplayLabel(storageName) {
  if (!storageName) return 'Add-on';
  const row = PRICING_ADDONS.find((a) => a.storageName === storageName);
  if (row) return row.name;
  return String(storageName).replace(/_/g, ' ');
}
