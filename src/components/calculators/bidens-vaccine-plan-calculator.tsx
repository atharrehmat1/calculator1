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

export function BidensVaccinePlanCalculator() {
  const [population, setPopulation] = useState("");
  const [vaccinationRate, setVaccinationRate] = useState("");
  const [result, setResult] = useState<{
    vaccinated: number;
    remaining: number;
    daysToComplete: number;
  } | null>(null);

  const calculate = () => {
    const pop = parseFloat(population);
    const rate = parseFloat(vaccinationRate);
    
    if (pop > 0 && rate > 0) {
      const vaccinated = pop * (rate / 100);
      const remaining = pop - vaccinated;
      // Assuming 1 million vaccinations per day capacity
      const dailyCapacity = 1000000;
      const daysToComplete = remaining / dailyCapacity;
      
      setResult({
        vaccinated,
        remaining,
        daysToComplete,
      });
    } else {
      setResult(null);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Biden's Vaccine Plan Calculator</CardTitle>
        <CardDescription>
          Calculate vaccination progress and timeline estimates for COVID-19 vaccination plans.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="population">Target Population</Label>
            <Input
              id="population"
              type="number"
              value={population}
              onChange={(e) => setPopulation(e.target.value)}
              placeholder="Enter population size"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="vaccinationRate">Current Vaccination Rate (%)</Label>
            <Input
              id="vaccinationRate"
              type="number"
              step="0.1"
              value={vaccinationRate}
              onChange={(e) => setVaccinationRate(e.target.value)}
              placeholder="Enter vaccination rate"
              className="mt-2"
            />
          </div>
          <Button onClick={calculate} className="w-full">
            Calculate
          </Button>
          {result && (
            <div className="mt-6 bg-muted p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span>Vaccinated:</span>
                <span className="font-bold">{result.vaccinated.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Remaining:</span>
                <span className="font-bold">{result.remaining.toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span>Estimated Days to Complete:</span>
                <span className="font-bold">{result.daysToComplete.toFixed(0)} days</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

