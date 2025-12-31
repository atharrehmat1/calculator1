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

export function BBTCalculator() {
  const [temperature, setTemperature] = useState("");
  const [day, setDay] = useState("");
  const [result, setResult] = useState<{
    phase: string;
    ovulation: string;
  } | null>(null);

  const calculate = () => {
    const temp = parseFloat(temperature);
    const d = parseFloat(day);
    
    if (temp > 0 && d > 0) {
      // BBT typically rises 0.5-1°F after ovulation
      // Follicular phase: 97.0-97.5°F, Luteal phase: 97.6-98.6°F
      let phase = "";
      let ovulation = "";
      
      if (temp < 97.5) {
        phase = "Follicular Phase (before ovulation)";
        ovulation = "Ovulation likely to occur soon";
      } else if (temp >= 97.6) {
        phase = "Luteal Phase (after ovulation)";
        ovulation = "Ovulation likely occurred";
      } else {
        phase = "Transition Phase";
        ovulation = "Ovulation may be occurring";
      }
      
      setResult({
        phase,
        ovulation,
      });
    } else {
      setResult(null);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>BBT Calculator | Basal Body Temperature</CardTitle>
        <CardDescription>
          Track your basal body temperature to identify ovulation and menstrual cycle phases.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="temperature">Basal Body Temperature (°F)</Label>
            <Input
              id="temperature"
              type="number"
              step="0.1"
              value={temperature}
              onChange={(e) => setTemperature(e.target.value)}
              placeholder="Enter BBT"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="day">Day of Cycle</Label>
            <Input
              id="day"
              type="number"
              value={day}
              onChange={(e) => setDay(e.target.value)}
              placeholder="Enter day of menstrual cycle"
              className="mt-2"
            />
          </div>
          <Button onClick={calculate} className="w-full">
            Calculate
          </Button>
          {result && (
            <div className="mt-6 bg-muted p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span>Cycle Phase:</span>
                <span className="font-bold">{result.phase}</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span>Ovulation Status:</span>
                <span className="font-bold">{result.ovulation}</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

