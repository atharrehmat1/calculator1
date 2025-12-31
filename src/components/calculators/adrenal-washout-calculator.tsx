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

export function AdrenalWashoutCalculator() {
  const [preContrast, setPreContrast] = useState("");
  const [postContrast, setPostContrast] = useState("");
  const [delayed, setDelayed] = useState("");
  const [result, setResult] = useState<{
    washout: number;
    interpretation: string;
  } | null>(null);

  const calculate = () => {
    const pre = parseFloat(preContrast);
    const post = parseFloat(postContrast);
    const del = parseFloat(delayed);
    
    if (pre > 0 && post > 0 && del > 0) {
      // Absolute washout = (Post - Delayed) / (Post - Pre) × 100
      // Relative washout = (Post - Delayed) / Post × 100
      const absoluteWashout = ((post - del) / (post - pre)) * 100;
      const relativeWashout = ((post - del) / post) * 100;
      
      let interpretation = "";
      if (absoluteWashout >= 60 && relativeWashout >= 40) {
        interpretation = "Adenoma (benign)";
      } else {
        interpretation = "Non-adenoma (may require further evaluation)";
      }
      
      setResult({
        washout: absoluteWashout,
        interpretation,
      });
    } else {
      setResult(null);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Adrenal Washout Calculator</CardTitle>
        <CardDescription>
          Calculate adrenal washout percentage from CT scan to help differentiate adrenal adenomas from other lesions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="preContrast">Pre-Contrast HU</Label>
            <Input
              id="preContrast"
              type="number"
              value={preContrast}
              onChange={(e) => setPreContrast(e.target.value)}
              placeholder="Enter pre-contrast Hounsfield units"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="postContrast">Post-Contrast HU</Label>
            <Input
              id="postContrast"
              type="number"
              value={postContrast}
              onChange={(e) => setPostContrast(e.target.value)}
              placeholder="Enter post-contrast Hounsfield units"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="delayed">Delayed Phase HU</Label>
            <Input
              id="delayed"
              type="number"
              value={delayed}
              onChange={(e) => setDelayed(e.target.value)}
              placeholder="Enter delayed phase Hounsfield units"
              className="mt-2"
            />
          </div>
          <Button onClick={calculate} className="w-full">
            Calculate
          </Button>
          {result && (
            <div className="mt-6 bg-muted p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span>Absolute Washout:</span>
                <span className="font-bold">{result.washout.toFixed(1)}%</span>
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="text-sm">
                  <strong>Interpretation:</strong> {result.interpretation}
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  <strong>Note:</strong> This is a diagnostic aid. Always consult with a radiologist for proper interpretation.
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

