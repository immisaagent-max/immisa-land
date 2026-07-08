'use client';

import { useState } from 'react';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import ExpressEntryLeadForm from '@/components/ExpressEntryLeadForm';
import { useReveal } from '@/lib/useReveal';

const CRS_FACTORS = [
  { factor: 'Age', max: '110 pts', note: 'Peaks for ages 20–29, declines each year after 30' },
  { factor: 'Education', max: '150 pts', note: "PhD scores highest; each credential must be verified by an ECA" },
  { factor: 'Official languages', max: '160 pts', note: 'English and/or French — CLB 9+ unlocks the biggest gains' },
  { factor: 'Canadian work experience', max: '80 pts', note: 'Skilled experience inside Canada scores far higher than foreign experience alone' },
  { factor: 'Skill transferability', max: '100 pts', note: 'Combines education + language + work experience for compounding points' },
  { factor: 'Additional points', max: '600 pts', note: 'Provincial nomination (+600), valid job offer, sibling in Canada, French ability, Canadian credential' },
];

const CATEGORY_ROUNDS = [
  {
    name: 'French-language proficiency',
    detail: 'The most frequent and accessible category. Candidates with CLB 7+ in French have recently been invited at CRS cut-offs well below general draws — often the single biggest lever for candidates who don\'t otherwise score high enough.',
    freq: 'Roughly every 2–3 weeks',
  },
  {
    name: 'Healthcare & social services occupations',
    detail: 'Nurses, personal support workers, physicians, and other healthcare occupations on IRCC\'s eligible list are prioritized, reflecting Canada\'s ongoing healthcare labour shortage.',
    freq: 'Roughly monthly',
  },
  {
    name: 'STEM occupations',
    detail: 'Software engineers, data scientists, mathematicians, and related technical occupations. Less frequent than French or healthcare rounds, but ITA volumes are competitive when they run.',
    freq: 'Several times a year',
  },
  {
    name: 'Trades occupations',
    detail: 'Skilled trades such as electricians, welders, and machinists — a category that consistently cuts off lower than general draws.',
    freq: 'Periodic',
  },
  {
    name: 'Transport occupations',
    detail: 'Truck drivers and other transport-sector occupations facing labour shortages.',
    freq: 'Periodic',
  },
  {
    name: 'Agriculture & agri-food occupations',
    detail: 'Occupations supporting Canada\'s agriculture and food-processing sectors.',
    freq: 'Periodic',
  },
];

const EE_FAQS: { q: string; a: string }[] = [
  {
    q: 'What is Express Entry?',
    a: "Express Entry is the federal application management system IRCC uses to select permanent residents through three programs: the Federal Skilled Worker Program (FSWP), Canadian Experience Class (CEC), and Federal Skilled Trades Program (FSTP). It also manages Provincial Nominee Program (PNP) candidates linked to Express Entry. Eligible candidates enter a pool, are ranked by CRS score, and receive an Invitation to Apply (ITA) when selected in a round.",
  },
  {
    q: 'What is a category-based Express Entry draw, exactly?',
    a: 'Alongside general, CEC, FSTP, and PNP-specific rounds, IRCC runs category-based rounds that target candidates with specific work experience (e.g. healthcare, STEM, trades) or French-language ability — regardless of whether their CRS score would qualify in a general round. If your profile fits an active category, you can receive an ITA at a meaningfully lower score than the general cut-off.',
  },
  {
    q: 'How is my CRS score calculated?',
    a: 'The Comprehensive Ranking System scores four core areas — age, education, official language ability, and Canadian/foreign work experience — plus skill-transferability combinations and additional points for provincial nomination, a valid job offer, French proficiency, sibling in Canada, or a Canadian credential. We calculate this precisely during your paid consultation and identify which additional points you may be missing.',
  },
  {
    q: 'What CRS score do I need?',
    a: "It depends entirely on the round type and timing — general draws, category draws, and CEC/PNP-specific draws all cut off at different scores, and those scores move with every round. Rather than quote a number that will be outdated by the time you read this, we check the current cut-off trends for your specific profile during your consultation.",
  },
  {
    q: "I don't think my CRS score is high enough — is it still worth applying?",
    a: 'Often, yes. Category-based draws (especially French-language) have consistently invited candidates at scores well below general-draw cut-offs. We assess whether you qualify for any active category before concluding you\'re not competitive.',
  },
  {
    q: 'How long does the Express Entry process take?',
    a: "Once invited, IRCC's service standard for a complete Express Entry application is 6 months. Building a strong profile, gathering an Educational Credential Assessment (ECA), and language testing beforehand typically takes several weeks to a few months, depending on how quickly documents can be obtained.",
  },
  {
    q: 'Do you handle other immigration categories too?',
    a: 'Yes — beyond Express Entry, we also assist with Spousal Sponsorship, Provincial Nominee Programs, work and study permits, visitor visas, super visas, business immigration, and appeals.',
  },
];

