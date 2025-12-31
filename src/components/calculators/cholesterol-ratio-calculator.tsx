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

export function CholesterolRatioCalculator() {
  const [totalCholesterol, setTotalCholesterol] = useState("");
  const [hdl, setHdl] = useState("");
  const [result, setResult] = useState<{
    ratio: number;
    interpretation: string;
  } | null>(null);

  const calculate = () => {
    const total = parseFloat(totalCholesterol);
    const h = parseFloat(hdl);
    
    if (total > 0 && h > 0) {
      const ratio = total / h;
      
      let interpretation = "";
      if (ratio < 3.5) {
        interpretation = "Optimal";
      } else if (ratio < 5) {
        interpretation = "Good";
      } else {
        interpretation = "High risk - consult doctor";
      }
      
      setResult({
        ratio,
        interpretation,
      });
    } else {
      setResult(null);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Cholesterol Ratio Calculator</CardTitle>
        <CardDescription>
          Calculate your cholesterol ratio (Total Cholesterol / HDL) to assess cardiovascular risk.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="totalCholesterol">Total Cholesterol (mg/dL)</Label>
            <Input
              id="totalCholesterol"
              type="number"
              value={totalCholesterol}
              onChange={(e) => setTotalCholesterol(e.target.value)}
              placeholder="Enter total cholesterol"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="hdl">HDL Cholesterol (mg/dL)</Label>
            <Input
              id="hdl"
              type="number"
              value={hdl}
              onChange={(e) => setHdl(e.target.value)}
              placeholder="Enter HDL cholesterol"
              className="mt-2"
            />
          </div>
          <Button onClick={calculate} className="w-full">
            Calculate
          </Button>
          {result && (
            <div className="mt-6 bg-muted p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span>Cholesterol Ratio:</span>
                <span className="font-bold text-lg">{result.ratio.toFixed(2)}</span>
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="text-sm">
                  <strong>Interpretation:</strong> {result.interpretation}
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

