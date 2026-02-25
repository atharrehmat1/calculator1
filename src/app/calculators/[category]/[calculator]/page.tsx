'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Head from 'next/head';
import { api, type Calculator, type RadioOption } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Heart, Radio } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CalculatorInfo } from '@/components/calculator-info';
import { AdvancedCalculator } from '@/components/advanced-calculator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/hooks/use-toast';

export default function CalculatorPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [calculator, setCalculator] = useState<Calculator | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  const [results, setResults] = useState<Record<string, any>>({});
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [loadingLikes, setLoadingLikes] = useState(true);
  const [selectedRadioOption, setSelectedRadioOption] = useState<string>('');
  const [radioOptions, setRadioOptions] = useState<RadioOption[]>([]);
  const [subCalcInputValues, setSubCalcInputValues] = useState<Record<string, Record<string, string>>>({});
  const [subCalcResults, setSubCalcResults] = useState<Record<string, Record<string, any>>>({});

  const categorySlug = params?.category as string;
  const calculatorSlug = params?.calculator as string;

  // Update document meta tags when calculator data changes
  useEffect(() => {
    if (calculator) {
      // Update title
      const title = calculator.meta_title || `${calculator.name} - Free Online Calculator`;
      document.title = title;

      // Update meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      const description = calculator.meta_description ||
        (calculator.description ? calculator.description.replace(/<[^>]*>/g, '').substring(0, 160) : `Use our free ${calculator.name} to calculate results quickly and easily.`);

      if (metaDescription) {
        metaDescription.setAttribute('content', description);
      } else {
        const newMeta = document.createElement('meta');
        newMeta.name = 'description';
        newMeta.content = description;
        document.head.appendChild(newMeta);
      }

      // Update meta keywords
      if (calculator.meta_keywords) {
        let metaKeywords = document.querySelector('meta[name="keywords"]');
        if (metaKeywords) {
          metaKeywords.setAttribute('content', calculator.meta_keywords);
        } else {
          const newMeta = document.createElement('meta');
          newMeta.name = 'keywords';
          newMeta.content = calculator.meta_keywords;
          document.head.appendChild(newMeta);
        }
      }

      // Update Open Graph tags
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) {
        ogTitle.setAttribute('content', title);
      }

      const ogDescription = document.querySelector('meta[property="og:description"]');
      if (ogDescription) {
        ogDescription.setAttribute('content', description);
      }
    }
  }, [calculator]);

  // Fetch calculator data
  useEffect(() => {
    async function fetchCalculator() {
      if (!categorySlug || !calculatorSlug) return;

      try {
        setLoading(true);
        setError(null);

        // First, get the category to find its ID
        const categories = await api.categories.getAll();
        const category = categories.find((c: any) => c.slug === categorySlug);

        if (!category) {
          setError('Category not found');
          setLoading(false);
          return;
        }

        // Fetch calculators for this category
        const calculators = await api.calculators.getAll({
          category_id: category.id,
          is_active: true,
        });

        // Find the calculator by slug
        const calc = calculators.find((c: Calculator) => c.slug === calculatorSlug);

        if (!calc) {
          setError('Calculator not found');
          setLoading(false);
          return;
        }

        // Validate calculator has required fields
        if (!calc.id || !calc.name || !calc.slug) {
          setError('Calculator data is invalid');
          setLoading(false);
          return;
        }

        setCalculator(calc);

        // Check if calculator has radio modes
        if (calc.has_radio_modes && calc.radio_options) {
          let options: RadioOption[] = [];
          try {
            if (Array.isArray(calc.radio_options)) {
              options = calc.radio_options;
            } else if (typeof calc.radio_options === 'string') {
              options = JSON.parse(calc.radio_options);
            }
          } catch (e) {
            options = [];
          }

          setRadioOptions(options);

          // Set first option as default
          if (options.length > 0) {
            setSelectedRadioOption(options[0].id);

            // Initialize input values for the first radio option
            const initialValues: Record<string, string> = {};
            options[0].inputs.forEach((input: any) => {
              const inputName = input.name || input.label || input.key || `input_${input.id}`;
              initialValues[inputName] = input.defaultValue?.toString() || '';
            });
            setInputValues(initialValues);
          }
        } else {
          // Standard mode - Initialize input values normally
          let inputs: any[] = [];
          try {
            if (calc.inputs) {
              if (Array.isArray(calc.inputs)) {
                inputs = calc.inputs;
              } else if (typeof calc.inputs === 'string') {
                inputs = JSON.parse(calc.inputs);
              }
            }
          } catch (e) {
            inputs = [];
          }

          const initialValues: Record<string, string> = {};
          inputs.forEach((input: any) => {
            const inputName = input.name || input.label || input.key || `input_${input.id}`;
            initialValues[inputName] = input.defaultValue?.toString() || '';
          });
          setInputValues(initialValues);
        }

        // Initialize sub-calculator input values
        if (calc.sub_calculators) {
          let subs: any[] = [];
          try {
            subs = Array.isArray(calc.sub_calculators) ? calc.sub_calculators : JSON.parse(calc.sub_calculators);
          } catch (e) {
            subs = [];
          }
          const subInitialValues: Record<string, Record<string, string>> = {};
          subs.forEach((sub: any) => {
            const vals: Record<string, string> = {};
            (sub.inputs || []).forEach((input: any) => {
              const inputName = input.name || input.label || input.key || `input_${input.id}`;
              vals[inputName] = input.defaultValue?.toString() || '';
            });
            subInitialValues[sub.id] = vals;
          });
          setSubCalcInputValues(subInitialValues);
        }

        // Track view if user is authenticated
        if (user && calc.id) {
          try {
            await api.calculatorInteractions.trackView(calc.id);
          } catch (err) {
            // Silently fail - view tracking is not critical
          }
        }

        // Fetch likes
        if (calc.id) {
          try {
            const likesData = await api.calculatorInteractions.getLikes(calc.id);
            setIsLiked(likesData.isLiked);
            setLikeCount(likesData.likeCount);
          } catch (err) {
            // Error handled silently
          } finally {
            setLoadingLikes(false);
          }
        } else {
          setLoadingLikes(false);
        }
      } catch (err) {
        setError('Failed to load calculator');
        setLoadingLikes(false);
      } finally {
        setLoading(false);
      }
    }

    fetchCalculator();
  }, [categorySlug, calculatorSlug, user]);

  const handleLike = async () => {
    if (!calculator) return;

    // Check authentication
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to like calculators.",
        variant: "destructive",
      });
      router.push('/auth');
      return;
    }

    try {
      const data = await api.calculatorInteractions.toggleLike(calculator.id);
      setIsLiked(data.liked);

      // Refresh like count
      const likesData = await api.calculatorInteractions.getLikes(calculator.id);
      setLikeCount(likesData.likeCount);

      toast({
        title: data.liked ? "Added to favorites!" : "Removed from favorites",
        description: data.liked ? "You can find it in your profile." : "",
      });
    } catch (error: any) {
      if (error.message && error.message.includes('Authentication required')) {
        toast({
          title: "Authentication Required",
          description: "Please log in to like calculators.",
          variant: "destructive",
        });
        router.push('/auth');
      } else {
        toast({
          title: "Error",
          description: "Failed to update like. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const calculateResults = (values: Record<string, string>) => {
    if (!calculator) return;

    try {
      const calculatedResults: Record<string, any> = {};

      // Get inputs and results based on mode (radio or standard)
      let inputs: any[] = [];
      let results: any[] = [];

      if (calculator.has_radio_modes && radioOptions.length > 0 && selectedRadioOption) {
        // Radio mode - get inputs and results from selected option
        const currentOption = radioOptions.find(opt => opt.id === selectedRadioOption);
        if (currentOption) {
          inputs = currentOption.inputs || [];
          results = currentOption.results || [];
        }
      } else {
        // Standard mode - Parse inputs and results if they're strings
        inputs = Array.isArray(calculator.inputs)
          ? calculator.inputs
          : calculator.inputs
            ? JSON.parse(calculator.inputs)
            : [];
        results = Array.isArray(calculator.results)
          ? calculator.results
          : calculator.results
            ? JSON.parse(calculator.results)
            : [];
      }

      if (results.length === 0) return;

      // Convert input values based on their type (preserve strings for text inputs, convert to numbers for number inputs)
      const inputValues: Record<string, number | string> = {};
      inputs.forEach((input: any) => {
        const inputName = input.name || input.label || input.key || `input_${input.id}`;
        const rawValue = values[inputName] || '';
        const key = input.key || inputName;
        const inputType = input.type || 'number';

        if (inputType === 'number') {
          const value = parseFloat(rawValue);
          inputValues[key] = isNaN(value) ? 0 : value;
        } else {
          // For text inputs, preserve the string value
          inputValues[key] = rawValue;
        }
      });

      // Create scope with input values and JavaScript objects/functions
      // Add Math.js function mappings (sqrt, log, sin, etc.) to Math.* equivalents
      const scope: Record<string, any> = {
        ...inputValues,
        Math: Math,
        Number: Number,
        Array: Array,
        String: String,
        Object: Object,
        JSON: JSON,
        Date: Date,
        // Math.js function mappings
        sqrt: (x: number) => Math.sqrt(x),
        abs: (x: number) => Math.abs(x),
        exp: (x: number) => Math.exp(x),
        log: (x: number) => Math.log(x),
        log10: (x: number) => Math.log10(x),
        log2: (x: number) => Math.log2(x),
        sin: (x: number) => Math.sin(x),
        cos: (x: number) => Math.cos(x),
        tan: (x: number) => Math.tan(x),
        asin: (x: number) => Math.asin(x),
        acos: (x: number) => Math.acos(x),
        atan: (x: number) => Math.atan(x),
        atan2: (y: number, x: number) => Math.atan2(y, x),
        sinh: (x: number) => Math.sinh(x),
        cosh: (x: number) => Math.cosh(x),
        tanh: (x: number) => Math.tanh(x),
        round: (x: number) => Math.round(x),
        floor: (x: number) => Math.floor(x),
        ceil: (x: number) => Math.ceil(x),
        min: (...args: number[]) => Math.min(...args),
        max: (...args: number[]) => Math.max(...args),
        pow: (x: number, y: number) => Math.pow(x, y),
        mod: (x: number, y: number) => x % y,
        gcd: (a: number, b: number) => {
          let x = Math.abs(a);
          let y = Math.abs(b);
          while (y !== 0) {
            const temp = y;
            y = x % y;
            x = temp;
          }
          return x;
        },
        lcm: (a: number, b: number) => {
          const gcdFunc = (x: number, y: number) => {
            let num1 = Math.abs(x);
            let num2 = Math.abs(y);
            while (num2 !== 0) {
              const temp = num2;
              num2 = num1 % num2;
              num1 = temp;
            }
            return num1;
          };
          return Math.abs(a * b) / (gcdFunc(a, b) || 1);
        },
        // Date functions
        add_days: (date: string | Date | number, days: number) => {
          try {
            let dateObj: Date;

            // Handle different input types
            if (typeof date === 'string') {
              // Try to parse the date string
              const dateStr = date.trim();
              dateObj = new Date(dateStr);

              // If parsing fails, try alternative formats
              if (isNaN(dateObj.getTime())) {
                // Try common date formats: YYYY-MM-DD, MM/DD/YYYY, etc.
                const formats = [
                  dateStr, // Original
                  dateStr.replace(/\//g, '-'), // Convert slashes to dashes
                  dateStr.replace(/-/g, '/'), // Convert dashes to slashes
                ];

                for (const format of formats) {
                  const parsed = new Date(format);
                  if (!isNaN(parsed.getTime())) {
                    dateObj = parsed;
                    break;
                  }
                }

                if (isNaN(dateObj.getTime())) {
                  throw new Error(`Invalid date format: ${date}`);
                }
              }
            } else if (typeof date === 'number') {
              // Assume it's a timestamp (milliseconds since epoch)
              dateObj = new Date(date);
            } else if (date instanceof Date) {
              dateObj = date;
            } else {
              throw new Error(`Invalid date type: ${typeof date}`);
            }

            // Validate the date
            if (isNaN(dateObj.getTime())) {
              throw new Error(`Invalid date: ${date}`);
            }

            // Add days
            const result = new Date(dateObj);
            result.setDate(result.getDate() + Math.floor(Number(days) || 0));

            return result;
          } catch (error) {
            throw new Error(`add_days failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
          }
        },
        // Punnett Square functions
        compute_punnett: (parent1: string, parent2: string) => {
          // Monohybrid cross (e.g., Aa x Aa)
          const normalizeGenotype = (genotype: string) => {
            return String(genotype || '').trim().replace(/\s+/g, '');
          };

          const p1 = normalizeGenotype(parent1);
          const p2 = normalizeGenotype(parent2);

          if (!p1 || !p2) return 'Invalid genotype';

          // Extract alleles (assume single letter alleles like A, a)
          const getAlleles = (genotype: string) => {
            const alleles: string[] = [];
            for (let i = 0; i < genotype.length; i++) {
              const char = genotype[i];
              if (/[A-Za-z]/.test(char)) {
                alleles.push(char);
              }
            }
            return alleles.length === 2 ? alleles : [genotype[0] || 'A', genotype[1] || 'a'];
          };

          const p1Alleles = getAlleles(p1);
          const p2Alleles = getAlleles(p2);

          // Generate gametes
          const p1Gametes = [...new Set(p1Alleles)];
          const p2Gametes = [...new Set(p2Alleles)];

          // Calculate offspring genotypes and probabilities
          const outcomes: Record<string, number> = {};
          let total = 0;

          for (const g1 of p1Gametes) {
            for (const g2 of p2Gametes) {
              // Sort alleles to normalize genotype (Aa = aA)
              const genotype = [g1, g2].sort().join('');
              outcomes[genotype] = (outcomes[genotype] || 0) + 1;
              total++;
            }
          }

          // Format results
          const results: string[] = [];
          for (const [genotype, count] of Object.entries(outcomes)) {
            const probability = (count / total) * 100;
            results.push(`${genotype}: ${probability.toFixed(1)}%`);
          }

          return results.join(', ');
        },
        compute_dihybrid_punnett: (parent1_genotype: string, parent2_genotype: string) => {
          // Dihybrid cross (e.g., AaBb x AaBb)
          const normalizeGenotype = (genotype: string) => {
            return String(genotype || '').trim().replace(/\s+/g, '');
          };

          const p1 = normalizeGenotype(parent1_genotype);
          const p2 = normalizeGenotype(parent2_genotype);

          if (!p1 || !p2) return 'Invalid genotype';

          // Parse dihybrid genotype (e.g., AaBb -> [A,a] and [B,b])
          const parseDihybrid = (genotype: string) => {
            const upper = genotype.match(/[A-Z]/g) || [];
            const lower = genotype.match(/[a-z]/g) || [];
            const pairs: string[][] = [];

            // Try to pair uppercase with lowercase
            for (let i = 0; i < Math.max(upper.length, lower.length); i++) {
              const u = upper[i] || '';
              const l = lower[i] || '';
              if (u && l) {
                pairs.push([u, l]);
              }
            }

            // If we can't pair, try to extract pairs of 2
            if (pairs.length === 0 && genotype.length >= 4) {
              for (let i = 0; i < genotype.length; i += 2) {
                const pair = genotype.slice(i, i + 2);
                if (pair.length === 2) {
                  pairs.push([pair[0], pair[1]]);
                }
              }
            }

            return pairs.length >= 2 ? pairs : [[genotype[0] || 'A', genotype[1] || 'a'], [genotype[2] || 'B', genotype[3] || 'b']];
          };

          const p1Pairs = parseDihybrid(p1);
          const p2Pairs = parseDihybrid(p2);

          if (p1Pairs.length < 2 || p2Pairs.length < 2) return 'Invalid dihybrid genotype';

          // Generate gametes (4 possible combinations for each parent)
          const getGametes = (pairs: string[][]) => {
            const gametes: string[] = [];
            const [pair1, pair2] = pairs;
            for (const a1 of pair1) {
              for (const a2 of pair2) {
                gametes.push(a1 + a2);
              }
            }
            return gametes;
          };

          const p1Gametes = getGametes(p1Pairs);
          const p2Gametes = getGametes(p2Pairs);

          // Calculate offspring genotypes
          const outcomes: Record<string, number> = {};
          let total = 0;

          for (const g1 of p1Gametes) {
            for (const g2 of p2Gametes) {
              // Combine gametes to form genotype
              const genotype = g1 + g2;
              outcomes[genotype] = (outcomes[genotype] || 0) + 1;
              total++;
            }
          }

          // Format results (show unique genotypes with probabilities)
          const results: string[] = [];
          for (const [genotype, count] of Object.entries(outcomes)) {
            const probability = (count / total) * 100;
            results.push(`${genotype}: ${probability.toFixed(1)}%`);
          }

          return results.join(', ');
        },
        compute_trihybrid_punnett: (parent1_genotype: string, parent2_genotype: string) => {
          // Trihybrid cross (e.g., AaBbCc x AaBbCc)
          const normalizeGenotype = (genotype: string) => {
            return String(genotype || '').trim().replace(/\s+/g, '');
          };

          const p1 = normalizeGenotype(parent1_genotype);
          const p2 = normalizeGenotype(parent2_genotype);

          if (!p1 || !p2) return 'Invalid genotype';

          // Parse trihybrid genotype (e.g., AaBbCc -> [A,a], [B,b], [C,c])
          const parseTrihybrid = (genotype: string) => {
            const pairs: string[][] = [];

            // Try to extract pairs of 2
            for (let i = 0; i < genotype.length; i += 2) {
              const pair = genotype.slice(i, i + 2);
              if (pair.length === 2) {
                pairs.push([pair[0], pair[1]]);
              }
            }

            // If we don't have 3 pairs, try to infer
            if (pairs.length < 3 && genotype.length >= 6) {
              pairs.length = 0;
              for (let i = 0; i < 6; i += 2) {
                const pair = genotype.slice(i, i + 2);
                if (pair.length === 2) {
                  pairs.push([pair[0], pair[1]]);
                }
              }
            }

            return pairs.length >= 3 ? pairs : [
              [genotype[0] || 'A', genotype[1] || 'a'],
              [genotype[2] || 'B', genotype[3] || 'b'],
              [genotype[4] || 'C', genotype[5] || 'c']
            ];
          };

          const p1Pairs = parseTrihybrid(p1);
          const p2Pairs = parseTrihybrid(p2);

          if (p1Pairs.length < 3 || p2Pairs.length < 3) return 'Invalid trihybrid genotype';

          // Generate gametes (8 possible combinations for each parent)
          const getGametes = (pairs: string[][]) => {
            const gametes: string[] = [];
            const [pair1, pair2, pair3] = pairs;
            for (const a1 of pair1) {
              for (const a2 of pair2) {
                for (const a3 of pair3) {
                  gametes.push(a1 + a2 + a3);
                }
              }
            }
            return gametes;
          };

          const p1Gametes = getGametes(p1Pairs);
          const p2Gametes = getGametes(p2Pairs);

          // Calculate offspring genotypes
          const outcomes: Record<string, number> = {};
          let total = 0;

          for (const g1 of p1Gametes) {
            for (const g2 of p2Gametes) {
              // Combine gametes to form genotype
              const genotype = g1 + g2;
              outcomes[genotype] = (outcomes[genotype] || 0) + 1;
              total++;
            }
          }

          // Format results (show unique genotypes with probabilities)
          const results: string[] = [];
          for (const [genotype, count] of Object.entries(outcomes)) {
            const probability = (count / total) * 100;
            results.push(`${genotype}: ${probability.toFixed(1)}%`);
          }

          return results.join(', ');
        },
        // Length function for arrays, strings, and objects
        length: (value: any) => {
          if (value === null || value === undefined) {
            return 0;
          }
          if (Array.isArray(value)) {
            return value.length;
          }
          if (typeof value === 'string') {
            return value.length;
          }
          if (typeof value === 'object') {
            return Object.keys(value).length;
          }
          if (typeof value === 'number') {
            return String(value).length;
          }
          return 0;
        },
      };
      const computed: Record<string, any> = {};

      // Helper function to convert ^ operator to pow() function
      const convertPowerOperator = (formula: string): string => {
        // Convert ^ operator to pow() function
        // This handles patterns like: a ^ b, (a + b) ^ c, a ^ (b + c), etc.
        let result = formula;

        // Function to find matching closing parenthesis
        const findMatchingParen = (str: string, start: number): number => {
          let depth = 1;
          for (let i = start + 1; i < str.length; i++) {
            if (str[i] === '(') depth++;
            if (str[i] === ')') depth--;
            if (depth === 0) return i;
          }
          return -1;
        };

        // Function to find the start of an operand (going left from a position)
        const findOperandStart = (str: string, endPos: number): number => {
          let pos = endPos;
          // Skip whitespace
          while (pos >= 0 && /\s/.test(str[pos])) pos--;
          if (pos < 0) return endPos;

          if (str[pos] === ')') {
            // Find matching opening parenthesis
            let depth = 1;
            let start = pos - 1;
            while (start >= 0 && depth > 0) {
              if (str[start] === ')') depth++;
              if (str[start] === '(') depth--;
              start--;
            }
            const parenStart = start + 1;

            // Check if there's a function name before the opening parenthesis
            let funcStart = parenStart - 1;
            while (funcStart >= 0 && /\s/.test(str[funcStart])) funcStart--;
            if (funcStart >= 0 && /[a-zA-Z_]/.test(str[funcStart])) {
              // This might be a function call, include the function name
              while (funcStart >= 0 && /[a-zA-Z0-9_]/.test(str[funcStart])) funcStart--;
              return funcStart + 1;
            }

            return parenStart;
          } else if (/[a-zA-Z_]/.test(str[pos])) {
            // Extract identifier (might be part of a function call or variable)
            let start = pos;
            while (start >= 0 && /[a-zA-Z0-9_]/.test(str[start])) start--;
            return start + 1;
          } else if (/[0-9]/.test(str[pos])) {
            // Extract number (including decimal point)
            let start = pos;
            while (start >= 0 && /[0-9.]/.test(str[start])) start--;
            return start + 1;
          } else {
            // Single character
            return pos;
          }
        };

        // Function to find the end of an operand (going right from a position)
        const findOperandEnd = (str: string, startPos: number): number => {
          let pos = startPos;
          // Skip whitespace
          while (pos < str.length && /\s/.test(str[pos])) pos++;
          if (pos >= str.length) return startPos;

          if (str[pos] === '(') {
            // Find matching closing parenthesis
            const end = findMatchingParen(str, pos);
            return end >= 0 ? end : pos;
          } else if (/[a-zA-Z_]/.test(str[pos])) {
            // This might be an identifier or function call
            // Extract the identifier first
            let end = pos;
            while (end < str.length && /[a-zA-Z0-9_]/.test(str[end])) end++;

            // Check if this identifier is followed by a function call
            let nextPos = end;
            while (nextPos < str.length && /\s/.test(str[nextPos])) nextPos++;

            if (nextPos < str.length && str[nextPos] === '(') {
              // This is a function call, include the entire call
              const parenEnd = findMatchingParen(str, nextPos);
              return parenEnd >= 0 ? parenEnd : nextPos;
            } else {
              // Just an identifier or variable
              return end - 1;
            }
          } else if (/[0-9]/.test(str[pos])) {
            // Extract number (including decimal point)
            let end = pos;
            while (end < str.length && /[0-9.]/.test(str[end])) end++;
            return end - 1;
          } else {
            // Single character or unknown
            return pos;
          }
        };

        // Process from right to left to handle right-associativity
        let caretIndex = result.lastIndexOf('^');
        while (caretIndex !== -1) {
          // Extract left operand (everything before ^)
          const leftStart = findOperandStart(result, caretIndex - 1);
          const leftEnd = caretIndex - 1;
          let leftValue = result.substring(leftStart, leftEnd + 1).trim();

          // Extract right operand (everything after ^)
          const rightStart = caretIndex + 1;
          const rightEnd = findOperandEnd(result, rightStart);
          let rightValue = result.substring(rightStart, rightEnd + 1).trim();

          // Remove outer parentheses if they exist for cleaner output
          // But preserve inner parentheses for function calls and nested expressions
          while (leftValue.startsWith('(') && leftValue.endsWith(')')) {
            // Check if the outer parentheses are actually grouping parentheses
            // by checking if removing them would break the expression
            const inner = leftValue.slice(1, -1).trim();
            if (inner.length > 0) {
              leftValue = inner;
            } else {
              break;
            }
          }

          while (rightValue.startsWith('(') && rightValue.endsWith(')')) {
            const inner = rightValue.slice(1, -1).trim();
            if (inner.length > 0) {
              rightValue = inner;
            } else {
              break;
            }
          }

          // Ensure we have valid operands
          if (!leftValue || !rightValue) {
            break;
          }

          const replacement = `pow(${leftValue}, ${rightValue})`;
          result = result.substring(0, leftStart) + replacement + result.substring(rightEnd + 1);

          // Find next ^ operator
          caretIndex = result.lastIndexOf('^');
        }

        return result;
      };

      // Helper function to evaluate JavaScript code safely
      const evaluateJavaScript = (code: string, currentScope: Record<string, any>): any => {
        const scopeKeys = Object.keys(currentScope);
        const scopeValues = scopeKeys.map(key => currentScope[key]);

        // Convert ^ operator to pow() function before evaluation
        const originalCode = code;
        code = convertPowerOperator(code);

        // Verify that pow is available if the code uses it
        if (code.includes('pow(')) {
          if (!currentScope.pow) {
            throw new Error('pow function is not available. Please ensure pow is defined in the calculator scope.');
          }
          if (typeof currentScope.pow !== 'function') {
            throw new Error(`pow is not a function (type: ${typeof currentScope.pow}). Please ensure pow is defined as a function in the calculator scope.`);
          }
        }

        // Check if code contains statements (if, for, while, etc.)
        const hasStatements = /^(if|for|while|switch|function|const|let|var|return)\s/.test(code.trim()) ||
          /;\s*(if|for|while|switch|function|const|let|var|return)/.test(code) ||
          (code.includes('{') && code.includes('}'));

        const functionBody = hasStatements ? code : `return ${code}`;

        try {
          // Verify pow is in scope keys
          if (code.includes('pow(') && !scopeKeys.includes('pow')) {
            throw new Error('pow function is not in the evaluation scope. This is a bug in the calculator.');
          }

          const func = new Function(...scopeKeys, functionBody);
          return func(...scopeValues);
        } catch (error: any) {
          // Provide more detailed error message
          const availableFunctions = Object.keys(currentScope).filter(k => typeof currentScope[k] === 'function').join(', ');
          const errorMsg = error.message || 'Unknown error';
          throw new Error(`JavaScript evaluation error: ${errorMsg}. Available functions: ${availableFunctions}. Original formula: ${originalCode}`);
        }
      };

      // Evaluate each result formula
      results.forEach((result: any) => {
        if (result.formula) {
          try {
            // Check if formula contains JavaScript syntax (loops, if-else, etc.)
            const hasJavaScriptSyntax = /^(if|for|while|switch|function|const|let|var|return)\s/.test(result.formula.trim()) ||
              /;\s*(if|for|while|switch|function|const|let|var|return)/.test(result.formula) ||
              (result.formula.includes('{') && result.formula.includes('}')) ||
              result.formula.includes('=>');

            let value: any;
            if (hasJavaScriptSyntax) {
              // Use full JavaScript evaluation for complex code
              value = evaluateJavaScript(result.formula, scope);
            } else {
              // For simple expressions, try eval with scope variables
              try {
                // Check if formula contains comma-separated expressions (multiple values)
                const hasComma = result.formula.includes(',');
                const likelyMultipleExpressions = hasComma && (
                  /\)\s*,\s*\(/.test(result.formula) || // Pattern: ), (
                  result.formula.split(',').length > 2 || // Multiple commas
                  /^[^(]*\([^)]+\)\s*,\s*\(/.test(result.formula) // Pattern like: sqrt(x), (y)
                );

                if (likelyMultipleExpressions) {
                  // Wrap in array brackets to evaluate as array literal
                  try {
                    value = evaluateJavaScript(`[${result.formula}]`, scope);
                    if (!Array.isArray(value)) {
                      // Fallback: split and evaluate each part
                      const parts = result.formula.split(',').map(p => p.trim());
                      if (parts.length > 1) {
                        value = parts.map(part => evaluateJavaScript(part, scope));
                      }
                    }
                  } catch {
                    value = evaluateJavaScript(result.formula, scope);
                  }
                } else {
                  value = evaluateJavaScript(result.formula, scope);
                }
              } catch (error: any) {
                throw new Error(`Evaluation failed: ${error.message}`);
              }
            }

            // Store computed result and add to scope for subsequent formulas
            computed[result.key] = value;
            scope[result.key] = value;

            // Format the result
            // Handle arrays (multiple values from comma-separated expressions)
            let formattedValue: string | number | string[];
            const resultValue = computed[result.key];

            // Helper to safely convert and format a value
            const safeFormatValue = (val: any, fmt: string): string | number => {
              if (typeof val === 'string') return val;
              if (val === null || val === undefined) return 'N/A';

              const numVal = typeof val === 'number' ? val : Number(val);
              if (isNaN(numVal)) {
                if (typeof val === 'boolean') return val.toString();
                return String(val);
              }

              if (fmt === 'currency') {
                return new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(numVal);
              } else if (fmt === 'percent') {
                return `${numVal.toFixed(2)}%`;
              } else if (fmt === 'integer') {
                return Math.round(numVal);
              } else {
                return parseFloat(numVal.toFixed(2));
              }
            };

            if (Array.isArray(resultValue)) {
              formattedValue = resultValue.map(v => safeFormatValue(v, result.format)).join(', ');
            } else if (typeof resultValue === 'string') {
              // If value is already a string (e.g., from toString(2) for binary), return it as-is
              formattedValue = resultValue;
            } else {
              formattedValue = safeFormatValue(resultValue, result.format);
            }

            const resultKey = result.key || result.name || result.label || `result_${result.id}`;
            calculatedResults[resultKey] = {
              value: formattedValue,
              label: result.label || result.name || resultKey,
              unit: result.unit || '',
              format: result.format || 'number',
            };
          } catch (err) {
            const resultKey = result.key || result.name || result.label || `result_${result.id}`;
            calculatedResults[resultKey] = {
              value: 'Error',
              label: result.label || result.name || resultKey,
              unit: result.unit || '',
            };
          }
        }
      });

      setResults(calculatedResults);
    } catch (err) {
      // Error handled silently
    }
  };

  const handleInputChange = (name: string, value: string) => {
    const newValues = {
      ...inputValues,
      [name]: value,
    };
    setInputValues(newValues);
  };

  // Handle radio option change
  const handleRadioOptionChange = (optionId: string) => {
    setSelectedRadioOption(optionId);
    setResults({}); // Clear previous results

    // Initialize input values for the new radio option
    const selectedOption = radioOptions.find(opt => opt.id === optionId);
    if (selectedOption) {
      const newValues: Record<string, string> = {};
      selectedOption.inputs.forEach((input: any) => {
        const inputName = input.name || input.label || input.key || `input_${input.id}`;
        newValues[inputName] = input.defaultValue?.toString() || '';
      });
      setInputValues(newValues);
    }
  };

  // Recalculate results when input values change
  useEffect(() => {
    if (calculator && Object.keys(inputValues).length > 0) {
      // Only calculate if at least one input has a value
      const hasValue = Object.values(inputValues).some(v => v && v.trim() !== '');
      if (hasValue) {
        calculateResults(inputValues);
      } else {
        setResults({});
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValues, calculator, selectedRadioOption]);

  // Handle sub-calculator input change
  const handleSubCalcInputChange = (subId: string, name: string, value: string) => {
    setSubCalcInputValues(prev => ({
      ...prev,
      [subId]: { ...(prev[subId] || {}), [name]: value },
    }));
  };

  // Calculate sub-calculator results when their inputs change
  useEffect(() => {
    if (!calculator || !calculator.sub_calculators) return;
    let subs: any[] = [];
    try {
      subs = Array.isArray(calculator.sub_calculators) ? calculator.sub_calculators : JSON.parse(calculator.sub_calculators);
    } catch { return; }

    const allSubResults: Record<string, Record<string, any>> = {};

    subs.forEach((sub: any) => {
      const vals = subCalcInputValues[sub.id] || {};
      const hasVal = Object.values(vals).some(v => v && v.trim() !== '');
      if (!hasVal) return;

      const subInputValues: Record<string, number | string> = {};
      (sub.inputs || []).forEach((input: any) => {
        const inputName = input.name || input.label || input.key;
        const raw = vals[inputName] || '';
        const key = input.key || inputName;
        if (input.type === 'number' || input.type === 'integer' || input.type === 'percent') {
          const v = parseFloat(raw); subInputValues[key] = isNaN(v) ? 0 : v;
        } else {
          subInputValues[key] = raw;
        }
      });

      const scope: Record<string, any> = {
        ...subInputValues,
        Math, Number, Array, String, Object, JSON, Date,
        sqrt: Math.sqrt, abs: Math.abs, pow: Math.pow,
        round: Math.round, floor: Math.floor, ceil: Math.ceil,
        min: Math.min, max: Math.max, log: Math.log, log10: Math.log10,
        sin: Math.sin, cos: Math.cos, tan: Math.tan,
        exp: Math.exp,
      };

      const computed: Record<string, any> = {};
      (sub.results || []).forEach((result: any) => {
        try {
          const formula = result.formula || '';
          const fn = new Function(...Object.keys({ ...scope, ...computed }), `return (${formula})`);
          const value = fn(...Object.values({ ...scope, ...computed }));
          const key = result.key || result.label;
          computed[key] = value;
          allSubResults[sub.id] = allSubResults[sub.id] || {};
          allSubResults[sub.id][key] = {
            label: result.label,
            value,
            unit: result.unit,
            format: result.format,
          };
        } catch (e) { /* skip errors */ }
      });
    });

    setSubCalcResults(allSubResults);
  }, [subCalcInputValues, calculator]);


  if (loading) {
    return (
      <div className="container py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-muted rounded w-1/3"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !calculator) {
    return (
      <div className="container py-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Calculator Not Found</h1>
          <p className="text-muted-foreground mb-8">{error || 'The calculator you are looking for does not exist.'}</p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="relative flex items-center justify-between mb-8 bg-card p-4 rounded-lg shadow-sm min-h-[60px] md:min-h-[70px]">
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 flex-shrink-0"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-5 w-5 md:h-6 md:w-6" />
          <span className="sr-only">Back</span>
        </Button>
        <div className="flex-1 text-center px-12 md:px-16 min-w-0">
          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold font-headline truncate line-clamp-2 break-words">
            {calculator.name}
          </h1>
        </div>
        <div className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 flex-shrink-0">
          <Button
            variant={isLiked ? "default" : "outline"}
            onClick={handleLike}
            disabled={loadingLikes}
            size="sm"
            className="h-8 md:h-9 px-2 md:px-3 text-xs md:text-sm"
          >
            <Heart className={`w-3 h-3 md:w-4 md:h-4 ${isLiked ? 'fill-current' : ''} md:mr-2`} />
            <span className="hidden sm:inline">
              {loadingLikes ? "..." : isLiked ? "Liked" : "Like"}
              {likeCount > 0 && ` (${likeCount})`}
            </span>
          </Button>
        </div>
      </div>

      {/* Calculator Body */}
      <div className="max-w-4xl mx-auto mb-8">
        <Card>
          <CardContent className="p-6 space-y-6">
            {/* Check if calculator has radio modes */}
            {calculator.has_radio_modes && radioOptions.length > 0 ? (
              <>
                {/* Radio Mode Calculator */}
                {/* Radio Options Selector */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Select Calculation Mode</Label>
                  <RadioGroup
                    value={selectedRadioOption}
                    onValueChange={handleRadioOptionChange}
                    className="flex flex-wrap gap-3"
                  >
                    {radioOptions.map((option) => (
                      <div key={option.id} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.id} id={option.id} />
                        <Label
                          htmlFor={option.id}
                          className={`cursor-pointer px-3 py-1.5 rounded-md transition-colors ${selectedRadioOption === option.id
                            ? 'bg-primary/10 text-primary font-medium'
                            : 'hover:bg-muted'
                            }`}
                        >
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Input Fields for Selected Radio Option */}
                {(() => {
                  const currentOption = radioOptions.find(opt => opt.id === selectedRadioOption);
                  if (!currentOption || currentOption.inputs.length === 0) return null;

                  return (
                    <div className="space-y-4 pt-4 border-t">
                      {currentOption.inputs.map((input: any, index: number) => {
                        const inputName = input.name || input.label || input.key || `input_${input.id || index}`;
                        return (
                          <div key={index} className="space-y-2">
                            <Label htmlFor={inputName}>
                              {input.label || input.name || `Input ${index + 1}`}
                              {input.unit && <span className="text-muted-foreground ml-1">({input.unit})</span>}
                              {input.required && <span className="text-red-500 ml-1">*</span>}
                            </Label>
                            <Input
                              id={inputName}
                              type={input.type || 'number'}
                              placeholder={input.placeholder || `Enter ${input.label || input.name}`}
                              value={inputValues[inputName] || ''}
                              onChange={(e) => handleInputChange(inputName, e.target.value)}
                              min={input.min}
                              max={input.max}
                            />
                            {input.description && (
                              <p className="text-sm text-muted-foreground">{input.description}</p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}

                {/* Results for Radio Mode */}
                {Object.keys(results).length > 0 && (
                  <div className="mt-6 space-y-4 pt-4 border-t">
                    <h3 className="text-lg font-semibold">Results</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(results).map(([key, result]: [string, any]) => (
                        <div key={key} className="p-4 bg-muted rounded-lg">
                          <div className="text-sm text-muted-foreground mb-1">{result.label || key}</div>
                          <div className="text-2xl font-bold">
                            {result.format === 'currency'
                              ? result.value
                              : typeof result.value === 'number'
                                ? result.value.toFixed(2)
                                : result.value}
                            {result.unit && result.format !== 'currency' && result.format !== 'percent' && (
                              <span className="text-lg ml-1">{result.unit}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* Standard Mode Calculator */
              (() => {
                let inputs: any[] = [];
                try {
                  if (calculator.inputs) {
                    if (Array.isArray(calculator.inputs)) {
                      inputs = calculator.inputs;
                    } else if (typeof calculator.inputs === 'string') {
                      inputs = JSON.parse(calculator.inputs);
                    }
                  }
                } catch (e) {
                  inputs = [];
                }

                return inputs.length > 0 ? (
                  <>
                    {/* Input Fields */}
                    <div className="space-y-4">
                      {inputs.map((input: any, index: number) => {
                        const inputName = input.name || input.label || input.key || `input_${input.id || index}`;
                        return (
                          <div key={index} className="space-y-2">
                            <Label htmlFor={inputName}>
                              {input.label || input.name || `Input ${index + 1}`}
                              {input.unit && <span className="text-muted-foreground ml-1">({input.unit})</span>}
                              {input.required && <span className="text-red-500 ml-1">*</span>}
                            </Label>
                            <Input
                              id={inputName}
                              type={input.type || 'number'}
                              placeholder={input.placeholder || `Enter ${input.label || input.name}`}
                              value={inputValues[inputName] || ''}
                              onChange={(e) => handleInputChange(inputName, e.target.value)}
                            />
                            {input.description && (
                              <p className="text-sm text-muted-foreground">{input.description}</p>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Results */}
                    {Object.keys(results).length > 0 && (
                      <div className="mt-6 space-y-4">
                        <h3 className="text-lg font-semibold">Results</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {Object.entries(results).map(([key, result]: [string, any]) => (
                            <div key={key} className="p-4 bg-muted rounded-lg">
                              <div className="text-sm text-muted-foreground mb-1">{result.label || key}</div>
                              <div className="text-2xl font-bold">
                                {result.format === 'currency'
                                  ? result.value
                                  : typeof result.value === 'number'
                                    ? result.value.toFixed(2)
                                    : result.value}
                                {result.unit && result.format !== 'currency' && result.format !== 'percent' && (
                                  <span className="text-lg ml-1">{result.unit}</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  /* Fallback to Advanced Calculator if no inputs defined */
                  <div className="flex justify-center">
                    <AdvancedCalculator />
                  </div>
                );
              })()
            )}
          </CardContent>
        </Card>
      </div>

      {/* Sub-Calculators */}
      {calculator.sub_calculators && (() => {
        let subs: any[] = [];
        try {
          subs = Array.isArray(calculator.sub_calculators) ? calculator.sub_calculators : JSON.parse(calculator.sub_calculators);
        } catch { subs = []; }
        if (subs.length === 0) return null;

        return subs.map((sub: any) => {
          let subInputs: any[] = sub.inputs || [];
          const subId = sub.id;
          const subResults = subCalcResults[subId] || {};

          return (
            <div key={subId} className="max-w-4xl mx-auto mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>{sub.name}</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {subInputs.length > 0 && (
                    <div className="space-y-4">
                      {subInputs.map((input: any, index: number) => {
                        const inputName = input.name || input.label || input.key || `input_${input.id || index}`;
                        return (
                          <div key={index} className="space-y-2">
                            <Label htmlFor={`${subId}_${inputName}`}>
                              {input.label || input.name || `Input ${index + 1}`}
                              {input.unit && <span className="text-muted-foreground ml-1">({input.unit})</span>}
                            </Label>
                            <Input
                              id={`${subId}_${inputName}`}
                              type={input.type || 'number'}
                              placeholder={input.placeholder || `Enter ${input.label || input.name}`}
                              value={(subCalcInputValues[subId] || {})[inputName] || ''}
                              onChange={(e) => handleSubCalcInputChange(subId, inputName, e.target.value)}
                            />
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {Object.keys(subResults).length > 0 && (
                    <div className="mt-6 space-y-4">
                      <h3 className="text-lg font-semibold">Results</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(subResults).map(([key, result]: [string, any]) => (
                          <div key={key} className="p-4 bg-muted rounded-lg">
                            <div className="text-sm text-muted-foreground mb-1">{result.label || key}</div>
                            <div className="text-2xl font-bold">
                              {result.format === 'currency'
                                ? result.value
                                : typeof result.value === 'number'
                                  ? result.value.toFixed(2)
                                  : result.value}
                              {result.unit && result.format !== 'currency' && result.format !== 'percent' && (
                                <span className="text-lg ml-1">{result.unit}</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          );
        });
      })()}

      <CalculatorInfo calculator={calculator} />
    </div>
  );
}

