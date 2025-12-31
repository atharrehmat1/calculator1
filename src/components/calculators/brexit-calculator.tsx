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

export function BrexitCalculator() {
  const [ukAmount, setUkAmount] = useState("");
  const [exchangeRate, setExchangeRate] = useState("1.15");
  const [tariffRate, setTariffRate] = useState("0");
  const [result, setResult] = useState<{
    euEquivalent: number;
    withTariff: number;
    tariffCost: number;
  } | null>(null);

  const calculate = () => {
    const amount = parseFloat(ukAmount);
    const rate = parseFloat(exchangeRate);
    const tariff = parseFloat(tariffRate);
    
    if (amount > 0 && rate > 0 && tariff >= 0) {
      const euEquivalent = amount * rate;
      const tariffCost = euEquivalent * (tariff / 100);
      const withTariff = euEquivalent + tariffCost;
      
      setResult({
        euEquivalent,
        withTariff,
        tariffCost,
      });
    } else {
      setResult(null);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Brexit Calculator</CardTitle>
        <CardDescription>
          Calculate financial impacts related to Brexit including currency conversion and tariff costs.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="ukAmount">UK Amount (£)</Label>
            <Input
              id="ukAmount"
              type="number"
              step="0.01"
              value={ukAmount}
              onChange={(e) => setUkAmount(e.target.value)}
              placeholder="Enter amount in GBP"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="exchangeRate">GBP to EUR Exchange Rate</Label>
            <Input
              id="exchangeRate"
              type="number"
              step="0.01"
              value={exchangeRate}
              onChange={(e) => setExchangeRate(e.target.value)}
              placeholder="Enter exchange rate"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="tariffRate">Tariff Rate (%)</Label>
            <Input
              id="tariffRate"
              type="number"
              step="0.1"
              value={tariffRate}
              onChange={(e) => setTariffRate(e.target.value)}
              placeholder="Enter tariff rate"
              className="mt-2"
            />
          </div>
          <Button onClick={calculate} className="w-full">
            Calculate
          </Button>
          {result && (
            <div className="mt-6 bg-muted p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span>EUR Equivalent:</span>
                <span className="font-bold">€{result.euEquivalent.toFixed(2)}</span>
              </div>
              {parseFloat(tariffRate) > 0 && (
                <>
                  <div className="flex justify-between">
                    <span>Tariff Cost:</span>
                    <span className="font-bold text-red-600">€{result.tariffCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span>Total with Tariff:</span>
                    <span className="font-bold">€{result.withTariff.toFixed(2)}</span>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

