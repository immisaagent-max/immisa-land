'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { LEAD_STATUSES, CATEGORIES, CATEGORY_COLORS } from '@/lib/constants';

type Lead = {
  id: number; name: string; email: string; phone: string | null;
  company: string | null; service: string | null; category: string; message: string | null;
  source: string; status: string; notes: string | null; createdAt: string;
  crmLead: { id: string } | null;
};

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  'New':       { bg: '#EBF1F5', text: '#2E4256' },
  'Contacted': { bg: '#FFF3CD', text: '#856404' },
  'Qualified': { bg: '#FCE4E2', text: '#B5564F' },
  'Converted': { bg: '#D4EDDA', text: '#155724' },
  'Lost':      { bg: '#F8D7DA', text: '#842029' },
};

const SOURCE_LABELS: Record<string, string> = {
  landing: '🌐 Landing Page',
  api:     '🤖 API',
  manual:  '✏️ Manual',
};

function StatusBadge({ status }: { status: string }) {
  const c = STATUS_COLORS[status] ?? { bg: '#f0f0f0', text: '#555' };
  return (
    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap" style={{ backgroundColor: c.bg, color: c.text }}>
      {status}
    </span>
  );
}

function CategoryBadge({ category }: { category: string }) {
  return (
    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap border ${CATEGORY_COLORS[category] ?? CATEGORY_COLORS.Other}`}>
      {category}
    </span>
  );
}

export default function LeadsPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [selected, setSelected] = useState<Lead | null>(null);
  const [editStatus, setEditStatus] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [converting, setConverting] = useState(false);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (filterStatus) params.set('status', filterStatus);
    if (filterCategory) params.set('category', filterCategory);
    const res = await fetch(`/api/admin/leads?${params}`);
    if (res.status === 401) { router.push('/admin'); return; }
    setLeads(await res.json());
    setLoading(false);
  }, [q, filterStatus, filterCategory, router]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  function openLead(lead: Lead) {
    setSelected(lead);
    setEditStatus(lead.status);
    setEditNotes(lead.notes ?? '');
  }

  async function saveLead() {
    if (!selected) return;
    setSaving(true);
    await fetch('/api/admin/leads', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: selected.id, status: editStatus, notes: editNotes }),
    });
    setSaving(false);
    setSelected(null);
    fetchLeads();
  }

  async function convertLead() {
    if (!selected) return;
    setConverting(true);
    await fetch('/api/admin/leads/convert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: selected.id }),
    });
    setConverting(false);
    setSelected(null);
    fetchLeads();
  }

  async function deleteLead(id: number) {
    if (!confirm('Delete this lead?')) return;
    await fetch('/api/admin/leads', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setSelected(null);
    fetchLeads();
  }

  async function logout() {
    await fetch('/api/admin/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'logout' }) });
    router.push('/admin');
  }

  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'New').length,
    qualified: leads.filter(l => l.status === 'Qualified').length,
    converted: leads.filter(l => l.status === 'Converted').length,
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ fontFamily: 'var(--font-inter, Inter, sans-serif)', backgroundColor: '#F4F6F8' }}>

      {/* SIDEBAR */}
      <aside className="w-56 flex-shrink-0 hidden md:flex flex-col" style={{ backgroundColor: '#1B2731', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="p-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <div className="rounded-lg overflow-hidden" style={{ backgroundColor: '#fff', padding: '5px 8px', lineHeight: 0 }}>
            <Image src="/images/immisa-logo.png" alt="Immisa Immigration" width={130} height={67} style={{ objectFit: 'contain' }} unoptimized />
          </div>
          <p className="text-[9px] uppercase tracking-widest mt-2" style={{ color: 'rgba(255,255,255,0.3)' }}>Admin CRM</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {[
            { href: '/admin/leads', label: 'Website Leads', icon: '🌐', active: true, sub: 'Landing page enquiries' },
            { href: '/admin/crm', label: 'CRM Pipeline', icon: '👥', active: false, sub: 'Full lead management' },
          ].map(item => (
            <Link key={item.href} href={item.href}
              className="flex items-start gap-3 px-3 py-2.5 rounded-lg transition-colors"
              style={{
                backgroundColor: item.active ? 'rgba(232,144,138,0.15)' : 'transparent',
                color: item.active ? '#E8908A' : 'rgba(255,255,255,0.5)',
                border: item.active ? '1px solid rgba(232,144,138,0.3)' : '1px solid transparent',
              }}>
              <span className="mt-0.5 flex-shrink-0">{item.icon}</span>
              <div>
                <div className="text-sm font-semibold">{item.label}</div>
                <div className="text-[10px] opacity-60 mt-0.5">{item.sub}</div>
              </div>
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <Link href="/" className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg mb-1" style={{ color: 'rgba(255,255,255,0.35)' }}>🌐 View Website</Link>
          <button onClick={logout} className="w-full flex items-center gap-2 text-xs px-3 py-2 rounded-lg" style={{ color: 'rgba(255,255,255,0.35)' }}>🚪 Logout</button>
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex-shrink-0 flex items-center justify-between px-6 h-14 bg-white border-b border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <h1 className="font-black text-base" style={{ color: '#2E4256', fontFamily: 'var(--font-montserrat, Montserrat)' }}>Leads</h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ backgroundColor: '#EBF1F5', color: '#2E4256' }}>{stats.total}</span>
          </div>
        </header>

        <div className="flex-shrink-0 grid grid-cols-4 gap-4 px-6 py-4">
          {[
            { label: 'Total Leads', value: stats.total, color: '#2E4256' },
            { label: 'New', value: stats.new, color: '#E8908A' },
            { label: 'Qualified', value: stats.qualified, color: '#B5564F' },
            { label: 'Converted', value: stats.converted, color: '#155724' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="text-2xl font-black" style={{ color: s.color, fontFamily: 'var(--font-montserrat, Montserrat)' }}>{s.value}</div>
              <div className="text-xs text-gray-400 uppercase tracking-wide mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="flex-shrink-0 flex items-center gap-3 px-6 pb-4">
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && fetchLeads()}
            placeholder="Search name, email, phone…"
            className="flex-1 max-w-xs border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
          />
          <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none">
            <option value="">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none">
            <option value="">All Statuses</option>
            {LEAD_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <button onClick={fetchLeads} className="px-4 py-2 rounded-lg text-sm font-bold" style={{ backgroundColor: '#4E6076', color: '#fff' }}>
            Search
          </button>
        </div>

        <div className="flex-1 overflow-auto px-6 pb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: '#F8F9FA', borderBottom: '2px solid #E9ECEF' }}>
                  {['#', 'Name', 'Contact', 'Category', 'Source', 'Status', 'Date', ''].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider" style={{ color: '#6C757D' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={8} className="text-center py-12 text-gray-400 text-sm">Loading leads…</td></tr>
                ) : leads.length === 0 ? (
                  <tr><td colSpan={8} className="text-center py-12 text-gray-400 text-sm">No leads found</td></tr>
                ) : leads.map((lead, i) => (
                  <tr key={lead.id} className="border-b border-gray-50 hover:bg-[#FBF1F0] cursor-pointer transition-colors" onClick={() => openLead(lead)}>
                    <td className="px-4 py-3 text-gray-400 text-xs">{i + 1}</td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-gray-800">{lead.name}</div>
                      {lead.company && <div className="text-xs text-gray-400">{lead.company}</div>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-xs text-blue-600">{lead.email}</div>
                      {lead.phone && <div className="text-xs text-gray-500">{lead.phone}</div>}
                    </td>
                    <td className="px-4 py-3"><CategoryBadge category={lead.category} /></td>
                    <td className="px-4 py-3 text-xs text-gray-400">{SOURCE_LABELS[lead.source] ?? lead.source}</td>
                    <td className="px-4 py-3"><StatusBadge status={lead.status} /></td>
                    <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">{new Date(lead.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <button onClick={e => { e.stopPropagation(); deleteLead(lead.id); }} className="text-red-400 hover:text-red-600 text-xs px-2 py-1 rounded">✕</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* LEAD DETAIL DRAWER */}
      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end" onClick={() => setSelected(null)}>
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative bg-white w-full max-w-md h-full shadow-2xl flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-5 border-b border-gray-100 flex items-start justify-between" style={{ backgroundColor: '#1B2731' }}>
              <div>
                <h2 className="font-black text-white text-base" style={{ fontFamily: 'var(--font-montserrat, Montserrat)' }}>{selected.name}</h2>
                {selected.company && <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>{selected.company}</p>}
              </div>
              <button onClick={() => setSelected(null)} className="text-white/50 hover:text-white text-xl leading-none">✕</button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Contact</h3>
                <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                  <a href={`mailto:${selected.email}`} className="flex items-center gap-2 text-sm text-blue-600 hover:underline">📧 {selected.email}</a>
                  {selected.phone && <a href={`tel:${selected.phone}`} className="flex items-center gap-2 text-sm text-gray-700">📞 {selected.phone}</a>}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Details</h3>
                <div className="bg-gray-50 rounded-lg p-3 space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-400">Category</span><CategoryBadge category={selected.category} /></div>
                  <div className="flex justify-between"><span className="text-gray-400">Source</span><span className="font-medium">{SOURCE_LABELS[selected.source] ?? selected.source}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Received</span><span className="font-medium">{new Date(selected.createdAt).toLocaleString()}</span></div>
                </div>
              </div>

              {selected.message && (
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Message</h3>
                  <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600 leading-relaxed">{selected.message}</div>
                </div>
              )}

              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Status</h3>
                <select value={editStatus} onChange={e => setEditStatus(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none bg-white">
                  {LEAD_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Internal Notes</h3>
                <textarea value={editNotes} onChange={e => setEditNotes(e.target.value)} rows={4}
                  placeholder="Add notes about this lead…"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none resize-none" />
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex flex-col gap-2">
              <button onClick={convertLead} disabled={converting || !!selected.crmLead}
                className="w-full py-2.5 rounded-lg font-bold text-sm border"
                style={selected.crmLead
                  ? { backgroundColor: '#D4EDDA', color: '#155724', borderColor: '#c3e6cb' }
                  : { backgroundColor: '#fff', color: '#4E6076', borderColor: '#4E6076', opacity: converting ? 0.6 : 1 }}>
                {selected.crmLead ? 'Already in CRM ✓' : converting ? 'Converting…' : 'Convert to CRM →'}
              </button>
              <div className="flex gap-3">
                <button onClick={saveLead} disabled={saving}
                  className="flex-1 py-2.5 rounded-lg font-bold text-sm"
                  style={{ backgroundColor: '#4E6076', color: '#fff', opacity: saving ? 0.7 : 1 }}>
                  {saving ? 'Saving…' : 'Save Changes'}
                </button>
                <button onClick={() => deleteLead(selected.id)}
                  className="px-4 py-2.5 rounded-lg font-bold text-sm border border-red-200 text-red-500 hover:bg-red-50">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
