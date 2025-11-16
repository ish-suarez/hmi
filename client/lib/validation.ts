import { z } from 'zod';

// ✅ Equipment
export const equipmentSchema = z.object({
    equipment_id: z.string().min(1),
    equipment_name: z.string().min(1),
    device_type_id: z.number().int().positive(),
    location_id: z.number().int().positive(),
    status: z.string().min(1),
    description: z.string().optional(),
    fault_code: z.string().optional().nullable(),
});

// ✅ Status Logs
export const statusLogSchema = z.object({
    equipment_id: z.string().min(1),
    status: z.string().min(1),
    fault_code: z.string().optional().nullable(),
    value_reading: z.string().optional(),
    operator_name: z.string().min(1),
    notes: z.string().optional(),
});

// ✅ Maintenance Events
export const maintenanceEventSchema = z.object({
    equipment_id: z.string().min(1),
    maintenance_type: z.string().min(1),
    fault_code: z.string().nullable(),
    technician_name: z.string().min(1),
    start_time: z.coerce.date().optional(),
    end_time: z.coerce.date().optional(),
    action_taken: z.string().min(1),
    parts_replaced: z.string().optional(),
    follow_up_required: z.boolean().default(false),
});

// ✅ Device Types
export const deviceTypeSchema = z.object({
    device_type_name: z.string().min(1),
});

// ✅ Locations
export const locationSchema = z.object({
    location_name: z.string().min(1),
});

// ✅ Fault Codes
export const faultCodeSchema = z.object({
    fault_code: z.string().min(1),
    fault_description: z.string().min(1),
});

// Exporting TypeScript types for better type safety
export type Equipment = z.infer<typeof equipmentSchema>;
export type StatusLog = z.infer<typeof statusLogSchema>;
export type MaintenanceEvent = z.infer<typeof maintenanceEventSchema>;
export type DeviceType = z.infer<typeof deviceTypeSchema>;
export type Location = z.infer<typeof locationSchema>;
export type FaultCode = z.infer<typeof faultCodeSchema>;
