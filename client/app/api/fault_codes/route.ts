import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { faultCodeSchema } from '@/lib/validation';

const { fault_codes } = prisma;

// GET /api/fault_codes
export async function GET() {
  try { 
    const types = await fault_codes.findMany();
    return NextResponse.json(types, { status: 200 });

  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
}

// POST /api/device_types
export async function POST(request: Request) {
  try {
    const data = await request.json();
    faultCodeSchema.parse(data); //  Validate incoming data
    const newType = await fault_codes.create({
      data,
    });
    return NextResponse.json(newType, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
  }
}
