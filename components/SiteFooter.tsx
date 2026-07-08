import Image from 'next/image';

export default function SiteFooter() {
  return (
    <footer style={{ backgroundColor: 'var(--slate-darker)' }} className="text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid sm:grid-cols-3 gap-8">
        <div>
          <Image src="/images/immisa-logo.png" alt="Immisa Immigration" width={130} height={67} style={{ objectFit: 'contain', filter: 'brightness(0) invert(1)' }} unoptimized />
          <p className="text-xs text-white/50 mt-3">Regulated Canadian Immigration Consultants for your new beginning.</p>
        </div>
        <div className="text-sm text-white/70 space-y-1.5">
          <p className="font-bold text-white text-xs uppercase tracking-wide mb-2">Contact</p>
          <p>110 James Street, Suite 200<br />St. Catharines, ON, Canada, L2R 7E8</p>
          <p><a href="tel:+16474101067" className="hover:text-white">+1 (647) 410-1067</a></p>
          <p><a href="mailto:info@immisa.ca" className="hover:text-white">info@immisa.ca</a></p>
        </div>
        <div className="text-xs text-white/40 leading-relaxed">
          <p className="font-bold text-white text-xs uppercase tracking-wide mb-2">Disclaimer</p>
          <p>Immisa Immigration provides services through Regulated Canadian Immigration Consultants (RCIC). Information on this page is general in nature, may not reflect the most recent IRCC policy changes, and is not a guarantee of any immigration outcome. Processing times, CRS cut-offs, and category-based draw criteria change frequently — confirm current details with our team or directly with IRCC.</p>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-[11px] text-white/40">
        © {new Date().getFullYear()} Immisa Immigration. All rights reserved.
      </div>
    </footer>
  );
}
