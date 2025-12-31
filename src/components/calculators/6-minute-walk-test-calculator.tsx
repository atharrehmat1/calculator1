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

export function SixMinuteWalkTestCalculator() {
  const [distance, setDistance] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("male");
  const [height, setHeight] = useState("");
  const [result, setResult] = useState<{
    predicted: number;
    percentage: number;
    interpretation: string;
  } | null>(null);

  const calculate = () => {
    const d = parseFloat(distance);
    const a = parseFloat(age);
    const h = parseFloat(height);
    
    if (d > 0 && a > 0 && h > 0) {
      // Simplified prediction formula (actual formulas are more complex)
      // Men: 867 - (5.71 × age) + (1.03 × height in cm)
      // Women: 525 - (2.86 × age) + (2.71 × height in cm)
      const heightCm = h;
      let predicted = 0;
      
      if (gender === "male") {
        predicted = 867 - (5.71 * a) + (1.03 * heightCm);
      } else {
        predicted = 525 - (2.86 * a) + (2.71 * heightCm);
      }
      
      const percentage = (d / predicted) * 100;
      
      let interpretation = "";
      if (percentage >= 100) {
        interpretation = "Excellent";
      } else if (percentage >= 80) {
        interpretation = "Good";
      } else if (percentage >= 60) {
        interpretation = "Fair";
      } else {
        interpretation = "Poor - consult healthcare provider";
      }
      
      setResult({
        predicted,
        percentage,
        interpretation,
      });
    } else {
      setResult(null);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>6 Minute Walk Test Calculator</CardTitle>
        <CardDescription>
          Calculate your 6-minute walk test results and compare to predicted values based on age, gender, and height.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="distance">Distance Walked (meters)</Label>
            <Input
              id="distance"
              type="number"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              placeholder="Enter distance in meters"
              className="mt-2"
            />
          </div>
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
            <Label htmlFor="gender">Gender</Label>
            <select
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="mt-2 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div>
            <Label htmlFor="height">Height (cm)</Label>
            <Input
              id="height"
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="Enter height"
              className="mt-2"
            />
          </div>
          <Button onClick={calculate} className="w-full">
            Calculate
          </Button>
          {result && (
            <div className="mt-6 bg-muted p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span>Predicted Distance:</span>
                <span className="font-bold">{result.predicted.toFixed(0)} m</span>
              </div>
              <div className="flex justify-between">
                <span>Percentage of Predicted:</span>
                <span className="font-bold">{result.percentage.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span>Interpretation:</span>
                <span className="font-bold">{result.interpretation}</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

