import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAuthenticated } from '@/lib/auth';

export async function POST(req: NextRequest) {
  if (!await isAuthenticated()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await req.json();
  const leadId = Number(id);
  const lead = await prisma.lead.findUnique({ where: { id: leadId }, include: { crmLead: true } });
  if (!lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
  if (lead.crmLead) return NextResponse.json(lead.crmLead);

  try {
    const [crmLead] = await prisma.$transaction([
      prisma.crmLead.create({
        data: {
          contactName: lead.name,
          mobile1: lead.phone,
          email1: lead.email,
          notes: lead.message,
          segment: lead.category,
          source: 'landing',
          originLeadId: lead.id,
        },
      }),
      prisma.lead.update({ where: { id: lead.id }, data: { status: 'Converted' } }),
    ]);
    return NextResponse.json(crmLead);
  } catch (e: unknown) {
    if (typeof e === 'object' && e !== null && 'code' in e && e.code === 'P2002') {
      const existing = await prisma.crmLead.findUnique({ where: { originLeadId: leadId } });
      if (existing) return NextResponse.json(existing);
    }
    throw e;
  }
}
