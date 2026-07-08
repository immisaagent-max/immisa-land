'use client';

import { useState } from 'react';
import { CATEGORIES } from '@/lib/constants';

export default function AddLeadModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [form, setForm] = useState({
    contactName: '', orgName: '', mobile1: '', mobile2: '',
    email1: '', email2: '', address: '', segment: CATEGORIES[0] as string, notes: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm(f => ({ ...f, [key]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.contactName.trim()) {
      setError('Contact name is required');
      return;
    }
    setSaving(true);
    setError('');
    const res = await fetch('/api/admin/crm-leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (!res.ok) {
      setError('Failed to save lead');
      return;
    }
    onCreated();
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between" style={{ backgroundColor: '#1B2731' }}>
          <h2 className="font-black text-white text-base" style={{ fontFamily: 'var(--font-montserrat, Montserrat)' }}>Add Lead</h2>
          <button onClick={onClose} className="text-white/50 hover:text-white text-xl leading-none">✕</button>
        </div>
        <form onSubmit={submit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-bold mb-1 text-gray-600">Contact Name *</label>
              <input value={form.contactName} onChange={e => set('contactName', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none" required />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold mb-1 text-gray-600">Category</label>
              <select value={form.segment} onChange={e => set('segment', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold mb-1 text-gray-600">Mobile</label>
              <input value={form.mobile1} onChange={e => set('mobile1', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1 text-gray-600">Alt. Mobile</label>
              <input value={form.mobile2} onChange={e => set('mobile2', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1 text-gray-600">Email</label>
              <input type="email" value={form.email1} onChange={e => set('email1', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1 text-gray-600">Alt. Email</label>
              <input type="email" value={form.email2} onChange={e => set('email2', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold mb-1 text-gray-600">Address</label>
              <input value={form.address} onChange={e => set('address', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold mb-1 text-gray-600">Notes</label>
              <textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={3}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none resize-none" />
            </div>
          </div>
          {error && <p className="text-red-500 text-xs">{error}</p>}
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving}
              className="flex-1 py-2.5 rounded-lg font-bold text-sm text-white"
              style={{ backgroundColor: '#4E6076', opacity: saving ? 0.7 : 1 }}>
              {saving ? 'Saving…' : 'Save Lead'}
            </button>
            <button type="button" onClick={onClose}
              className="px-4 py-2.5 rounded-lg font-bold text-sm border border-gray-200 text-gray-500 hover:bg-gray-50">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
