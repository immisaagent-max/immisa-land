import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAuthenticated } from '@/lib/auth';

export async function GET(req: NextRequest) {
  if (!await isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const stage = searchParams.get('stage');
  const segment = searchParams.get('segment');
  const q = searchParams.get('q');

  const leads = await prisma.crmLead.findMany({
    where: {
      ...(stage ? { stage } : {}),
      ...(segment ? { segment } : {}),
      ...(q ? {
        OR: [
          { orgName: { contains: q, mode: 'insensitive' } },
          { contactName: { contains: q, mode: 'insensitive' } },
          { mobile1: { contains: q, mode: 'insensitive' } },
          { email1: { contains: q, mode: 'insensitive' } },
        ],
      } : {}),
    },
    include: {
      assignedTo: { select: { id: true, name: true } },
      callLogs: { orderBy: { createdAt: 'desc' }, take: 1 },
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(leads);
}

export async function POST(req: NextRequest) {
  if (!await isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  if (!body?.contactName) {
    return NextResponse.json({ error: 'contactName is required' }, { status: 400 });
  }

  const lead = await prisma.crmLead.create({
    data: {
      contactName: body.contactName,
      orgName: body.orgName || null,
      orgWebsite: body.orgWebsite || null,
      mobile1: body.mobile1 || null,
      mobile2: body.mobile2 || null,
      email1: body.email1 || null,
      email2: body.email2 || null,
      address: body.address || null,
      segment: body.segment || 'Other',
      notes: body.notes || null,
      assignedToId: body.assignedToId || null,
      source: 'manual',
    },
  });
  return NextResponse.json(lead, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  if (!await isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id, stage, notes, assignedToId } = await req.json();
  const lead = await prisma.crmLead.update({
    where: { id },
    data: {
      ...(stage !== undefined ? { stage } : {}),
      ...(notes !== undefined ? { notes } : {}),
      ...(assignedToId !== undefined ? { assignedToId } : {}),
    },
  });
  return NextResponse.json(lead);
}

export async function DELETE(req: NextRequest) {
  if (!await isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await req.json();
  await prisma.crmLead.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
