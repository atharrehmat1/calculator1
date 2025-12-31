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

export function SurfaceAreaOfHemisphereCalculator() {
  const [radius, setRadius] = useState("");
  const [result, setResult] = useState<{
    curved: number;
    base: number;
    total: number;
  } | null>(null);

  const calculate = () => {
    const r = parseFloat(radius);
    
    if (!isNaN(r) && r > 0) {
      // Surface area of hemisphere:
      // Curved surface = 2πr²
      // Base area = πr²
      // Total = 3πr²
      const curved = 2 * Math.PI * r * r;
      const base = Math.PI * r * r;
      const total = curved + base;
      
      setResult({
        curved,
        base,
        total,
      });
    } else {
      setResult(null);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Surface Area of a Hemisphere Calculator</CardTitle>
        <CardDescription>
          Calculate the surface area of a hemisphere given its radius.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="radius">Radius</Label>
            <Input
              id="radius"
              type="number"
              step="0.01"
              value={radius}
              onChange={(e) => setRadius(e.target.value)}
              placeholder="Enter radius"
              className="mt-2"
            />
          </div>
          <Button onClick={calculate} className="w-full">
            Calculate
          </Button>
          {result && (
            <div className="mt-6 bg-muted p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span>Curved Surface Area:</span>
                <span className="font-bold">{result.curved.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Base Area:</span>
                <span className="font-bold">{result.base.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span>Total Surface Area:</span>
                <span className="font-bold text-lg">{result.total.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}





