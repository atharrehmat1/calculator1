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

export function AAGradientCalculator() {
  const [pao2, setPao2] = useState("");
  const [fio2, setFio2] = useState("");
  const [paco2, setPaco2] = useState("");
  const [result, setResult] = useState<{
    gradient: number;
    interpretation: string;
  } | null>(null);

  const calculate = () => {
    const paO2 = parseFloat(pao2);
    const fiO2 = parseFloat(fio2);
    const paCO2 = parseFloat(paco2);
    
    if (paO2 > 0 && fiO2 > 0 && paCO2 > 0) {
      // A-a gradient = PAO2 - PaO2
      // PAO2 = (FiO2 × (Patm - PH2O)) - (PaCO2 / RQ)
      // Simplified: PAO2 = (FiO2 × 713) - (PaCO2 / 0.8)
      const patm = 760; // mmHg at sea level
      const ph2o = 47; // Water vapor pressure
      const rq = 0.8; // Respiratory quotient
      const paO2 = (fiO2 * (patm - ph2o)) - (paCO2 / rq);
      const gradient = paO2 - paO2;
      
      let interpretation = "";
      const age = 40; // Would normally use patient age
      const normalGradient = 2.5 + (0.21 * age);
      
      if (gradient <= normalGradient) {
        interpretation = "Normal";
      } else if (gradient <= normalGradient + 10) {
        interpretation = "Mildly elevated";
      } else {
        interpretation = "Significantly elevated - may indicate V/Q mismatch";
      }
      
      setResult({
        gradient,
        interpretation,
      });
    } else {
      setResult(null);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Aa Gradient Calculator</CardTitle>
        <CardDescription>
          Calculate the Alveolar-arterial (A-a) oxygen gradient to assess pulmonary gas exchange.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="pao2">PaO2 (mmHg)</Label>
            <Input
              id="pao2"
              type="number"
              step="0.1"
              value={pao2}
              onChange={(e) => setPao2(e.target.value)}
              placeholder="Enter arterial PaO2"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="fio2">FiO2 (fraction, e.g., 0.21 for room air)</Label>
            <Input
              id="fio2"
              type="number"
              step="0.01"
              value={fio2}
              onChange={(e) => setFio2(e.target.value)}
              placeholder="Enter FiO2"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="paco2">PaCO2 (mmHg)</Label>
            <Input
              id="paco2"
              type="number"
              step="0.1"
              value={paco2}
              onChange={(e) => setPaco2(e.target.value)}
              placeholder="Enter arterial PaCO2"
              className="mt-2"
            />
          </div>
          <Button onClick={calculate} className="w-full">
            Calculate
          </Button>
          {result && (
            <div className="mt-6 bg-muted p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span>A-a Gradient:</span>
                <span className="font-bold text-lg">{result.gradient.toFixed(1)} mmHg</span>
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

