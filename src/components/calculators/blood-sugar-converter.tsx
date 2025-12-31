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

export function BloodSugarConverter() {
  const [value, setValue] = useState("");
  const [fromUnit, setFromUnit] = useState("mgdl");
  const [result, setResult] = useState<{
    mgdl: number;
    mmoll: number;
  } | null>(null);

  const calculate = () => {
    const val = parseFloat(value);
    
    if (val > 0) {
      let mgdl = 0;
      let mmoll = 0;
      
      if (fromUnit === "mgdl") {
        mgdl = val;
        mmoll = val / 18.0182; // Convert mg/dL to mmol/L
      } else {
        mmoll = val;
        mgdl = val * 18.0182; // Convert mmol/L to mg/dL
      }
      
      setResult({
        mgdl,
        mmoll,
      });
    } else {
      setResult(null);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Blood Sugar Converter</CardTitle>
        <CardDescription>
          Convert blood glucose levels between mg/dL (US) and mmol/L (international) units.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="value">Blood Sugar Value</Label>
            <Input
              id="value"
              type="number"
              step="0.1"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter blood sugar value"
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
                <SelectItem value="mgdl">mg/dL (US)</SelectItem>
                <SelectItem value="mmoll">mmol/L (International)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={calculate} className="w-full">
            Convert
          </Button>
          {result && (
            <div className="mt-6 bg-muted p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span>mg/dL:</span>
                <span className="font-bold">{result.mgdl.toFixed(1)} mg/dL</span>
              </div>
              <div className="flex justify-between">
                <span>mmol/L:</span>
                <span className="font-bold">{result.mmoll.toFixed(2)} mmol/L</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

