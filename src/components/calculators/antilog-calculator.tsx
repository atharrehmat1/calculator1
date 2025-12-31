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

export function AntilogCalculator() {
  const [value, setValue] = useState("");
  const [base, setBase] = useState("10");
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    const val = parseFloat(value);
    const baseVal = parseFloat(base);
    
    if (!isNaN(val) && !isNaN(baseVal) && baseVal > 0 && baseVal !== 1) {
      // Antilog: antilog_b(x) = b^x
      const antilog = Math.pow(baseVal, val);
      setResult(antilog);
    } else {
      setResult(null);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Antilog Calculator – Antilogarithm</CardTitle>
        <CardDescription>
          Calculate the antilogarithm (inverse logarithm) of a value.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="value">Logarithm Value</Label>
            <Input
              id="value"
              type="number"
              step="0.01"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter logarithm value"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="base">Base</Label>
            <Select value={base} onValueChange={setBase}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select base" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 (Common Log)</SelectItem>
                <SelectItem value="2.71828">e (Natural Log)</SelectItem>
                <SelectItem value="2">2 (Binary Log)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={calculate} className="w-full">
            Calculate
          </Button>
          {result !== null && (
            <div className="mt-6 bg-muted p-4 rounded-lg">
              <div className="flex justify-between">
                <span>Antilog:</span>
                <span className="font-bold text-lg">{result.toFixed(6)}</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}





