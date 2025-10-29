"use client";
import { useEffect, useState, use } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";

const url = '/api/maintenance_events';

// import interfaces for MaintenanceData
import { MaintenanceData } from "@/util/interface";
import { initialMaintenanceFormData } from "@/util/helper";
import { Description } from "@radix-ui/react-dialog";

export default function MaintenancePage() {
    const [events, setEvents] = useState<MaintenanceData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const [formData, setFormData] = useState(initialMaintenanceFormData);

    // get all maintenance events
    const getMaintenanceEvents = async () => {
        try {
            setLoading(true);
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
        getMaintenanceEvents();
    }, [])

    console.log("Maintenance Events:", events);
    console.log("Form Data:", formData);

    const handleSubmit = async (e: React.FormEvent) => {
        try {
            e.preventDefault();
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setFormData(initialMaintenanceFormData)
            }
        } catch (error) {
            console.error("Error submitting maintenance event:", error);
        } finally {
            getMaintenanceEvents();
        }
    }

    return (
        <div className='p-6 space-y-6'>
            <Card>
                <CardHeader className="flex justify-between items-center">
                    <CardTitle className="text-xl font-semibold">Maintenance Events</CardTitle>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button>Add Event</Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg">
                            <DialogHeader>
                                <DialogTitle>New Maintenance Event</DialogTitle>
                                <Description>
                                    Fill out the form below to log a new maintenance event for the equipment.
                                </Description>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <Input
                                    placeholder="Equipment ID: e.g., EQ12345"
                                    value={formData.equipment_id}
                                    onChange={(e) => setFormData({ ...formData, equipment_id: e.target.value })}
                                    required
                                />
                                <Input
                                    placeholder="Maintenance Type: e.g., Preventive, Corrective, Calibration"
                                    value={formData.maintenance_type}
                                    onChange={(e) => setFormData({ ...formData, maintenance_type: e.target.value })}
                                    required
                                />
                                <Input
                                    placeholder="Fault Code (optional)"
                                    value={formData.fault_code}
                                    onChange={(e) => setFormData({ ...formData, fault_code: e.target.value })}
                                />
                                <Input
                                    placeholder="Technician Name e.g., J. Doe"
                                    value={formData.technician_name}
                                    onChange={(e) => setFormData({ ...formData, technician_name: e.target.value })}
                                    required
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
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="follow-up"
                                        checked={formData.follow_up_required}
                                        onCheckedChange={(checked) =>
                                            setFormData({ ...formData, follow_up_required: !!checked })
                                        }
                                    />
                                    <label htmlFor="follow-up" className="text-sm">
                                        Follow-up required
                                    </label>
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
                                        <TableCell>{new Date(event.start_time).toLocaleString()}</TableCell>
                                        <TableCell>{event.equipment_status?.equipment_name}</TableCell>
                                        <TableCell>{event.technician_name}</TableCell>
                                        <TableCell>{event.action_taken}</TableCell>
                                        <TableCell>{event.parts_replaced || "—"}</TableCell>
                                        <TableCell>{event.follow_up_required ? "Yes" : "No"}</TableCell>
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