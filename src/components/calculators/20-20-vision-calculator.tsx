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

export function TwentyTwentyVisionCalculator() {
  const [distance, setDistance] = useState("");
  const [letterSize, setLetterSize] = useState("");
  const [result, setResult] = useState<{
    vision: string;
    interpretation: string;
  } | null>(null);

  const calculate = () => {
    const d = parseFloat(distance);
    const size = parseFloat(letterSize);
    
    if (d > 0 && size > 0) {
      // 20/20 vision means seeing at 20 feet what should normally be seen at 20 feet
      // Vision = (Distance / Standard Distance) × (Standard Size / Letter Size)
      const standardDistance = 20; // feet
      const standardSize = 1; // arbitrary unit
      const visionRatio = (d / standardDistance) * (standardSize / size);
      const vision = `20/${(20 / visionRatio).toFixed(0)}`;
      
      let interpretation = "";
      if (visionRatio >= 1) {
        interpretation = "Normal or better vision (20/20 or better)";
      } else if (visionRatio >= 0.5) {
        interpretation = "Mild vision impairment";
      } else if (visionRatio >= 0.25) {
        interpretation = "Moderate vision impairment";
      } else {
        interpretation = "Severe vision impairment - consult eye doctor";
      }
      
      setResult({
        vision,
        interpretation,
      });
    } else {
      setResult(null);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>20/20 Vision Calculator for 2020</CardTitle>
        <CardDescription>
          Calculate visual acuity and determine if you have 20/20 vision or need corrective lenses.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="distance">Distance from Chart (feet)</Label>
            <Input
              id="distance"
              type="number"
              step="0.1"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              placeholder="Enter distance"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="letterSize">Smallest Letter Size Readable</Label>
            <Input
              id="letterSize"
              type="number"
              step="0.1"
              value={letterSize}
              onChange={(e) => setLetterSize(e.target.value)}
              placeholder="Enter letter size"
              className="mt-2"
            />
          </div>
          <Button onClick={calculate} className="w-full">
            Calculate
          </Button>
          {result && (
            <div className="mt-6 bg-muted p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span>Visual Acuity:</span>
                <span className="font-bold text-lg">{result.vision}</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span>Interpretation:</span>
                <span className="font-bold">{result.interpretation}</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

