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

export function BetaStockCalculator() {
  const [stockReturn, setStockReturn] = useState("");
  const [marketReturn, setMarketReturn] = useState("");
  const [riskFreeRate, setRiskFreeRate] = useState("");
  const [result, setResult] = useState<{
    beta: number;
    interpretation: string;
  } | null>(null);

  const calculate = () => {
    const stock = parseFloat(stockReturn);
    const market = parseFloat(marketReturn);
    const riskFree = parseFloat(riskFreeRate);
    
    if (market !== riskFree) {
      // Beta = (Stock Return - Risk Free Rate) / (Market Return - Risk Free Rate)
      const beta = (stock - riskFree) / (market - riskFree);
      
      let interpretation = "";
      if (beta < 0) {
        interpretation = "Negative beta - moves opposite to market";
      } else if (beta < 0.5) {
        interpretation = "Low beta - less volatile than market";
      } else if (beta < 1) {
        interpretation = "Moderate beta - less volatile than market";
      } else if (beta === 1) {
        interpretation = "Beta = 1 - moves with market";
      } else if (beta < 1.5) {
        interpretation = "High beta - more volatile than market";
      } else {
        interpretation = "Very high beta - highly volatile";
      }
      
      setResult({
        beta,
        interpretation,
      });
    } else {
      setResult(null);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Beta Stock Calculator</CardTitle>
        <CardDescription>
          Calculate the beta coefficient of a stock, which measures its volatility relative to the market.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="stockReturn">Stock Return (%)</Label>
            <Input
              id="stockReturn"
              type="number"
              step="0.01"
              value={stockReturn}
              onChange={(e) => setStockReturn(e.target.value)}
              placeholder="Enter stock return percentage"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="marketReturn">Market Return (%)</Label>
            <Input
              id="marketReturn"
              type="number"
              step="0.01"
              value={marketReturn}
              onChange={(e) => setMarketReturn(e.target.value)}
              placeholder="Enter market return percentage"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="riskFreeRate">Risk-Free Rate (%)</Label>
            <Input
              id="riskFreeRate"
              type="number"
              step="0.01"
              value={riskFreeRate}
              onChange={(e) => setRiskFreeRate(e.target.value)}
              placeholder="Enter risk-free rate (e.g., 2.5)"
              className="mt-2"
            />
          </div>
          <Button onClick={calculate} className="w-full">
            Calculate
          </Button>
          {result && (
            <div className="mt-6 bg-muted p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span>Beta Coefficient:</span>
                <span className="font-bold">{result.beta.toFixed(3)}</span>
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="text-sm text-muted-foreground">
                  <strong>Interpretation:</strong> {result.interpretation}
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

