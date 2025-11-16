import { prisma } from "@/lib/prisma";
import { equipmentSchema } from "@/lib/validation";
import { NextResponse } from "next/server";

const { equipment_status } = prisma;

// GET /api/equipment
export async function GET() {
    try {
        const equipment = await equipment_status.findMany({
            include: {
                device_type: true,
                locations: true,
            },
            orderBy: { equipment_name: 'asc' }
        })
        return NextResponse.json(equipment, { status: 200 });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
    }
};

// POST /api/equipment
export async function POST(req: Request) {
    try {
        const data = await req.json();
        equipmentSchema.parse(data); // Validate incoming data
        const newEquipment = await equipment_status.create({
            data: data
        })
        return NextResponse.json(newEquipment, { status: 201 });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
        return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
    }
};