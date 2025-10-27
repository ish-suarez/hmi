import { prisma } from '@/lib/prisma';
import { statusLogSchema } from '@/lib/validation';
import { NextResponse } from 'next/server';

const { status_logs } = prisma;

// GET /api/status_logs
export async function GET() {
    try {
        const logs = await status_logs.findMany({
            include: {
                equipment_status: true,
                fault_codes: true,
            },
            orderBy: { logged_at: 'desc' }
        });
        return NextResponse.json(logs, { status: 200 });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
    }
}

// POST /api/status_logs
export async function POST(req: Request) {
    try {
        const data = await req.json();
        statusLogSchema.parse(data); // Validate incoming data
        const newLog = await status_logs.create({
            data: data,
        })
        return NextResponse.json(newLog, { status: 201 });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
    }
}