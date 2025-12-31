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

export function CoffeeCalculator() {
  const [cups, setCups] = useState("");
  const [coffeeRatio, setCoffeeRatio] = useState("15");
  const [result, setResult] = useState<{
    coffeeGrams: number;
    coffeeOunces: number;
    waterMl: number;
    waterCups: number;
  } | null>(null);

  const calculate = () => {
    const numCups = parseFloat(cups);
    const ratio = parseFloat(coffeeRatio);
    
    if (numCups > 0 && ratio > 0) {
      // Standard cup = 8 fl oz = 236.588 ml
      const waterMl = numCups * 236.588;
      const coffeeGrams = waterMl / ratio;
      const coffeeOunces = coffeeGrams / 28.35;
      const waterCups = numCups;
      
      setResult({
        coffeeGrams,
        coffeeOunces,
        waterMl,
        waterCups,
      });
    } else {
      setResult(null);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Coffee Calculator</CardTitle>
        <CardDescription>
          Calculate the perfect coffee-to-water ratio for your brew. Standard ratio is 1:15 (1g coffee per 15ml water).
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="cups">Number of Cups</Label>
            <Input
              id="cups"
              type="number"
              step="0.25"
              value={cups}
              onChange={(e) => setCups(e.target.value)}
              placeholder="Enter number of cups"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="coffeeRatio">Coffee Ratio (water:coffee)</Label>
            <Input
              id="coffeeRatio"
              type="number"
              step="0.1"
              value={coffeeRatio}
              onChange={(e) => setCoffeeRatio(e.target.value)}
              placeholder="Enter ratio (e.g., 15 for 1:15)"
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">Standard: 15 (1g coffee per 15ml water)</p>
          </div>
          <Button onClick={calculate} className="w-full">
            Calculate
          </Button>
          {result && (
            <div className="mt-6 bg-muted p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span>Coffee Needed:</span>
                <span className="font-bold">{result.coffeeGrams.toFixed(1)} g ({result.coffeeOunces.toFixed(2)} oz)</span>
              </div>
              <div className="flex justify-between">
                <span>Water Needed:</span>
                <span className="font-bold">{result.waterMl.toFixed(0)} ml ({result.waterCups.toFixed(2)} cups)</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

