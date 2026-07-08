import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Express Entry Canada — Category-Based Draws & $99 CRS Consultation | Immisa Immigration',
  description:
    'Book a $99 consultation to get a full CRS score calculation and check every active Express Entry category — French-language, healthcare, STEM, trades — against your profile. Regulated Canadian Immigration Consultants.',
};

export default function ExpressEntryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
