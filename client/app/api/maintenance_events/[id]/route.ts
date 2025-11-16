import { NextResponse } from "next/server"; 
import { prisma } from "@/lib/prisma";
import { treeifyError, z } from "zod";
import { maintenanceEventSchema } from "@/lib/validation";
import { maintenanceParams } from "@/util/interface";


const { maintenance_events, equipment_status } = prisma;

const idSchema = z.object({
    id: z.coerce.number().int().positive(),
})

// Patch /api/maintenance query equipment_id optional
export async function PATCH(req: Request, { params }: maintenanceParams) {
    try {
        const { id } = idSchema.parse({ id: (await params).id });
        const data = await req.json();

        const partialMaintenanceSchema = maintenanceEventSchema.partial();
        const updateData = partialMaintenanceSchema.parse(data)

        const updated = await prisma.maintenance_events.update({
            where: { event_id: id },
            data: updateData
        });
        
        return NextResponse.json(updated, { status: 200 });
        

    } catch (error) {
        console.error("Error updating maintenance event:", error);
        return NextResponse.json({error: 'Failed to update maintenance event'}, {status: 500});
    }      
}

// DELETE /api/maintenance/[id]
export async function DELETE(req: Request, { params }: maintenanceParams) {
    try {
        const { id } = idSchema.parse({ id: (await params).id });

        const deleted = await maintenance_events.delete({ where: { event_id: id } });

        return NextResponse.json(deleted, { status: 200 });
    } catch (error) {
        console.error("Error deleting maintenance event:", error);
        return NextResponse.json({error: 'Failed to delete maintenance event'}, {status: 500});
    }
} 
