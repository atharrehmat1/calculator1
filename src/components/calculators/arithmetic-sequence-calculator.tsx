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

export function ArithmeticSequenceCalculator() {
  const [firstTerm, setFirstTerm] = useState("");
  const [commonDiff, setCommonDiff] = useState("");
  const [n, setN] = useState("");
  const [result, setResult] = useState<{
    nthTerm: number;
    sum: number;
  } | null>(null);

  const calculate = () => {
    const a = parseFloat(firstTerm);
    const d = parseFloat(commonDiff);
    const num = parseFloat(n);
    
    if (!isNaN(a) && !isNaN(d) && !isNaN(num) && num > 0) {
      // nth term: a_n = a + (n-1)d
      // Sum: S_n = n/2 * (2a + (n-1)d)
      const nthTerm = a + (num - 1) * d;
      const sum = (num / 2) * (2 * a + (num - 1) * d);
      
      setResult({
        nthTerm,
        sum,
      });
    } else {
      setResult(null);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Arithmetic Sequence Calculator</CardTitle>
        <CardDescription>
          Calculate the nth term and sum of an arithmetic sequence.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="firstTerm">First Term (a₁)</Label>
            <Input
              id="firstTerm"
              type="number"
              step="0.01"
              value={firstTerm}
              onChange={(e) => setFirstTerm(e.target.value)}
              placeholder="Enter first term"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="commonDiff">Common Difference (d)</Label>
            <Input
              id="commonDiff"
              type="number"
              step="0.01"
              value={commonDiff}
              onChange={(e) => setCommonDiff(e.target.value)}
              placeholder="Enter common difference"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="n">Number of Terms (n)</Label>
            <Input
              id="n"
              type="number"
              value={n}
              onChange={(e) => setN(e.target.value)}
              placeholder="Enter number of terms"
              className="mt-2"
            />
          </div>
          <Button onClick={calculate} className="w-full">
            Calculate
          </Button>
          {result && (
            <div className="mt-6 bg-muted p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span>nth Term:</span>
                <span className="font-bold">{result.nthTerm.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span>Sum of n Terms:</span>
                <span className="font-bold text-lg">{result.sum.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}





