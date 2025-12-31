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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function BMICalculator() {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [unit, setUnit] = useState("metric");
  const [result, setResult] = useState<{
    bmi: number;
    category: string;
  } | null>(null);

  const calculate = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    
    if (w > 0 && h > 0) {
      let bmi = 0;
      if (unit === "metric") {
        // BMI = weight (kg) / height (m)²
        bmi = w / Math.pow(h / 100, 2);
      } else {
        // BMI = (weight in lbs / (height in inches)²) * 703
        bmi = (w / Math.pow(h, 2)) * 703;
      }
      
      let category = "";
      if (bmi < 18.5) {
        category = "Underweight";
      } else if (bmi < 25) {
        category = "Normal weight";
      } else if (bmi < 30) {
        category = "Overweight";
      } else {
        category = "Obese";
      }
      
      setResult({
        bmi,
        category,
      });
    } else {
      setResult(null);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>BMI Calculator – Body Mass Index</CardTitle>
        <CardDescription>
          Calculate your Body Mass Index (BMI) to assess your weight status.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="unit">Unit System</Label>
            <Select value={unit} onValueChange={setUnit}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="metric">Metric (kg, cm)</SelectItem>
                <SelectItem value="imperial">Imperial (lbs, inches)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="weight">Weight ({unit === "metric" ? "kg" : "lbs"})</Label>
            <Input
              id="weight"
              type="number"
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder={`Enter weight in ${unit === "metric" ? "kg" : "lbs"}`}
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="height">Height ({unit === "metric" ? "cm" : "inches"})</Label>
            <Input
              id="height"
              type="number"
              step="0.1"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder={`Enter height in ${unit === "metric" ? "cm" : "inches"}`}
              className="mt-2"
            />
          </div>
          <Button onClick={calculate} className="w-full">
            Calculate
          </Button>
          {result && (
            <div className="mt-6 bg-muted p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span>BMI:</span>
                <span className="font-bold text-lg">{result.bmi.toFixed(1)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span>Category:</span>
                <span className="font-bold">{result.category}</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

