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

export function AtalPensionYojanaCalculator() {
  const [age, setAge] = useState("");
  const [monthlyContribution, setMonthlyContribution] = useState("");
  const [pensionAmount, setPensionAmount] = useState("");
  const [result, setResult] = useState<{
    totalContributions: number;
    governmentCoContribution: number;
    totalValue: number;
    monthlyPension: number;
  } | null>(null);

  const calculate = () => {
    const a = parseFloat(age);
    const monthly = parseFloat(monthlyContribution);
    const pension = parseFloat(pensionAmount);
    
    if (a >= 18 && a <= 40 && monthly > 0 && pension > 0) {
      const yearsTo60 = 60 - a;
      const totalMonths = yearsTo60 * 12;
      const totalContributions = monthly * totalMonths;
      
      // Government co-contribution: 50% of contribution (max ₹1000/year for 5 years)
      const govtContribution = Math.min(totalContributions * 0.5, 5000);
      const totalValue = totalContributions + govtContribution;
      
      // APY provides fixed pension based on contribution
      const monthlyPension = pension;
      
      setResult({
        totalContributions,
        governmentCoContribution: govtContribution,
        totalValue,
        monthlyPension,
      });
    } else {
      setResult(null);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Atal Pension Yojana Calculator</CardTitle>
        <CardDescription>
          Calculate your Atal Pension Yojana (APY) contributions, government co-contribution, and pension benefits.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="age">Current Age (18-40)</Label>
            <Input
              id="age"
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Enter current age"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="monthlyContribution">Monthly Contribution (₹)</Label>
            <Input
              id="monthlyContribution"
              type="number"
              value={monthlyContribution}
              onChange={(e) => setMonthlyContribution(e.target.value)}
              placeholder="Enter monthly contribution"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="pensionAmount">Expected Monthly Pension (₹)</Label>
            <Input
              id="pensionAmount"
              type="number"
              value={pensionAmount}
              onChange={(e) => setPensionAmount(e.target.value)}
              placeholder="Enter expected pension"
              className="mt-2"
            />
          </div>
          <Button onClick={calculate} className="w-full">
            Calculate
          </Button>
          {result && (
            <div className="mt-6 bg-muted p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span>Total Contributions:</span>
                <span className="font-bold">₹{result.totalContributions.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Government Co-Contribution:</span>
                <span className="font-bold text-green-600">₹{result.governmentCoContribution.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Value:</span>
                <span className="font-bold">₹{result.totalValue.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span>Monthly Pension at 60:</span>
                <span className="font-bold text-lg">₹{result.monthlyPension.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

