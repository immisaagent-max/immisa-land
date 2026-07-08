'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { CRM_STAGES, CATEGORIES, CATEGORY_COLORS } from '@/lib/constants';
import AddLeadModal from './components/AddLeadModal';
import FollowUpForm from './components/FollowUpForm';

type CrmLead = {
  id: string; createdAt: string; updatedAt: string;
  contactName: string; orgName: string | null; orgWebsite: string | null;
  mobile1: string | null; mobile2: string | null;
  email1: string | null; email2: string | null;
  address: string | null; segment: string; stage: string;
  source: string; notes: string | null;
  assignedTo: { id: string; name: string } | null;
  callLogs: { createdAt: string; outcome: string }[];
  originLeadId: number | null;
};

const STAGE_COLORS: Record<string, { bg: string; text: string }> = {
  'New':                   { bg: '#EBF1F5', text: '#2E4256' },
  'Contacted':             { bg: '#FFF3CD', text: '#856404' },
  'Consultation Booked':   { bg: '#FCE4E2', text: '#B5564F' },
  'Retained':              { bg: '#D4EDDA', text: '#155724' },
  'Not Eligible / Lost':   { bg: '#F0F0F0', text: '#6C757D' },
};

function StageBadge({ stage }: { stage: string }) {
  const c = STAGE_COLORS[stage] ?? { bg: '#f0f0f0', text: '#555' };
  return (
    <span className="px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider whitespace-nowrap"
      style={{ backgroundColor: c.bg, color: c.text }}>
      {stage}
    </span>
  );
}

