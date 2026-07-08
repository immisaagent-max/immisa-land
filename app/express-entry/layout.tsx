import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Express Entry Canada — Category-Based Draws & Free CRS Assessment | Immisa Immigration',
  description:
    'Get a free CRS score calculation and check every active Express Entry category — French-language, healthcare, STEM, trades — against your profile. Regulated Canadian Immigration Consultants.',
};

export default function ExpressEntryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
