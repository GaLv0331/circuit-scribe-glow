import { Question, TestCase, JudgeResult, TestResult, CompilationResult } from "@/types/questions";
import { ArduinoCompiler } from "./arduinoCompiler";

export class ArduinoJudge {
  private static instance: ArduinoJudge;
  private compiler: ArduinoCompiler;
  
  public static getInstance(): ArduinoJudge {
    if (!ArduinoJudge.instance) {
      ArduinoJudge.instance = new ArduinoJudge();
    }
    return ArduinoJudge.instance;
  }

  constructor() {
    this.compiler = ArduinoCompiler.getInstance();
  }

  async judgeCode(code: string, question: Question): Promise<JudgeResult> {
    const startTime = Date.now();
    
    // First, compile the code
    const compilationResult = await this.compiler.compile(code);
    
    if (!compilationResult.success) {
      return {
        success: false,
        score: 0,
        maxScore: question.testCases.length,
        testResults: [],
        executionTime: Date.now() - startTime,
        feedback: `Compilation failed: ${compilationResult.errors.join(', ')}`
      };
    }

    // Check required functions
    const functionCheckResult = this.checkRequiredFunctions(code, question.judgeConfig.requiredFunctions);
    if (!functionCheckResult.success) {
      return {
        success: false,
        score: 0,
        maxScore: question.testCases.length,
        testResults: [],
        executionTime: Date.now() - startTime,
        feedback: functionCheckResult.message
      };
    }

    // Run test cases
    const testResults: TestResult[] = [];
    let passedTests = 0;

    for (const testCase of question.testCases) {
      const testResult = await this.runTestCase(code, testCase);
      testResults.push(testResult);
      if (testResult.passed) passedTests++;
    }

    const executionTime = Date.now() - startTime;
    const score = passedTests;
    const maxScore = question.testCases.length;
    const success = score === maxScore;

    return {
      success,
      score,
      maxScore,
      testResults,
      executionTime,
      feedback: this.generateFeedback(testResults, success, score, maxScore)
    };
  }

  private checkRequiredFunctions(code: string, requiredFunctions: string[]): { success: boolean; message: string } {
    const missingFunctions: string[] = [];
    
    for (const func of requiredFunctions) {
      if (!code.includes(func)) {
        missingFunctions.push(func);
      }
    }

    if (missingFunctions.length > 0) {
      return {
        success: false,
        message: `Missing required functions: ${missingFunctions.join(', ')}`
      };
    }

    return { success: true, message: '' };
  }

