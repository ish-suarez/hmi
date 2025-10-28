import { device_types, equipment_status, locations, maintenance_events, status_logs } from "@/app/generated/prisma/client";

interface EquipmentData extends equipment_status {
    equipment_id: string;
    equipment_name: string;
    status: string;
    device_type_id: number;
    location_id: number;
    device_type: device_types;
    locations: locations;
    status_logs: status_logs[];
    maintenance_events?: maintenance_events;
}

type equipmentParams = {
    params: Promise<{ id: string }>;
};




export type { EquipmentData, equipmentParams};