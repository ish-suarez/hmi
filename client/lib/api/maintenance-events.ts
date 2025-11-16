import { MaintenanceData } from "@/util/interface";

export async function restoreEventApi(event: Omit<MaintenanceData, "event_id">) {
    const res = await fetch(`/api/maintenance_events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(event),
    });

    if (!res.ok) {
        throw new Error("Failed to restore event");
    }

    return res.json();
}