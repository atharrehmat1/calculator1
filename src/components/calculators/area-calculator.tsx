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

export function AreaCalculator() {
  const [shape, setShape] = useState("rectangle");
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [radius, setRadius] = useState("");
  const [base, setBase] = useState("");
  const [height, setHeight] = useState("");
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    let area = 0;
    
    if (shape === "rectangle") {
      const l = parseFloat(length);
      const w = parseFloat(width);
      if (!isNaN(l) && !isNaN(w)) {
        area = l * w;
      }
    } else if (shape === "circle") {
      const r = parseFloat(radius);
      if (!isNaN(r)) {
        area = Math.PI * r * r;
      }
    } else if (shape === "triangle") {
      const b = parseFloat(base);
      const h = parseFloat(height);
      if (!isNaN(b) && !isNaN(h)) {
        area = 0.5 * b * h;
      }
    }
    
    setResult(area > 0 ? area : null);
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Area Calculator</CardTitle>
        <CardDescription>
          Calculate the area of various geometric shapes.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="shape">Shape</Label>
            <Select value={shape} onValueChange={setShape}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select shape" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rectangle">Rectangle</SelectItem>
                <SelectItem value="circle">Circle</SelectItem>
                <SelectItem value="triangle">Triangle</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {shape === "rectangle" && (
            <>
              <div>
                <Label htmlFor="length">Length</Label>
                <Input
                  id="length"
                  type="number"
                  step="0.01"
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                  placeholder="Enter length"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="width">Width</Label>
                <Input
                  id="width"
                  type="number"
                  step="0.01"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  placeholder="Enter width"
                  className="mt-2"
                />
              </div>
            </>
          )}
          {shape === "circle" && (
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
          )}
          {shape === "triangle" && (
            <>
              <div>
                <Label htmlFor="base">Base</Label>
                <Input
                  id="base"
                  type="number"
                  step="0.01"
                  value={base}
                  onChange={(e) => setBase(e.target.value)}
                  placeholder="Enter base"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="height">Height</Label>
                <Input
                  id="height"
                  type="number"
                  step="0.01"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="Enter height"
                  className="mt-2"
                />
              </div>
            </>
          )}
          <Button onClick={calculate} className="w-full">
            Calculate
          </Button>
          {result !== null && (
            <div className="mt-6 bg-muted p-4 rounded-lg">
              <div className="flex justify-between">
                <span>Area:</span>
                <span className="font-bold text-lg">{result.toFixed(2)} square units</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}





