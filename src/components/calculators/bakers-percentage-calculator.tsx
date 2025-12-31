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

export function BakersPercentageCalculator() {
  const [flourWeight, setFlourWeight] = useState("");
  const [waterPercent, setWaterPercent] = useState("60");
  const [saltPercent, setSaltPercent] = useState("2");
  const [yeastPercent, setYeastPercent] = useState("1");
  const [result, setResult] = useState<{
    water: number;
    salt: number;
    yeast: number;
    totalWeight: number;
  } | null>(null);

  const calculate = () => {
    const flour = parseFloat(flourWeight);
    const water = parseFloat(waterPercent);
    const salt = parseFloat(saltPercent);
    const yeast = parseFloat(yeastPercent);
    
    if (flour > 0 && water >= 0 && salt >= 0 && yeast >= 0) {
      const waterWeight = flour * (water / 100);
      const saltWeight = flour * (salt / 100);
      const yeastWeight = flour * (yeast / 100);
      const totalWeight = flour + waterWeight + saltWeight + yeastWeight;
      
      setResult({
        water: waterWeight,
        salt: saltWeight,
        yeast: yeastWeight,
        totalWeight,
      });
    } else {
      setResult(null);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Baker's Percentage Calculator</CardTitle>
        <CardDescription>
          Calculate ingredient weights using baker's percentage method. Flour is always 100%, other ingredients are percentages of flour weight.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="flourWeight">Flour Weight (g) - 100%</Label>
            <Input
              id="flourWeight"
              type="number"
              value={flourWeight}
              onChange={(e) => setFlourWeight(e.target.value)}
              placeholder="Enter flour weight in grams"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="waterPercent">Water Percentage (%)</Label>
            <Input
              id="waterPercent"
              type="number"
              step="0.1"
              value={waterPercent}
              onChange={(e) => setWaterPercent(e.target.value)}
              placeholder="Enter water percentage"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="saltPercent">Salt Percentage (%)</Label>
            <Input
              id="saltPercent"
              type="number"
              step="0.1"
              value={saltPercent}
              onChange={(e) => setSaltPercent(e.target.value)}
              placeholder="Enter salt percentage"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="yeastPercent">Yeast Percentage (%)</Label>
            <Input
              id="yeastPercent"
              type="number"
              step="0.1"
              value={yeastPercent}
              onChange={(e) => setYeastPercent(e.target.value)}
              placeholder="Enter yeast percentage"
              className="mt-2"
            />
          </div>
          <Button onClick={calculate} className="w-full">
            Calculate
          </Button>
          {result && (
            <div className="mt-6 bg-muted p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span>Flour:</span>
                <span className="font-bold">{parseFloat(flourWeight).toFixed(1)} g (100%)</span>
              </div>
              <div className="flex justify-between">
                <span>Water:</span>
                <span className="font-bold">{result.water.toFixed(1)} g ({waterPercent}%)</span>
              </div>
              <div className="flex justify-between">
                <span>Salt:</span>
                <span className="font-bold">{result.salt.toFixed(1)} g ({saltPercent}%)</span>
              </div>
              <div className="flex justify-between">
                <span>Yeast:</span>
                <span className="font-bold">{result.yeast.toFixed(1)} g ({yeastPercent}%)</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span>Total Dough Weight:</span>
                <span className="font-bold text-lg">{result.totalWeight.toFixed(1)} g</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

