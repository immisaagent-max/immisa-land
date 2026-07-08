'use client';

import { useState } from 'react';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import ServiceLeadForm from '@/components/ServiceLeadForm';
import { useReveal } from '@/lib/useReveal';

const ELIGIBLE_RELATIONSHIPS = [
  { title: 'Spouse', desc: 'Legally married to your sponsor, in a marriage valid both where it took place and under Canadian law.' },
  { title: 'Common-law partner', desc: 'Living together continuously with your sponsor in a conjugal relationship for at least 12 months.' },
  { title: 'Conjugal partner', desc: "In a committed relationship for at least 1 year but unable to live together or marry due to circumstances like immigration status or legal/religious barriers — this stream applies only outside Canada." },
];

const REFUSAL_REASONS = [
  { title: 'Incomplete relationship evidence', desc: 'Photos, communication history, and joint finances that don\'t convincingly show a genuine, ongoing relationship.' },
  { title: 'Inconsistencies between spouses\' statements', desc: 'Mismatched details about how you met, your relationship timeline, or living arrangements during interviews or in forms.' },
  { title: 'Missing or incorrect forms', desc: 'A single missing document or form error can trigger a Procedural Fairness Letter or an outright refusal.' },
  { title: 'Choosing the wrong stream', desc: 'Filing inland when outland suits your situation better (or vice versa) can add months of unnecessary delay.' },
];

const DOCUMENT_CHECKLIST = [
  'Proof of legal marriage or common-law/conjugal relationship',
  'Photos together spanning the relationship, with family and friends',
  'Communication history (messages, call logs, emails) showing an ongoing relationship',
  'Evidence of joint finances — shared bank accounts, leases, bills, insurance',
  'Sponsor\'s proof of status (citizenship or PR) and ability to sponsor',
  'Police certificates, medical exams, and biometrics for the sponsored person',
  'Statutory declarations from family and friends confirming the relationship',
];

const SS_FAQS: { q: string; a: string }[] = [
  {
    q: "What's the difference between inland and outland spousal sponsorship?",
    a: "Inland applications are filed while the sponsored spouse or partner is living in Canada — they may qualify for an open work permit while the application is processed, but typically cannot appeal a refusal to the Immigration Appeal Division. Outland applications are filed while the sponsored person is outside Canada (or can be, even if they're currently in Canada) and are processed through the visa office serving their country of residence — refusals here carry full appeal rights. We assess your travel patterns, admissibility, and timeline needs to recommend the stream least likely to face delays or refusal.",
  },
  {
    q: 'Can my spouse work in Canada while the sponsorship is processing?',
    a: "If you're sponsoring your spouse or partner inland, they may be eligible to apply for an open work permit alongside (or shortly after) the sponsorship application, letting them work for almost any employer in Canada while the PR application is processed. Eligibility conditions apply and can change — we confirm current eligibility as part of your assessment.",
  },
  {
    q: 'How long does spousal sponsorship take?',
    a: "IRCC publishes a service standard, but actual processing time varies by stream, visa office, and application completeness — inland and outland cases have moved at different speeds depending on volume. We check current published processing times for your specific stream during your paid consultation, and we build applications to avoid the delays we see most often: missing documents and inconsistent relationship evidence.",
  },
  {
    q: 'What relationship evidence do I actually need?',
    a: "IRCC looks for evidence across four dimensions: shared finances, shared living arrangements, social recognition of the relationship (by family and friends), and the nature of the relationship itself (communication history, shared activities). A few photos and a marriage certificate are rarely enough on their own — we build a complete evidence file mapped to what officers are trained to look for.",
  },
  {
    q: 'My spouse was refused before — can we reapply?',
    a: "Yes. Many refusals stem from fixable issues — incomplete evidence, inconsistent statements, or an avoidable stream choice — rather than a genuine relationship problem. We review the refusal letter, identify exactly what IRCC flagged, and rebuild the application to address it directly.",
  },
  {
    q: 'Do you handle other immigration categories too?',
    a: 'Yes — beyond Spousal Sponsorship, we also assist with Express Entry, Provincial Nominee Programs, work and study permits, visitor visas, super visas, business immigration, and appeals.',
  },
];

