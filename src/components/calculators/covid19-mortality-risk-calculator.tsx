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

export function COVID19MortalityRiskCalculator() {
  const [age, setAge] = useState("");
  const [comorbidities, setComorbidities] = useState("0");
  const [result, setResult] = useState<{
    risk: number;
    riskLevel: string;
  } | null>(null);

  const calculate = () => {
    const a = parseFloat(age);
    const comorb = parseFloat(comorbidities);
    
    if (a > 0) {
      // Simplified risk calculation
      let baseRisk = 0;
      if (a < 30) baseRisk = 0.1;
      else if (a < 50) baseRisk = 0.5;
      else if (a < 70) baseRisk = 2;
      else if (a < 80) baseRisk = 8;
      else baseRisk = 15;
      
      const risk = baseRisk + (comorb * 2);
      const riskPercent = Math.min(50, risk);
      
      let riskLevel = "";
      if (riskPercent < 1) {
        riskLevel = "Very Low";
      } else if (riskPercent < 5) {
        riskLevel = "Low";
      } else if (riskPercent < 15) {
        riskLevel = "Moderate";
      } else {
        riskLevel = "High";
      }
      
      setResult({
        risk: riskPercent,
        riskLevel,
      });
    } else {
      setResult(null);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>COVID-19 Mortality Risk Calculator</CardTitle>
        <CardDescription>
          Estimate COVID-19 mortality risk based on age and comorbidities. This is a simplified model for educational purposes.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Enter age"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="comorbidities">Number of Comorbidities</Label>
            <Input
              id="comorbidities"
              type="number"
              min="0"
              value={comorbidities}
              onChange={(e) => setComorbidities(e.target.value)}
              placeholder="Enter number of comorbidities"
              className="mt-2"
            />
          </div>
          <Button onClick={calculate} className="w-full">
            Calculate
          </Button>
          {result && (
            <div className="mt-6 bg-muted p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span>Estimated Risk:</span>
                <span className="font-bold text-lg">{result.risk.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span>Risk Level:</span>
                <span className="font-bold">{result.riskLevel}</span>
              </div>
              <div className="text-xs text-muted-foreground mt-4 pt-4 border-t">
                <strong>Note:</strong> This is a simplified model for educational purposes only. Actual risk depends on many factors. Consult healthcare professionals for accurate assessment.
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

