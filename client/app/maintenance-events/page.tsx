"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2 } from "lucide-react";

import { MaintenanceData, MaintenanceEventUpdate } from "@/util/interface";

async function fetchEvents(): Promise<MaintenanceData[]> {
    const res = await fetch("/api/maintenance_events");
    if (!res.ok) throw new Error("Failed to fetch maintenance events");
    return res.json();
}

async function deleteEventApi(event_id: number): Promise<void> {
    const res = await fetch(`/api/maintenance_events/${event_id}`,
        { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete maintenance event");
}

async function updateEventApi(update: MaintenanceEventUpdate): Promise<MaintenanceData> {
    const res = await fetch(`/api/maintenance_events/${update.event_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(update),
    });
    if (!res.ok) {
        const payload = await res.json().catch(() => null);
        throw new Error(payload?.error || "Failed to update maintenance event");
    }
    return res.json();
}

export default function MaintenanceEventsPage() {
    const queryClient = useQueryClient();
    const [filter, setFilter] = useState("");
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState<MaintenanceEventUpdate | object>({});

    // Fetch maintenance events
    const { data: events = [], isLoading } = useQuery<MaintenanceData[], Error>({
        queryKey: ["maintenance_events"],
        queryFn: fetchEvents,
        staleTime: 10_000, // 10 seconds
    });

    // Optimistic update for DELETE 
    const deleteMutation = useMutation<
        void, 
        Error,
        number, 
        { previous?: MaintenanceData[]; deletedItem?: MaintenanceData }
        >({
        mutationFn: id => deleteEventApi(id),
        onMutate: async (id: number) => {
            await queryClient.cancelQueries({ queryKey: ["maintenance_events"] });
            const previous = queryClient.getQueryData<MaintenanceData[]>(["maintenance_events"]);

            const deletedItem = previous?.find(event => event.event_id === id);

            queryClient.setQueryData<MaintenanceData[] | undefined>(
                ["maintenance_events"], 
                (old) => old?.filter(event => event.event_id !== id)
            );
            toast.message(
                "Deleted locally",
                { 
                    description: "Change will sync shortly.", 
                    action: { 
                        label: "Undo",
                        onClick: async () => { 
                            if (deletedItem && previous) {
                                queryClient.setQueryData(["maintenance_events"], [ ...previous ]);
                                await fetch(`/api/maintenance_events/`, { method: "POST", body: JSON.stringify(deletedItem) });
                                toast.message(
                                    "Restored", 
                                    { description: "Deletion undone." });
                            }
                    }},
                    duration: 5_000 
            });
            return { previous, deletedItem };
        },
        onError: (err, id, context) => {
            if (context?.previous) {
                queryClient.setQueryData(["maintenance_events"], context.previous);
            }
            toast.message("Error", { description: "Failed to delete item." });
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["maintenance_events"] })
        },
        onSuccess: () => {
            toast.message("Deleted", { description: "Maintenance event deleted successfully.", duration: 1_000 });
        }
    })

    // Optimistic update for update
    const updateMutation = useMutation<MaintenanceEventUpdate, Error, MaintenanceEventUpdate, { previous?: MaintenanceData[]}>({
        mutationFn: upd => updateEventApi(upd),
        onMutate: async (updated) => {
            await queryClient.cancelQueries({ queryKey: ["maintenance_events"] });
            const previous = queryClient.getQueryData<MaintenanceData[]>(["maintenance_events"]);
            queryClient.setQueryData<MaintenanceData[] | undefined>(["maintenance_events"], (old) =>
                old?.map((e) => (e.event_id === updated.event_id ? { ...e, ...updated } : e))
            );
            toast.message("Updated locally", { description: "Change will sync shortly." , duration: 2_000 });
            return { previous };
        },
        onError: (err, updated, context) => {
            if (context?.previous) {
                queryClient.setQueryData(["maintenance_events"], context.previous);
            }
            toast.message("Error", { description: err.message });
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["maintenance_events"] })
        },
        onSuccess: () => {
            toast.message("Updated", { description: "Maintenance event updated successfully.", duration: 3_000 });
        }
    })

    const startEdit = (event: MaintenanceData) => {
        setEditingId(event.event_id);
        setFormData({
            event_id: event.event_id,
            maintenance_type: event.maintenance_type,
            technician_name: event.technician_name,
            fault_code: event.fault_code ?? null,
            action_taken: event.action_taken,
            parts_replaced: event.parts_replaced ?? null,
            follow_up_required: event.follow_up_required,
        });
    }

    const cancelEdit = () => {
        setEditingId(null);
        setFormData({});
    };

    const handleSave = async () => {
        if (!editingId || typeof formData !== "object") return;
        const payload = formData as MaintenanceEventUpdate;
        updateMutation.mutate(payload);
        setEditingId(null);
        setFormData({});
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this maintenance event?")) return;
        deleteMutation.mutate(id);
    };


    const filteredEvents = events.filter((ev) =>
        (ev.equipment_status?.equipment_name ?? "").toLowerCase().includes(filter.toLowerCase())
    );


    return (
        <div className="p-6 space-y-4">
            <div className="mb-4 flex items-center gap-4">
                <Input
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    placeholder="Filter by equipment..."
                    className="w-1/3"
                />
                <div className="text-sm text-muted-foreground">Showing {filteredEvents.length} of {events.length}</div>
            </div>

            {isLoading ? (
                <div className="flex justify-center p-8">
                    <Loader2 className="animate-spin" />
                </div>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Equipment</TableHead>
                            <TableHead>Technician</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Start</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {   filteredEvents.map((ev) => (
                            <TableRow key={ev.event_id}>
                                <TableCell>{ev.equipment_status?.equipment_name ?? "—"}</TableCell>

                                <TableCell>
                                    {editingId === ev.event_id ? (
                                        <Input
                                            value={(formData as MaintenanceEventUpdate).technician_name ?? ""}
                                            onChange={(e) =>
                                                setFormData((prev) => ({ ...(prev as MaintenanceEventUpdate), technician_name: e.target.value }))
                                            }
                                        />
                                    ) : (
                                        ev.technician_name
                                    )}
                                </TableCell>

                                <TableCell>
                                    {editingId === ev.event_id ? (
                                        <Input
                                            value={(formData as MaintenanceEventUpdate).maintenance_type ?? ""}
                                            onChange={(e) =>
                                                setFormData((prev) => ({ ...(prev as MaintenanceEventUpdate), maintenance_type: e.target.value }))
                                            }
                                        />
                                    ) : (
                                        ev.maintenance_type
                                    )}
                                </TableCell>

                                <TableCell>{new Date(ev.start_time).toLocaleString()}</TableCell>

                                <TableCell className="flex gap-2">
                                    {editingId === ev.event_id ? (
                                        <>
                                            <Button size="sm" onClick={handleSave}>Save</Button>
                                            <Button size="sm" variant="outline" onClick={cancelEdit}>Cancel</Button>
                                        </>
                                    ) : (
                                        <>
                                            <Button size="sm" onClick={() => startEdit(ev)}>Edit</Button>
                                            <Button size="sm" variant="destructive" onClick={() => handleDelete(ev.event_id)}>Delete</Button>
                                        </>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}


        </div>
    );
}
