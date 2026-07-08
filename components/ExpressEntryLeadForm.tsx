'use client';

import { useState } from 'react';
import { reportConversion } from '@/lib/gtag';
import { FUNDS_RANGES, EDUCATION_LEVELS, EXPERIENCE_RANGES, LANGUAGE_LEVELS } from '@/lib/constants';

const initialForm = {
  name: '',
  email: '',
  phone: '',
  fundsAvailable: '',
  educationLevel: '',
  workExperience: '',
  languageLevel: '',
  message: '',
};

export default function ExpressEntryLeadForm() {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  function set<K extends keyof typeof initialForm>(key: K, value: string) {
    setForm(f => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email) return;
    setSubmitting(true);
    setError('');
    const res = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, category: 'Express Entry' }),
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
    <div id="lead-form" className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
      {submitted ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-3">✅</div>
          <h3 className="font-black text-xl mb-2" style={{ color: 'var(--slate-dark)' }}>Thanks — your request is in!</h3>
          <p className="text-sm text-gray-500">A member of the Immisa team will reach out to confirm your $99 consultation booking within one business day. In a hurry? Call us at <a href="tel:+16474101067" className="font-bold" style={{ color: 'var(--slate)' }}>+1 (647) 410-1067</a>.</p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between gap-3 mb-1">
            <h2 className="font-black text-xl" style={{ color: 'var(--slate-dark)' }}>Book Your $99 Express Entry Consultation</h2>
          </div>
          <p className="text-xs text-gray-400 mb-5">A few quick questions help us prepare a real CRS and category assessment before your paid consultation — not a generic chat.</p>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input required placeholder="Full name" value={form.name}
              onChange={e => set('name', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none" />
            <div className="grid grid-cols-2 gap-2">
              <input required type="email" placeholder="Email address" value={form.email}
                onChange={e => set('email', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none" />
              <input placeholder="Phone number" value={form.phone}
                onChange={e => set('phone', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none" />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-500 mb-1">Settlement funds available</label>
              <select required value={form.fundsAvailable} onChange={e => set('fundsAvailable', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none">
                <option value="" disabled>Select a range</option>
                {FUNDS_RANGES.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 mb-1">Highest education</label>
                <select required value={form.educationLevel} onChange={e => set('educationLevel', e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none">
                  <option value="" disabled>Select</option>
                  {EDUCATION_LEVELS.map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-500 mb-1">Skilled work experience</label>
                <select required value={form.workExperience} onChange={e => set('workExperience', e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none">
                  <option value="" disabled>Select</option>
                  {EXPERIENCE_RANGES.map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-500 mb-1">Language test result</label>
              <select required value={form.languageLevel} onChange={e => set('languageLevel', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none">
                <option value="" disabled>Select</option>
                {LANGUAGE_LEVELS.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>

            <textarea placeholder="Anything else we should know? (optional)" rows={2} value={form.message}
              onChange={e => set('message', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none resize-none" />
            {error && <p className="text-red-500 text-xs">{error}</p>}
            <button type="submit" disabled={submitting} className="btn-coral w-full text-center" style={{ opacity: submitting ? 0.7 : 1 }}>
              {submitting ? 'Submitting…' : 'Book My $99 Consultation'}
            </button>
            <p className="text-[11px] text-gray-400 text-center">The $99 consultation fee is collected when we confirm your appointment — not charged now.</p>
          </form>
        </>
      )}
    </div>
  );
}
