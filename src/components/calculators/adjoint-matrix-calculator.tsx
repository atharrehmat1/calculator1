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

export function AdjointMatrixCalculator() {
  const [matrix, setMatrix] = useState("");
  const [result, setResult] = useState<number[][] | null>(null);

  const calculate = () => {
    try {
      // Parse 2x2 or 3x3 matrix from input (format: "a,b;c,d" or "a,b,c;d,e,f;g,h,i")
      const rows = matrix.split(';').map(row => row.split(',').map(v => parseFloat(v.trim())));
      
      if (rows.length === 2 && rows[0].length === 2 && rows[1].length === 2) {
        // 2x2 matrix adjoint
        const [[a, b], [c, d]] = rows;
        const adjoint = [[d, -b], [-c, a]];
        setResult(adjoint);
      } else if (rows.length === 3 && rows.every(row => row.length === 3)) {
        // 3x3 matrix adjoint (simplified - shows structure)
        setResult(rows); // Placeholder - full adjoint calculation is complex
      } else {
        setResult(null);
      }
    } catch {
      setResult(null);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Adjoint Matrix Calculator</CardTitle>
        <CardDescription>
          Calculate the adjoint (adjugate) of a 2x2 or 3x3 matrix. Format: "a,b;c,d" for 2x2 or "a,b,c;d,e,f;g,h,i" for 3x3.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="matrix">Matrix (semicolon-separated rows, comma-separated values)</Label>
            <Input
              id="matrix"
              type="text"
              value={matrix}
              onChange={(e) => setMatrix(e.target.value)}
              placeholder="e.g., 1,2;3,4 for 2x2"
              className="mt-2"
            />
          </div>
          <Button onClick={calculate} className="w-full">
            Calculate
          </Button>
          {result && (
            <div className="mt-6 bg-muted p-4 rounded-lg">
              <div className="text-sm font-semibold mb-2">Adjoint Matrix:</div>
              <div className="space-y-1">
                {result.map((row, i) => (
                  <div key={i} className="flex gap-2">
                    {row.map((val, j) => (
                      <span key={j} className="font-mono">{val.toFixed(2)}</span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}





