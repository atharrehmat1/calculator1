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

export function AfterTaxCostOfDebtCalculator() {
  const [interestRate, setInterestRate] = useState("");
  const [taxRate, setTaxRate] = useState("");
  const [result, setResult] = useState<{
    afterTaxCost: number;
    taxSavings: number;
  } | null>(null);

  const calculate = () => {
    const interest = parseFloat(interestRate);
    const tax = parseFloat(taxRate);
    
    if (interest > 0 && tax >= 0 && tax <= 100) {
      // After-tax cost of debt = Interest Rate × (1 - Tax Rate)
      const afterTaxCost = interest * (1 - tax / 100);
      const taxSavings = interest - afterTaxCost;
      
      setResult({
        afterTaxCost,
        taxSavings,
      });
    } else {
      setResult(null);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>After-tax Cost of Debt Calculator</CardTitle>
        <CardDescription>
          Calculate the after-tax cost of debt for a company, accounting for tax deductions on interest payments.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="interestRate">Interest Rate (%)</Label>
            <Input
              id="interestRate"
              type="number"
              step="0.01"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              placeholder="Enter interest rate"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="taxRate">Tax Rate (%)</Label>
            <Input
              id="taxRate"
              type="number"
              step="0.01"
              value={taxRate}
              onChange={(e) => setTaxRate(e.target.value)}
              placeholder="Enter corporate tax rate"
              className="mt-2"
            />
          </div>
          <Button onClick={calculate} className="w-full">
            Calculate
          </Button>
          {result && (
            <div className="mt-6 bg-muted p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span>After-tax Cost of Debt:</span>
                <span className="font-bold">{result.afterTaxCost.toFixed(2)}%</span>
              </div>
              <div className="flex justify-between">
                <span>Tax Savings:</span>
                <span className="font-bold">{result.taxSavings.toFixed(2)}%</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

