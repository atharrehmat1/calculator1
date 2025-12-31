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

export function TenOneARMCalculator() {
  const [loanAmount, setLoanAmount] = useState("");
  const [initialRate, setInitialRate] = useState("");
  const [adjustedRate, setAdjustedRate] = useState("");
  const [loanTerm, setLoanTerm] = useState("30");
  const [result, setResult] = useState<{
    initialPayment: number;
    adjustedPayment: number;
    paymentIncrease: number;
  } | null>(null);

  const calculate = () => {
    const principal = parseFloat(loanAmount);
    const initial = parseFloat(initialRate) / 100 / 12; // Monthly rate
    const adjusted = parseFloat(adjustedRate) / 100 / 12;
    const term = parseFloat(loanTerm) * 12; // Total months
    
    if (principal > 0 && initial > 0 && adjusted > 0 && term > 0) {
      // Calculate monthly payment: P * [r(1+r)^n] / [(1+r)^n - 1]
      const initialPayment = principal * (initial * Math.pow(1 + initial, term)) / (Math.pow(1 + initial, term) - 1);
      
      // After 10 years (120 months), recalculate with remaining balance and new rate
      const remainingMonths = term - 120;
      const remainingBalance = principal * (Math.pow(1 + initial, 120) - Math.pow(1 + initial, 120)) / (Math.pow(1 + initial, 120) - 1);
      const actualRemaining = principal * (Math.pow(1 + initial, 120) - 1) / (Math.pow(1 + initial, term) - 1) * (Math.pow(1 + adjusted, remainingMonths) - 1);
      const adjustedPayment = actualRemaining * (adjusted * Math.pow(1 + adjusted, remainingMonths)) / (Math.pow(1 + adjusted, remainingMonths) - 1);
      
      // Simplified calculation
      const balanceAfter10Years = principal * (1 - Math.pow(1 + initial, -120)) / (1 - Math.pow(1 + initial, -term));
      const remainingPrincipal = principal - (principal - balanceAfter10Years);
      const newPayment = remainingPrincipal * (adjusted * Math.pow(1 + adjusted, remainingMonths)) / (Math.pow(1 + adjusted, remainingMonths) - 1);
      
      setResult({
        initialPayment,
        adjustedPayment: newPayment || adjustedPayment,
        paymentIncrease: (newPayment || adjustedPayment) - initialPayment,
      });
    } else {
      setResult(null);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>10/1 ARM Calculator</CardTitle>
        <CardDescription>
          Calculate payments for a 10/1 Adjustable Rate Mortgage (fixed for 10 years, then adjusts annually).
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="loanAmount">Loan Amount ($)</Label>
            <Input
              id="loanAmount"
              type="number"
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
              placeholder="Enter loan amount"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="initialRate">Initial Interest Rate (%)</Label>
            <Input
              id="initialRate"
              type="number"
              step="0.01"
              value={initialRate}
              onChange={(e) => setInitialRate(e.target.value)}
              placeholder="Enter initial rate"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="adjustedRate">Adjusted Interest Rate (%)</Label>
            <Input
              id="adjustedRate"
              type="number"
              step="0.01"
              value={adjustedRate}
              onChange={(e) => setAdjustedRate(e.target.value)}
              placeholder="Enter adjusted rate after 10 years"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="loanTerm">Loan Term (years)</Label>
            <Input
              id="loanTerm"
              type="number"
              value={loanTerm}
              onChange={(e) => setLoanTerm(e.target.value)}
              placeholder="Enter loan term"
              className="mt-2"
            />
          </div>
          <Button onClick={calculate} className="w-full">
            Calculate
          </Button>
          {result && (
            <div className="mt-6 bg-muted p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span>Initial Monthly Payment (10 years):</span>
                <span className="font-bold">${result.initialPayment.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Adjusted Monthly Payment:</span>
                <span className="font-bold">${result.adjustedPayment.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span>Payment Increase:</span>
                <span className="font-bold text-red-600">${result.paymentIncrease.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

