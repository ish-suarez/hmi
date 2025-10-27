import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { deviceTypeSchema } from '@/lib/validation';

const { device_types } = prisma;

// GET /api/device_types
export async function GET() {
  try {
    const types = await device_types.findMany();
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
    deviceTypeSchema.parse(data); // Validate incoming data
    const newType = await device_types.create({
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
