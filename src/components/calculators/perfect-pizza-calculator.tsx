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

export function PerfectPizzaCalculator() {
  const [diameter, setDiameter] = useState("");
  const [doughThickness, setDoughThickness] = useState("0.5");
  const [result, setResult] = useState<{
    doughWeight: number;
    flour: number;
    water: number;
    salt: number;
    yeast: number;
    area: number;
  } | null>(null);

  const calculate = () => {
    const d = parseFloat(diameter);
    const thickness = parseFloat(doughThickness);
    
    if (d > 0 && thickness > 0) {
      const radius = d / 2;
      const area = Math.PI * radius * radius;
      // Dough weight = area * thickness * density (density ≈ 1.2 g/cm³ for pizza dough)
      // Convert inches to cm: 1 inch = 2.54 cm
      const radiusCm = radius * 2.54;
      const thicknessCm = thickness * 2.54;
      const areaCm = Math.PI * radiusCm * radiusCm;
      const doughWeight = areaCm * thicknessCm * 1.2;
      
      // Standard pizza dough recipe: 60% hydration, 2% salt, 1% yeast
      const flour = doughWeight / 1.63; // Total weight / (1 + 0.6 + 0.02 + 0.01)
      const water = flour * 0.6;
      const salt = flour * 0.02;
      const yeast = flour * 0.01;
      
      setResult({
        doughWeight,
        flour,
        water,
        salt,
        yeast,
        area,
      });
    } else {
      setResult(null);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Perfect Pizza Calculator</CardTitle>
        <CardDescription>
          Calculate the perfect amount of dough and ingredients for your pizza based on size and thickness.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="diameter">Pizza Diameter (inches)</Label>
            <Input
              id="diameter"
              type="number"
              step="0.5"
              value={diameter}
              onChange={(e) => setDiameter(e.target.value)}
              placeholder="Enter pizza diameter"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="doughThickness">Dough Thickness (inches)</Label>
            <Input
              id="doughThickness"
              type="number"
              step="0.1"
              value={doughThickness}
              onChange={(e) => setDoughThickness(e.target.value)}
              placeholder="Enter dough thickness"
              className="mt-2"
            />
          </div>
          <Button onClick={calculate} className="w-full">
            Calculate
          </Button>
          {result && (
            <div className="mt-6 bg-muted p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span>Pizza Area:</span>
                <span className="font-bold">{result.area.toFixed(1)} sq in</span>
              </div>
              <div className="flex justify-between">
                <span>Total Dough Weight:</span>
                <span className="font-bold">{result.doughWeight.toFixed(1)} g</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span>Flour:</span>
                <span className="font-bold">{result.flour.toFixed(1)} g</span>
              </div>
              <div className="flex justify-between">
                <span>Water:</span>
                <span className="font-bold">{result.water.toFixed(1)} g</span>
              </div>
              <div className="flex justify-between">
                <span>Salt:</span>
                <span className="font-bold">{result.salt.toFixed(1)} g</span>
              </div>
              <div className="flex justify-between">
                <span>Yeast:</span>
                <span className="font-bold">{result.yeast.toFixed(1)} g</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

