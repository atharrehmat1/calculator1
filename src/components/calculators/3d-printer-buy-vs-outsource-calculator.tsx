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

export function ThreeDPrinterBuyVsOutsourceCalculator() {
  const [monthlyVolume, setMonthlyVolume] = useState("");
  const [printerCost, setPrinterCost] = useState("");
  const [materialCostPerUnit, setMaterialCostPerUnit] = useState("");
  const [outsourceCostPerUnit, setOutsourceCostPerUnit] = useState("");
  const [printerLifespan, setPrinterLifespan] = useState("3");
  const [result, setResult] = useState<{
    buyTotal: number;
    outsourceTotal: number;
    savings: number;
    recommendation: string;
  } | null>(null);

  const calculate = () => {
    const volume = parseFloat(monthlyVolume);
    const printer = parseFloat(printerCost);
    const material = parseFloat(materialCostPerUnit);
    const outsource = parseFloat(outsourceCostPerUnit);
    const lifespan = parseFloat(printerLifespan);
    
    if (volume > 0 && printer > 0 && material > 0 && outsource > 0 && lifespan > 0) {
      const totalMonths = lifespan * 12;
      const totalVolume = volume * totalMonths;
      const buyTotal = printer + (material * totalVolume);
      const outsourceTotal = outsource * totalVolume;
      const savings = outsourceTotal - buyTotal;
      const recommendation = savings > 0 ? "Buy" : "Outsource";
      
      setResult({
        buyTotal,
        outsourceTotal,
        savings: Math.abs(savings),
        recommendation,
      });
    } else {
      setResult(null);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>3D Printer - Buy vs Outsource Calculator</CardTitle>
        <CardDescription>
          Compare the cost of buying a 3D printer versus outsourcing printing services.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="monthlyVolume">Monthly Print Volume (units)</Label>
            <Input
              id="monthlyVolume"
              type="number"
              value={monthlyVolume}
              onChange={(e) => setMonthlyVolume(e.target.value)}
              placeholder="Enter monthly volume"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="printerCost">3D Printer Cost ($)</Label>
            <Input
              id="printerCost"
              type="number"
              value={printerCost}
              onChange={(e) => setPrinterCost(e.target.value)}
              placeholder="Enter printer cost"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="materialCostPerUnit">Material Cost per Unit ($)</Label>
            <Input
              id="materialCostPerUnit"
              type="number"
              step="0.01"
              value={materialCostPerUnit}
              onChange={(e) => setMaterialCostPerUnit(e.target.value)}
              placeholder="Enter material cost"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="outsourceCostPerUnit">Outsource Cost per Unit ($)</Label>
            <Input
              id="outsourceCostPerUnit"
              type="number"
              step="0.01"
              value={outsourceCostPerUnit}
              onChange={(e) => setOutsourceCostPerUnit(e.target.value)}
              placeholder="Enter outsource cost"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="printerLifespan">Printer Lifespan (years)</Label>
            <Input
              id="printerLifespan"
              type="number"
              value={printerLifespan}
              onChange={(e) => setPrinterLifespan(e.target.value)}
              placeholder="Enter lifespan"
              className="mt-2"
            />
          </div>
          <Button onClick={calculate} className="w-full">
            Calculate
          </Button>
          {result && (
            <div className="mt-6 bg-muted p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span>Buy Total Cost:</span>
                <span className="font-bold">${result.buyTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Outsource Total Cost:</span>
                <span className="font-bold">${result.outsourceTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Savings:</span>
                <span className="font-bold">${result.savings.toFixed(2)}</span>
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Recommendation:</span>
                  <span className={`font-bold ${result.recommendation === "Buy" ? "text-green-600" : "text-blue-600"}`}>
                    {result.recommendation}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

