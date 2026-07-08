export const CATEGORIES = ['Express Entry', 'Spousal Sponsorship', 'Other'] as const;
export type Category = (typeof CATEGORIES)[number];

export const LEAD_STATUSES = ['New', 'Contacted', 'Qualified', 'Converted', 'Lost'] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const CRM_STAGES = [
  'New',
  'Contacted',
  'Consultation Booked',
  'Retained',
  'Not Eligible / Lost',
] as const;
export type CrmStage = (typeof CRM_STAGES)[number];

export const CALL_OUTCOMES = [
  'Connected – Interested',
  'Connected – Not Eligible',
  'No Answer',
  'Left Voicemail',
  'Booked Consultation',
  'Requested Callback',
  'Not Interested',
] as const;
export type CallOutcome = (typeof CALL_OUTCOMES)[number];

export const CATEGORY_COLORS: Record<string, string> = {
  'Express Entry': 'bg-[#4E6076]/10 text-[#4E6076] border-[#4E6076]/30',
  'Spousal Sponsorship': 'bg-[#E8908A]/15 text-[#b5564f] border-[#E8908A]/40',
  Other: 'bg-gray-100 text-gray-600 border-gray-300',
};

export const FUNDS_RANGES = [
  'Under CA$5,000',
  'CA$5,000 – CA$15,000',
  'CA$15,000 – CA$30,000',
  'CA$30,000+',
  'Not sure yet',
] as const;

export const EDUCATION_LEVELS = [
  'High school',
  'Diploma / certificate (1–2 yr)',
  "Bachelor's degree",
  "Master's degree",
  'Doctoral (PhD)',
  'Trade certification',
] as const;

export const EXPERIENCE_RANGES = [
  'Less than 1 year',
  '1–2 years',
  '3–5 years',
  '6–9 years',
  '10+ years',
] as const;

export const LANGUAGE_LEVELS = [
  'Not tested yet',
  'IELTS/CELPIP — CLB 4–6',
  'IELTS/CELPIP — CLB 7–8',
  'IELTS/CELPIP — CLB 9+',
  'TEF/TCF (French) taken',
] as const;
