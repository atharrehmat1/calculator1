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

export function AcidBaseCalculator() {
  const [ph, setPh] = useState("");
  const [pco2, setPco2] = useState("");
  const [hco3, setHco3] = useState("");
  const [result, setResult] = useState<{
    disorder: string;
    compensation: string;
  } | null>(null);

  const calculate = () => {
    const pH = parseFloat(ph);
    const pCO2 = parseFloat(pco2);
    const hCO3 = parseFloat(hco3);
    
    if (pH > 0 && pCO2 > 0 && hCO3 > 0) {
      let disorder = "";
      let compensation = "";
      
      // Normal ranges: pH 7.35-7.45, pCO2 35-45, HCO3 22-26
      if (pH < 7.35) {
        // Acidosis
        if (pCO2 > 45) {
          disorder = "Respiratory Acidosis";
          if (hCO3 > 26) {
            compensation = "Metabolically compensated";
          } else {
            compensation = "Uncompensated";
          }
        } else if (hCO3 < 22) {
          disorder = "Metabolic Acidosis";
          if (pCO2 < 35) {
            compensation = "Respiratorily compensated";
          } else {
            compensation = "Uncompensated";
          }
        }
      } else if (pH > 7.45) {
        // Alkalosis
        if (pCO2 < 35) {
          disorder = "Respiratory Alkalosis";
          if (hCO3 < 22) {
            compensation = "Metabolically compensated";
          } else {
            compensation = "Uncompensated";
          }
        } else if (hCO3 > 26) {
          disorder = "Metabolic Alkalosis";
          if (pCO2 > 45) {
            compensation = "Respiratorily compensated";
          } else {
            compensation = "Uncompensated";
          }
        }
      } else {
        disorder = "Normal";
        compensation = "No compensation needed";
      }
      
      setResult({
        disorder,
        compensation,
      });
    } else {
      setResult(null);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Acid Base Calculator</CardTitle>
        <CardDescription>
          Analyze arterial blood gas (ABG) results to identify acid-base disorders and compensation status.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="ph">pH</Label>
            <Input
              id="ph"
              type="number"
              step="0.01"
              value={ph}
              onChange={(e) => setPh(e.target.value)}
              placeholder="Enter pH (normal: 7.35-7.45)"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="pco2">pCO2 (mmHg)</Label>
            <Input
              id="pco2"
              type="number"
              step="0.1"
              value={pco2}
              onChange={(e) => setPco2(e.target.value)}
              placeholder="Enter pCO2 (normal: 35-45)"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="hco3">HCO3- (mEq/L)</Label>
            <Input
              id="hco3"
              type="number"
              step="0.1"
              value={hco3}
              onChange={(e) => setHco3(e.target.value)}
              placeholder="Enter HCO3- (normal: 22-26)"
              className="mt-2"
            />
          </div>
          <Button onClick={calculate} className="w-full">
            Calculate
          </Button>
          {result && (
            <div className="mt-6 bg-muted p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span>Disorder:</span>
                <span className="font-bold">{result.disorder}</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span>Compensation:</span>
                <span className="font-bold">{result.compensation}</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

