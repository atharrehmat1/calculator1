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

export function APRICalculator() {
  const [ast, setAst] = useState("");
  const [platelets, setPlatelets] = useState("");
  const [result, setResult] = useState<{
    apri: number;
    interpretation: string;
  } | null>(null);

  const calculate = () => {
    const a = parseFloat(ast);
    const p = parseFloat(platelets);
    
    if (a > 0 && p > 0) {
      // APRI = (AST / ULN) / Platelets × 100
      // ULN (Upper Limit Normal) for AST = 40 U/L
      const uln = 40;
      const apri = ((a / uln) / p) * 100;
      
      let interpretation = "";
      if (apri < 0.5) {
        interpretation = "No significant fibrosis (F0-F1)";
      } else if (apri < 1.5) {
        interpretation = "Significant fibrosis possible (F2-F3)";
      } else {
        interpretation = "Cirrhosis likely (F4)";
      }
      
      setResult({
        apri,
        interpretation,
      });
    } else {
      setResult(null);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>APRI Calculator</CardTitle>
        <CardDescription>
          Calculate AST to Platelet Ratio Index (APRI) to assess liver fibrosis and cirrhosis risk.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="ast">AST (U/L)</Label>
            <Input
              id="ast"
              type="number"
              step="0.1"
              value={ast}
              onChange={(e) => setAst(e.target.value)}
              placeholder="Enter AST level"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="platelets">Platelet Count (×10³/μL)</Label>
            <Input
              id="platelets"
              type="number"
              step="0.1"
              value={platelets}
              onChange={(e) => setPlatelets(e.target.value)}
              placeholder="Enter platelet count"
              className="mt-2"
            />
          </div>
          <Button onClick={calculate} className="w-full">
            Calculate
          </Button>
          {result && (
            <div className="mt-6 bg-muted p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span>APRI Score:</span>
                <span className="font-bold text-lg">{result.apri.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span>Interpretation:</span>
                <span className="font-bold">{result.interpretation}</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

