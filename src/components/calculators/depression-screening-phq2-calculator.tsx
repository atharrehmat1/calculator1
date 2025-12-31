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

export function DepressionScreeningPHQ2Calculator() {
  const [question1, setQuestion1] = useState("0");
  const [question2, setQuestion2] = useState("0");
  const [result, setResult] = useState<{
    score: number;
    interpretation: string;
  } | null>(null);

  const calculate = () => {
    const q1 = parseFloat(question1);
    const q2 = parseFloat(question2);
    
    const score = q1 + q2;
    
    let interpretation = "";
    if (score === 0) {
      interpretation = "No depression symptoms";
    } else if (score <= 2) {
      interpretation = "Minimal symptoms";
    } else if (score <= 4) {
      interpretation = "Mild depression - consider PHQ-9";
    } else if (score <= 6) {
      interpretation = "Moderate depression - recommend PHQ-9";
    } else {
      interpretation = "Severe depression - recommend full evaluation";
    }
    
    setResult({
      score,
      interpretation,
    });
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Depression Screening by PHQ-2 Calculator</CardTitle>
        <CardDescription>
          Quick 2-question depression screening tool. Score 0-3 on each question (0=Not at all, 3=Nearly every day).
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="question1">Q1: Little interest or pleasure in doing things (0-3)</Label>
            <Input
              id="question1"
              type="number"
              min="0"
              max="3"
              value={question1}
              onChange={(e) => setQuestion1(e.target.value)}
              placeholder="0-3"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="question2">Q2: Feeling down, depressed, or hopeless (0-3)</Label>
            <Input
              id="question2"
              type="number"
              min="0"
              max="3"
              value={question2}
              onChange={(e) => setQuestion2(e.target.value)}
              placeholder="0-3"
              className="mt-2"
            />
          </div>
          <Button onClick={calculate} className="w-full">
            Calculate
          </Button>
          {result && (
            <div className="mt-6 bg-muted p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span>PHQ-2 Score:</span>
                <span className="font-bold text-lg">{result.score} / 6</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span>Interpretation:</span>
                <span className="font-bold">{result.interpretation}</span>
              </div>
              <div className="text-xs text-muted-foreground mt-4 pt-4 border-t">
                <strong>Note:</strong> This is a screening tool only. Score ≥3 suggests need for full PHQ-9 assessment. Always consult with a healthcare professional for proper diagnosis and treatment.
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

