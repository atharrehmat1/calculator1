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

export function AddedSugarIntakeCalculator() {
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("male");
  const [result, setResult] = useState<{
    maxSugar: number;
    maxCalories: number;
  } | null>(null);

  const calculate = () => {
    const a = parseFloat(age);
    
    if (a > 0) {
      // AHA recommendations: Men max 36g (9 tsp), Women max 25g (6 tsp) per day
      // Max 10% of daily calories from added sugar
      let maxSugar = 0;
      let maxCalories = 0;
      
      if (a >= 19) {
        maxSugar = gender === "male" ? 36 : 25; // grams
        maxCalories = gender === "male" ? 2000 : 1800; // approximate daily calories
      } else if (a >= 13) {
        maxSugar = 25; // grams for teens
        maxCalories = 2000;
      } else if (a >= 9) {
        maxSugar = 20; // grams for children 9-12
        maxCalories = 1800;
      } else {
        maxSugar = 12; // grams for children 2-8
        maxCalories = 1200;
      }
      
      setResult({
        maxSugar,
        maxCalories: maxSugar * 4, // 4 calories per gram of sugar
      });
    } else {
      setResult(null);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Added Sugar Intake Calculator</CardTitle>
        <CardDescription>
          Calculate the recommended maximum daily added sugar intake based on age and gender.
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
            <Label htmlFor="gender">Gender</Label>
            <select
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="mt-2 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <Button onClick={calculate} className="w-full">
            Calculate
          </Button>
          {result && (
            <div className="mt-6 bg-muted p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span>Max Daily Added Sugar:</span>
                <span className="font-bold">{result.maxSugar} g ({result.maxSugar * 0.25} tsp)</span>
              </div>
              <div className="flex justify-between">
                <span>Max Calories from Sugar:</span>
                <span className="font-bold">{result.maxCalories} kcal</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

