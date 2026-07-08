import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { CATEGORIES } from '@/lib/constants';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.name || !body?.email) {
    return NextResponse.json({ error: 'name and email are required' }, { status: 400 });
  }

  const apiKeyHeader = req.headers.get('x-api-key');
  let source = 'landing';
  if (apiKeyHeader) {
    const apiKey = await prisma.apiKey.findFirst({ where: { key: apiKeyHeader, active: true } });
    if (!apiKey) {
      return NextResponse.json({ error: 'invalid api key' }, { status: 401 });
    }
    source = 'api';
  }

  const category = CATEGORIES.includes(body.category) ? body.category : 'Other';

  const lead = await prisma.lead.create({
    data: {
      name: body.name,
      email: body.email,
      phone: body.phone || null,
      company: body.company || null,
      service: body.service || null,
      category,
      message: body.message || null,
      fundsAvailable: body.fundsAvailable || null,
      educationLevel: body.educationLevel || null,
      workExperience: body.workExperience || null,
      languageLevel: body.languageLevel || null,
      source,
    },
  });

  return NextResponse.json({ id: lead.id }, { status: 201 });
}
