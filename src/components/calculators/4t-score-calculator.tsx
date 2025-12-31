"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export function FourTScoreCalculator() {
  const [thrombocytopenia, setThrombocytopenia] = useState("0");
  const [timing, setTiming] = useState("0");
  const [thrombosis, setThrombosis] = useState("0");
  const [otherCause, setOtherCause] = useState("0");
  const [result, setResult] = useState<{
    score: number;
    probability: string;
  } | null>(null);

  const calculate = () => {
    const t1 = parseFloat(thrombocytopenia);
    const t2 = parseFloat(timing);
    const t3 = parseFloat(thrombosis);
    const t4 = parseFloat(otherCause);
    
    const score = t1 + t2 + t3 + t4;
    
    let probability = "";
    if (score <= 3) {
      probability = "Low probability (1-5%)";
    } else if (score <= 5) {
      probability = "Intermediate probability (14-20%)";
    } else {
      probability = "High probability (64-100%)";
    }
    
    setResult({
      score,
      probability,
    });
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>4T Score Calculator | HIT</CardTitle>
        <CardDescription>
          Calculate the 4T score for Heparin-Induced Thrombocytopenia (HIT) risk assessment.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="thrombocytopenia">T1: Thrombocytopenia (0-2)</Label>
            <Input
              id="thrombocytopenia"
              type="number"
              min="0"
              max="2"
              value={thrombocytopenia}
              onChange={(e) => setThrombocytopenia(e.target.value)}
              placeholder="0-2"
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">2: &gt;50% fall or nadir 20-100k, 1: 30-50% fall or nadir 10-19k, 0: &lt;30% fall or nadir &lt;10k</p>
          </div>
          <div>
            <Label htmlFor="timing">T2: Timing (0-2)</Label>
            <Input
              id="timing"
              type="number"
              min="0"
              max="2"
              value={timing}
              onChange={(e) => setTiming(e.target.value)}
              placeholder="0-2"
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">2: Day 5-10 or ≤1 day if recent exposure, 1: &gt;Day 10 or unclear, 0: &lt;Day 4</p>
          </div>
          <div>
            <Label htmlFor="thrombosis">T3: Thrombosis (0-2)</Label>
            <Input
              id="thrombosis"
              type="number"
              min="0"
              max="2"
              value={thrombosis}
              onChange={(e) => setThrombosis(e.target.value)}
              placeholder="0-2"
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">2: Confirmed thrombosis, 1: Progressive/recurrent, 0: None</p>
          </div>
          <div>
            <Label htmlFor="otherCause">T4: Other Cause (0-2)</Label>
            <Input
              id="otherCause"
              type="number"
              min="0"
              max="2"
              value={otherCause}
              onChange={(e) => setOtherCause(e.target.value)}
              placeholder="0-2"
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">2: None apparent, 1: Possible, 0: Definite</p>
          </div>
          <Button onClick={calculate} className="w-full">
            Calculate
          </Button>
          {result && (
            <div className="mt-6 bg-muted p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span>4T Score:</span>
                <span className="font-bold text-lg">{result.score} / 8</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span>HIT Probability:</span>
                <span className="font-bold">{result.probability}</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

