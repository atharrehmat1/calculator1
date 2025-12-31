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

export function TwelveHourShiftPayCalculator() {
  const [hourlyRate, setHourlyRate] = useState("");
  const [regularHours, setRegularHours] = useState("8");
  const [overtimeRate, setOvertimeRate] = useState("");
  const [shiftsPerWeek, setShiftsPerWeek] = useState("");
  const [result, setResult] = useState<{
    regularPay: number;
    overtimePay: number;
    totalPay: number;
    weeklyPay: number;
  } | null>(null);

  const calculate = () => {
    const rate = parseFloat(hourlyRate);
    const regular = parseFloat(regularHours);
    const overtime = parseFloat(overtimeRate) || rate * 1.5; // Default 1.5x if not provided
    const shifts = parseFloat(shiftsPerWeek);
    
    if (rate > 0 && regular > 0 && shifts > 0) {
      const overtimeHours = 12 - regular;
      const regularPay = rate * regular;
      const overtimePay = overtime * overtimeHours;
      const totalPay = regularPay + overtimePay;
      const weeklyPay = totalPay * shifts;
      
      setResult({
        regularPay,
        overtimePay,
        totalPay,
        weeklyPay,
      });
    } else {
      setResult(null);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>12-Hour Shift Pay Calculator</CardTitle>
        <CardDescription>
          Calculate pay for 12-hour shift work including regular and overtime hours.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
            <Input
              id="hourlyRate"
              type="number"
              step="0.01"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(e.target.value)}
              placeholder="Enter hourly rate"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="regularHours">Regular Hours (before overtime)</Label>
            <Input
              id="regularHours"
              type="number"
              value={regularHours}
              onChange={(e) => setRegularHours(e.target.value)}
              placeholder="Enter regular hours"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="overtimeRate">Overtime Rate ($) - Leave blank for 1.5x</Label>
            <Input
              id="overtimeRate"
              type="number"
              step="0.01"
              value={overtimeRate}
              onChange={(e) => setOvertimeRate(e.target.value)}
              placeholder="Auto: 1.5x hourly rate"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="shiftsPerWeek">Shifts per Week</Label>
            <Input
              id="shiftsPerWeek"
              type="number"
              value={shiftsPerWeek}
              onChange={(e) => setShiftsPerWeek(e.target.value)}
              placeholder="Enter number of shifts"
              className="mt-2"
            />
          </div>
          <Button onClick={calculate} className="w-full">
            Calculate
          </Button>
          {result && (
            <div className="mt-6 bg-muted p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span>Regular Pay (per shift):</span>
                <span className="font-bold">${result.regularPay.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Overtime Pay (per shift):</span>
                <span className="font-bold">${result.overtimePay.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Pay (per shift):</span>
                <span className="font-bold">${result.totalPay.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span>Weekly Pay:</span>
                <span className="font-bold text-lg">${result.weeklyPay.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

