'use client';

import { useEffect, useState, useCallback } from 'react';
import { CALL_OUTCOMES } from '@/lib/constants';

type Agent = { id: string; name: string };
type CallLog = {
  id: string; createdAt: string; outcome: string; notes: string | null;
  nextFollowUp: string | null; agent: { id: string; name: string };
};

export default function FollowUpForm({ leadId }: { leadId: string }) {
  const [logs, setLogs] = useState<CallLog[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [outcome, setOutcome] = useState<string>(CALL_OUTCOMES[0]);
  const [notes, setNotes] = useState('');
  const [nextFollowUp, setNextFollowUp] = useState('');
  const [agentId, setAgentId] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/call-logs?leadId=${leadId}`);
    if (res.ok) setLogs(await res.json());
    setLoading(false);
  }, [leadId]);

  useEffect(() => {
    fetchLogs();
    fetch('/api/admin/agents').then(r => r.ok ? r.json() : []).then((list: Agent[]) => {
      setAgents(list);
      if (list.length > 0) setAgentId(list[0].id);
    });
  }, [fetchLogs]);

  async function logFollowUp(e: React.FormEvent) {
    e.preventDefault();
    if (!agentId) return;
    setSaving(true);
    await fetch('/api/admin/call-logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        leadId, agentId, outcome, notes: notes || undefined,
        nextFollowUp: nextFollowUp || undefined,
      }),
    });
    setSaving(false);
    setNotes('');
    setNextFollowUp('');
    fetchLogs();
  }

  return (
    <div className="space-y-3">
      <form onSubmit={logFollowUp} className="bg-gray-50 rounded-lg p-3 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <select value={outcome} onChange={e => setOutcome(e.target.value)}
            className="border border-gray-200 rounded-lg px-2.5 py-2 text-xs bg-white focus:outline-none">
            {CALL_OUTCOMES.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
          <select value={agentId} onChange={e => setAgentId(e.target.value)}
            className="border border-gray-200 rounded-lg px-2.5 py-2 text-xs bg-white focus:outline-none">
            {agents.length === 0 && <option value="">No agents</option>}
            {agents.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
        </div>
        <input type="date" value={nextFollowUp} onChange={e => setNextFollowUp(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-2.5 py-2 text-xs focus:outline-none" placeholder="Next follow-up date" />
        <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2}
          placeholder="Call notes…" className="w-full border border-gray-200 rounded-lg px-2.5 py-2 text-xs focus:outline-none resize-none" />
        <button type="submit" disabled={saving || !agentId}
          className="w-full py-2 rounded-lg font-bold text-xs text-white"
          style={{ backgroundColor: '#4E6076', opacity: saving ? 0.7 : 1 }}>
          {saving ? 'Logging…' : '+ Log Follow-up'}
        </button>
      </form>

      <div className="space-y-2 max-h-56 overflow-y-auto">
        {loading ? (
          <p className="text-xs text-gray-400 text-center py-3">Loading history…</p>
        ) : logs.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-3">No follow-ups logged yet</p>
        ) : logs.map(log => (
          <div key={log.id} className="border border-gray-100 rounded-lg p-2.5 text-xs">
            <div className="flex justify-between items-start">
              <span className="font-bold text-gray-700">{log.outcome}</span>
              <span className="text-gray-400">{new Date(log.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="text-gray-400 mt-0.5">by {log.agent.name}{log.nextFollowUp && ` · next: ${new Date(log.nextFollowUp).toLocaleDateString()}`}</div>
            {log.notes && <p className="text-gray-600 mt-1">{log.notes}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
