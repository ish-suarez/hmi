"use client";
import { use, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { EquipmentData, equipmentParams } from "@/util/interface";
import { ParamValue } from "next/dist/server/request/params";
import { faultyStatusColor } from "@/util/helper";
import { status_logs } from "@/app/generated/prisma/client";

const initFormData = {
    status: "",
    fault_code: "",
    operator_name: "",
    notes: ""
}


export default function EquipmentDetailsPage({ params }: equipmentParams) {
    const { id } = useParams();
    const resolvedId = use(params).id;
    console.log("Resolved ID:", resolvedId);


    console.log("Params:", id);

    const [equipment, setEquipment] = useState<EquipmentData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState(initFormData)

    useEffect(() => {
        console.log("Fetching equipment with ID (client):", resolvedId);
        fetch(`/api/equipment/${resolvedId}`)
            .then(res => res.json())
            .then(data => {
                setEquipment(data);
                setLoading(false);
            })
    }, [resolvedId]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="animate-spin h-8 w-8 text-gray-600" />
            </div>
        );
    }

    if (!equipment) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-red-600">Equipment Not Found</p>
            </div>
        );
    }

    const { equipment_id, equipment_name, device_type: { device_type_name }, locations: { location_name }, maintenance_events, description, fault_code, last_checked } = equipment;


    return (
        <div className="p-6 space-y-6">
            <Card className="p-6 space-y-6">
                <CardHeader>
                    <CardTitle className="text-2xl">{equipment_name}</CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-4">
                    <div>
                        <p><strong>Type:</strong> {device_type_name}</p>
                        <p><strong>Location:</strong> {location_name}</p>
                        <p><strong>Description:</strong> {description}</p>
                    </div>
                    <div>
                        <p>
                            <strong>Status:</strong>{" "}
                            <Badge variant={equipment.status === "Online" ? "secondary" : "destructive"}
                                className={`${faultyStatusColor(equipment.status)}`}>
                                {equipment.status}
                            </Badge>
                        </p>
                        {fault_code && (
                            <p><strong>Fault Code:</strong> {fault_code}</p>
                        )}
                        <p><strong>Last Checked:</strong> {new Date(last_checked).toLocaleString()}</p>
                    </div>
                </CardContent>
            </Card>

            {/* Status Log */}
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-xl">Status Log</CardTitle>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="default">Add Log</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>New Status Log</DialogTitle>
                                </DialogHeader>
                                <form
                                    onSubmit={async (e) => {
                                        e.preventDefault();
                                        const res = await fetch(`/api/status_logs`, {
                                            method: 'POST',
                                            headers: {
                                                'Content-Type': 'application/json'
                                            },
                                            body: JSON.stringify({
                                                ...formData,
                                                equipment_id
                                            }),
                                        });
                                        if (res.ok) {
                                            alert("Status log added successfully");
                                            setFormData(initFormData);
                                            const updatedEquipment = await fetch(`/api/equipment/${resolvedId}`);
                                            const updatedData = await updatedEquipment.json();
                                            setEquipment(updatedData);
                                        } else {
                                            alert("Failed to add status log");
                                        }
                                    }}
                                    className="space-y-4"
                                >
                                    <Input
                                        placeholder="Status"
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        required
                                    />
                                    <Input
                                        placeholder="Fault Code (optional)"
                                        value={formData.fault_code}
                                        onChange={(e) => setFormData({ ...formData, fault_code: e.target.value })}
                                    />
                                    <Input
                                        placeholder="Operator Name"
                                        value={formData.operator_name}
                                        onChange={(e) => setFormData({ ...formData, operator_name: e.target.value })}
                                        required
                                    />
                                    <Textarea
                                        placeholder="Notes"
                                        value={formData.notes}
                                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    />
                                    <Button type="submit" className="w-full">Submit</Button>
                                </form>
                            </DialogContent>
                        </Dialog>

                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Fault</TableHead>
                                <TableHead>Operator</TableHead>
                                <TableHead>Notes</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {
                                equipment.status_logs.map((status_logs: status_logs) => (
                                    <TableRow key={status_logs.log_id}>
                                        <TableCell>{new Date(status_logs.logged_at).toLocaleString()}</TableCell>
                                        <TableCell>{status_logs.status}</TableCell>
                                        <TableCell>{status_logs.fault_code || "—"}</TableCell>
                                        <TableCell>{status_logs.operator_name}</TableCell>
                                        <TableCell>{status_logs.notes}</TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

        </div>
    );

}