export default function ExpressEntryPage() {
  useReveal();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      <SiteHeader active="express-entry" />

      <main className="flex-1">
        {/* HERO */}
        <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1B2731 0%, #2E4256 55%, #4E6076 100%)' }}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
            <div className="anim-fade-up">
              <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-4" style={{ backgroundColor: 'rgba(232,144,138,.18)', color: 'var(--coral)' }}>
                Express Entry · Canada Permanent Residence
              </span>
              <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-5">
                Category-Based Draws Are Rewriting Who Gets Invited
              </h1>
              <p className="text-white/70 text-base md:text-lg mb-8 max-w-md">
                IRCC no longer selects on CRS score alone. French-language ability, healthcare, STEM, and trades occupations are getting Invitations to Apply at scores general draws would reject. We check every active pathway against your profile.
              </p>
              <div className="flex flex-wrap gap-3 mb-8">
                <a href="#lead-form" className="btn-coral">Book My $99 Consultation</a>
                <a href="#categories" className="btn-ghost">See Active Categories</a>
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-white/60">
                <span>✓ RCIC Regulated</span>
                <span>✓ Full CRS &amp; Category Review</span>
                <span>✓ Every Active Category Checked</span>
              </div>
            </div>
            <div className="anim-fade-up anim-delay-2">
              <ExpressEntryLeadForm />
            </div>
          </div>
        </section>

        {/* THREE PROGRAMS */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-20">
          <div className="text-center max-w-2xl mx-auto mb-12 reveal">
            <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-3" style={{ backgroundColor: 'rgba(78,96,118,.1)', color: 'var(--slate)' }}>
              How Express Entry Works
            </span>
            <h2 className="text-2xl md:text-3xl font-black mb-3" style={{ color: 'var(--slate-dark)' }}>
              One System, Three Ways In
            </h2>
            <p className="text-gray-500">Express Entry manages candidates across three federal programs, plus provincially nominated candidates. You only need to qualify for one.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { title: 'Federal Skilled Worker (FSWP)', desc: 'Skilled foreign work experience, language ability, and education that meet a minimum points threshold — the main pathway for candidates applying from outside Canada.' },
              { title: 'Canadian Experience Class (CEC)', desc: 'At least one year of skilled work experience inside Canada in the last 3 years — often the fastest route for temporary workers and international graduates already here.' },
              { title: 'Federal Skilled Trades (FSTP)', desc: 'Qualified trades experience with a valid job offer or a certificate of qualification issued by a Canadian province or territory.' },
            ].map(p => (
              <div key={p.title} className="info-card reveal">
                <h3 className="font-black text-base mb-2" style={{ color: 'var(--slate-dark)' }}>{p.title}</h3>
                <p className="text-sm text-gray-500">{p.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-gray-400 mt-6 reveal">Provincial Nominee Program (PNP) candidates nominated by a province or territory also enter the pool with a guaranteed +600 CRS points.</p>
        </section>

        <div className="max-w-6xl mx-auto px-4 sm:px-6"><div className="glow-line" /></div>

        {/* CRS BREAKDOWN */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-20">
          <div className="grid md:grid-cols-2 gap-10 items-start">
            <div className="reveal">
              <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-3" style={{ backgroundColor: 'rgba(78,96,118,.1)', color: 'var(--slate)' }}>
                CRS Score
              </span>
              <h2 className="text-2xl md:text-3xl font-black mb-4" style={{ color: 'var(--slate-dark)' }}>
                What Actually Moves Your Ranking
              </h2>
              <p className="text-gray-500 mb-4 leading-relaxed">
                The Comprehensive Ranking System scores every candidate out of 1,200 points. Most applicants underestimate how much skill-transferability and additional points (provincial nomination, a valid job offer, French ability) can add — often the difference between missing a general draw and qualifying easily.
              </p>
              <ul className="space-y-2 text-sm text-gray-600 mb-6">
                <li>✓ Full CRS calculation across every factor</li>
                <li>✓ Identify missing points you can realistically add</li>
                <li>✓ Educational Credential Assessment (ECA) guidance</li>
                <li>✓ Language test strategy (IELTS/CELPIP/TEF/TCF)</li>
              </ul>
              <a href="#lead-form" className="btn-outline-slate">Book My $99 Consultation</a>
            </div>
            <div className="info-card reveal">
              <h3 className="font-black text-sm uppercase tracking-wide mb-4" style={{ color: 'var(--slate)' }}>CRS Factors at a Glance</h3>
              <div className="space-y-3">
                {CRS_FACTORS.map(f => (
                  <div key={f.factor} className="flex justify-between gap-4 text-sm border-b pb-2" style={{ borderColor: 'var(--border-lt)' }}>
                    <div>
                      <div className="font-bold" style={{ color: 'var(--slate-dark)' }}>{f.factor}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{f.note}</div>
                    </div>
                    <div className="font-black whitespace-nowrap" style={{ color: 'var(--coral)' }}>{f.max}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CATEGORY-BASED DRAWS */}
        <section id="categories" className="py-16 md:py-20" style={{ backgroundColor: 'var(--bg)' }}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-12 reveal">
              <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-3" style={{ backgroundColor: 'rgba(232,144,138,.15)', color: '#b5564f' }}>
                Category-Based Selection
              </span>
              <h2 className="text-2xl md:text-3xl font-black mb-3" style={{ color: 'var(--slate-dark)' }}>Active Draw Categories</h2>
              <p className="text-gray-500">IRCC targets specific categories throughout the year, each with its own frequency and cut-off pattern. Category and cut-off details change frequently — this reflects the pathways IRCC has been actively running.</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              {CATEGORY_ROUNDS.map(c => (
                <div key={c.name} className="info-card reveal">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <h3 className="font-black text-sm" style={{ color: 'var(--slate-dark)' }}>{c.name}</h3>
                    <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-full whitespace-nowrap" style={{ backgroundColor: 'rgba(78,96,118,.1)', color: 'var(--slate)' }}>{c.freq}</span>
                  </div>
                  <p className="text-sm text-gray-500">{c.detail}</p>
                </div>
              ))}
            </div>
            <div className="note reveal mt-8 text-center text-xs text-gray-400 max-w-2xl mx-auto">
              CRS cut-offs and which categories IRCC is actively running shift with every round. Rather than quote figures that could be outdated by the time you read this, we check the live picture against your profile during your paid consultation.
            </div>
          </div>
        </section>

        {/* WHY IMMISA */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-20">
          <div className="text-center max-w-2xl mx-auto mb-12 reveal">
            <h2 className="text-2xl md:text-3xl font-black mb-3" style={{ color: 'var(--slate-dark)' }}>Why Candidates Choose Immisa for Express Entry</h2>
            <p className="text-gray-500">Led by Sumbal Anees, a Regulated Canadian Immigration Consultant (RCIC), Immisa has guided Express Entry candidates across Asia, the Middle East, Europe, and the Americas.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { icon: '🧮', title: 'Full CRS Optimization', desc: "We don't just calculate your score — we identify realistic ways to raise it before you enter the pool." },
              { icon: '🎯', title: 'Every Category Checked', desc: 'We track which categories are active and whether your occupation or language ability qualifies you for a lower cut-off.' },
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
            <h2 className="text-2xl md:text-3xl font-black text-center mb-12 reveal" style={{ color: 'var(--slate-dark)' }}>Your Path From Profile to PR</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { step: '01', title: '$99 CRS Consultation', desc: 'We calculate your score and check every active category against your profile.' },
                { step: '02', title: 'Profile Optimization', desc: 'ECA, language testing, and profile strategy to raise your ranking before you enter the pool.' },
                { step: '03', title: 'ITA & Application', desc: 'Once invited, we prepare a complete application within IRCC\'s 6-month service standard.' },
                { step: '04', title: 'Decision & Landing', desc: 'We manage follow-up requests and support you through to a final decision.' },
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
          <h2 className="text-2xl md:text-3xl font-black text-center mb-10 reveal" style={{ color: 'var(--slate-dark)' }}>Express Entry FAQ</h2>
          <div className="space-y-3">
            {EE_FAQS.map((f, i) => (
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
