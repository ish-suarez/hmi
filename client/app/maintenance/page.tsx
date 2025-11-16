"use client";
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Loader2, Trash2, Pencil } from "lucide-react";
import { toast } from "sonner";


// import interfaces for MaintenanceData
import { Equipment, MaintenanceData } from "@/util/interface";
import { initialMaintenanceFormData } from "@/util/helper";

export default function MaintenancePage() {

    const [events, setEvents] = useState<MaintenanceData[]>([]);
    const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedEquipment, setSelectedEquipment] = useState<string>('all');
    const [editingEvent, setEditingEvent] = useState<MaintenanceData | null>(null);
    const [formData, setFormData] = useState(initialMaintenanceFormData);

    const fetchEquipment = async () => {
        try {
            const res = await fetch('/api/equipment', { cache: 'no-store' });
            const data = await res.json();
            setEquipmentList(data);
        } catch (error) {
            console.error("Error fetching equipment list:", error);
        }
    }

    // get all maintenance events
    const getMaintenanceEvents = async (equipmentFilter?: string) => {
        try {
            let url = '/api/maintenance_events';
            setLoading(true);
            if (equipmentFilter && equipmentFilter !== 'all') {
                url += `?equipment_id=${equipmentFilter}`;
            }
            const res = await fetch(url, { cache: 'no-store' });
            const data = await res.json();
            setEvents(data);
        } catch (error) {
            console.error("Error fetching maintenance events:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchEquipment();
        getMaintenanceEvents();
    }, []);

    const handleFilterChange = (value: string) => {
        setSelectedEquipment(value);
        getMaintenanceEvents(value);
    }

    const handleSubmit = async (e: React.FormEvent) => {
        try {
            e.preventDefault();

            const newTempId = Date.now(); // Temporary ID for the example
            const optimisticEvent = {
                event_id: newTempId,
                equipment_id: Number(formData.equipment_id),
                maintenance_type: formData.maintenance_type,
                technician_name: formData.technician_name,
                fault_code: formData.fault_code,
                action_taken: formData.action_taken,
                parts_replaced: formData.parts_replaced,
                follow_up_required: formData.follow_up_required,
                start_time: new Date().toISOString(),
                end_time: null,
                equipment_status: {
                    equipment_name: 
                        equipmentList.find(eq => String(eq.equipment_id) === formData.equipment_id)?.equipment_name || 'Unknown'
                },
            }

            // Optimistically update UI
            setEvents(prev => [optimisticEvent, ...prev]);
            toast.loading('Creating...', { description: 'Saving maintenance event...', toasterId: 'create-maintenance' });

            const url = '/api/maintenance_events';
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {

                const created = await res.json();
                setEvents(prev => 
                    prev.map(ev => (ev.event_id === newTempId ? created : ev))
                );
                getMaintenanceEvents(selectedEquipment);
                toast.dismiss('create-maintenance');
                toast.success("Created", { description: "The maintenance event has been recorded.", duration: 3000 });
            } else {
                setEvents(prev => prev.filter(ev => ev.event_id !== newTempId));
                toast.error("Error", { description: "Failed to submit maintenance event." });
            } 

        } catch (error) {
            console.error("Error submitting maintenance event:", error);
        } finally {
            setFormData(initialMaintenanceFormData);
            getMaintenanceEvents();
        }
    }

    const handleDelete = async (id: number) => {
        try {
            const url = '/api/maintenance_events';
            if (!confirm("Are you sure you want to delete this maintenance event?")) return;

            const prev = [...events];
            // Optimistically update UI
            setEvents(prev.filter(ev => ev.event_id !== id));
            toast.loading('Deleting...', { description: 'Deleting maintenance event...', toasterId: 'delete-maintenance' });
            const res = await fetch(`${url}/${id}`, { method: 'DELETE' });
            if(res.ok) {
                toast.dismiss('delete-maintenance');
                toast.success("Maintenance event deleted successfully");
            } else {
                setEvents(prev);
                toast.error("Error", { description: "Failed to delete maintenance event." });
            }

        } catch (error) {
            console.error("Error deleting maintenance event:", error);
            toast.error("Error", { description: "Failed to delete maintenance event." });
        } finally {
            getMaintenanceEvents(selectedEquipment);
        }
    }

    const handleEditSubmit = async (e: React.FormEvent) => {
        try {
            e.preventDefault();
            if (!editingEvent) return;
            const prev = [...events];   
            // Optimistically update UI
            setEvents(prev.map(ev => (ev.event_id === editingEvent.event_id ? editingEvent : ev)));
            toast.loading('Updating...', { description: 'Updating maintenance event...', toasterId: 'edit-maintenance' });

            const url = `/api/maintenance_events/${editingEvent.event_id}`;
            const res = await fetch(url, {
                method: "PATCH",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingEvent)
            });
            if (res.ok) {
                toast.dismiss('edit-maintenance');
                toast.success("Updated", { description: "Maintenance event updated successfully", duration: 3000 });
            } else {
                setEvents(prev);
                toast.error("Error", { description: "Failed to update maintenance event." });
            }

        } catch (error) {
            console.error("Error editing maintenance event:", error);
            toast.error("Error", { description: "Failed to update maintenance event." });
        } finally {
            setEditingEvent(null);
            getMaintenanceEvents(selectedEquipment);
        }
    }

    return (
        <div className='p-6 space-y-6'>
            <Card>
                <CardHeader className="flex justify-between items-center">
                    <CardTitle className="text-xl font-semibold">Maintenance Events</CardTitle>

                    {/* Filter Dropdown */}
                    <div className="flex items-center space-x-3">
                        <Select value={selectedEquipment} onValueChange={handleFilterChange}>
                            <SelectTrigger className="w-48">
                                <SelectValue placeholder="Filter by Equipment" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Equipment</SelectItem>
                                {equipmentList.map((eq) => (
                                    <SelectItem key={eq.equipment_id} value={String(eq.equipment_id)}>
                                        {eq.equipment_name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>



                    {/* Add Event Button */}
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button>Add Event</Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg">
                            <DialogHeader>
                                <DialogTitle>New Maintenance Event</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <Select
                                    onValueChange={(value) => setFormData({ ...formData, equipment_id: value })}
                                    value={formData.equipment_id}
                                    required
                                >
                                    <SelectTrigger><SelectValue placeholder="Select Equipment" /></SelectTrigger>
                                    <SelectContent>
                                        {equipmentList.map((eq) => (
                                            <SelectItem key={eq.equipment_id} value={String(eq.equipment_id)}>
                                                {eq.equipment_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Input
                                    placeholder="Maintenance Type"
                                    value={formData.maintenance_type}
                                    onChange={(e) => setFormData({ ...formData, maintenance_type: e.target.value })}
                                    required
                                />
                                <Input
                                    placeholder="Technician Name"
                                    value={formData.technician_name}
                                    onChange={(e) => setFormData({ ...formData, technician_name: e.target.value })}
                                    required
                                />
                                <Input
                                    placeholder="Fault Code (optional)"
                                    value={formData.fault_code}
                                    onChange={(e) => setFormData({ ...formData, fault_code: e.target.value })}
                                />
                                <Textarea
                                    placeholder="Action Taken"
                                    value={formData.action_taken}
                                    onChange={(e) => setFormData({ ...formData, action_taken: e.target.value })}
                                    required
                                />
                                <Input
                                    placeholder="Parts Replaced (optional)"
                                    value={formData.parts_replaced}
                                    onChange={(e) => setFormData({ ...formData, parts_replaced: e.target.value })}
                                />
                                <div className="flex flex-row gap-2 items-center">
                                    <Checkbox
                                        id="follow-up"
                                        checked={formData.follow_up_required}
                                        onCheckedChange={(checked) =>
                                            setFormData({ ...formData, follow_up_required: !!checked })
                                        }
                                    />
                                    <div className="flex items-center space-x-2">
                                        <Label htmlFor="follow-up" className="text-sm">Follow-up required</Label>
                                    </div>
                                </div>
                                <Button type="submit" className="w-full">Submit</Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center items-center h-40">
                            <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Start Time</TableHead>
                                    <TableHead>Equipment</TableHead>
                                    <TableHead>Technician</TableHead>
                                    <TableHead>Action</TableHead>
                                    <TableHead>Parts</TableHead>
                                    <TableHead>Follow-Up</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {events.map((event) => (
                                    <TableRow key={event.event_id}>
                                        {editingEvent?.event_id === event.event_id ? (
                                            <>
                                                <TableCell colSpan={6}>
                                                    <form onSubmit={handleEditSubmit} className="grid grid-cols-2 gap-2">
                                                        <Input
                                                            value={editingEvent.technician_name}
                                                            onChange={(e) =>
                                                                setEditingEvent({ ...editingEvent, technician_name: e.target.value })
                                                            }
                                                            placeholder="Technician"
                                                        />
                                                        <Input
                                                            value={editingEvent.action_taken}
                                                            onChange={(e) =>
                                                                setEditingEvent({ ...editingEvent, action_taken: e.target.value })
                                                            }
                                                            placeholder="Action Taken"
                                                        />
                                                        <Input
                                                            value={editingEvent.parts_replaced ?? ""}
                                                            onChange={(e) =>
                                                                setEditingEvent({ ...editingEvent, parts_replaced: e.target.value })
                                                            }
                                                            placeholder="Parts"
                                                        />
                                                        <div className="flex items-center space-x-2">
                                                            <Checkbox
                                                                id="edit-follow-up"
                                                                checked={editingEvent.follow_up_required}
                                                                onCheckedChange={(checked) =>
                                                                    setEditingEvent({
                                                                        ...editingEvent,
                                                                        follow_up_required: !!checked,
                                                                    })
                                                                }
                                                            />
                                                            <Label htmlFor="edit-follow-up" className="text-sm">Follow-up required</Label>


                                                        </div>
                                                        <Button type="submit" className="col-span-2">Save</Button>
                                                    </form>
                                                </TableCell>
                                            </>
                                        ) : (
                                            <>
                                                <TableCell>{new Date(event.start_time).toLocaleString()}</TableCell>
                                                <TableCell>{event.equipment_status?.equipment_name}</TableCell>
                                                <TableCell>{event.technician_name}</TableCell>
                                                <TableCell>{event.action_taken}</TableCell>
                                                <TableCell>{event.parts_replaced || "—"}</TableCell>
                                                <TableCell>{event.follow_up_required ? "Yes" : "No"}</TableCell>
                                                <TableCell className="flex space-x-2">
                                                    <Button variant="outline" size="icon" onClick={() => setEditingEvent(event)}>
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="destructive" size="icon" onClick={() => handleDelete(event.event_id)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </>
                                        )}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}