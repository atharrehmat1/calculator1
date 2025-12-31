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

export function AdderallDosageCalculator() {
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [formulation, setFormulation] = useState("ir");
  const [result, setResult] = useState<{
    startingDose: number;
    maxDose: number;
    frequency: string;
  } | null>(null);

  const calculate = () => {
    const a = parseFloat(age);
    const w = parseFloat(weight);
    
    if (a > 0 && w > 0) {
      let startingDose = 0;
      let maxDose = 0;
      let frequency = "";
      
      if (a >= 18) {
        // Adult dosing
        startingDose = formulation === "ir" ? 5 : 20; // IR: 5mg, XR: 20mg
        maxDose = formulation === "ir" ? 40 : 60;
        frequency = formulation === "ir" ? "2-3 times daily" : "Once daily";
      } else if (a >= 6) {
        // Pediatric dosing: 0.3-0.7 mg/kg/day
        startingDose = Math.round((w * 0.3) / 5) * 5; // Round to nearest 5mg
        maxDose = Math.round((w * 0.7) / 5) * 5;
        frequency = formulation === "ir" ? "2-3 times daily" : "Once daily";
      } else {
        startingDose = 0;
        maxDose = 0;
        frequency = "Not recommended under 6 years";
      }
      
      setResult({
        startingDose,
        maxDose,
        frequency,
      });
    } else {
      setResult(null);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Adderall Dosage Calculator</CardTitle>
        <CardDescription>
          Calculate appropriate Adderall dosage based on age, weight, and formulation. Always consult a healthcare provider.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Enter age"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="weight">Weight (kg)</Label>
            <Input
              id="weight"
              type="number"
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Enter weight"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="formulation">Formulation</Label>
            <select
              id="formulation"
              value={formulation}
              onChange={(e) => setFormulation(e.target.value)}
              className="mt-2 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            >
              <option value="ir">Immediate Release (IR)</option>
              <option value="xr">Extended Release (XR)</option>
            </select>
          </div>
          <Button onClick={calculate} className="w-full">
            Calculate
          </Button>
          {result && (
            <div className="mt-6 bg-muted p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span>Starting Dose:</span>
                <span className="font-bold">{result.startingDose} mg</span>
              </div>
              <div className="flex justify-between">
                <span>Maximum Dose:</span>
                <span className="font-bold">{result.maxDose} mg</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span>Frequency:</span>
                <span className="font-bold">{result.frequency}</span>
              </div>
              <div className="text-xs text-muted-foreground mt-4 pt-4 border-t">
                <strong>Warning:</strong> This is for informational purposes only. Always follow your healthcare provider's prescription. Do not adjust medication without medical supervision.
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