export default function SpousalSponsorshipPage() {
  useReveal();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      <SiteHeader active="spousal-sponsorship" />

      <main className="flex-1">
        {/* HERO */}
        <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1B2731 0%, #2E4256 55%, #4E6076 100%)' }}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
            <div className="anim-fade-up">
              <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-4" style={{ backgroundColor: 'rgba(232,144,138,.18)', color: 'var(--coral)' }}>
                Spousal &amp; Common-Law Partner Sponsorship
              </span>
              <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-5">
                Bring Your Spouse or Partner to Canada — Without the Guesswork
              </h1>
              <p className="text-white/70 text-base md:text-lg mb-8 max-w-md">
                Most refusals come from incomplete relationship evidence or the wrong stream — not a genuine relationship problem. We build a complete, well-documented application from day one.
              </p>
              <div className="flex flex-wrap gap-3 mb-8">
                <a href="#lead-form" className="btn-coral">Book My $99 Consultation</a>
                <a href="#inland-outland" className="btn-ghost">Inland vs. Outland</a>
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-white/60">
                <span>✓ RCIC Regulated</span>
                <span>✓ Full Evidence Review</span>
                <span>✓ Inland &amp; Outland Strategy</span>
              </div>
            </div>
            <div className="anim-fade-up anim-delay-2">
              <ServiceLeadForm category="Spousal Sponsorship" title="Book Your $99 Consultation" subtitle="We'll review your situation and recommend the right stream — confirmed within one business day." />
            </div>
          </div>
        </section>

        {/* WHO CAN SPONSOR / BE SPONSORED */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-20">
          <div className="text-center max-w-2xl mx-auto mb-12 reveal">
            <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-3" style={{ backgroundColor: 'rgba(78,96,118,.1)', color: 'var(--slate)' }}>
              Eligibility
            </span>
            <h2 className="text-2xl md:text-3xl font-black mb-3" style={{ color: 'var(--slate-dark)' }}>Who Qualifies</h2>
            <p className="text-gray-500">To sponsor, you must be a Canadian citizen or permanent resident, 18 or older, and able to demonstrate a genuine relationship with the person you're sponsoring.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {ELIGIBLE_RELATIONSHIPS.map(r => (
              <div key={r.title} className="info-card reveal">
                <h3 className="font-black text-base mb-2" style={{ color: 'var(--slate-dark)' }}>{r.title}</h3>
                <p className="text-sm text-gray-500">{r.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-4 sm:px-6"><div className="glow-line" /></div>

        {/* INLAND VS OUTLAND */}
        <section id="inland-outland" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-20">
          <div className="text-center max-w-2xl mx-auto mb-12 reveal">
            <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-3" style={{ backgroundColor: 'rgba(232,144,138,.15)', color: '#b5564f' }}>
              Choosing Your Stream
            </span>
            <h2 className="text-2xl md:text-3xl font-black mb-3" style={{ color: 'var(--slate-dark)' }}>Inland vs. Outland Sponsorship</h2>
            <p className="text-gray-500">The right choice depends on where the sponsored spouse lives, their immigration status, and how important an open work permit or appeal rights are to your situation.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="info-card reveal">
              <h3 className="font-black text-base mb-3" style={{ color: 'var(--slate-dark)' }}>Inland</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>✓ Filed while the sponsored spouse is living in Canada</li>
                <li>✓ May qualify for an open work permit while the application processes</li>
                <li>✗ Generally no Immigration Appeal Division (IAD) appeal if refused</li>
                <li>✗ Travel outside Canada during processing needs care to avoid abandoning the application</li>
              </ul>
            </div>
            <div className="info-card reveal">
              <h3 className="font-black text-base mb-3" style={{ color: 'var(--slate-dark)' }}>Outland</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>✓ Full IAD appeal rights if the application is refused</li>
                <li>✓ Sponsored spouse can usually still visit Canada during processing</li>
                <li>✗ No open work permit pathway tied to this stream</li>
                <li>✓ Often the better fit when the couple is not yet living together in Canada</li>
              </ul>
            </div>
          </div>
          <div className="text-center mt-8 reveal">
            <a href="#lead-form" className="btn-outline-slate">Which Stream Fits My Situation?</a>
          </div>
        </section>

        {/* OPEN WORK PERMIT */}
        <section className="py-16 md:py-20" style={{ backgroundColor: 'var(--bg)' }}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-10 items-start">
            <div className="reveal">
              <h2 className="text-2xl md:text-3xl font-black mb-4" style={{ color: 'var(--slate-dark)' }}>The Spousal Open Work Permit</h2>
              <p className="text-gray-500 mb-4 leading-relaxed">
                If you're sponsoring your spouse or partner while they're living with you in Canada, they may be able to apply for an open work permit alongside your sponsorship application — letting them work for almost any employer while IRCC processes your case, rather than waiting years to work legally.
              </p>
              <p className="text-gray-500 leading-relaxed">
                Eligibility conditions and processing timelines for this pathway are set by IRCC policy and do change — we confirm current eligibility and help you apply for both at the same time to minimize the gap.
              </p>
            </div>
            <div className="info-card reveal">
              <h3 className="font-black text-sm uppercase tracking-wide mb-4" style={{ color: 'var(--slate)' }}>Typically Required</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>✓ A complete, submitted spousal sponsorship application (inland)</li>
                <li>✓ Valid temporary resident status, or eligibility to restore it</li>
                <li>✓ Proof of the genuine relationship with your sponsor</li>
              </ul>
            </div>
          </div>
        </section>

        {/* DOCUMENT CHECKLIST */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-20">
          <div className="grid md:grid-cols-2 gap-10 items-start">
            <div className="reveal">
              <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-3" style={{ backgroundColor: 'rgba(78,96,118,.1)', color: 'var(--slate)' }}>
                Evidence That Matters
              </span>
              <h2 className="text-2xl md:text-3xl font-black mb-4" style={{ color: 'var(--slate-dark)' }}>What IRCC Actually Looks For</h2>
              <p className="text-gray-500 mb-4 leading-relaxed">
                Officers assess your relationship across shared finances, shared living arrangements, social recognition by family and friends, and the nature of the relationship itself. A marriage certificate and a handful of photos are rarely enough on their own.
              </p>
              <a href="#lead-form" className="btn-outline-slate">Get My Document Checklist</a>
            </div>
            <div className="info-card reveal">
              <h3 className="font-black text-sm uppercase tracking-wide mb-4" style={{ color: 'var(--slate)' }}>Core Document Checklist</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                {DOCUMENT_CHECKLIST.map(d => <li key={d}>✓ {d}</li>)}
              </ul>
            </div>
          </div>
        </section>

        {/* WHY REFUSALS HAPPEN */}
        <section className="py-16 md:py-20" style={{ backgroundColor: 'var(--bg)' }}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-12 reveal">
              <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-3" style={{ backgroundColor: 'rgba(232,144,138,.15)', color: '#b5564f' }}>
                Avoid the Common Traps
              </span>
              <h2 className="text-2xl md:text-3xl font-black mb-3" style={{ color: 'var(--slate-dark)' }}>Why Spousal Applications Get Refused</h2>
              <p className="text-gray-500">Almost every refusal we review traces back to one of these — not to the relationship itself.</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              {REFUSAL_REASONS.map(r => (
                <div key={r.title} className="info-card reveal">
                  <h3 className="font-black text-sm mb-2" style={{ color: 'var(--slate-dark)' }}>{r.title}</h3>
                  <p className="text-sm text-gray-500">{r.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHY IMMISA */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-20">
          <div className="text-center max-w-2xl mx-auto mb-12 reveal">
            <h2 className="text-2xl md:text-3xl font-black mb-3" style={{ color: 'var(--slate-dark)' }}>Why Couples Choose Immisa</h2>
            <p className="text-gray-500">Led by Sumbal Anees, a Regulated Canadian Immigration Consultant (RCIC), Immisa has guided sponsorship applications across Asia, the Middle East, Europe, and the Americas.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { icon: '📋', title: 'Complete Evidence Files', desc: 'We build relationship evidence mapped to exactly what officers are trained to assess — not a generic checklist.' },
              { icon: '🧭', title: 'Right Stream, First Time', desc: 'Inland vs. outland decided on your specific travel, status, and timeline needs — not a default guess.' },
              { icon: '🛡️', title: 'RCIC Regulated', desc: 'Licensed and accountable to Canada\'s immigration consultant regulatory body — your case is always in compliant hands.' },
            ].map(f => (
              <div key={f.title} className="info-card text-center reveal">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-black text-base mb-2" style={{ color: 'var(--slate-dark)' }}>{f.title}</h3>
                <p className="text-sm text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* PROCESS */}
        <section className="py-16 md:py-20" style={{ backgroundColor: 'var(--bg)' }}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl md:text-3xl font-black text-center mb-12 reveal" style={{ color: 'var(--slate-dark)' }}>Your Path From Application to Approval</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { step: '01', title: '$99 Consultation', desc: 'We review your relationship, status, and timeline to recommend inland or outland.' },
                { step: '02', title: 'Evidence Building', desc: 'We compile a complete relationship evidence file mapped to IRCC\'s assessment criteria.' },
                { step: '03', title: 'Submission & OWP', desc: 'We file your sponsorship application — and the open work permit alongside it, if eligible.' },
                { step: '04', title: 'Processing Support', desc: 'We track your case, respond to any requests, and support you through to a decision.' },
              ].map(p => (
                <div key={p.step} className="reveal">
                  <div className="text-3xl font-black mb-2" style={{ color: 'var(--coral)' }}>{p.step}</div>
                  <h3 className="font-black text-base mb-1" style={{ color: 'var(--slate-dark)' }}>{p.title}</h3>
                  <p className="text-sm text-gray-500">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16 md:py-20">
          <h2 className="text-2xl md:text-3xl font-black text-center mb-10 reveal" style={{ color: 'var(--slate-dark)' }}>Spousal Sponsorship FAQ</h2>
          <div className="space-y-3">
            {SS_FAQS.map((f, i) => (
              <div key={f.q} className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: 'var(--border-lt)' }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left px-5 py-4 flex items-center justify-between gap-4"
                >
                  <span className="font-bold text-sm" style={{ color: 'var(--slate-dark)' }}>{f.q}</span>
                  <span className="text-lg flex-shrink-0" style={{ color: 'var(--coral)' }}>{openFaq === i ? '−' : '+'}</span>
                </button>
                {openFaq === i && <div className="px-5 pb-4 text-sm text-gray-500 leading-relaxed">{f.a}</div>}
              </div>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