  private async runTestCase(code: string, testCase: TestCase): Promise<TestResult> {
    const startTime = Date.now();
    
    try {
      // Simulate Arduino execution based on test case type
      const result = await this.simulateArduinoExecution(code, testCase);
      const executionTime = Date.now() - startTime;

      return {
        testCase,
        passed: result.passed,
        actualValue: result.actualValue,
        expectedValue: result.expectedValue,
        executionTime,
        error: result.error
      };
    } catch (error) {
      return {
        testCase,
        passed: false,
        executionTime: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  private async simulateArduinoExecution(code: string, testCase: TestCase): Promise<{
    passed: boolean;
    actualValue?: any;
    expectedValue?: any;
    error?: string;
  }> {
    // Simulate execution delay
    await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));

    const { expectedBehavior } = testCase;

    switch (expectedBehavior.type) {
      case 'pin_state':
        return this.testPinState(code, testCase);
      
      case 'serial_output':
        return this.testSerialOutput(code, testCase);
      
      case 'timing':
        return this.testTiming(code, testCase);
      
      case 'pwm_value':
        return this.testPWMValue(code, testCase);
      
      default:
        return {
          passed: false,
          error: `Unknown test type: ${expectedBehavior.type}`
        };
    }
  }

  private testPinState(code: string, testCase: TestCase): {
    passed: boolean;
    actualValue?: any;
    expectedValue?: any;
    error?: string;
  } {
    const { expectedBehavior } = testCase;
    const pin = expectedBehavior.pin!;
    const expectedValue = expectedBehavior.expectedValue;

    // Check if code properly sets up the pin
    const hasPinMode = code.includes(`pinMode(${pin}`) || code.includes(`pinMode(LED_BUILTIN`);
    const hasDigitalWrite = code.includes(`digitalWrite(${pin}`) || code.includes(`digitalWrite(LED_BUILTIN`);

    if (!hasPinMode) {
      return {
        passed: false,
        error: `Pin ${pin} not configured with pinMode()`
      };
    }

    if (!hasDigitalWrite) {
      return {
        passed: false,
        error: `Pin ${pin} not controlled with digitalWrite()`
      };
    }

    // Simulate pin state based on code analysis
    const actualValue = this.analyzePinState(code, pin);

    return {
      passed: actualValue === expectedValue,
      actualValue,
      expectedValue
    };
  }

  private testSerialOutput(code: string, testCase: TestCase): {
    passed: boolean;
    actualValue?: any;
    expectedValue?: any;
    error?: string;
  } {
    const { expectedBehavior } = testCase;
    const expectedPattern = expectedBehavior.pattern;

    // Check if Serial is initialized
    if (!code.includes('Serial.begin')) {
      return {
        passed: false,
        error: 'Serial communication not initialized with Serial.begin()'
      };
    }

    // Check for Serial output
    const hasSerialPrint = code.includes('Serial.print') || code.includes('Serial.println');
    if (!hasSerialPrint) {
      return {
        passed: false,
        error: 'No Serial output found'
      };
    }

    // Simulate serial output based on code analysis
    const actualOutput = this.analyzeSerialOutput(code);
    const passed = expectedPattern ? new RegExp(expectedPattern).test(actualOutput) : true;

    return {
      passed,
      actualValue: actualOutput,
      expectedValue: expectedPattern
    };
  }

  private testTiming(code: string, testCase: TestCase): {
    passed: boolean;
    actualValue?: any;
    expectedValue?: any;
    error?: string;
  } {
    const { expectedBehavior } = testCase;
    const timing = expectedBehavior.timing!;

    // Analyze delay usage in code
    const delays = this.extractDelays(code);
    const totalDelay = delays.reduce((sum, delay) => sum + delay, 0);

    const passed = totalDelay >= timing.minMs && totalDelay <= timing.maxMs;

    return {
      passed,
      actualValue: `${totalDelay}ms`,
      expectedValue: `${timing.minMs}-${timing.maxMs}ms`
    };
  }

  private testPWMValue(code: string, testCase: TestCase): {
    passed: boolean;
    actualValue?: any;
    expectedValue?: any;
    error?: string;
  } {
    const { expectedBehavior } = testCase;
    const pin = expectedBehavior.pin!;
    const expectedValue = expectedBehavior.expectedValue as number;
    const tolerance = expectedBehavior.tolerance || 10;

    // Check for analogWrite usage
    if (!code.includes('analogWrite')) {
      return {
        passed: false,
        error: 'No PWM output found (analogWrite not used)'
      };
    }

    // Analyze PWM value
    const actualValue = this.analyzePWMValue(code, pin);
    const passed = Math.abs(actualValue - expectedValue) <= tolerance;

    return {
      passed,
      actualValue,
      expectedValue: `${expectedValue} ±${tolerance}`
    };
  }

  private analyzePinState(code: string, pin: number): boolean {
    // Simple analysis - look for digitalWrite calls
    const highPattern = new RegExp(`digitalWrite\\(\\s*${pin}\\s*,\\s*HIGH\\s*\\)`);
    const lowPattern = new RegExp(`digitalWrite\\(\\s*${pin}\\s*,\\s*LOW\\s*\\)`);
    
    if (highPattern.test(code)) return true;
    if (lowPattern.test(code)) return false;
    
    // Default assumption
    return false;
  }

  private analyzeSerialOutput(code: string): string {
    // Extract strings from Serial.print statements
    const printMatches = code.match(/Serial\.print(?:ln)?\s*\(\s*"([^"]*)"\s*\)/g);
    if (printMatches) {
      return printMatches.map(match => {
        const stringMatch = match.match(/"([^"]*)"/);
        return stringMatch ? stringMatch[1] : '';
      }).join('');
    }
    return 'Serial output detected';
  }

  private extractDelays(code: string): number[] {
    const delayMatches = code.match(/delay\s*\(\s*(\d+)\s*\)/g);
    if (!delayMatches) return [];
    
    return delayMatches.map(match => {
      const numberMatch = match.match(/\d+/);
      return numberMatch ? parseInt(numberMatch[0]) : 0;
    });
  }

  private analyzePWMValue(code: string, pin: number): number {
    // Look for analogWrite calls with specific values
    const pwmPattern = new RegExp(`analogWrite\\s*\\(\\s*${pin}\\s*,\\s*(\\d+)\\s*\\)`);
    const match = code.match(pwmPattern);
    
    if (match) {
      return parseInt(match[1]);
    }
    
    // Look for variable-based PWM
    if (code.includes('analogWrite')) {
      return 128; // Default middle value
    }
    
    return 0;
  }

  private generateFeedback(testResults: TestResult[], success: boolean, score: number, maxScore: number): string {
    if (success) {
      return `🎉 Excellent! All ${maxScore} test cases passed. Your Arduino code works perfectly!`;
    }

    const failedTests = testResults.filter(result => !result.passed);
    let feedback = `❌ ${score}/${maxScore} test cases passed. Issues found:\n\n`;

    failedTests.forEach((result, index) => {
      feedback += `${index + 1}. ${result.testCase.name}: ${result.error || 'Test failed'}\n`;
      if (result.actualValue !== undefined && result.expectedValue !== undefined) {
        feedback += `   Expected: ${result.expectedValue}, Got: ${result.actualValue}\n`;
      }
    });

    feedback += '\n💡 Review the failed test cases and adjust your code accordingly.';
    return feedback;
  }
}