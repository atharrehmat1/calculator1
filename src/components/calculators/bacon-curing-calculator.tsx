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

export function BaconCuringCalculator() {
  const [porkWeight, setPorkWeight] = useState("");
  const [cureType, setCureType] = useState("pink");
  const [result, setResult] = useState<{
    salt: number;
    sugar: number;
    pinkSalt: number;
    curingTime: number;
  } | null>(null);

  const calculate = () => {
    const weight = parseFloat(porkWeight);
    
    if (weight > 0) {
      // Standard curing ratios:
      // Salt: 2.5% of meat weight
      // Sugar: 1% of meat weight
      // Pink salt (cure #1): 0.25% of meat weight (for safety)
      const salt = weight * 0.025;
      const sugar = weight * 0.01;
      const pinkSalt = weight * 0.0025;
      
      // Curing time: approximately 7 days per inch of thickness
      // Assuming average bacon thickness of 1.5 inches
      const curingTime = 7 * 1.5;
      
      setResult({
        salt,
        sugar,
        pinkSalt,
        curingTime,
      });
    } else {
      setResult(null);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Bacon Curing Calculator</CardTitle>
        <CardDescription>
          Calculate the perfect amount of salt, sugar, and curing salt for homemade bacon curing.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="porkWeight">Pork Belly Weight (lbs)</Label>
            <Input
              id="porkWeight"
              type="number"
              step="0.1"
              value={porkWeight}
              onChange={(e) => setPorkWeight(e.target.value)}
              placeholder="Enter pork belly weight"
              className="mt-2"
            />
          </div>
          <Button onClick={calculate} className="w-full">
            Calculate
          </Button>
          {result && (
            <div className="mt-6 bg-muted p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span>Salt:</span>
                <span className="font-bold">{result.salt.toFixed(2)} oz</span>
              </div>
              <div className="flex justify-between">
                <span>Sugar:</span>
                <span className="font-bold">{result.sugar.toFixed(2)} oz</span>
              </div>
              <div className="flex justify-between">
                <span>Pink Salt (Cure #1):</span>
                <span className="font-bold">{result.pinkSalt.toFixed(3)} oz</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span>Estimated Curing Time:</span>
                <span className="font-bold">{result.curingTime.toFixed(0)} days</span>
              </div>
              <div className="mt-4 pt-4 border-t text-xs text-muted-foreground">
                <strong>Note:</strong> Always follow proper food safety guidelines when curing meat. Refrigerate during curing and ensure proper temperature control.
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

