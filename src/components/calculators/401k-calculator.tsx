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

export function FourZeroOneKCalculator() {
  const [currentAge, setCurrentAge] = useState("");
  const [retirementAge, setRetirementAge] = useState("65");
  const [currentBalance, setCurrentBalance] = useState("");
  const [monthlyContribution, setMonthlyContribution] = useState("");
  const [employerMatch, setEmployerMatch] = useState("");
  const [annualReturn, setAnnualReturn] = useState("7");
  const [result, setResult] = useState<{
    totalContributions: number;
    totalValue: number;
    earnings: number;
  } | null>(null);

  const calculate = () => {
    const age = parseFloat(currentAge);
    const retire = parseFloat(retirementAge);
    const balance = parseFloat(currentBalance) || 0;
    const monthly = parseFloat(monthlyContribution);
    const match = parseFloat(employerMatch) || 0;
    const returnRate = parseFloat(annualReturn) / 100;
    
    if (age > 0 && retire > age && monthly > 0 && returnRate > 0) {
      const years = retire - age;
      const months = years * 12;
      const monthlyRate = returnRate / 12;
      const totalMonthly = monthly + (monthly * match / 100);
      
      // Future value of current balance
      const futureBalance = balance * Math.pow(1 + returnRate, years);
      
      // Future value of annuity (monthly contributions)
      const futureAnnuity = totalMonthly * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
      
      const totalValue = futureBalance + futureAnnuity;
      const totalContributions = balance + (totalMonthly * months);
      const earnings = totalValue - totalContributions;
      
      setResult({
        totalContributions,
        totalValue,
        earnings,
      });
    } else {
      setResult(null);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>401k Calculator</CardTitle>
        <CardDescription>
          Calculate your 401(k) retirement plan contributions, employer match, and growth over time.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="currentAge">Current Age</Label>
            <Input
              id="currentAge"
              type="number"
              value={currentAge}
              onChange={(e) => setCurrentAge(e.target.value)}
              placeholder="Enter current age"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="retirementAge">Retirement Age</Label>
            <Input
              id="retirementAge"
              type="number"
              value={retirementAge}
              onChange={(e) => setRetirementAge(e.target.value)}
              placeholder="Enter retirement age"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="currentBalance">Current 401(k) Balance ($)</Label>
            <Input
              id="currentBalance"
              type="number"
              value={currentBalance}
              onChange={(e) => setCurrentBalance(e.target.value)}
              placeholder="Enter current balance (0 if none)"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="monthlyContribution">Monthly Contribution ($)</Label>
            <Input
              id="monthlyContribution"
              type="number"
              step="0.01"
              value={monthlyContribution}
              onChange={(e) => setMonthlyContribution(e.target.value)}
              placeholder="Enter monthly contribution"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="employerMatch">Employer Match (%)</Label>
            <Input
              id="employerMatch"
              type="number"
              step="0.1"
              value={employerMatch}
              onChange={(e) => setEmployerMatch(e.target.value)}
              placeholder="Enter employer match percentage"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="annualReturn">Expected Annual Return (%)</Label>
            <Input
              id="annualReturn"
              type="number"
              step="0.1"
              value={annualReturn}
              onChange={(e) => setAnnualReturn(e.target.value)}
              placeholder="Enter expected return"
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
                <span className="font-bold">${result.totalContributions.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Value at Retirement:</span>
                <span className="font-bold text-lg">${result.totalValue.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span>Estimated Earnings:</span>
                <span className="font-bold text-green-600">${result.earnings.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

