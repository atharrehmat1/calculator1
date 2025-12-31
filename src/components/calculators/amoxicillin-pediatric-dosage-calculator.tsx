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

export function AmoxicillinPediatricDosageCalculator() {
  const [weight, setWeight] = useState("");
  const [indication, setIndication] = useState("standard");
  const [result, setResult] = useState<{
    dailyDose: number;
    perDose: number;
    frequency: string;
  } | null>(null);

  const calculate = () => {
    const w = parseFloat(weight);
    
    if (w > 0) {
      let dailyDose = 0;
      let perDose = 0;
      let frequency = "";
      
      if (indication === "standard") {
        // Standard: 20-40 mg/kg/day divided q8h or q12h
        dailyDose = w * 30; // Average 30 mg/kg/day
        perDose = dailyDose / 3; // q8h (3 times daily)
        frequency = "Every 8 hours (3 times daily)";
      } else if (indication === "otitis") {
        // Otitis media: 80-90 mg/kg/day divided q12h
        dailyDose = w * 85;
        perDose = dailyDose / 2; // q12h (2 times daily)
        frequency = "Every 12 hours (2 times daily)";
      } else {
        // High dose: 80-90 mg/kg/day divided q8h
        dailyDose = w * 85;
        perDose = dailyDose / 3;
        frequency = "Every 8 hours (3 times daily)";
      }
      
      setResult({
        dailyDose,
        perDose,
        frequency,
      });
    } else {
      setResult(null);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Amoxicillin Pediatric Dosage Calculator</CardTitle>
        <CardDescription>
          Calculate appropriate amoxicillin dosage for pediatric patients based on weight and indication.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="weight">Weight (kg)</Label>
            <Input
              id="weight"
              type="number"
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Enter weight in kg"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="indication">Indication</Label>
            <select
              id="indication"
              value={indication}
              onChange={(e) => setIndication(e.target.value)}
              className="mt-2 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            >
              <option value="standard">Standard (20-40 mg/kg/day)</option>
              <option value="otitis">Otitis Media (80-90 mg/kg/day)</option>
              <option value="high">High Dose (80-90 mg/kg/day)</option>
            </select>
          </div>
          <Button onClick={calculate} className="w-full">
            Calculate
          </Button>
          {result && (
            <div className="mt-6 bg-muted p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span>Daily Dose:</span>
                <span className="font-bold">{result.dailyDose.toFixed(0)} mg/day</span>
              </div>
              <div className="flex justify-between">
                <span>Per Dose:</span>
                <span className="font-bold">{result.perDose.toFixed(0)} mg</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span>Frequency:</span>
                <span className="font-bold">{result.frequency}</span>
              </div>
              <div className="text-xs text-muted-foreground mt-4 pt-4 border-t">
                <strong>Important:</strong> Always consult with a healthcare provider before administering medication. Dosages may vary based on specific conditions and patient factors.
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

