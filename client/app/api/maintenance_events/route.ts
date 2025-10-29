import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { treeifyError, z } from "zod";
import { maintenanceEventSchema } from "@/lib/validation";

const { maintenance_events, equipment_status } = prisma;

const paramsSchema = z.object({
    equipment_id: z.string().optional(),
});

// GET /api/maintenance query equipment_id optional
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const { equipment_id } = paramsSchema.parse({
            equipment_id: searchParams.get('equipment_id') ?? undefined,
        });

        const maintenanceEvents = await maintenance_events.findMany({
            where: equipment_id ? { equipment_id: equipment_id } : undefined,
            orderBy: { equipment_id: 'desc' },
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
        const data = await req.json();
        const { equipment_id } = maintenanceEventSchema.parse(data);
        console.log("Parsed Maintenance Event Data:", data);

        // Verify equipment exists
        const findExistingEquipment = await equipment_status.findUnique({
            where: { equipment_id: equipment_id }
        });

        // Check if equipment exists
        if (!findExistingEquipment) {
            return NextResponse.json({error: "Equipment Not Found"}, {status: 404});
        }
        
        // Create new maintenance event
        const newMaintenanceEvent = await maintenance_events.create({
            data
        });

        return NextResponse.json(newMaintenanceEvent, { status: 201 });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: treeifyError(error) }, { status: 400 });
        }
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}