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

interface Equipment { 
    equipment_id: string;
    equipment_name: string;
}

type equipmentParams = {
    params: Promise<{ id: string }>;
};

interface MaintenanceData {
    event_id: number;
    equipment_id: number;
    maintenance_type: string;
    technician_name: string;
    fault_code?: string | null;
    action_taken: string;
    parts_replaced?: string | null;
    follow_up_required: boolean;
    start_time: string;
    end_time: string | null;
    equipment_status: { equipment_name: string };
}

type MaintenanceEventUpdate = Partial <
    Pick<
        MaintenanceData,
        | "maintenance_type"
        | "technician_name"
        | "fault_code"
        | "action_taken"
        | "parts_replaced"
        | "follow_up_required"
    >
> & { event_id: number };

type maintenanceParams = {
    params: Promise<{ id: string }>;
};

interface MaintenanceEventCreate {
    equipment_id: number;
    maintenance_type: string;
    technician_name: string;
    fault_code?: string | null;
    action_taken: string;
    parts_replaced?: string | null;
    follow_up_required: boolean;
}






export type { EquipmentData, equipmentParams, MaintenanceData, Equipment, maintenanceParams, MaintenanceEventUpdate, MaintenanceEventCreate };