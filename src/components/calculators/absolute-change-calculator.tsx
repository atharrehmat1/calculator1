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

export function AbsoluteChangeCalculator() {
  const [initial, setInitial] = useState("");
  const [final, setFinal] = useState("");
  const [result, setResult] = useState<{
    absoluteChange: number;
    percentageChange: number;
  } | null>(null);

  const calculate = () => {
    const initialVal = parseFloat(initial);
    const finalVal = parseFloat(final);
    
    if (!isNaN(initialVal) && !isNaN(finalVal)) {
      const absoluteChange = finalVal - initialVal;
      const percentageChange = initialVal !== 0 ? (absoluteChange / initialVal) * 100 : 0;
      
      setResult({
        absoluteChange,
        percentageChange,
      });
    } else {
      setResult(null);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Absolute Change Calculator</CardTitle>
        <CardDescription>
          Calculate the absolute change and percentage change between two values.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="initial">Initial Value</Label>
            <Input
              id="initial"
              type="number"
              step="0.01"
              value={initial}
              onChange={(e) => setInitial(e.target.value)}
              placeholder="Enter initial value"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="final">Final Value</Label>
            <Input
              id="final"
              type="number"
              step="0.01"
              value={final}
              onChange={(e) => setFinal(e.target.value)}
              placeholder="Enter final value"
              className="mt-2"
            />
          </div>
          <Button onClick={calculate} className="w-full">
            Calculate
          </Button>
          {result && (
            <div className="mt-6 bg-muted p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span>Absolute Change:</span>
                <span className="font-bold text-lg">{result.absoluteChange.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span>Percentage Change:</span>
                <span className="font-bold">{result.percentageChange.toFixed(2)}%</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}





