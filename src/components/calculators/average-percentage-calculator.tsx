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

export function AveragePercentageCalculator() {
  const [values, setValues] = useState("");
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    const valueArray = values.split(',').map(v => parseFloat(v.trim())).filter(v => !isNaN(v));
    
    if (valueArray.length > 0) {
      const sum = valueArray.reduce((acc, val) => acc + val, 0);
      const average = sum / valueArray.length;
      setResult(average);
    } else {
      setResult(null);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Average Percentage Calculator</CardTitle>
        <CardDescription>
          Calculate the average of multiple percentage values.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="values">Percentage Values (comma-separated)</Label>
            <Input
              id="values"
              type="text"
              value={values}
              onChange={(e) => setValues(e.target.value)}
              placeholder="e.g., 75, 80, 90, 85"
              className="mt-2"
            />
          </div>
          <Button onClick={calculate} className="w-full">
            Calculate
          </Button>
          {result !== null && (
            <div className="mt-6 bg-muted p-4 rounded-lg">
              <div className="flex justify-between">
                <span>Average Percentage:</span>
                <span className="font-bold text-lg">{result.toFixed(2)}%</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
