import { prisma } from '@/lib/prisma';
import { statusLogSchema } from '@/lib/validation';
import { NextResponse } from 'next/server';
import { treeifyError, z } from 'zod';

const { status_logs, equipment_status } = prisma;

const queryParamsSchema = z.object({
    equipment_id: z.string().optional(),
})

// GET /api/status_logs
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const { equipment_id } = queryParamsSchema.parse({
            equipment_id: searchParams.get('equipment_id') ?? undefined
        })

        const logs = await status_logs.findMany({
            where: equipment_id ? { equipment_id: equipment_id } : undefined,
            orderBy: { logged_at: 'desc' },
            include: {
                fault_codes: true,
                equipment_status: {
                    select: {  
                        equipment_name: true,
                    }
                },
            },
            take: 100,
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
        const { equipment_id } = statusLogSchema.parse(data); // Validate incoming data

        const findExistingLog = await equipment_status.findUnique({
            where: { equipment_id: equipment_id }
        })

        if (!findExistingLog) {
            return NextResponse.json({ error: "Equipment Not Found" }, { status: 404 });
        }

        const newLog = await status_logs.create({
            data
        })
        return NextResponse.json(newLog, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: treeifyError(error) }, { status: 400 });
        }
        return NextResponse.json({ error: 'Failed to Create Status Log' }, { status: 500 });
    }
}