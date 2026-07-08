import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAuthenticated } from '@/lib/auth';

export async function GET(req: NextRequest) {
  if (!await isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');
  const category = searchParams.get('category');
  const q = searchParams.get('q');

  const leads = await prisma.lead.findMany({
    where: {
      ...(status ? { status } : {}),
      ...(category ? { category } : {}),
      ...(q ? {
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { email: { contains: q, mode: 'insensitive' } },
          { company: { contains: q, mode: 'insensitive' } },
          { phone: { contains: q, mode: 'insensitive' } },
        ],
      } : {}),
    },
    include: { crmLead: { select: { id: true } } },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(leads);
}

export async function PATCH(req: NextRequest) {
  if (!await isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id, status, notes } = await req.json();
  const lead = await prisma.lead.update({
    where: { id: Number(id) },
    data: { ...(status ? { status } : {}), ...(notes !== undefined ? { notes } : {}) },
  });
  return NextResponse.json(lead);
}

export async function DELETE(req: NextRequest) {
  if (!await isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await req.json();
  await prisma.lead.delete({ where: { id: Number(id) } });
  return NextResponse.json({ ok: true });
}
