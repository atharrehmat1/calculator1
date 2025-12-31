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

export function AngleBetweenTwoVectorsCalculator() {
  const [x1, setX1] = useState("");
  const [y1, setY1] = useState("");
  const [x2, setX2] = useState("");
  const [y2, setY2] = useState("");
  const [result, setResult] = useState<{
    radians: number;
    degrees: number;
  } | null>(null);

  const calculate = () => {
    const x1Val = parseFloat(x1);
    const y1Val = parseFloat(y1);
    const x2Val = parseFloat(x2);
    const y2Val = parseFloat(y2);
    
    if (!isNaN(x1Val) && !isNaN(y1Val) && !isNaN(x2Val) && !isNaN(y2Val)) {
      // Dot product: v1 · v2 = x1*x2 + y1*y2
      // Magnitudes: |v1| = √(x1² + y1²), |v2| = √(x2² + y2²)
      // Angle: θ = arccos((v1 · v2) / (|v1| * |v2|))
      const dotProduct = x1Val * x2Val + y1Val * y2Val;
      const mag1 = Math.sqrt(x1Val * x1Val + y1Val * y1Val);
      const mag2 = Math.sqrt(x2Val * x2Val + y2Val * y2Val);
      
      if (mag1 > 0 && mag2 > 0) {
        const cosAngle = dotProduct / (mag1 * mag2);
        const radians = Math.acos(Math.max(-1, Math.min(1, cosAngle)));
        const degrees = (radians * 180) / Math.PI;
        
        setResult({
          radians,
          degrees,
        });
      } else {
        setResult(null);
      }
    } else {
      setResult(null);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Angle Between Two Vectors Calculator</CardTitle>
        <CardDescription>
          Calculate the angle between two 2D vectors.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label>Vector 1</Label>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <Input
                  type="number"
                  step="0.01"
                  value={x1}
                  onChange={(e) => setX1(e.target.value)}
                  placeholder="x₁"
                />
              </div>
              <div>
                <Input
                  type="number"
                  step="0.01"
                  value={y1}
                  onChange={(e) => setY1(e.target.value)}
                  placeholder="y₁"
                />
              </div>
            </div>
          </div>
          <div>
            <Label>Vector 2</Label>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <Input
                  type="number"
                  step="0.01"
                  value={x2}
                  onChange={(e) => setX2(e.target.value)}
                  placeholder="x₂"
                />
              </div>
              <div>
                <Input
                  type="number"
                  step="0.01"
                  value={y2}
                  onChange={(e) => setY2(e.target.value)}
                  placeholder="y₂"
                />
              </div>
            </div>
          </div>
          <Button onClick={calculate} className="w-full">
            Calculate
          </Button>
          {result && (
            <div className="mt-6 bg-muted p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span>Angle (Radians):</span>
                <span className="font-bold">{result.radians.toFixed(4)} rad</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span>Angle (Degrees):</span>
                <span className="font-bold text-lg">{result.degrees.toFixed(2)}°</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}





