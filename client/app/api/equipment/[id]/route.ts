import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { equipmentParams } from '@/util/interface';
import { z } from 'zod';

const { equipment_status, } = prisma

const paramsSchema = z.object({
    id: z.string().min(1),
});


// GET /api/equipment/[id]
export async function GET(
    req: NextRequest, 
    { params }: equipmentParams
    ){
        try { 
            const { id } = paramsSchema.parse({ id: (await params).id });
    
            const equipment = await equipment_status.findUnique({
                where: { equipment_id: id },
                include: {
                    device_type: true,
                    locations: true,
                    status_logs: { 
                        orderBy: { 
                            logged_at: 'desc' }, 
                            take: 50 
                        },
                    maintenance_events: {
                        orderBy: { start_time: 'desc' },
                        take: 50,
                    },
                },
            });

            if (!equipment) {
                return NextResponse.json({ error: "Equipment Not Found" }, { status: 404 });
            }

            return NextResponse.json(equipment, { status: 200 });
    

        } catch (error) {
            console.error("Error fetching equipment:", error);
            return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
        }   

    }


// Delete /api/equipment/[id]
export async function DELETE(
    req: NextRequest,
    { params }: equipmentParams
) {
    try {
        const { id } = paramsSchema.parse({ id: (await params).id });

        await equipment_status.delete({
            where: { equipment_id: id },
        });

        return NextResponse.json({ message: "Equipment Deleted Successfully" }, { status: 200 });

    } catch (error) {
        console.error("Error deleting equipment:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}





