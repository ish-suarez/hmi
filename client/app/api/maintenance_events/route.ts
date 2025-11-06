import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { treeifyError, z } from "zod";
import { maintenanceEventSchema } from "@/lib/validation";

const { maintenance_events, fault_codes } = prisma;

const paramsSchema = z.object({
    equipment_id: z.string().optional(),
});

// GET /api/maintenance_events query equipment_id optional
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const { equipment_id } = paramsSchema.parse({
            equipment_id: searchParams.get('equipment_id') ?? undefined,
        });

        const maintenanceEvents = await maintenance_events.findMany({
            where: equipment_id ? { equipment_id: equipment_id } : undefined,
            orderBy: { start_time: 'desc' },
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

        return NextResponse.json(maintenanceEvents, { status: 200 });
    } catch (error) {
        console.error("Error fetching maintenance events:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// POST /api/maintenance create new maintenance event
export async function POST(req: Request) {
    try {
        const body = await req.json();
    const data = maintenanceEventSchema.parse(body);

        // check equipment exists
        const equipmentExists = await prisma.equipment_status.findUnique({
        where: { equipment_id: data.equipment_id },
        });
        const faultCodeExists = await fault_codes.findUnique({
            where: { fault_code: data.fault_code || '' },
        });

        if (!equipmentExists) {
        return NextResponse.json(
            { error: "Equipment not found" },
            { status: 404 }
        );
        }


        const newEvent = await maintenance_events.create({
            data: {
                ...data,
                fault_code: data.fault_code && faultCodeExists ? data.fault_code : null,
            },
        });

        return NextResponse.json(newEvent, { status: 201 });


    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error('Failed to add maintenance event:', error);
            return NextResponse.json({ error: treeifyError(error) }, { status: 400 });
        }
        console.error('Error creating maintenance event:', error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}