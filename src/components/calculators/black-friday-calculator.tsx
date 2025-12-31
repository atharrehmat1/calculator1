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

export function BlackFridayCalculator() {
  const [originalPrice, setOriginalPrice] = useState("");
  const [discountPercent, setDiscountPercent] = useState("");
  const [result, setResult] = useState<{
    discountedPrice: number;
    savings: number;
  } | null>(null);

  const calculate = () => {
    const price = parseFloat(originalPrice);
    const discount = parseFloat(discountPercent);
    
    if (price > 0 && discount >= 0 && discount <= 100) {
      const savings = price * (discount / 100);
      const discountedPrice = price - savings;
      
      setResult({
        discountedPrice,
        savings,
      });
    } else {
      setResult(null);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Black Friday Calculator</CardTitle>
        <CardDescription>
          Calculate savings and final prices for Black Friday shopping with discounts.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="originalPrice">Original Price ($)</Label>
            <Input
              id="originalPrice"
              type="number"
              step="0.01"
              value={originalPrice}
              onChange={(e) => setOriginalPrice(e.target.value)}
              placeholder="Enter original price"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="discountPercent">Discount Percentage (%)</Label>
            <Input
              id="discountPercent"
              type="number"
              step="0.1"
              value={discountPercent}
              onChange={(e) => setDiscountPercent(e.target.value)}
              placeholder="Enter discount percentage"
              className="mt-2"
            />
          </div>
          <Button onClick={calculate} className="w-full">
            Calculate
          </Button>
          {result && (
            <div className="mt-6 bg-muted p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span>Discounted Price:</span>
                <span className="font-bold text-lg">${result.discountedPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span>You Save:</span>
                <span className="font-bold text-green-600">${result.savings.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