function CategoryBadge({ category }: { category: string }) {
  return (
    <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold whitespace-nowrap border ${CATEGORY_COLORS[category] ?? CATEGORY_COLORS.Other}`}>
      {category}
    </span>
  );
}

export default function CrmPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<CrmLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [filterStage, setFilterStage] = useState('');
  const [selected, setSelected] = useState<CrmLead | null>(null);
  const [editStage, setEditStage] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (filterStage) params.set('stage', filterStage);
    const res = await fetch(`/api/admin/crm-leads?${params}`);
    if (res.status === 401) { router.push('/admin'); return; }
    setLeads(await res.json());
    setLoading(false);
  }, [q, filterStage, router]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  function openLead(lead: CrmLead) {
    setSelected(lead);
    setEditStage(lead.stage);
    setEditNotes(lead.notes ?? '');
  }

  async function saveLead() {
    if (!selected) return;
    setSaving(true);
    await fetch('/api/admin/crm-leads', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: selected.id, stage: editStage, notes: editNotes }),
    });
    setSaving(false);
    setSelected(null);
    fetchLeads();
  }

  async function deleteLead(id: string) {
    if (!confirm('Delete this lead?')) return;
    await fetch('/api/admin/crm-leads', {
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

  const stageCounts = CRM_STAGES.reduce((acc, s) => ({ ...acc, [s]: leads.filter(l => l.stage === s).length }), {} as Record<string, number>);

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
            { href: '/admin/leads', label: 'Website Leads', icon: '🌐', active: false, sub: 'Landing page enquiries' },
            { href: '/admin/crm', label: 'CRM Pipeline', icon: '👥', active: true, sub: 'Full lead management' },
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
          <div>
            <h1 className="font-black text-base" style={{ color: '#2E4256', fontFamily: 'var(--font-montserrat, Montserrat)' }}>CRM Pipeline</h1>
            <p className="text-[11px] text-gray-400">Express Entry &amp; Spousal Sponsorship prospects · {leads.length} total</p>
          </div>
          <button onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-lg text-sm font-bold text-white" style={{ backgroundColor: '#4E6076' }}>
            + Add Lead
          </button>
        </header>

        <div className="flex-shrink-0 flex items-center gap-2 px-6 pt-4 pb-2 overflow-x-auto">
          {[{ key: '', label: `All (${leads.length})` }, ...CRM_STAGES.map(s => ({ key: s, label: `${s} (${stageCounts[s] ?? 0})` }))].map(tab => (
            <button key={tab.key} onClick={() => setFilterStage(tab.key)}
              className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide whitespace-nowrap transition-all"
              style={{
                backgroundColor: filterStage === tab.key ? '#1B2731' : '#fff',
                color: filterStage === tab.key ? '#E8908A' : '#6C757D',
                border: '1px solid #E9ECEF',
              }}>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-shrink-0 flex items-center gap-3 px-6 pb-3 pt-1">
          <input value={q} onChange={e => setQ(e.target.value)} onKeyDown={e => e.key === 'Enter' && fetchLeads()}
            placeholder="Search name, email, phone…"
            className="flex-1 max-w-sm border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none" />
          <button onClick={fetchLeads} className="px-4 py-2 rounded-lg text-sm font-bold text-white" style={{ backgroundColor: '#1B2731' }}>
            Go
          </button>
        </div>

        <div className="flex-1 overflow-auto px-6 pb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: '#1B2731', borderBottom: '2px solid #1B2731' }}>
                  {['Contact', 'Mobile', 'Email', 'Category', 'Stage', 'Last Follow-up', ''].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-white/60">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={7} className="text-center py-12 text-gray-400 text-sm">Loading leads…</td></tr>
                ) : leads.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-12 text-gray-400 text-sm">No leads found</td></tr>
                ) : leads.map(lead => (
                  <tr key={lead.id} className="border-b border-gray-50 hover:bg-[#FBF1F0] cursor-pointer transition-colors" onClick={() => openLead(lead)}>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-gray-800 text-sm">{lead.contactName}</div>
                      {lead.orgName && <div className="text-[11px] text-gray-400 truncate max-w-[180px]">{lead.orgName}</div>}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{lead.mobile1 || '—'}</td>
                    <td className="px-4 py-3">
                      {lead.email1 ? <a href={`mailto:${lead.email1}`} className="text-blue-600 text-sm hover:underline" onClick={e => e.stopPropagation()}>{lead.email1}</a> : <span className="text-gray-400">—</span>}
                    </td>
                    <td className="px-4 py-3"><CategoryBadge category={lead.segment} /></td>
                    <td className="px-4 py-3"><StageBadge stage={lead.stage} /></td>
                    <td className="px-4 py-3 text-xs text-gray-400">
                      {lead.callLogs[0] ? new Date(lead.callLogs[0].createdAt).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={e => { e.stopPropagation(); deleteLead(lead.id); }} className="text-red-300 hover:text-red-500 text-xs px-2 py-1 rounded transition-colors">✕</button>
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
                <h2 className="font-black text-white text-base">{selected.orgName || selected.contactName}</h2>
                <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>{selected.contactName}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-white/50 hover:text-white text-xl leading-none">✕</button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Contact</h3>
                <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                  {selected.mobile1 && <a href={`tel:${selected.mobile1}`} className="flex items-center gap-2 text-sm text-gray-700">📞 {selected.mobile1}</a>}
                  {selected.mobile2 && <a href={`tel:${selected.mobile2}`} className="flex items-center gap-2 text-sm text-gray-500">📞 {selected.mobile2}</a>}
                  {selected.email1 && <a href={`mailto:${selected.email1}`} className="flex items-center gap-2 text-sm text-blue-600 hover:underline">📧 {selected.email1}</a>}
                  {selected.email2 && <a href={`mailto:${selected.email2}`} className="flex items-center gap-2 text-sm text-blue-500 hover:underline">📧 {selected.email2}</a>}
                  {selected.address && <div className="flex items-start gap-2 text-sm text-gray-500">📍 {selected.address}</div>}
                  {selected.orgWebsite && <a href={selected.orgWebsite} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-blue-600 hover:underline">🌐 {selected.orgWebsite}</a>}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Details</h3>
                <div className="bg-gray-50 rounded-lg p-3 space-y-2 text-sm">
                  <div className="flex justify-between items-center"><span className="text-gray-400">Category</span><CategoryBadge category={selected.segment} /></div>
                  <div className="flex justify-between"><span className="text-gray-400">Source</span><span className="font-medium capitalize">{selected.source}{selected.originLeadId ? ` (from Lead #${selected.originLeadId})` : ''}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Added</span><span className="font-medium">{new Date(selected.createdAt).toLocaleDateString()}</span></div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Stage</h3>
                <select value={editStage} onChange={e => setEditStage(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none bg-white">
                  {CRM_STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Notes</h3>
                <textarea value={editNotes} onChange={e => setEditNotes(e.target.value)} rows={3}
                  placeholder="Add notes about this prospect…"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none resize-none" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Follow-ups</h3>
                <FollowUpForm leadId={selected.id} />
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
              <button onClick={saveLead} disabled={saving}
                className="flex-1 py-2.5 rounded-lg font-bold text-sm text-white transition-opacity"
                style={{ backgroundColor: '#4E6076', opacity: saving ? 0.7 : 1 }}>
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
              <button onClick={() => deleteLead(selected.id)}
                className="px-4 py-2.5 rounded-lg font-bold text-sm border border-red-200 text-red-500 hover:bg-red-50">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <AddLeadModal
          onClose={() => setShowAddModal(false)}
          onCreated={() => { setShowAddModal(false); fetchLeads(); }}
        />
      )}
    </div>
  );
}
