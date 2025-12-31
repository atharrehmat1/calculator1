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

export function ArccosCalculator() {
  const [value, setValue] = useState("");
  const [result, setResult] = useState<{
    radians: number;
    degrees: number;
  } | null>(null);

  const calculate = () => {
    const val = parseFloat(value);
    
    if (!isNaN(val) && val >= -1 && val <= 1) {
      const radians = Math.acos(val);
      const degrees = (radians * 180) / Math.PI;
      
      setResult({
        radians,
        degrees,
      });
    } else {
      setResult(null);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Arccos Calculator (Inverse Cosine)</CardTitle>
        <CardDescription>
          Calculate the inverse cosine (arccos) of a value. Input must be between -1 and 1.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="value">Value (between -1 and 1)</Label>
            <Input
              id="value"
              type="number"
              step="0.01"
              min="-1"
              max="1"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter value"
              className="mt-2"
            />
          </div>
          <Button onClick={calculate} className="w-full">
            Calculate
          </Button>
          {result && (
            <div className="mt-6 bg-muted p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span>Arccos (Radians):</span>
                <span className="font-bold">{result.radians.toFixed(4)} rad</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span>Arccos (Degrees):</span>
                <span className="font-bold text-lg">{result.degrees.toFixed(2)}°</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}





