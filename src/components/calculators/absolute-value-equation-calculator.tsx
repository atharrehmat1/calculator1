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

export function AbsoluteValueEquationCalculator() {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [c, setC] = useState("");
  const [result, setResult] = useState<{
    solution1: number | null;
    solution2: number | null;
  } | null>(null);

  const calculate = () => {
    const aVal = parseFloat(a);
    const bVal = parseFloat(b);
    const cVal = parseFloat(c);
    
    if (aVal !== 0 && !isNaN(aVal) && !isNaN(bVal) && !isNaN(cVal)) {
      // Solve |ax + b| = c
      // Solutions: x = (c - b) / a and x = (-c - b) / a
      const solution1 = (cVal - bVal) / aVal;
      const solution2 = (-cVal - bVal) / aVal;
      
      setResult({
        solution1: cVal >= 0 ? solution1 : null,
        solution2: cVal >= 0 ? solution2 : null,
      });
    } else {
      setResult(null);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Absolute Value Equation Calculator</CardTitle>
        <CardDescription>
          Solve absolute value equations of the form |ax + b| = c.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="a">Coefficient a</Label>
            <Input
              id="a"
              type="number"
              step="0.1"
              value={a}
              onChange={(e) => setA(e.target.value)}
              placeholder="Enter coefficient a"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="b">Coefficient b</Label>
            <Input
              id="b"
              type="number"
              step="0.1"
              value={b}
              onChange={(e) => setB(e.target.value)}
              placeholder="Enter coefficient b"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="c">Constant c</Label>
            <Input
              id="c"
              type="number"
              step="0.1"
              value={c}
              onChange={(e) => setC(e.target.value)}
              placeholder="Enter constant c"
              className="mt-2"
            />
          </div>
          <Button onClick={calculate} className="w-full">
            Calculate
          </Button>
          {result && (
            <div className="mt-6 bg-muted p-4 rounded-lg space-y-2">
              {result.solution1 !== null && (
                <div className="flex justify-between">
                  <span>Solution 1:</span>
                  <span className="font-bold">x = {result.solution1.toFixed(4)}</span>
                </div>
              )}
              {result.solution2 !== null && result.solution1 !== result.solution2 && (
                <div className="flex justify-between">
                  <span>Solution 2:</span>
                  <span className="font-bold">x = {result.solution2.toFixed(4)}</span>
                </div>
              )}
              {result.solution1 === null && result.solution2 === null && (
                <div className="text-sm text-muted-foreground">No real solutions (c must be ≥ 0)</div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}





