"use client";

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Calculator, FunctionSquare, History, Delete, X, Trash2 } from 'lucide-react';
import { useTheme } from 'next-themes';

const factorial = (n: number): number => {
  if (n < 0) return NaN;
  if (n === 0) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
};

type CalculatorMode = 'basic' | 'scientific';

type HistoryItem = {
  input: string;
  result: string;
};

export function AdvancedCalculator() {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [expression, setExpression] = useState('');
  const [display, setDisplay] = useState('0');
  const [result, setResult] = useState<string | null>(null);
  const [inputExpression, setInputExpression] = useState<string>('');
  const [liveResult, setLiveResult] = useState<string | null>(null);
  const [showFinalResult, setShowFinalResult] = useState(false);
  const [mode, setMode] = useState<CalculatorMode>('basic');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Handle hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && (resolvedTheme === 'dark' || theme === 'dark');

  // Helper function to evaluate expression
  const evaluateExpression = (expr: string): string | null => {
    if (!expr || expr === '') return null;
    try {
      let evalExpr = expr
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/π/g, 'Math.PI')
        .replace(/(?<!Math\.)e(?!xp)/g, 'Math.E')
        .replace(/sin\(/g, 'Math.sin((Math.PI/180)*')
        .replace(/cos\(/g, 'Math.cos((Math.PI/180)*')
        .replace(/tan\(/g, 'Math.tan((Math.PI/180)*')
        .replace(/ln\(/g, 'Math.log(')
        .replace(/log\(/g, 'Math.log10(')
        .replace(/√\(/g, 'Math.sqrt(')
        .replace(/√/g, 'Math.sqrt(');
      
      if (evalExpr.includes('^')) {
        evalExpr = evalExpr.replace(/(\d+(?:\.\d+)?)\^(\d+(?:\.\d+)?)/g, 'Math.pow($1, $2)');
      }
      if (evalExpr.includes('!')) {
        evalExpr = evalExpr.replace(/(\d+)!/g, (match, num) => String(factorial(Number(num))));
      }
      if (evalExpr.includes('²')) {
        evalExpr = evalExpr.replace(/\(([^)]+)\)²/g, 'Math.pow($1, 2)');
        evalExpr = evalExpr.replace(/(\d+(?:\.\d+)?)²/g, 'Math.pow($1, 2)');
      }

      const calculatedResult = eval(evalExpr);
      if (typeof calculatedResult === 'number' && !isNaN(calculatedResult) && isFinite(calculatedResult)) {
        return calculatedResult % 1 === 0 
          ? calculatedResult.toString() 
          : calculatedResult.toFixed(10).replace(/\.?0+$/, '');
      }
      return null;
    } catch {
      return null;
    }
  };

  const handleButtonClick = (value: string) => {
    try {
      switch (value) {
        case 'C':
          setExpression('');
          setDisplay('0');
          setResult(null);
          setInputExpression('');
          setLiveResult(null);
          setShowFinalResult(false);
          break;
        case '←':
        case 'DEL':
          if (expression.length > 0) {
            const newExpression = expression.slice(0, -1);
            setExpression(newExpression);
            if (newExpression === '') {
              setDisplay('0');
              setResult(null);
              setInputExpression('');
              setLiveResult(null);
              setShowFinalResult(false);
            } else if (showFinalResult) {
              // If editing after showing final result, switch to live preview mode
              setShowFinalResult(false);
              setResult(null);
              setInputExpression('');
            }
          }
          break;
        case '=':
          const currentInput = expression;
          const calculatedResult = evaluateExpression(expression);
          
          if (calculatedResult !== null) {
            setDisplay(calculatedResult);
            setResult(calculatedResult);
            setInputExpression(currentInput);
            setShowFinalResult(true);
            setLiveResult(null);
            
            // Add to history (keep only last 10)
            setHistory((prev) => {
              const newHistory = [{ input: currentInput, result: calculatedResult }, ...prev];
              return newHistory.slice(0, 10);
            });
            
            setExpression(calculatedResult);
          } else {
            setDisplay('Error');
            setResult(null);
            setInputExpression('');
            setExpression('');
            setLiveResult(null);
            setShowFinalResult(false);
          }
          break;
        case 'sin':
        case 'cos':
        case 'tan':
        case 'ln':
        case 'log':
        case '√':
          setExpression((prev) => prev + value + '(');
          break;
        case 'π':
        case 'e':
          setExpression((prev) => prev + value);
          break;
        case 'x²':
          setExpression((prev) => {
            if (prev === '') return '0²';
            return `(${prev})²`;
          });
          break;
        case 'x!':
          setExpression((prev) => {
            if (prev === '') return '0!';
            return `${prev}!`;
          });
          break;
        case 'x^y':
          setExpression((prev) => prev + '^');
          break;
        case 'e^x':
          setExpression((prev) => {
            if (prev === '') return 'Math.exp(0)';
            return `Math.exp(${prev})`;
          });
          break;
        case '1/x':
          setExpression((prev) => {
            if (prev === '') return '1/';
            return `1/(${prev})`;
          });
          break;
        case '|x|':
          setExpression((prev) => {
            if (prev === '') return 'Math.abs(0)';
            return `Math.abs(${prev})`;
          });
          break;
        case 'Rad':
          // Toggle between Rad and Deg (for now just add Rad indicator)
          break;
        case '÷':
        case '×':
        case '-':
        case '+':
        case '.':
        case '(':
        case ')':
        case '^':
        case '%':
          if (expression === '' && value !== '-' && value !== '(' && value !== '%') return;
          // If we have a final result and user is typing an operator, continue from result
          if (showFinalResult && result !== null) {
            // Continue from the result - hide the result, keep expression
            setShowFinalResult(false);
            setResult(null);
            setInputExpression('');
            setExpression((prev) => prev + value);
          } else {
            setExpression((prev) => prev + value);
          }
          break;
        case '+/-':
          if (expression === '') {
            setExpression('-');
          } else {
            setExpression((prev) => {
              if (prev.startsWith('-')) {
                return prev.slice(1);
              } else {
                return '-' + prev;
              }
            });
          }
          setShowFinalResult(false);
          break;
        default: // Numbers
          if (display === 'Error') {
            // If error, start fresh
            setExpression(value);
            setResult(null);
            setInputExpression('');
            setLiveResult(null);
            setShowFinalResult(false);
          } else if (showFinalResult && result !== null) {
            // If we just calculated a result and user types a number, start fresh
            setExpression(value);
            setResult(null);
            setInputExpression('');
            setLiveResult(null);
            setShowFinalResult(false);
          } else if (display === '0' && value !== '.') {
            setExpression(value);
            setResult(null);
            setShowFinalResult(false);
          } else {
            // Continue typing
            if (result !== null) {
              // If result exists but we're continuing, clear result state
              setResult(null);
              setInputExpression('');
            }
            setShowFinalResult(false);
            setExpression((prev) => prev + value);
          }
      }
    } catch (error) {
      setDisplay('Error');
      setExpression('');
    }
  };

  // Update display and compute live result while typing
  useEffect(() => {
    if (expression === '') {
      setDisplay('0');
      setLiveResult(null);
    } else if (!showFinalResult) {
      // Show expression while typing
      setDisplay(expression.replace(/\*/g, '×').replace(/\//g, '÷'));
      // Compute live preview result
      const preview = evaluateExpression(expression);
      setLiveResult(preview);
    }
    // If showFinalResult is true, display is already set to the result
  }, [expression, showFinalResult]);

  // Basic mode buttons
  const basicButtons = [
    { value: 'C', label: 'C', type: 'operator' }, // C is orange in iOS
    { value: '()', label: '()', type: 'function' },
    { value: '%', label: '%', type: 'function' },
    { value: '÷', label: '÷', type: 'operator' },
    { value: '7', label: '7', type: 'number' },
    { value: '8', label: '8', type: 'number' },
    { value: '9', label: '9', type: 'number' },
    { value: '×', label: '×', type: 'operator' },
    { value: '4', label: '4', type: 'number' },
    { value: '5', label: '5', type: 'number' },
    { value: '6', label: '6', type: 'number' },
    { value: '-', label: '-', type: 'operator' },
    { value: '1', label: '1', type: 'number' },
    { value: '2', label: '2', type: 'number' },
    { value: '3', label: '3', type: 'number' },
    { value: '+', label: '+', type: 'operator' },
    { value: '+/-', label: '+/-', type: 'function' },
    { value: '0', label: '0', type: 'number' },
    { value: '.', label: '.', type: 'number' },
    { value: '=', label: '=', type: 'equals' },
  ];

  // Scientific mode buttons
  const scientificButtons = [
    // Row 1: x!, Rad, √, |x|
    { value: 'x!', label: 'x!', type: 'function' },
    { value: 'Rad', label: 'Rad', type: 'function' },
    { value: '√', label: '√', type: 'function' },
    { value: '|x|', label: '|x|', type: 'function' },
    // Row 2: sin, cos, tan, π
    { value: 'sin', label: 'sin', type: 'function' },
    { value: 'cos', label: 'cos', type: 'function' },
    { value: 'tan', label: 'tan', type: 'function' },
    { value: 'π', label: 'π', type: 'function' },
    // Row 3: ln, log, 1/x, e
    { value: 'ln', label: 'ln', type: 'function' },
    { value: 'log', label: 'log', type: 'function' },
    { value: '1/x', label: '1/x', type: 'function' },
    { value: 'e', label: 'e', type: 'function' },
    // Row 4: e^x, x², x^y, %
    { value: 'e^x', label: 'e^x', type: 'function' },
    { value: 'x²', label: 'x²', type: 'function' },
    { value: 'x^y', label: 'x^y', type: 'function' },
    { value: '%', label: '%', type: 'function' },
    // Row 5: C, (, ), +
    { value: 'C', label: 'C', type: 'operator' },
    { value: '(', label: '(', type: 'function' },
    { value: ')', label: ')', type: 'function' },
    { value: '+', label: '+', type: 'operator' },
    // Row 6: 7, 8, 9, ÷
    { value: '7', label: '7', type: 'number' },
    { value: '8', label: '8', type: 'number' },
    { value: '9', label: '9', type: 'number' },
    { value: '÷', label: '÷', type: 'operator' },
    // Row 7: 4, 5, 6, ×
    { value: '4', label: '4', type: 'number' },
    { value: '5', label: '5', type: 'number' },
    { value: '6', label: '6', type: 'number' },
    { value: '×', label: '×', type: 'operator' },
    // Row 8: 1, 2, 3, -
    { value: '1', label: '1', type: 'number' },
    { value: '2', label: '2', type: 'number' },
    { value: '3', label: '3', type: 'number' },
    { value: '-', label: '-', type: 'operator' },
    // Row 9: +/-, 0, ., =
    { value: '+/-', label: '+/-', type: 'function' },
    { value: '0', label: '0', type: 'number' },
    { value: '.', label: '.', type: 'number' },
    { value: '=', label: '=', type: 'equals' },
  ];

  const getButtonClassName = (type: string, value?: string) => {
    if (isDark) {
      // Dark mode colors with greenish theme
      switch (type) {
        case 'number':
          return 'bg-[#2a2a2a] hover:bg-[#353535] active:bg-[#1f1f1f] text-white';
        case 'operator':
          return 'bg-primary hover:bg-primary/90 active:bg-primary/80 text-primary-foreground';
        case 'function':
          return 'bg-[#3a3a3a] hover:bg-[#454545] active:bg-[#2f2f2f] text-white';
        case 'equals':
          return 'bg-primary hover:bg-primary/90 active:bg-primary/80 text-primary-foreground';
        case 'empty':
          return 'bg-transparent';
        default:
          return 'bg-[#2a2a2a] hover:bg-[#353535] text-white';
      }
    } else {
      // Light mode colors with greenish theme - white/light backgrounds
      switch (type) {
        case 'number':
          return 'bg-[#f5f5f5] hover:bg-[#e8e8e8] active:bg-[#dcdcdc] text-foreground';
        case 'operator':
          return 'bg-primary hover:bg-primary/90 active:bg-primary/80 text-primary-foreground';
        case 'function':
          return 'bg-[#e8e8e8] hover:bg-[#dcdcdc] active:bg-[#d0d0d0] text-foreground';
        case 'equals':
          return 'bg-primary hover:bg-primary/90 active:bg-primary/80 text-primary-foreground';
        case 'empty':
          return 'bg-transparent';
        default:
          return 'bg-[#f5f5f5] hover:bg-[#e8e8e8] text-foreground';
      }
    }
  };

  const handleParentheses = () => {
    const openCount = (expression.match(/\(/g) || []).length;
    const closeCount = (expression.match(/\)/g) || []).length;
    if (openCount > closeCount) {
      setExpression((prev) => prev + ')');
    } else {
      setExpression((prev) => prev + '(');
    }
  };

  const buttons = mode === 'basic' ? basicButtons : scientificButtons;

  if (!mounted) {
    return (
      <div className="w-full max-w-sm mx-auto">
        <div className="bg-card rounded-3xl overflow-hidden shadow-2xl min-h-[600px]" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className={cn(
        'rounded-3xl overflow-hidden shadow-2xl border transition-all duration-300 ease-in-out',
        isDark 
          ? 'bg-[#1a1a1a] border-border' 
          : 'bg-white border-border'
      )}>
        {/* Display Area */}
        <div className={cn(
          'px-6 py-6 min-h-[140px] flex flex-col justify-end transition-all duration-300 ease-in-out',
          isDark ? 'bg-[#1a1a1a]' : 'bg-white'
        )}>
          <div className="text-right">
            {showFinalResult && inputExpression ? (
              // After pressing '=' - show input small, result big
              <>
                <div className={cn(
                  'text-xl font-light mb-1 break-all leading-tight opacity-70',
                  isDark ? 'text-gray-400' : 'text-gray-600'
                )}>
                  {inputExpression.length > 20 ? (
                    <div className="text-lg">{inputExpression}</div>
                  ) : (
                    inputExpression
                  )}
                </div>
                <div className={cn(
                  'text-5xl font-light mb-2 break-all leading-tight',
                  isDark ? 'text-white' : 'text-foreground'
                )}>
                  {display.length > 12 ? (
                    <div className="text-3xl">{display}</div>
                  ) : (
                    display
                  )}
                </div>
              </>
            ) : (
              // While typing - show expression big, live result small below
              <>
                <div className={cn(
                  'text-5xl font-light mb-2 break-all leading-tight',
                  isDark ? 'text-white' : 'text-foreground'
                )}>
                  {display.length > 12 ? (
                    <div className="text-3xl">{display}</div>
                  ) : (
                    display
                  )}
                </div>
                {liveResult && expression !== liveResult && (
                  <div className={cn(
                    'text-xl font-light break-all leading-tight opacity-60',
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  )}>
                    = {liveResult}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Mode Toggle, History, and Delete */}
        <div className="px-4 pb-2 flex gap-2 transition-all duration-300 ease-in-out">
          <button
            onClick={() => setMode(mode === 'basic' ? 'scientific' : 'basic')}
            className={cn(
              'py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-300 ease-in-out flex items-center justify-center gap-2',
              isDark
                ? 'bg-[#2a2a2a] text-foreground hover:bg-[#353535]'
                : 'bg-muted text-foreground hover:bg-muted/80'
            )}
          >
            {mode === 'basic' ? (
              <>
                <FunctionSquare className="h-4 w-4" />
                Scientific
              </>
            ) : (
              <>
                <Calculator className="h-4 w-4" />
                Basic
              </>
            )}
          </button>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className={cn(
              'py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-300 ease-in-out flex items-center justify-center gap-2',
              showHistory
                ? 'bg-primary text-primary-foreground'
                : isDark
                  ? 'bg-[#2a2a2a] text-foreground hover:bg-[#353535]'
                  : 'bg-muted text-foreground hover:bg-muted/80'
            )}
          >
            <History className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleButtonClick('←')}
            className={cn(
              'py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-300 ease-in-out flex items-center justify-center gap-2 ml-auto',
              isDark
                ? 'bg-[#2a2a2a] text-foreground hover:bg-[#353535]'
                : 'bg-muted text-foreground hover:bg-muted/80'
            )}
          >
            <Delete className="h-4 w-4" />
          </button>
        </div>

        {/* Button Grid or History Panel */}
        {showHistory ? (
          // Inline History Panel
          <div className={cn(
            'p-4 pb-6 transition-all duration-300 ease-in-out',
            mode === 'basic' ? 'min-h-[340px]' : 'min-h-[420px]'
          )}>
            {/* History Header */}
            <div className="flex items-center justify-between mb-3">
              <span className={cn(
                'text-sm font-medium',
                isDark ? 'text-gray-400' : 'text-gray-600'
              )}>
                History ({history.length})
              </span>
              <div className="flex gap-2">
                {history.length > 0 && (
                  <button
                    onClick={() => setHistory([])}
                    className={cn(
                      'p-2 rounded-lg text-sm transition-colors flex items-center gap-1',
                      isDark
                        ? 'text-red-400 hover:bg-red-400/10'
                        : 'text-red-500 hover:bg-red-50'
                    )}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Clear</span>
                  </button>
                )}
                <button
                  onClick={() => setShowHistory(false)}
                  className={cn(
                    'p-2 rounded-lg transition-colors',
                    isDark
                      ? 'text-gray-400 hover:bg-gray-700'
                      : 'text-gray-500 hover:bg-gray-100'
                  )}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            {/* History List */}
            <div className={cn(
              'overflow-y-auto pr-1',
              mode === 'basic' ? 'max-h-[280px]' : 'max-h-[360px]'
            )}>
              {history.length === 0 ? (
                <div className={cn(
                  'text-center py-12',
                  isDark ? 'text-gray-500' : 'text-gray-400'
                )}>
                  No calculations yet
                </div>
              ) : (
                <div className="space-y-2">
                  {history.map((item, index) => (
                    <div
                      key={index}
                      className={cn(
                        'p-3 rounded-lg cursor-pointer transition-colors',
                        isDark
                          ? 'bg-[#2a2a2a] hover:bg-[#353535]'
                          : 'bg-gray-50 hover:bg-gray-100'
                      )}
                      onClick={() => {
                        setExpression(item.result);
                        setDisplay(item.result);
                        setResult(item.result);
                        setInputExpression(item.input);
                        setShowFinalResult(true);
                        setLiveResult(null);
                        setShowHistory(false);
                      }}
                    >
                      <div className={cn(
                        'text-sm break-all',
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      )}>
                        {item.input}
                      </div>
                      <div className={cn(
                        'text-lg font-medium break-all',
                        isDark ? 'text-white' : 'text-foreground'
                      )}>
                        = {item.result}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          // Button Grid
          <div className={cn(
            'transition-all duration-300 ease-in-out',
            mode === 'basic' ? 'p-2 pb-6' : 'p-1.5 pb-5'
          )}>
            <div className={cn(
              'grid transition-all duration-300 ease-in-out',
              mode === 'basic' 
                ? 'grid-cols-4 gap-2' 
                : 'grid-cols-4 gap-1'
            )}>
              {buttons.map((btn, index) => {
                if (btn.type === 'empty') {
                  return <div key={`empty-${index}`} className="col-span-1" />;
                }
                
                const span = btn.span || 1;
                
                return (
                  <button
                    key={`${btn.value}-${index}`}
                    onClick={() => {
                      if (btn.value === '()') {
                        handleParentheses();
                      } else if (btn.value !== '') {
                        handleButtonClick(btn.value);
                      }
                    }}
                    className={cn(
                      'rounded-full font-medium transition-all duration-150',
                      'active:scale-95 focus:outline-none',
                      mode === 'basic'
                        ? 'h-16 text-2xl'
                        : 'h-10 text-sm',
                      getButtonClassName(btn.type, btn.value),
                      span === 2 && 'col-span-2',
                      span === 4 && 'col-span-4'
                    )}
                    disabled={btn.value === ''}
                  >
                    {btn.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
