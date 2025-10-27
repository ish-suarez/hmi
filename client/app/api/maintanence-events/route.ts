import { NextResponse } from "next/server";
import { PrismaClient } from "../../generated/prisma/client";
import { maintenanceEventSchema } from "@/lib/validation";

const prisma = new PrismaClient();
const { maintenance_events } = prisma

// GET /api/maintenance-events
export async function GET() {
    try {
        const events = await maintenance_events.findMany({
            include: {
                equipment_status: true,
                fault_codes: true
            }
        });
        return NextResponse.json(events, { status: 200 });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
    }
}

// POST /api/maintenance-events
export async function POST(req: Request) {
    try {
        const data = await req.json();
        const newEvent = await maintenance_events.create(data);
        maintenanceEventSchema.parse(data); // Validate incoming data
        return NextResponse.json(newEvent, {status: 201});
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
    }
}
