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

export function BuyingPowerCalculator() {
  const [amount, setAmount] = useState("");
  const [inflationRate, setInflationRate] = useState("3");
  const [years, setYears] = useState("");
  const [result, setResult] = useState<{
    futureValue: number;
    purchasingPower: number;
    loss: number;
  } | null>(null);

  const calculate = () => {
    const amt = parseFloat(amount);
    const inflation = parseFloat(inflationRate) / 100;
    const y = parseFloat(years);
    
    if (amt > 0 && inflation >= 0 && y > 0) {
      // Future value with inflation
      const futureValue = amt * Math.pow(1 + inflation, y);
      // Purchasing power (what you can buy today with future money)
      const purchasingPower = amt / Math.pow(1 + inflation, y);
      const loss = amt - purchasingPower;
      
      setResult({
        futureValue,
        purchasingPower,
        loss,
      });
    } else {
      setResult(null);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Buying Power Calculator</CardTitle>
        <CardDescription>
          Calculate purchasing power and inflation-adjusted values over time.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="amount">Current Amount ($)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter current amount"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="inflationRate">Annual Inflation Rate (%)</Label>
            <Input
              id="inflationRate"
              type="number"
              step="0.1"
              value={inflationRate}
              onChange={(e) => setInflationRate(e.target.value)}
              placeholder="Enter inflation rate"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="years">Number of Years</Label>
            <Input
              id="years"
              type="number"
              step="0.1"
              value={years}
              onChange={(e) => setYears(e.target.value)}
              placeholder="Enter number of years"
              className="mt-2"
            />
          </div>
          <Button onClick={calculate} className="w-full">
            Calculate
          </Button>
          {result && (
            <div className="mt-6 bg-muted p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span>Future Value Needed:</span>
                <span className="font-bold">${result.futureValue.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Purchasing Power Today:</span>
                <span className="font-bold">${result.purchasingPower.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span>Purchasing Power Loss:</span>
                <span className="font-bold text-red-600">${result.loss.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

