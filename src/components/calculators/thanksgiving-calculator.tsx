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

export function ThanksgivingCalculator() {
  const [guests, setGuests] = useState("");
  const [result, setResult] = useState<{
    turkey: number;
    stuffing: number;
    mashedPotatoes: number;
    greenBeans: number;
    cranberrySauce: number;
    pie: number;
  } | null>(null);

  const calculate = () => {
    const numGuests = parseFloat(guests);
    
    if (numGuests > 0) {
      // Standard Thanksgiving serving sizes per person
      const turkey = numGuests * 1.5; // 1.5 lbs per person
      const stuffing = numGuests * 0.5; // 0.5 cups per person
      const mashedPotatoes = numGuests * 0.75; // 0.75 cups per person
      const greenBeans = numGuests * 0.5; // 0.5 cups per person
      const cranberrySauce = numGuests * 0.25; // 0.25 cups per person
      const pie = Math.ceil(numGuests / 8); // 1 pie per 8 people
      
      setResult({
        turkey,
        stuffing,
        mashedPotatoes,
        greenBeans,
        cranberrySauce,
        pie,
      });
    } else {
      setResult(null);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Thanksgiving Calculator</CardTitle>
        <CardDescription>
          Calculate the perfect amount of food for your Thanksgiving dinner based on the number of guests.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="guests">Number of Guests</Label>
            <Input
              id="guests"
              type="number"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              placeholder="Enter number of guests"
              className="mt-2"
            />
          </div>
          <Button onClick={calculate} className="w-full">
            Calculate
          </Button>
          {result && (
            <div className="mt-6 bg-muted p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span>Turkey:</span>
                <span className="font-bold">{result.turkey.toFixed(1)} lbs</span>
              </div>
              <div className="flex justify-between">
                <span>Stuffing:</span>
                <span className="font-bold">{result.stuffing.toFixed(1)} cups</span>
              </div>
              <div className="flex justify-between">
                <span>Mashed Potatoes:</span>
                <span className="font-bold">{result.mashedPotatoes.toFixed(1)} cups</span>
              </div>
              <div className="flex justify-between">
                <span>Green Beans:</span>
                <span className="font-bold">{result.greenBeans.toFixed(1)} cups</span>
              </div>
              <div className="flex justify-between">
                <span>Cranberry Sauce:</span>
                <span className="font-bold">{result.cranberrySauce.toFixed(1)} cups</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span>Pies:</span>
                <span className="font-bold">{result.pie} pie(s)</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

