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

export function AddictionCalculator() {
  const [substance, setSubstance] = useState("");
  const [frequency, setFrequency] = useState("");
  const [amount, setAmount] = useState("");
  const [duration, setDuration] = useState("");
  const [result, setResult] = useState<{
    risk: string;
    recommendation: string;
  } | null>(null);

  const calculate = () => {
    const freq = parseFloat(frequency);
    const amt = parseFloat(amount);
    const dur = parseFloat(duration);
    
    if (freq > 0 && amt > 0 && dur > 0) {
      // Simplified risk assessment
      const riskScore = (freq * amt * dur) / 100;
      
      let risk = "";
      let recommendation = "";
      
      if (riskScore < 10) {
        risk = "Low";
        recommendation = "Monitor usage, maintain awareness";
      } else if (riskScore < 30) {
        risk = "Moderate";
        recommendation = "Consider reducing usage, seek support if needed";
      } else {
        risk = "High";
        recommendation = "Strongly recommend professional help and support";
      }
      
      setResult({
        risk,
        recommendation,
      });
    } else {
      setResult(null);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Addiction Calculator</CardTitle>
        <CardDescription>
          Assess potential addiction risk based on substance use patterns. This is a screening tool, not a diagnosis.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="substance">Substance Type</Label>
            <Input
              id="substance"
              type="text"
              value={substance}
              onChange={(e) => setSubstance(e.target.value)}
              placeholder="Enter substance type"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="frequency">Frequency (times per week)</Label>
            <Input
              id="frequency"
              type="number"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              placeholder="Enter frequency"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="amount">Amount per Use</Label>
            <Input
              id="amount"
              type="number"
              step="0.1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="duration">Duration (months)</Label>
            <Input
              id="duration"
              type="number"
              step="0.1"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="Enter duration"
              className="mt-2"
            />
          </div>
          <Button onClick={calculate} className="w-full">
            Calculate
          </Button>
          {result && (
            <div className="mt-6 bg-muted p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span>Risk Level:</span>
                <span className="font-bold">{result.risk}</span>
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="text-sm">
                  <strong>Recommendation:</strong> {result.recommendation}
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  <strong>Note:</strong> This is a screening tool only. Consult a healthcare professional for proper assessment.
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

