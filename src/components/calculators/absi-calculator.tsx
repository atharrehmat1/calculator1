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

export function ABSICalculator() {
  const [waist, setWaist] = useState("");
  const [height, setHeight] = useState("");
  const [bmi, setBmi] = useState("");
  const [result, setResult] = useState<{
    absi: number;
    interpretation: string;
  } | null>(null);

  const calculate = () => {
    const w = parseFloat(waist);
    const h = parseFloat(height);
    const b = parseFloat(bmi);
    
    if (w > 0 && h > 0 && b > 0) {
      // ABSI = WC / (BMI^(2/3) * height^(1/2))
      // WC in meters, height in meters
      const waistM = w / 100; // Convert cm to meters
      const heightM = h / 100;
      const absi = waistM / (Math.pow(b, 2/3) * Math.pow(heightM, 1/2));
      
      let interpretation = "";
      if (absi < 0.08) {
        interpretation = "Low risk";
      } else if (absi < 0.083) {
        interpretation = "Moderate risk";
      } else {
        interpretation = "High risk";
      }
      
      setResult({
        absi,
        interpretation,
      });
    } else {
      setResult(null);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>ABSI Calculator</CardTitle>
        <CardDescription>
          Calculate A Body Shape Index (ABSI) - a measure of abdominal obesity and health risk.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="waist">Waist Circumference (cm)</Label>
            <Input
              id="waist"
              type="number"
              step="0.1"
              value={waist}
              onChange={(e) => setWaist(e.target.value)}
              placeholder="Enter waist circumference"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="height">Height (cm)</Label>
            <Input
              id="height"
              type="number"
              step="0.1"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="Enter height"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="bmi">BMI (Body Mass Index)</Label>
            <Input
              id="bmi"
              type="number"
              step="0.1"
              value={bmi}
              onChange={(e) => setBmi(e.target.value)}
              placeholder="Enter BMI"
              className="mt-2"
            />
          </div>
          <Button onClick={calculate} className="w-full">
            Calculate
          </Button>
          {result && (
            <div className="mt-6 bg-muted p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span>ABSI:</span>
                <span className="font-bold">{result.absi.toFixed(4)}</span>
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="text-sm">
                  <strong>Risk Level:</strong> {result.interpretation}
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

