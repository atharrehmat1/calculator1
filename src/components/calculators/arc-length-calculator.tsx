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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ArcLengthCalculator() {
  const [radius, setRadius] = useState("");
  const [angle, setAngle] = useState("");
  const [angleUnit, setAngleUnit] = useState("degrees");
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    const r = parseFloat(radius);
    const a = parseFloat(angle);
    
    if (!isNaN(r) && !isNaN(a) && r > 0 && a > 0) {
      // Arc length = r * θ (where θ is in radians)
      let angleRadians = a;
      if (angleUnit === "degrees") {
        angleRadians = (a * Math.PI) / 180;
      }
      const arcLength = r * angleRadians;
      setResult(arcLength);
    } else {
      setResult(null);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Arc Length Calculator</CardTitle>
        <CardDescription>
          Calculate the arc length of a circle given the radius and central angle.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="radius">Radius</Label>
            <Input
              id="radius"
              type="number"
              step="0.01"
              value={radius}
              onChange={(e) => setRadius(e.target.value)}
              placeholder="Enter radius"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="angle">Central Angle</Label>
            <Input
              id="angle"
              type="number"
              step="0.01"
              value={angle}
              onChange={(e) => setAngle(e.target.value)}
              placeholder="Enter angle"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="angleUnit">Angle Unit</Label>
            <Select value={angleUnit} onValueChange={setAngleUnit}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="degrees">Degrees</SelectItem>
                <SelectItem value="radians">Radians</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={calculate} className="w-full">
            Calculate
          </Button>
          {result !== null && (
            <div className="mt-6 bg-muted p-4 rounded-lg">
              <div className="flex justify-between">
                <span>Arc Length:</span>
                <span className="font-bold text-lg">{result.toFixed(4)} units</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}





