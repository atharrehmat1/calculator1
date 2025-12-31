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

export function AnnualizedRateOfReturnCalculator() {
  const [initialValue, setInitialValue] = useState("");
  const [finalValue, setFinalValue] = useState("");
  const [years, setYears] = useState("");
  const [result, setResult] = useState<{
    annualizedReturn: number;
    totalReturn: number;
    totalReturnPercent: number;
  } | null>(null);

  const calculate = () => {
    const initial = parseFloat(initialValue);
    const final = parseFloat(finalValue);
    const y = parseFloat(years);
    
    if (initial > 0 && final > 0 && y > 0) {
      const totalReturn = final - initial;
      const totalReturnPercent = (totalReturn / initial) * 100;
      // Annualized Return = ((Final Value / Initial Value)^(1/Years)) - 1
      const annualizedReturn = (Math.pow(final / initial, 1 / y) - 1) * 100;
      
      setResult({
        annualizedReturn,
        totalReturn,
        totalReturnPercent,
      });
    } else {
      setResult(null);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Annualized Rate of Return Calculator</CardTitle>
        <CardDescription>
          Calculate the annualized rate of return on your investments over a specific period.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="initialValue">Initial Investment ($)</Label>
            <Input
              id="initialValue"
              type="number"
              value={initialValue}
              onChange={(e) => setInitialValue(e.target.value)}
              placeholder="Enter initial value"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="finalValue">Final Value ($)</Label>
            <Input
              id="finalValue"
              type="number"
              value={finalValue}
              onChange={(e) => setFinalValue(e.target.value)}
              placeholder="Enter final value"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="years">Investment Period (years)</Label>
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
                <span>Annualized Return:</span>
                <span className="font-bold">{result.annualizedReturn.toFixed(2)}%</span>
              </div>
              <div className="flex justify-between">
                <span>Total Return:</span>
                <span className="font-bold">${result.totalReturn.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Return %:</span>
                <span className="font-bold">{result.totalReturnPercent.toFixed(2)}%</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

