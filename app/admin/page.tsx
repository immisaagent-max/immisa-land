'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      router.push('/admin/leads');
    } else {
      setError('Incorrect password');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'linear-gradient(135deg, #1B2731 0%, #253645 60%, #2E4256 100%)' }}>
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="rounded-xl overflow-hidden inline-block mb-4" style={{ backgroundColor: '#fff', padding: '8px 16px', border: '1px solid #e5e7eb', lineHeight: 0 }}>
            <Image src="/images/immisa-logo.png" alt="Immisa Immigration" width={160} height={82} style={{ objectFit: 'contain' }} unoptimized />
          </div>
          <h1 className="font-black text-lg" style={{ color: '#4E6076', fontFamily: 'var(--font-montserrat, Montserrat)' }}>Admin CRM</h1>
          <p className="text-xs text-gray-400 mt-1">Sign in to manage leads</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold mb-1.5 text-gray-600">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2"
              style={{ '--tw-ring-color': '#E8908A' } as React.CSSProperties}
              required
            />
          </div>
          {error && <p className="text-red-500 text-xs">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg font-black text-sm uppercase tracking-wide"
            style={{ backgroundColor: '#4E6076', color: '#fff', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
        <p className="text-center text-[10px] text-gray-400 mt-6">Immisa Immigration · Internal Use Only</p>
      </div>
    </div>
  );
}
