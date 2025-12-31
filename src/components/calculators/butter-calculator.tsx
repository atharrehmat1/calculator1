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

export function ButterCalculator() {
  const [amount, setAmount] = useState("");
  const [fromUnit, setFromUnit] = useState("stick");
  const [result, setResult] = useState<{
    sticks: number;
    cups: number;
    tablespoons: number;
    teaspoons: number;
    grams: number;
    ounces: number;
  } | null>(null);

  const calculate = () => {
    const amt = parseFloat(amount);
    
    if (amt > 0) {
      // Convert to tablespoons first (1 stick = 8 tbsp = 113g)
      let tablespoons = 0;
      
      switch (fromUnit) {
        case "stick":
          tablespoons = amt * 8;
          break;
        case "cup":
          tablespoons = amt * 16;
          break;
        case "tablespoon":
          tablespoons = amt;
          break;
        case "teaspoon":
          tablespoons = amt / 3;
          break;
        case "gram":
          tablespoons = amt / 14.175;
          break;
        case "ounce":
          tablespoons = amt * 2;
          break;
      }
      
      const sticks = tablespoons / 8;
      const cups = tablespoons / 16;
      const teaspoons = tablespoons * 3;
      const grams = tablespoons * 14.175;
      const ounces = tablespoons / 2;
      
      setResult({
        sticks,
        cups,
        tablespoons,
        teaspoons,
        grams,
        ounces,
      });
    } else {
      setResult(null);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Butter Calculator - How Much is a Stick of Butter?</CardTitle>
        <CardDescription>
          Convert butter measurements between sticks, cups, tablespoons, teaspoons, grams, and ounces.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="fromUnit">From Unit</Label>
            <Select value={fromUnit} onValueChange={setFromUnit}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="stick">Stick(s)</SelectItem>
                <SelectItem value="cup">Cup(s)</SelectItem>
                <SelectItem value="tablespoon">Tablespoon(s)</SelectItem>
                <SelectItem value="teaspoon">Teaspoon(s)</SelectItem>
                <SelectItem value="gram">Gram(s)</SelectItem>
                <SelectItem value="ounce">Ounce(s)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={calculate} className="w-full">
            Calculate
          </Button>
          {result && (
            <div className="mt-6 bg-muted p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span>Sticks:</span>
                <span className="font-bold">{result.sticks.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Cups:</span>
                <span className="font-bold">{result.cups.toFixed(3)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tablespoons:</span>
                <span className="font-bold">{result.tablespoons.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Teaspoons:</span>
                <span className="font-bold">{result.teaspoons.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Grams:</span>
                <span className="font-bold">{result.grams.toFixed(2)} g</span>
              </div>
              <div className="flex justify-between">
                <span>Ounces:</span>
                <span className="font-bold">{result.ounces.toFixed(2)} oz</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

