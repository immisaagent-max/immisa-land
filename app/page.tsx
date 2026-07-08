'use client';

import { useEffect, useState } from 'react';
import { reportConversion } from '@/lib/gtag';
import { useReveal } from '@/lib/useReveal';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

type Category = 'Express Entry' | 'Spousal Sponsorship' | 'Other';

const FAQS: { q: string; a: string }[] = [
  {
    q: 'What is a category-based Express Entry draw?',
    a: 'IRCC periodically invites candidates from specific categories (e.g. French-language proficiency, healthcare, trades, STEM) in addition to general CRS-score draws. Depending on your background, you may qualify through a category draw even with a lower CRS score.',
  },
  {
    q: 'How is my CRS score calculated?',
    a: 'Your Comprehensive Ranking System score is based on age, education, language ability (English/French), work experience, and factors like a valid job offer or provincial nomination. We calculate this for you during your paid consultation.',
  },
  {
    q: "What's the difference between inland and outland spousal sponsorship?",
    a: "Inland applications are filed while the sponsored spouse is in Canada (often with open work permit eligibility); outland applications are filed while they're outside Canada and processed through the visa office serving their country of residence. We help you choose the faster, safer path for your situation.",
  },
  {
    q: 'How long does spousal sponsorship take?',
    a: 'Processing times vary by stream and IRCC workload, typically ranging from about 12 to 24 months. We help you avoid the most common delays caused by incomplete documentation.',
  },
  {
    q: 'Do you handle other immigration categories too?',
    a: 'Yes — beyond Express Entry and Spousal Sponsorship, we also assist with Provincial Nominee Programs, work and study permits, visitor visas, super visas, business immigration, and appeals. Ask us during your consultation.',
  },
];

