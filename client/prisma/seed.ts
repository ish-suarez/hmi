import { PrismaClient } from "../app/generated/prisma/client"; 

const prisma = new PrismaClient()
const { device_types, locations, fault_codes, equipment_status, } = prisma;

async function createManyDeviceTypes() {
    try {
        const devicesToCreate = [
            { device_type_name: 'Motor Drive', is_active: true},
            { device_type_name: 'Centrifugal Pump', is_active: true},
            { device_type_name: 'Temperature Sensor', is_active: true},
            { device_type_name: 'Solenoid Valve', is_active: true},
            { device_type_name: 'Operator Panel', is_active: true},
            { device_type_name: 'Controller', is_active: true},
            { device_type_name: 'Level Sensor', is_active: true},
        ]
        const res = await device_types.createMany({
            data: devicesToCreate,
            skipDuplicates: true,
        })
        console.log(`Device types seeded successfully. ${res.count}`)
    } catch (error) {
        console.error("Error seeding device types:", error);
    }
}

async function createManyLocations() {
    try {
        const locationsToCreate = [
            { location_name: 'Line 1 - Blend', is_active: true},
            { location_name: 'Line 1 - Transfer', is_active: true},
            { location_name: 'Tank 2', is_active: true},
            { location_name: 'Reactor Loop', is_active: true},
            { location_name: 'Control Room', is_active: true},
            { location_name: 'MCC Room', is_active: true},
            { location_name: 'Packaging Line', is_active: true},
            { location_name: 'Tank 4', is_active: true},
        ]
        
        const res = await locations.createMany({
            data: locationsToCreate,
            skipDuplicates: true,
        })
        console.log(`Locations seeded successfully. ${res.count}` )
    } catch (error) {
        console.error("Error seeding locations:", error);
    }
}

async function createManyFaultCodes() {
    try {
        const faultCodesToCreate = [
            {fault_code: 'E101', fault_description: 'Overheating detected'},
            {fault_code: 'E102', fault_description: 'Low pressure alarm'},
            {fault_code: 'E103', fault_description: 'Sensor malfunction'},
            {fault_code: 'E104', fault_description: 'Communication error'},
            {fault_code: 'E105', fault_description: 'Power supply issue'},
        ]

        const res = await fault_codes.createMany({
            data: faultCodesToCreate,
            skipDuplicates: true,
        })
        console.log(`Fault codes seeded successfully. ${res.count}`)
    } catch (error) {
        console.error("Error seeding fault codes:", error);
    }
}

async function createManyEquipmentStatus() {
    try {
        const equipmentStatusToCreate  = [
            {equipment_id: 'EQ-001', equipment_name: 'Mixer A1', device_type_id: 1, location_id: 1, status: 'Running', last_checked: new Date('2025-10-24T22:15:00Z'), fault_code: null, description: 'Operating normally', is_active: true},
            {equipment_id: 'EQ-002', equipment_name: 'Pump P3', device_type_id: 2, location_id: 2, status: 'Stopped', last_checked: new Date('2025-10-24T22:10:30Z'), fault_code: 'E103', description: 'Low inlet pressure detected', is_active: false},
            {equipment_id: 'EQ-003', equipment_name: 'Sensor T-14', device_type_id: 3, location_id: 3, status: 'Online', last_checked: new Date('2025-10-24T22:17:12Z'), fault_code: null, description: '68.4°F and stable', is_active: true},
            {equipment_id: 'EQ-004', equipment_name: 'Valve V-7', device_type_id: 4, location_id: 4, status: 'Fault', last_checked: new Date('2025-10-24T22:12:45Z'), fault_code: 'F208', description: 'Coil short detected', is_active: true},
            {equipment_id: 'EQ-005', equipment_name: 'HMI-Panel 1', device_type_id: 5, location_id: 5, status: 'Online', last_checked: new Date('2025-10-24T22:20:01Z'), fault_code: null, description: 'Connected to PLC via Ethernet', is_active: true},
            {equipment_id: 'EQ-006', equipment_name: 'PLC-Rack 2', device_type_id: 6, location_id: 6, status: 'Online', last_checked: new Date('2025-10-24T22:18:30Z'), fault_code: null, description: 'Communications healthy', is_active: true},
            {equipment_id: 'EQ-007', equipment_name: 'Conveyor C1', device_type_id: 1, location_id: 7, status: 'Running', last_checked: new Date('2025-10-24T22:19:15Z'), fault_code: null, description: 'Load stable, operating at 85% speed', is_active: true},
            {equipment_id: 'EQ-008', equipment_name: 'Sensor L-9', device_type_id: 7, location_id: 8, status: 'Offline', last_checked: new Date('2025-10-24T22:05:10Z'), fault_code: 'E220', description: 'No signal — check wiring', is_active: true},
        ]
        const res =  await equipment_status.createMany({
            data: equipmentStatusToCreate,
            skipDuplicates: true,
        })
        console.log(`Equipment status seeded successfully. ${res.count}`)
    } catch (error) {
        console.error("Error seeding equipment status:", error);
    }
}

