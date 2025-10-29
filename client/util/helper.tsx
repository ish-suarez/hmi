
// Helper function to determine if equipment status is faulty
export const faultyStatusColor = (status: string) => { 
    return ['Offline', 'Stopped', 'Fault'].includes(status) ? "bg-red-600 text-white" : "bg-green-600 text-white"
};

export const initialMaintenanceFormData = {
    equipment_id: "",
    maintenance_type: "",
    fault_code: "",
    technician_name: "",
    action_taken: "",
    parts_replaced: "",
    follow_up_required: false,
};