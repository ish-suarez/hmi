// isFaulty(item.status) ? "bg-red-600 text-white" : "bg-green-600 text-white" 

// Helper function to determine if equipment status is faulty
export const faultyStatusColor = (status: string) => { 
    return ['Offline', 'Stopped', 'Fault'].includes(status) ? "bg-red-600 text-white" : "bg-green-600 text-white"
};