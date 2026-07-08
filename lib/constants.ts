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
