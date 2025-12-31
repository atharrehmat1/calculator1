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

export function ACFTCalculator() {
  const [deadlift, setDeadlift] = useState("");
  const [powerThrow, setPowerThrow] = useState("");
  const [handRelease, setHandRelease] = useState("");
  const [sprintDrag, setSprintDrag] = useState("");
  const [plank, setPlank] = useState("");
  const [run, setRun] = useState("");
  const [result, setResult] = useState<{
    totalScore: number;
    grade: string;
  } | null>(null);

  const calculate = () => {
    const dl = parseFloat(deadlift) || 0;
    const pt = parseFloat(powerThrow) || 0;
    const hr = parseFloat(handRelease) || 0;
    const sd = parseFloat(sprintDrag) || 0;
    const p = parseFloat(plank) || 0;
    const r = parseFloat(run) || 0;
    
    if (dl > 0 || pt > 0 || hr > 0 || sd > 0 || p > 0 || r > 0) {
      // Simplified scoring (actual ACFT has complex scoring tables)
      // Each event scored 0-100 points, total 600 points
      const totalScore = Math.min(600, (dl + pt + hr + sd + p + r));
      
      let grade = "";
      if (totalScore >= 540) {
        grade = "Excellent";
      } else if (totalScore >= 480) {
        grade = "Good";
      } else if (totalScore >= 360) {
        grade = "Passing";
      } else {
        grade = "Needs Improvement";
      }
      
      setResult({
        totalScore,
        grade,
      });
    } else {
      setResult(null);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>ACFT Calculator</CardTitle>
        <CardDescription>
          Calculate your Army Combat Fitness Test (ACFT) score and overall performance.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="deadlift">Deadlift Score (0-100)</Label>
            <Input
              id="deadlift"
              type="number"
              value={deadlift}
              onChange={(e) => setDeadlift(e.target.value)}
              placeholder="Enter deadlift score"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="powerThrow">Power Throw Score (0-100)</Label>
            <Input
              id="powerThrow"
              type="number"
              value={powerThrow}
              onChange={(e) => setPowerThrow(e.target.value)}
              placeholder="Enter power throw score"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="handRelease">Hand Release Push-ups Score (0-100)</Label>
            <Input
              id="handRelease"
              type="number"
              value={handRelease}
              onChange={(e) => setHandRelease(e.target.value)}
              placeholder="Enter hand release score"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="sprintDrag">Sprint-Drag-Carry Score (0-100)</Label>
            <Input
              id="sprintDrag"
              type="number"
              value={sprintDrag}
              onChange={(e) => setSprintDrag(e.target.value)}
              placeholder="Enter sprint-drag-carry score"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="plank">Plank Score (0-100)</Label>
            <Input
              id="plank"
              type="number"
              value={plank}
              onChange={(e) => setPlank(e.target.value)}
              placeholder="Enter plank score"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="run">2-Mile Run Score (0-100)</Label>
            <Input
              id="run"
              type="number"
              value={run}
              onChange={(e) => setRun(e.target.value)}
              placeholder="Enter 2-mile run score"
              className="mt-2"
            />
          </div>
          <Button onClick={calculate} className="w-full">
            Calculate
          </Button>
          {result && (
            <div className="mt-6 bg-muted p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span>Total ACFT Score:</span>
                <span className="font-bold text-lg">{result.totalScore.toFixed(0)} / 600</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span>Grade:</span>
                <span className="font-bold">{result.grade}</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

