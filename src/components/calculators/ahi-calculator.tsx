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

export function AHICalculator() {
  const [apneaEvents, setApneaEvents] = useState("");
  const [hypopneaEvents, setHypopneaEvents] = useState("");
  const [sleepHours, setSleepHours] = useState("");
  const [result, setResult] = useState<{
    ahi: number;
    severity: string;
  } | null>(null);

  const calculate = () => {
    const apnea = parseFloat(apneaEvents) || 0;
    const hypopnea = parseFloat(hypopneaEvents) || 0;
    const hours = parseFloat(sleepHours);
    
    if (hours > 0) {
      const totalEvents = apnea + hypopnea;
      const ahi = totalEvents / hours;
      
      let severity = "";
      if (ahi < 5) {
        severity = "Normal";
      } else if (ahi < 15) {
        severity = "Mild";
      } else if (ahi < 30) {
        severity = "Moderate";
      } else {
        severity = "Severe";
      }
      
      setResult({
        ahi,
        severity,
      });
    } else {
      setResult(null);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>AHI Calculator | Apnea-Hypopnea Index</CardTitle>
        <CardDescription>
          Calculate the Apnea-Hypopnea Index (AHI) to assess sleep apnea severity.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="apneaEvents">Number of Apnea Events</Label>
            <Input
              id="apneaEvents"
              type="number"
              value={apneaEvents}
              onChange={(e) => setApneaEvents(e.target.value)}
              placeholder="Enter apnea events"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="hypopneaEvents">Number of Hypopnea Events</Label>
            <Input
              id="hypopneaEvents"
              type="number"
              value={hypopneaEvents}
              onChange={(e) => setHypopneaEvents(e.target.value)}
              placeholder="Enter hypopnea events"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="sleepHours">Sleep Duration (hours)</Label>
            <Input
              id="sleepHours"
              type="number"
              step="0.1"
              value={sleepHours}
              onChange={(e) => setSleepHours(e.target.value)}
              placeholder="Enter sleep duration"
              className="mt-2"
            />
          </div>
          <Button onClick={calculate} className="w-full">
            Calculate
          </Button>
          {result && (
            <div className="mt-6 bg-muted p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span>AHI (Events per Hour):</span>
                <span className="font-bold text-lg">{result.ahi.toFixed(1)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span>Severity:</span>
                <span className="font-bold">{result.severity}</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

