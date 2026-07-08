'use client';

import { useState } from 'react';
import { reportConversion } from '@/lib/gtag';
import type { Category } from '@/lib/constants';

export default function ServiceLeadForm({
  category,
  title = 'Book Your $99 Consultation',
  subtitle = "Tell us a bit about your goals and we'll follow up within one business day.",
}: {
  category: Category;
  title?: string;
  subtitle?: string;
}) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

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
    <div id="lead-form" className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
      {submitted ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-3">✅</div>
          <h3 className="font-black text-xl mb-2" style={{ color: 'var(--slate-dark)' }}>Thanks — we&apos;ve got your details!</h3>
          <p className="text-sm text-gray-500">A member of the Immisa team will reach out shortly to confirm your $99 consultation booking. In a hurry? Call us at <a href="tel:+16474101067" className="font-bold" style={{ color: 'var(--slate)' }}>+1 (647) 410-1067</a>.</p>
        </div>
      ) : (
        <>
          <h2 className="font-black text-xl mb-1" style={{ color: 'var(--slate-dark)' }}>{title}</h2>
          <p className="text-xs text-gray-400 mb-5">{subtitle}</p>
          <form onSubmit={handleSubmit} className="space-y-3">
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
  );
}
