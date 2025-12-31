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

export function ABVCalculator() {
  const [originalGravity, setOriginalGravity] = useState("");
  const [finalGravity, setFinalGravity] = useState("");
  const [result, setResult] = useState<{
    abv: number;
    interpretation: string;
  } | null>(null);

  const calculate = () => {
    const og = parseFloat(originalGravity);
    const fg = parseFloat(finalGravity);
    
    if (og > 0 && fg > 0 && og >= fg) {
      // ABV = (OG - FG) * 131.25
      const abv = (og - fg) * 131.25;
      
      let interpretation = "";
      if (abv < 3) {
        interpretation = "Very light - like light beer";
      } else if (abv < 5) {
        interpretation = "Light - typical beer range";
      } else if (abv < 7) {
        interpretation = "Moderate - craft beer range";
      } else if (abv < 10) {
        interpretation = "Strong - like wine";
      } else if (abv < 15) {
        interpretation = "Very strong - like fortified wine";
      } else {
        interpretation = "Extremely strong - like spirits";
      }
      
      setResult({
        abv,
        interpretation,
      });
    } else {
      setResult(null);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>ABV Calculator (Alcohol by Volume)</CardTitle>
        <CardDescription>
          Calculate the alcohol by volume (ABV) percentage of your beverage using original and final gravity readings.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="originalGravity">Original Gravity (OG)</Label>
            <Input
              id="originalGravity"
              type="number"
              step="0.001"
              value={originalGravity}
              onChange={(e) => setOriginalGravity(e.target.value)}
              placeholder="Enter original gravity (e.g., 1.050)"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="finalGravity">Final Gravity (FG)</Label>
            <Input
              id="finalGravity"
              type="number"
              step="0.001"
              value={finalGravity}
              onChange={(e) => setFinalGravity(e.target.value)}
              placeholder="Enter final gravity (e.g., 1.010)"
              className="mt-2"
            />
          </div>
          <Button onClick={calculate} className="w-full">
            Calculate
          </Button>
          {result && (
            <div className="mt-6 bg-muted p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span>Alcohol by Volume (ABV):</span>
                <span className="font-bold text-lg">{result.abv.toFixed(2)}%</span>
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="text-sm text-muted-foreground">
                  <strong>Interpretation:</strong> {result.interpretation}
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

