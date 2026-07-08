import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAuthenticated } from '@/lib/auth';

export async function GET(req: NextRequest) {
  if (!await isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const leadId = searchParams.get('leadId');
  if (!leadId) return NextResponse.json({ error: 'leadId is required' }, { status: 400 });

  const callLogs = await prisma.callLog.findMany({
    where: { leadId },
    include: { agent: { select: { id: true, name: true } } },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(callLogs);
}

export async function POST(req: NextRequest) {
  if (!await isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  if (!body?.leadId || !body?.agentId || !body?.outcome) {
    return NextResponse.json({ error: 'leadId, agentId and outcome are required' }, { status: 400 });
  }

  const callLog = await prisma.callLog.create({
    data: {
      leadId: body.leadId,
      agentId: body.agentId,
      outcome: body.outcome,
      notes: body.notes || null,
      nextFollowUp: body.nextFollowUp ? new Date(body.nextFollowUp) : null,
    },
    include: { agent: { select: { id: true, name: true } } },
  });
  return NextResponse.json(callLog, { status: 201 });
}
