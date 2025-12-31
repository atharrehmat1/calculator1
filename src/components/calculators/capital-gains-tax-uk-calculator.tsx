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

export function CapitalGainsTaxUKCalculator() {
  const [purchasePrice, setPurchasePrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [annualAllowance, setAnnualAllowance] = useState("6000");
  const [result, setResult] = useState<{
    gain: number;
    taxableGain: number;
    basicRateTax: number;
    higherRateTax: number;
  } | null>(null);

  const calculate = () => {
    const purchase = parseFloat(purchasePrice);
    const sale = parseFloat(salePrice);
    const allowance = parseFloat(annualAllowance);
    
    if (purchase > 0 && sale > 0 && allowance >= 0) {
      const gain = sale - purchase;
      const taxableGain = Math.max(0, gain - allowance);
      
      // UK CGT rates: 10% basic rate, 20% higher rate (18% and 28% for property)
      const basicRateTax = taxableGain * 0.10;
      const higherRateTax = taxableGain * 0.20;
      
      setResult({
        gain,
        taxableGain,
        basicRateTax,
        higherRateTax,
      });
    } else {
      setResult(null);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Capital Gains Tax UK Calculator</CardTitle>
        <CardDescription>
          Calculate UK capital gains tax on your investments and asset sales.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="purchasePrice">Purchase Price (£)</Label>
            <Input
              id="purchasePrice"
              type="number"
              step="0.01"
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(e.target.value)}
              placeholder="Enter purchase price"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="salePrice">Sale Price (£)</Label>
            <Input
              id="salePrice"
              type="number"
              step="0.01"
              value={salePrice}
              onChange={(e) => setSalePrice(e.target.value)}
              placeholder="Enter sale price"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="annualAllowance">Annual CGT Allowance (£)</Label>
            <Input
              id="annualAllowance"
              type="number"
              value={annualAllowance}
              onChange={(e) => setAnnualAllowance(e.target.value)}
              placeholder="Enter annual allowance"
              className="mt-2"
            />
          </div>
          <Button onClick={calculate} className="w-full">
            Calculate
          </Button>
          {result && (
            <div className="mt-6 bg-muted p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span>Capital Gain:</span>
                <span className="font-bold">£{result.gain.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxable Gain:</span>
                <span className="font-bold">£{result.taxableGain.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Basic Rate Tax (10%):</span>
                <span className="font-bold">£{result.basicRateTax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span>Higher Rate Tax (20%):</span>
                <span className="font-bold">£{result.higherRateTax.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

