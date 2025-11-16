"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Activity, Wrench } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="grid gap-6 md:grid-cols-3 p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="text-green-500" /> Active Equipment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">42</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="text-yellow-500" /> Maintenance Pending
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">6</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="text-blue-500" /> Faults Logged
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">12</p>
        </CardContent>
      </Card>
    </div>
  );
}
