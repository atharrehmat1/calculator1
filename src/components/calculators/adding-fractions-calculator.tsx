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

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

export function AddingFractionsCalculator() {
  const [num1, setNum1] = useState("");
  const [den1, setDen1] = useState("");
  const [num2, setNum2] = useState("");
  const [den2, setDen2] = useState("");
  const [result, setResult] = useState<{
    numerator: number;
    denominator: number;
    simplified: { num: number; den: number };
  } | null>(null);

  const calculate = () => {
    const n1 = parseFloat(num1);
    const d1 = parseFloat(den1);
    const n2 = parseFloat(num2);
    const d2 = parseFloat(den2);
    
    if (!isNaN(n1) && !isNaN(d1) && !isNaN(n2) && !isNaN(d2) && d1 !== 0 && d2 !== 0) {
      // Add fractions: (n1/d1) + (n2/d2) = (n1*d2 + n2*d1) / (d1*d2)
      const numerator = n1 * d2 + n2 * d1;
      const denominator = d1 * d2;
      
      // Simplify
      const g = gcd(Math.abs(numerator), Math.abs(denominator));
      const simplified = {
        num: numerator / g,
        den: denominator / g,
      };
      
      setResult({
        numerator,
        denominator,
        simplified,
      });
    } else {
      setResult(null);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Adding Fractions Calculator</CardTitle>
        <CardDescription>
          Add two fractions and get the result in simplified form.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="num1">First Fraction Numerator</Label>
              <Input
                id="num1"
                type="number"
                value={num1}
                onChange={(e) => setNum1(e.target.value)}
                placeholder="Enter numerator"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="den1">First Fraction Denominator</Label>
              <Input
                id="den1"
                type="number"
                value={den1}
                onChange={(e) => setDen1(e.target.value)}
                placeholder="Enter denominator"
                className="mt-2"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="num2">Second Fraction Numerator</Label>
              <Input
                id="num2"
                type="number"
                value={num2}
                onChange={(e) => setNum2(e.target.value)}
                placeholder="Enter numerator"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="den2">Second Fraction Denominator</Label>
              <Input
                id="den2"
                type="number"
                value={den2}
                onChange={(e) => setDen2(e.target.value)}
                placeholder="Enter denominator"
                className="mt-2"
              />
            </div>
          </div>
          <Button onClick={calculate} className="w-full">
            Calculate
          </Button>
          {result && (
            <div className="mt-6 bg-muted p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span>Result:</span>
                <span className="font-bold">{result.numerator}/{result.denominator}</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span>Simplified:</span>
                <span className="font-bold text-lg">{result.simplified.num}/{result.simplified.den}</span>
              </div>
              {result.simplified.den === 1 && (
                <div className="flex justify-between pt-2 border-t">
                  <span>Decimal:</span>
                  <span className="font-bold">{result.simplified.num}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}





