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

export function BlackScholesCalculator() {
  const [stockPrice, setStockPrice] = useState("");
  const [strikePrice, setStrikePrice] = useState("");
  const [timeToExpiry, setTimeToExpiry] = useState("");
  const [riskFreeRate, setRiskFreeRate] = useState("");
  const [volatility, setVolatility] = useState("");
  const [result, setResult] = useState<{
    callPrice: number;
    putPrice: number;
  } | null>(null);

  const calculate = () => {
    const S = parseFloat(stockPrice);
    const K = parseFloat(strikePrice);
    const T = parseFloat(timeToExpiry) / 365; // Convert days to years
    const r = parseFloat(riskFreeRate) / 100;
    const sigma = parseFloat(volatility) / 100;
    
    if (S > 0 && K > 0 && T > 0 && r >= 0 && sigma > 0) {
      // Black-Scholes formula
      const d1 = (Math.log(S / K) + (r + (sigma * sigma) / 2) * T) / (sigma * Math.sqrt(T));
      const d2 = d1 - sigma * Math.sqrt(T);
      
      // Cumulative distribution function approximation
      const N = (x: number) => {
        const a1 = 0.254829592;
        const a2 = -0.284496736;
        const a3 = 1.421413741;
        const a4 = -1.453152027;
        const a5 = 1.061405429;
        const p = 0.3275911;
        const sign = x < 0 ? -1 : 1;
        x = Math.abs(x) / Math.sqrt(2.0);
        const t = 1.0 / (1.0 + p * x);
        const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
        return 0.5 * (1.0 + sign * y);
      };
      
      const N1 = N(d1);
      const N2 = N(d2);
      const N1Neg = N(-d1);
      const N2Neg = N(-d2);
      
      const callPrice = S * N1 - K * Math.exp(-r * T) * N2;
      const putPrice = K * Math.exp(-r * T) * N2Neg - S * N1Neg;
      
      setResult({
        callPrice: Math.max(0, callPrice),
        putPrice: Math.max(0, putPrice),
      });
    } else {
      setResult(null);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Black Scholes Calculator</CardTitle>
        <CardDescription>
          Calculate option prices using the Black-Scholes model for European options.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="stockPrice">Current Stock Price ($)</Label>
            <Input
              id="stockPrice"
              type="number"
              step="0.01"
              value={stockPrice}
              onChange={(e) => setStockPrice(e.target.value)}
              placeholder="Enter stock price"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="strikePrice">Strike Price ($)</Label>
            <Input
              id="strikePrice"
              type="number"
              step="0.01"
              value={strikePrice}
              onChange={(e) => setStrikePrice(e.target.value)}
              placeholder="Enter strike price"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="timeToExpiry">Time to Expiry (days)</Label>
            <Input
              id="timeToExpiry"
              type="number"
              value={timeToExpiry}
              onChange={(e) => setTimeToExpiry(e.target.value)}
              placeholder="Enter days to expiry"
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
              placeholder="Enter risk-free rate"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="volatility">Volatility (%)</Label>
            <Input
              id="volatility"
              type="number"
              step="0.01"
              value={volatility}
              onChange={(e) => setVolatility(e.target.value)}
              placeholder="Enter volatility percentage"
              className="mt-2"
            />
          </div>
          <Button onClick={calculate} className="w-full">
            Calculate
          </Button>
          {result && (
            <div className="mt-6 bg-muted p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span>Call Option Price:</span>
                <span className="font-bold">${result.callPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Put Option Price:</span>
                <span className="font-bold">${result.putPrice.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