async function createManyStatusLogs() {
    try {
        const statusLogsToCreate = [
            { equipment_id: 'EQ-002', status: 'Running', fault_code: null, value_reading: 40, logged_at: new Date('2025-10-24T21:50:00Z'), operator_name: 'J. Lopez', notes: 'Pump running normally'},
            { equipment_id: 'EQ-002', status: 'Stopped', fault_code: 'E103', value_reading: 10, logged_at: new Date('2025-10-24T22:10:30Z'), operator_name: 'J. Lopez', notes: 'Low inlet pressure alarm triggered'},
            { equipment_id: 'EQ-003', status: 'Running', fault_code: null, value_reading: null, logged_at: new Date('2025-10-24T21:40:00Z'), operator_name: 'S. Park', notes: 'Normal operation'},
            { equipment_id: 'EQ-004', status: 'Fault', fault_code: 'F208', value_reading: null, logged_at: new Date('2025-10-24T22:12:45Z'), operator_name: 'S. Park', notes: 'Valve coil short detected'},
            { equipment_id: 'EQ-005', status: 'Online', fault_code: null, value_reading: 95, logged_at: new Date('2025-10-24T21:45:00Z'), operator_name: 'D. Chan', notes: 'Stable signal'},
            { equipment_id: 'EQ-008', status: 'Offline', fault_code: 'E220', value_reading: null, logged_at: new Date('2025-10-24T22:05:10Z'), operator_name: 'D. Chan', notes: 'No signal — check wiring'},
        ]

        for (const log of statusLogsToCreate) {
            const existingFault = await fault_codes.findUnique({
                where: { fault_code: log.fault_code || '' },
            });
            if (!existingFault && log.fault_code) {
                const createFault = await prisma.fault_codes.create({
                    data: {
                        fault_code: log.fault_code || '',
                        fault_description: log.notes || 'Auto-generated fault code',
                    }
                })
                console.log(`Created missing fault code: ${createFault.fault_code}`);
            }
        }

        await prisma.status_logs.createMany({
            data: statusLogsToCreate,
            skipDuplicates: true,
        }).then((res) => {
            console.log(`Status logs seeded successfully. ${res.count}`)
        })
        
    } catch (error) {
        console.error("Error seeding status logs:", error);
    }
}

async function createManyMaintenanceEvents() {
    try {
        const maintenanceEventsToCreate = [
            { equipment_id: 'EQ-004', maintenance_type: 'Corrective', fault_code: 'F208', technician_name: 'R. Torres', start_time: new Date('2025-10-25T08:00:00Z'), end_time: new Date('2025-10-25T10:15:00Z'), action_taken: 'Replaced solenoid coil and verified operation', parts_replaced: 'Solenoid Coil Model SV-12', follow_up_required: false},
            { equipment_id: 'EQ-002', maintenance_type: 'Corrective', fault_code: 'E103', technician_name: 'K. Patel', start_time: new Date('2025-10-25T09:30:00Z'), end_time: new Date('2025-10-25T10:00:00Z'), action_taken: 'Checked suction line, cleaned filter', parts_replaced: 'N/A', follow_up_required: false},
            { equipment_id: 'EQ-008', maintenance_type: 'Preventive', fault_code: null, technician_name: 'J. Lee', start_time: new Date('2025-10-26T07:00:00Z'), end_time: new Date('2025-10-26T08:00:00Z'), action_taken: 'Rewired sensor connection, calibrated transmitter', parts_replaced: 'Sensor Cable', follow_up_required: false},
        ]

        const res = await prisma.maintenance_events.createMany({
            data: maintenanceEventsToCreate,
            skipDuplicates: true,
        })
        console.log(`Maintenance events seeded successfully. ${res.count}`)
    } catch (error) {
        console.error("Error seeding maintenance events:", error);
    }
}

async function createAllSeedData() {
    try { 
        await prisma.$connect(); 
        await createManyDeviceTypes();
        await createManyLocations();
        await createManyFaultCodes();
        await createManyEquipmentStatus();
        await createManyStatusLogs();
        await createManyMaintenanceEvents();   
    } catch (error) {
        console.error("Error connecting to the database:", error);
        return; 
    } finally {
        await prisma.$disconnect();
    }
}

createAllSeedData();

