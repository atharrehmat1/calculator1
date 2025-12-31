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

export function AdjustedAgeCalculator() {
  const [chronologicalAge, setChronologicalAge] = useState("");
  const [weeksPremature, setWeeksPremature] = useState("");
  const [result, setResult] = useState<{
    adjustedAge: number;
    adjustedAgeMonths: number;
  } | null>(null);

  const calculate = () => {
    const chrono = parseFloat(chronologicalAge);
    const weeks = parseFloat(weeksPremature);
    
    if (chrono > 0 && weeks > 0 && weeks <= 16) {
      // Adjusted age = Chronological age - (Weeks premature / 4)
      const adjustedAge = chrono - (weeks / 4);
      const adjustedAgeMonths = adjustedAge;
      
      setResult({
        adjustedAge: Math.max(0, adjustedAge),
        adjustedAgeMonths: Math.max(0, adjustedAgeMonths),
      });
    } else {
      setResult(null);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Adjusted Age Calculator</CardTitle>
        <CardDescription>
          Calculate adjusted age for premature infants by subtracting weeks of prematurity from chronological age.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="chronologicalAge">Chronological Age (months)</Label>
            <Input
              id="chronologicalAge"
              type="number"
              step="0.1"
              value={chronologicalAge}
              onChange={(e) => setChronologicalAge(e.target.value)}
              placeholder="Enter chronological age"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="weeksPremature">Weeks Premature</Label>
            <Input
              id="weeksPremature"
              type="number"
              step="0.1"
              value={weeksPremature}
              onChange={(e) => setWeeksPremature(e.target.value)}
              placeholder="Enter weeks premature"
              className="mt-2"
            />
          </div>
          <Button onClick={calculate} className="w-full">
            Calculate
          </Button>
          {result && (
            <div className="mt-6 bg-muted p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span>Adjusted Age:</span>
                <span className="font-bold text-lg">{result.adjustedAge.toFixed(1)} months</span>
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                Use adjusted age for developmental milestones and growth assessments until 2-3 years of age.
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

