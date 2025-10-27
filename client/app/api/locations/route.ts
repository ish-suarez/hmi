import { prisma } from '@/lib/prisma';
import { locationSchema } from '@/lib/validation';
import { NextResponse } from 'next/server';

const { locations } = prisma;

// GET /api/locations
export async function GET() {
  try {
    const types = await locations.findMany();
    return NextResponse.json(types, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
}

// POST /api/locations
export async function POST(request: Request) {
  try {
    const data = await request.json();
    locationSchema.parse(data); // Validate incoming data
    const newType = await locations.create({
      data,
    });
    return NextResponse.json(newType, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
  }
}