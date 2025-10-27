"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { EquipmentData } from "@/util/interface";
import { ParamValue } from "next/dist/server/request/params";
import { faultyStatusColor } from "@/util/helper";

const initFormData = {
    status: "",
    fault_code: "",
    operator_name: "",
    notes: ""
}

async function fetchEquipmentById(id: ParamValue) {
    try {
        const res = await fetch(`/api/equipment/${id}`, { cache: 'no-store' });
        return res.json();
    } catch (error) {
        console.error('Error fetching equipment data:', error);
        return null;
    } finally {
        // No cleanup actions needed here for fetch
    }
}

export default function EquipmentDetailsPage() {
    const { id } = useParams();
    const [equipment, setEquipment] = useState<EquipmentData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState(initFormData)

    useEffect(() => {
        try {
            async function fetchEquipment() {
                const data = await fetchEquipmentById(id);
                setEquipment(data);
            }
            fetchEquipment();
        } catch (error) {
            console.error('Error fetching equipment data:', error);
        } finally {
            setLoading(false);
        }
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full">
                <Loader2 className="animate-spin h-8 w-8 text-gray-600" />
            </div>
        );
    }

    if (!equipment) {
        return (
            <div className="flex justify-center items-center h-full">
                <p className="text-red-600">Equipment Not Found</p>
            </div>
        );
    }

    const { equipment_id, equipment_name, device_type: {device_type_name}, locations: {location_name}, description, } = equipment;

    return (
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
                <p>
              <strong>Status:</strong>{" "}
              <Badge variant={equipment.status === "Online" ? "secondary" : "destructive"}
              className={`${faultyStatusColor(equipment.status)}`}>
                {equipment.status}
              </Badge>
            </p>
            </CardContent>


        </Card>
    );
    
}



