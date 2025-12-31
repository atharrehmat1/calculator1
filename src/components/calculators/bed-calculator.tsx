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

export function BEDCalculator() {
  const [dose, setDose] = useState("");
  const [fractionation, setFractionation] = useState("");
  const [alphaBeta, setAlphaBeta] = useState("10");
  const [result, setResult] = useState<{
    bed: number;
    interpretation: string;
  } | null>(null);

  const calculate = () => {
    const d = parseFloat(dose);
    const f = parseFloat(fractionation);
    const ab = parseFloat(alphaBeta);
    
    if (d > 0 && f > 0 && ab > 0) {
      // BED = D × (1 + d / (α/β))
      // Where D = total dose, d = dose per fraction
      const dosePerFraction = d / f;
      const bed = d * (1 + (dosePerFraction / ab));
      
      let interpretation = "";
      if (bed < 50) {
        interpretation = "Low biological effect";
      } else if (bed < 100) {
        interpretation = "Moderate biological effect";
      } else {
        interpretation = "High biological effect";
      }
      
      setResult({
        bed,
        interpretation,
      });
    } else {
      setResult(null);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>BED Calculator</CardTitle>
        <CardDescription>
          Calculate Biological Effective Dose (BED) for radiation therapy planning.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="dose">Total Dose (Gy)</Label>
            <Input
              id="dose"
              type="number"
              step="0.1"
              value={dose}
              onChange={(e) => setDose(e.target.value)}
              placeholder="Enter total dose"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="fractionation">Number of Fractions</Label>
            <Input
              id="fractionation"
              type="number"
              value={fractionation}
              onChange={(e) => setFractionation(e.target.value)}
              placeholder="Enter number of fractions"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="alphaBeta">α/β Ratio (default: 10)</Label>
            <Input
              id="alphaBeta"
              type="number"
              step="0.1"
              value={alphaBeta}
              onChange={(e) => setAlphaBeta(e.target.value)}
              placeholder="Enter α/β ratio"
              className="mt-2"
            />
          </div>
          <Button onClick={calculate} className="w-full">
            Calculate
          </Button>
          {result && (
            <div className="mt-6 bg-muted p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span>BED:</span>
                <span className="font-bold text-lg">{result.bed.toFixed(1)} Gy</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span>Interpretation:</span>
                <span className="font-bold">{result.interpretation}</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

