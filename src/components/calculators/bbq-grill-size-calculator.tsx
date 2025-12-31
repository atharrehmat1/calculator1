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

export function BBQGrillSizeCalculator() {
  const [guests, setGuests] = useState("");
  const [result, setResult] = useState<{
    grillSize: number;
    recommendation: string;
    cookingArea: number;
  } | null>(null);

  const calculate = () => {
    const numGuests = parseFloat(guests);
    
    if (numGuests > 0) {
      // Standard: 72 sq in per person for comfortable grilling
      const cookingArea = numGuests * 72;
      // Grill size in square inches (assuming circular grill, diameter calculation)
      const grillSize = Math.sqrt(cookingArea / Math.PI) * 2;
      
      let recommendation = "";
      if (grillSize < 18) {
        recommendation = "Small portable grill (18-22 inches)";
      } else if (grillSize < 24) {
        recommendation = "Medium grill (22-26 inches)";
      } else if (grillSize < 30) {
        recommendation = "Large grill (26-30 inches)";
      } else {
        recommendation = "Extra large grill (30+ inches) or multiple grills";
      }
      
      setResult({
        grillSize,
        recommendation,
        cookingArea,
      });
    } else {
      setResult(null);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>BBQ Grill Size Calculator</CardTitle>
        <CardDescription>
          Calculate the perfect grill size for your party based on the number of guests.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="guests">Number of Guests</Label>
            <Input
              id="guests"
              type="number"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              placeholder="Enter number of guests"
              className="mt-2"
            />
          </div>
          <Button onClick={calculate} className="w-full">
            Calculate
          </Button>
          {result && (
            <div className="mt-6 bg-muted p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span>Recommended Grill Diameter:</span>
                <span className="font-bold">{result.grillSize.toFixed(1)} inches</span>
              </div>
              <div className="flex justify-between">
                <span>Cooking Area Needed:</span>
                <span className="font-bold">{result.cookingArea.toFixed(0)} sq in</span>
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="text-sm">
                  <strong>Recommendation:</strong> {result.recommendation}
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

