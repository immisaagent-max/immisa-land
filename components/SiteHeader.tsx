'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function SiteHeader({ active }: { active?: 'home' | 'express-entry' | 'spousal-sponsorship' }) {
  const links = [
    { href: '/', label: 'Home', key: 'home' },
    { href: '/express-entry', label: 'Express Entry', key: 'express-entry' },
    { href: '/spousal-sponsorship', label: 'Spousal Sponsorship', key: 'spousal-sponsorship' },
  ] as const;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b" style={{ borderColor: 'var(--border-lt)' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        <Link href="/">
          <Image src="/images/immisa-logo.png" alt="Immisa Immigration" width={140} height={72} style={{ objectFit: 'contain' }} priority unoptimized />
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-bold">
          {links.map(l => (
            <Link
              key={l.key}
              href={l.href}
              className="transition-colors"
              style={{ color: active === l.key ? 'var(--coral-h, #b5564f)' : 'var(--slate-dark)' }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <a href="tel:+16474101067" className="hidden sm:flex items-center gap-2 text-sm font-bold whitespace-nowrap" style={{ color: 'var(--slate-dark)' }}>
          📞 +1 (647) 410-1067
        </a>
      </div>
    </header>
  );
}
