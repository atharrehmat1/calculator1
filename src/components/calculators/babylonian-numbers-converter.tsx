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

function decimalToBabylonian(decimal: number): string {
  if (decimal === 0) return "∅";
  
  let result = "";
  let num = Math.floor(decimal);
  
  // Babylonian numerals use base 60
  const symbols = {
    1: "|",
    10: "<",
  };
  
  // Simplified conversion (full Babylonian system is complex)
  while (num > 0) {
    if (num >= 10) {
      result = symbols[10] + result;
      num -= 10;
    } else {
      result = symbols[1] + result;
      num -= 1;
    }
  }
  
  return result || "∅";
}

export function BabylonianNumbersConverter() {
  const [value, setValue] = useState("");
  const [direction, setDirection] = useState("toBabylonian");
  const [result, setResult] = useState<string | number | null>(null);

  const calculate = () => {
    if (direction === "toBabylonian") {
      const num = parseFloat(value);
      if (!isNaN(num) && num >= 0) {
        setResult(decimalToBabylonian(num));
      } else {
        setResult(null);
      }
    } else {
      // From Babylonian to decimal (simplified)
      setResult("Conversion from Babylonian numerals is complex and requires specialized parsing.");
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Babylonian Numbers Converter</CardTitle>
        <CardDescription>
          Convert decimal numbers to Babylonian numerals (base 60 system). Simplified version.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="direction">Conversion Direction</Label>
            <Select value={direction} onValueChange={setDirection}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select direction" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="toBabylonian">Decimal to Babylonian</SelectItem>
                <SelectItem value="fromBabylonian">Babylonian to Decimal</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="value">{direction === "toBabylonian" ? "Decimal Number" : "Babylonian Number"}</Label>
            <Input
              id="value"
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={direction === "toBabylonian" ? "Enter decimal number" : "Enter Babylonian number"}
              className="mt-2"
            />
          </div>
          <Button onClick={calculate} className="w-full">
            Convert
          </Button>
          {result !== null && (
            <div className="mt-6 bg-muted p-4 rounded-lg">
              <div className="flex justify-between">
                <span>Result:</span>
                <span className="font-bold text-lg">{typeof result === "string" ? result : result.toString()}</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}





