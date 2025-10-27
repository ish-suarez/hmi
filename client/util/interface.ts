import { device_types, equipment_status, locations } from "@/app/generated/prisma/client";

interface EquipmentData extends equipment_status {
    equipment_id: string;
    equipment_name: string;
    status: string;
    device_type_id: number;
    location_id: number;
    device_type: device_types;
    locations: locations;
}




export type { EquipmentData };