"use client";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { EquipmentData } from "@/util/interface";
import { faultyStatusColor } from "@/util/helper";

async function equipmentData() {
    try {
        const res = await fetch('/api/equipment', { cache: 'no-store' });
        return res.json();
    } catch (error) {
        console.error('Error fetching equipment data:', error);
        return [];
    } finally {
        // No cleanup actions needed here for fetch
    }
}

export default function EquipmentList() {
    const [search, setSearch] = useState("");
    const [equipment, setEquipment] = useState<EquipmentData[]>([]);
    
    const isFaulty = (status: string) => ['Offline', 'Stopped', 'Fault'].includes(status);

    useEffect(() => {
        try {
            async function fetchEquipment() {
                const data = await equipmentData();
                setEquipment(data);
            }
            fetchEquipment();
        } catch (error) {
            console.error('Error fetching equipment data:', error);
        } finally {
            // No cleanup actions needed here for fetch
        }

    }, []);

    const filtered: EquipmentData[] = equipment.filter((equipment: EquipmentData) =>
        equipment.equipment_name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Card className="m-6">
            <CardHeader>
                <CardTitle>Equipment List</CardTitle>
            </CardHeader>
            <CardContent>
                <Input
                    placeholder="Search equipment..."
                    className="mb-4"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Location</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filtered.map((item: EquipmentData) => (
                            <TableRow key={item.equipment_id}>
                                <TableCell>
                                    <Link href={`/equipment/${item.equipment_id}`} className="text-blue-600 hover:underline">
                                        {item.equipment_name}
                                    </Link>
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant={item.status === "Online" ? "secondary" : "destructive"}
                                        className={`${faultyStatusColor(item.status)}`}
                                    >
                                        {item.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>{item.device_type.device_type_name}</TableCell>
                                <TableCell>{item.locations.location_name}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
