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

export function AlvaradoScoreCalculator() {
  const [migration, setMigration] = useState("0");
  const [anorexia, setAnorexia] = useState("0");
  const [nausea, setNausea] = useState("0");
  const [tenderness, setTenderness] = useState("0");
  const [rebound, setRebound] = useState("0");
  const [elevatedTemp, setElevatedTemp] = useState("0");
  const [leukocytosis, setLeukocytosis] = useState("0");
  const [shiftLeft, setShiftLeft] = useState("0");
  const [result, setResult] = useState<{
    score: number;
    probability: string;
  } | null>(null);

  const calculate = () => {
    const mig = parseFloat(migration);
    const anor = parseFloat(anorexia);
    const nau = parseFloat(nausea);
    const tend = parseFloat(tenderness);
    const reb = parseFloat(rebound);
    const temp = parseFloat(elevatedTemp);
    const leuk = parseFloat(leukocytosis);
    const shift = parseFloat(shiftLeft);
    
    const score = mig + anor + nau + tend + reb + temp + leuk + shift;
    
    let probability = "";
    if (score <= 4) {
      probability = "Low probability - observation";
    } else if (score <= 6) {
      probability = "Moderate probability - consider surgery";
    } else {
      probability = "High probability - surgery recommended";
    }
    
    setResult({
      score,
      probability,
    });
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Alvarado Score Calculator</CardTitle>
        <CardDescription>
          Calculate Alvarado score for acute appendicitis diagnosis. Each symptom scored 0-1 or 0-2.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="migration">Migratory pain (0-1)</Label>
            <Input
              id="migration"
              type="number"
              min="0"
              max="1"
              value={migration}
              onChange={(e) => setMigration(e.target.value)}
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="anorexia">Anorexia (0-1)</Label>
            <Input
              id="anorexia"
              type="number"
              min="0"
              max="1"
              value={anorexia}
              onChange={(e) => setAnorexia(e.target.value)}
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="nausea">Nausea/Vomiting (0-1)</Label>
            <Input
              id="nausea"
              type="number"
              min="0"
              max="1"
              value={nausea}
              onChange={(e) => setNausea(e.target.value)}
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="tenderness">RLQ Tenderness (0-2)</Label>
            <Input
              id="tenderness"
              type="number"
              min="0"
              max="2"
              value={tenderness}
              onChange={(e) => setTenderness(e.target.value)}
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="rebound">Rebound tenderness (0-1)</Label>
            <Input
              id="rebound"
              type="number"
              min="0"
              max="1"
              value={rebound}
              onChange={(e) => setRebound(e.target.value)}
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="elevatedTemp">Elevated temperature (0-1)</Label>
            <Input
              id="elevatedTemp"
              type="number"
              min="0"
              max="1"
              value={elevatedTemp}
              onChange={(e) => setElevatedTemp(e.target.value)}
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="leukocytosis">Leukocytosis (0-2)</Label>
            <Input
              id="leukocytosis"
              type="number"
              min="0"
              max="2"
              value={leukocytosis}
              onChange={(e) => setLeukocytosis(e.target.value)}
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="shiftLeft">Shift to left (0-1)</Label>
            <Input
              id="shiftLeft"
              type="number"
              min="0"
              max="1"
              value={shiftLeft}
              onChange={(e) => setShiftLeft(e.target.value)}
              className="mt-2"
            />
          </div>
          <Button onClick={calculate} className="w-full">
            Calculate
          </Button>
          {result && (
            <div className="mt-6 bg-muted p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span>Alvarado Score:</span>
                <span className="font-bold text-lg">{result.score} / 10</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span>Appendicitis Probability:</span>
                <span className="font-bold">{result.probability}</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

