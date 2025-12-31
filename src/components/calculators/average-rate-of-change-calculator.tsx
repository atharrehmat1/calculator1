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

export function AverageRateOfChangeCalculator() {
  const [x1, setX1] = useState("");
  const [y1, setY1] = useState("");
  const [x2, setX2] = useState("");
  const [y2, setY2] = useState("");
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    const x1Val = parseFloat(x1);
    const y1Val = parseFloat(y1);
    const x2Val = parseFloat(x2);
    const y2Val = parseFloat(y2);
    
    if (!isNaN(x1Val) && !isNaN(y1Val) && !isNaN(x2Val) && !isNaN(y2Val) && x1Val !== x2Val) {
      // Average rate of change = (y2 - y1) / (x2 - x1)
      const rate = (y2Val - y1Val) / (x2Val - x1Val);
      setResult(rate);
    } else {
      setResult(null);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Average Rate of Change Calculator</CardTitle>
        <CardDescription>
          Calculate the average rate of change between two points (x1, y1) and (x2, y2).
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="x1">x₁</Label>
              <Input
                id="x1"
                type="number"
                step="0.1"
                value={x1}
                onChange={(e) => setX1(e.target.value)}
                placeholder="Enter x₁"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="y1">y₁</Label>
              <Input
                id="y1"
                type="number"
                step="0.1"
                value={y1}
                onChange={(e) => setY1(e.target.value)}
                placeholder="Enter y₁"
                className="mt-2"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="x2">x₂</Label>
              <Input
                id="x2"
                type="number"
                step="0.1"
                value={x2}
                onChange={(e) => setX2(e.target.value)}
                placeholder="Enter x₂"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="y2">y₂</Label>
              <Input
                id="y2"
                type="number"
                step="0.1"
                value={y2}
                onChange={(e) => setY2(e.target.value)}
                placeholder="Enter y₂"
                className="mt-2"
              />
            </div>
          </div>
          <Button onClick={calculate} className="w-full">
            Calculate
          </Button>
          {result !== null && (
            <div className="mt-6 bg-muted p-4 rounded-lg">
              <div className="flex justify-between">
                <span>Average Rate of Change:</span>
                <span className="font-bold text-lg">{result.toFixed(4)}</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}





