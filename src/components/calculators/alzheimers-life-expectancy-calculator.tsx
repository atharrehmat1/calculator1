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

export function AlzheimersLifeExpectancyCalculator() {
  const [age, setAge] = useState("");
  const [stage, setStage] = useState("mild");
  const [result, setResult] = useState<{
    lifeExpectancy: number;
    note: string;
  } | null>(null);

  const calculate = () => {
    const a = parseFloat(age);
    
    if (a > 0) {
      // Simplified estimates (actual varies significantly)
      let baseYears = 0;
      if (stage === "mild") {
        baseYears = 8;
      } else if (stage === "moderate") {
        baseYears = 5;
      } else {
        baseYears = 2;
      }
      
      // Adjust for age (older patients have shorter life expectancy)
      const ageAdjustment = a > 80 ? -2 : a > 70 ? -1 : 0;
      const lifeExpectancy = baseYears + ageAdjustment;
      
      setResult({
        lifeExpectancy: Math.max(1, lifeExpectancy),
        note: "This is a general estimate. Individual outcomes vary significantly based on many factors.",
      });
    } else {
      setResult(null);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Alzheimer's Life Expectancy Calculator</CardTitle>
        <CardDescription>
          Estimate life expectancy for Alzheimer's disease patients. This is a general estimate and individual outcomes vary significantly.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="age">Age at Diagnosis</Label>
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
            <Label htmlFor="stage">Disease Stage</Label>
            <select
              id="stage"
              value={stage}
              onChange={(e) => setStage(e.target.value)}
              className="mt-2 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            >
              <option value="mild">Mild</option>
              <option value="moderate">Moderate</option>
              <option value="severe">Severe</option>
            </select>
          </div>
          <Button onClick={calculate} className="w-full">
            Calculate
          </Button>
          {result && (
            <div className="mt-6 bg-muted p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span>Estimated Life Expectancy:</span>
                <span className="font-bold text-lg">{result.lifeExpectancy} years</span>
              </div>
              <div className="text-xs text-muted-foreground mt-4 pt-4 border-t">
                <strong>Important:</strong> {result.note} Always consult with healthcare professionals for personalized information.
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

