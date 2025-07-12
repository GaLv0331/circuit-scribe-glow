export interface Question {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
  starterCode: string;
  solution?: string;
  hints?: string[];
  expectedOutput?: string;
  testCases: TestCase[];
  judgeConfig: JudgeConfig;
}

export interface TestCase {
  id: string;
  name: string;
  description: string;
  inputs?: TestInput[];
  expectedBehavior: ExpectedBehavior;
  timeoutMs?: number;
}

export interface TestInput {
  pin: number;
  type: 'digital' | 'analog';
  value: number | boolean;
  timestamp?: number;
}

export interface ExpectedBehavior {
  type: 'pin_state' | 'serial_output' | 'timing' | 'pwm_value';
  pin?: number;
  expectedValue?: number | boolean | string;
  tolerance?: number;
  pattern?: string; // For serial output patterns
  timing?: {
    minMs: number;
    maxMs: number;
  };
}

export interface JudgeConfig {
  requiredFunctions: string[];
  forbiddenFunctions?: string[];
  maxExecutionTimeMs: number;
  memoryLimitBytes?: number;
  requiredPins?: number[];
}

export interface CompilationResult {
  success: boolean;
  output?: string;
  errors?: string[];
  warnings?: string[];
  syntaxValid?: boolean;
}

export interface JudgeResult {
  success: boolean;
  score: number;
  maxScore: number;
  testResults: TestResult[];
  executionTime: number;
  memoryUsage?: number;
  feedback: string;
}

export interface TestResult {
  testCase: TestCase;
  passed: boolean;
  actualValue?: any;
  expectedValue?: any;
  error?: string;
  executionTime: number;
}