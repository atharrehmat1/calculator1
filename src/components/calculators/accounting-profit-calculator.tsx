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

export function AccountingProfitCalculator() {
  const [revenue, setRevenue] = useState("");
  const [explicitCosts, setExplicitCosts] = useState("");
  const [result, setResult] = useState<{
    profit: number;
    profitMargin: number;
  } | null>(null);

  const calculate = () => {
    const rev = parseFloat(revenue);
    const costs = parseFloat(explicitCosts);
    
    if (rev >= 0 && costs >= 0) {
      const profit = rev - costs;
      const profitMargin = rev > 0 ? (profit / rev) * 100 : 0;
      
      setResult({
        profit,
        profitMargin,
      });
    } else {
      setResult(null);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Accounting Profit Calculator</CardTitle>
        <CardDescription>
          Calculate accounting profit for a business (Revenue - Explicit Costs).
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="revenue">Total Revenue ($)</Label>
            <Input
              id="revenue"
              type="number"
              step="0.01"
              value={revenue}
              onChange={(e) => setRevenue(e.target.value)}
              placeholder="Enter total revenue"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="explicitCosts">Explicit Costs ($)</Label>
            <Input
              id="explicitCosts"
              type="number"
              step="0.01"
              value={explicitCosts}
              onChange={(e) => setExplicitCosts(e.target.value)}
              placeholder="Enter total explicit costs"
              className="mt-2"
            />
          </div>
          <Button onClick={calculate} className="w-full">
            Calculate
          </Button>
          {result && (
            <div className="mt-6 bg-muted p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span>Accounting Profit:</span>
                <span className={`font-bold text-lg ${result.profit >= 0 ? "text-green-600" : "text-red-600"}`}>
                  ${result.profit.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span>Profit Margin:</span>
                <span className={`font-bold ${result.profitMargin >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {result.profitMargin.toFixed(2)}%
                </span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