export default function LandingPage() {
  const [category, setCategory] = useState<Category>('Other');
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get('category');
    if (cat === 'Express Entry' || cat === 'Spousal Sponsorship') setCategory(cat);
  }, []);

  useReveal();

  function scrollTo(id: string, cat?: Category) {
    if (cat) setCategory(cat);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email) return;
    setSubmitting(true);
    setError('');
    const res = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, category }),
    });
    setSubmitting(false);
    if (!res.ok) {
      setError('Something went wrong — please try again or call us directly.');
      return;
    }
    setSubmitted(true);
    reportConversion();
  }

  return (
    <>
      <SiteHeader active="home" />

      <main className="flex-1">
        {/* HERO */}
        <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1B2731 0%, #2E4256 55%, #4E6076 100%)' }}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
            <div className="anim-fade-up">
              <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-4" style={{ backgroundColor: 'rgba(232,144,138,.18)', color: 'var(--coral)' }}>
                Regulated Canadian Immigration Consultants
              </span>
              <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-5">
                Your NEW BEGINNING in Canada starts here.
              </h1>
              <p className="text-white/70 text-base md:text-lg mb-8 max-w-md">
                Experienced consultants, a clear process, and real results — for Express Entry candidates and couples navigating spousal sponsorship.
              </p>
              <div className="flex flex-wrap gap-3 mb-8">
                <button onClick={() => scrollTo('lead-form', 'Express Entry')} className="btn-coral">Check Express Entry Eligibility</button>
                <button onClick={() => scrollTo('lead-form', 'Spousal Sponsorship')} className="btn-ghost">Spousal Sponsorship Help</button>
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-white/60">
                <span>✓ RCIC Regulated</span>
                <span>✓ Clear, Transparent Process</span>
                <span>✓ Personalized Case Management</span>
              </div>
            </div>

            <div id="lead-form" className="anim-fade-up anim-delay-2">
              <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
                {submitted ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-3">✅</div>
                    <h3 className="font-black text-xl mb-2" style={{ color: 'var(--slate-dark)' }}>Thanks — we&apos;ve got your details!</h3>
                    <p className="text-sm text-gray-500">A member of the Immisa team will reach out shortly to confirm your $99 consultation booking. In a hurry? Call us at <a href="tel:+16474101067" className="font-bold" style={{ color: 'var(--slate)' }}>+1 (647) 410-1067</a>.</p>
                  </div>
                ) : (
                  <>
                    <h2 className="font-black text-xl mb-1" style={{ color: 'var(--slate-dark)' }}>Book Your $99 Consultation</h2>
                    <p className="text-xs text-gray-400 mb-5">Tell us a bit about your goals and we&apos;ll follow up within one business day.</p>
                    <form onSubmit={handleSubmit} className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        {(['Express Entry', 'Spousal Sponsorship', 'Other'] as Category[]).map(c => (
                          <button
                            type="button"
                            key={c}
                            onClick={() => setCategory(c)}
                            className="col-span-1 first:col-span-2 sm:first:col-span-1 px-3 py-2 rounded-lg text-xs font-bold border transition-colors"
                            style={category === c
                              ? { backgroundColor: 'var(--slate-dark)', color: '#fff', borderColor: 'var(--slate-dark)' }
                              : { backgroundColor: '#fff', color: 'var(--slate-dark)', borderColor: 'var(--border-lt)' }}
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                      <input required placeholder="Full name" value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none" />
                      <input required type="email" placeholder="Email address" value={form.email}
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none" />
                      <input placeholder="Phone number" value={form.phone}
                        onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none" />
                      <textarea placeholder="Tell us briefly about your situation (optional)" rows={2} value={form.message}
                        onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none resize-none" />
                      {error && <p className="text-red-500 text-xs">{error}</p>}
                      <button type="submit" disabled={submitting} className="btn-coral w-full text-center" style={{ opacity: submitting ? 0.7 : 1 }}>
                        {submitting ? 'Submitting…' : 'Book My $99 Consultation'}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* EXPRESS ENTRY */}
        <section id="express-entry" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-20">
          <div className="grid md:grid-cols-2 gap-10 items-start">
            <div className="reveal">
              <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-3" style={{ backgroundColor: 'rgba(78,96,118,.1)', color: 'var(--slate)' }}>
                Express Entry
              </span>
              <h2 className="text-2xl md:text-3xl font-black mb-4" style={{ color: 'var(--slate-dark)' }}>
                Category-Based Draws Are Opening New Doors to PR
              </h2>
              <p className="text-gray-500 mb-4 leading-relaxed">
                IRCC no longer invites candidates on CRS score alone. Category-based draws — for French speakers, healthcare workers, trades, STEM professionals, and more — mean candidates who were previously on the sidelines are now getting Invitations to Apply (ITAs).
              </p>
              <ul className="space-y-2 text-sm text-gray-600 mb-6">
                <li>✓ Full CRS score calculation &amp; profile review</li>
                <li>✓ Category-eligibility check across all active draw streams</li>
                <li>✓ Profile optimization to raise your ranking</li>
                <li>✓ Full application prep and submission support</li>
              </ul>
              <div className="flex flex-wrap gap-3 items-center">
                <button onClick={() => scrollTo('lead-form', 'Express Entry')} className="btn-outline-slate">Check My Eligibility</button>
                <a href="/express-entry" className="text-sm font-bold" style={{ color: 'var(--slate)' }}>Full Express Entry guide →</a>
              </div>
            </div>
            <div className="info-card reveal">
              <h3 className="font-black text-sm uppercase tracking-wide mb-4" style={{ color: 'var(--slate)' }}>Who Should Apply</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <p><strong style={{ color: 'var(--slate-dark)' }}>Federal Skilled Worker</strong> — skilled work experience, language ability, and education that meet FSWP criteria.</p>
                <p><strong style={{ color: 'var(--slate-dark)' }}>Canadian Experience Class</strong> — at least one year of skilled work experience in Canada.</p>
                <p><strong style={{ color: 'var(--slate-dark)' }}>Federal Skilled Trades</strong> — qualified trades experience with a valid job offer or certificate of qualification.</p>
                <p><strong style={{ color: 'var(--slate-dark)' }}>Provincial Nominees</strong> — nominated by a province through the Express Entry-linked PNP stream.</p>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-4 sm:px-6"><div className="glow-line" /></div>

        {/* SPOUSAL SPONSORSHIP */}
        <section id="spousal-sponsorship" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-20">
          <div className="grid md:grid-cols-2 gap-10 items-start">
            <div className="info-card reveal order-2 md:order-1">
              <h3 className="font-black text-sm uppercase tracking-wide mb-4" style={{ color: 'var(--coral-h, #b5564f)' }}>Inland vs. Outland</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <p><strong style={{ color: 'var(--slate-dark)' }}>Inland</strong> — sponsored spouse is in Canada; may qualify for an open work permit while the application is processed.</p>
                <p><strong style={{ color: 'var(--slate-dark)' }}>Outland</strong> — sponsored spouse applies from outside Canada; often faster for certain visa offices and situations.</p>
                <p>We assess your specific circumstances — relationship history, travel patterns, admissibility — to recommend the stream least likely to face delays or refusal.</p>
              </div>
            </div>
            <div className="reveal order-1 md:order-2">
              <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-3" style={{ backgroundColor: 'rgba(232,144,138,.15)', color: '#b5564f' }}>
                Spousal Sponsorship
              </span>
              <h2 className="text-2xl md:text-3xl font-black mb-4" style={{ color: 'var(--slate-dark)' }}>
                Bring Your Spouse or Partner to Canada — Without the Guesswork
              </h2>
              <p className="text-gray-500 mb-4 leading-relaxed">
                Spousal sponsorship applications are refused most often because of incomplete relationship evidence or procedural errors — not because the relationship isn&apos;t genuine. We build a complete, well-documented application from day one.
              </p>
              <ul className="space-y-2 text-sm text-gray-600 mb-6">
                <li>✓ Complete relationship &amp; eligibility assessment</li>
                <li>✓ Inland vs. outland strategy tailored to your situation</li>
                <li>✓ Full documentation checklist and relationship evidence review</li>
                <li>✓ Support through processing, RQs, and interviews</li>
              </ul>
              <div className="flex flex-wrap gap-3 items-center">
                <button onClick={() => scrollTo('lead-form', 'Spousal Sponsorship')} className="btn-outline-slate">Check My Eligibility</button>
                <a href="/spousal-sponsorship" className="text-sm font-bold" style={{ color: '#b5564f' }}>Full Spousal Sponsorship guide →</a>
              </div>
            </div>
          </div>
        </section>

        {/* WHY IMMISA / RCIC CREDIBILITY */}
        <section className="py-16 md:py-20" style={{ backgroundColor: 'var(--bg)' }}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-12 reveal">
              <h2 className="text-2xl md:text-3xl font-black mb-3" style={{ color: 'var(--slate-dark)' }}>Why Immisa Immigration</h2>
              <p className="text-gray-500">Led by Sumbal Anees, a Regulated Canadian Immigration Consultant (RCIC), Immisa has guided clients across Asia, the Middle East, Europe, and the Americas through their immigration journey.</p>
            </div>
            <div className="grid sm:grid-cols-3 gap-6">
              {[
                { icon: '🛡️', title: 'RCIC Regulated', desc: 'Licensed and accountable to Canada’s immigration consultant regulatory body — your case is always in compliant hands.' },
                { icon: '🎯', title: 'Clear Process', desc: 'You always know your next step: a documented plan from assessment through to decision.' },
                { icon: '🤝', title: 'Real Results', desc: 'Personalized case management — not a call centre. You work directly with our team throughout.' },
              ].map(f => (
                <div key={f.title} className="info-card text-center reveal">
                  <div className="text-3xl mb-3">{f.icon}</div>
                  <h3 className="font-black text-base mb-2" style={{ color: 'var(--slate-dark)' }}>{f.title}</h3>
                  <p className="text-sm text-gray-500">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PROCESS */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-20">
          <h2 className="text-2xl md:text-3xl font-black text-center mb-12 reveal" style={{ color: 'var(--slate-dark)' }}>How It Works</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: '01', title: '$99 Consultation', desc: 'Share your background and goals with our team.' },
              { step: '02', title: 'Eligibility Review', desc: 'We assess your CRS score or sponsorship eligibility.' },
              { step: '03', title: 'Application Prep', desc: 'We prepare a complete, well-documented application.' },
              { step: '04', title: 'Case Management', desc: 'We manage submission and follow-up through to decision.' },
            ].map(p => (
              <div key={p.step} className="reveal">
                <div className="text-3xl font-black mb-2" style={{ color: 'var(--coral)' }}>{p.step}</div>
                <h3 className="font-black text-base mb-1" style={{ color: 'var(--slate-dark)' }}>{p.title}</h3>
                <p className="text-sm text-gray-500">{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 md:py-20" style={{ backgroundColor: 'var(--bg)' }}>
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl md:text-3xl font-black text-center mb-10 reveal" style={{ color: 'var(--slate-dark)' }}>Frequently Asked Questions</h2>
            <div className="space-y-3">
              {FAQS.map((f, i) => (
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
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
