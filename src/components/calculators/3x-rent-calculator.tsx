"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export function ThreeXRentCalculator() {
  const [monthlyRent, setMonthlyRent] = useState("");
  const [result, setResult] = useState<{
    requiredIncome: number;
    requiredHourlyRate: number;
  } | null>(null);

  const calculate = () => {
    const rent = parseFloat(monthlyRent);
    
    if (rent > 0) {
      const requiredIncome = rent * 3; // 3x rent rule
      const requiredHourlyRate = requiredIncome / (40 * 4.33); // Assuming 40 hours/week, 4.33 weeks/month
      
      setResult({
        requiredIncome,
        requiredHourlyRate,
      });
    } else {
      setResult(null);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>3x Rent Calculator</CardTitle>
        <CardDescription>
          Calculate the minimum income required (3x rent rule) for rental applications.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="monthlyRent">Monthly Rent ($)</Label>
            <Input
              id="monthlyRent"
              type="number"
              step="0.01"
              value={monthlyRent}
              onChange={(e) => setMonthlyRent(e.target.value)}
              placeholder="Enter monthly rent"
              className="mt-2"
            />
          </div>
          <Button onClick={calculate} className="w-full">
            Calculate
          </Button>
          {result && (
            <div className="mt-6 bg-muted p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span>Required Monthly Income:</span>
                <span className="font-bold">${result.requiredIncome.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Required Annual Income:</span>
                <span className="font-bold">${(result.requiredIncome * 12).toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span>Required Hourly Rate (40hrs/week):</span>
                <span className="font-bold">${result.requiredHourlyRate.toFixed(2)}/hr</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

