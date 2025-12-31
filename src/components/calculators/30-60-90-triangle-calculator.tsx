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

export function ThirtySixtyNinetyTriangleCalculator() {
  const [shortSide, setShortSide] = useState("");
  const [result, setResult] = useState<{
    short: number;
    long: number;
    hypotenuse: number;
  } | null>(null);

  const calculate = () => {
    const s = parseFloat(shortSide);
    
    if (!isNaN(s) && s > 0) {
      // In a 30-60-90 triangle:
      // Short side (opposite 30°) = s
      // Long side (opposite 60°) = s * √3
      // Hypotenuse (opposite 90°) = 2s
      const long = s * Math.sqrt(3);
      const hypotenuse = 2 * s;
      
      setResult({
        short: s,
        long,
        hypotenuse,
      });
    } else {
      setResult(null);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>30 60 90 Triangle Calculator</CardTitle>
        <CardDescription>
          Calculate the side lengths of a 30-60-90 triangle given the short side.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="shortSide">Short Side (opposite 30°)</Label>
            <Input
              id="shortSide"
              type="number"
              step="0.01"
              value={shortSide}
              onChange={(e) => setShortSide(e.target.value)}
              placeholder="Enter short side length"
              className="mt-2"
            />
          </div>
          <Button onClick={calculate} className="w-full">
            Calculate
          </Button>
          {result && (
            <div className="mt-6 bg-muted p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span>Short Side (30°):</span>
                <span className="font-bold">{result.short.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Long Side (60°):</span>
                <span className="font-bold">{result.long.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span>Hypotenuse (90°):</span>
                <span className="font-bold text-lg">{result.hypotenuse.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}





