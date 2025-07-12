export class ArduinoCompiler {
  private static instance: ArduinoCompiler;
  
  public static getInstance(): ArduinoCompiler {
    if (!ArduinoCompiler.instance) {
      ArduinoCompiler.instance = new ArduinoCompiler();
    }
    return ArduinoCompiler.instance;
  }

  async validateSyntax(code: string): Promise<{ valid: boolean; errors: string[]; warnings: string[] }> {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Remove comments and strings for analysis
    const cleanCode = this.removeCommentsAndStrings(code);

    // Check for required structure
    if (!cleanCode.includes('void setup()') && !cleanCode.includes('void setup(')) {
      errors.push("Missing 'void setup()' function declaration");
    }

    if (!cleanCode.includes('void loop()') && !cleanCode.includes('void loop(')) {
      errors.push("Missing 'void loop()' function declaration");
    }

    // Check for balanced braces
    const braceBalance = this.checkBraceBalance(cleanCode);
    if (braceBalance !== 0) {
      errors.push(`Unbalanced braces: ${braceBalance > 0 ? 'missing closing' : 'extra closing'} brace(s)`);
    }

    // Check for balanced parentheses
    const parenBalance = this.checkParenthesesBalance(cleanCode);
    if (parenBalance !== 0) {
      errors.push(`Unbalanced parentheses: ${parenBalance > 0 ? 'missing closing' : 'extra closing'} parenthesis`);
    }

    // Check for semicolons after statements
    this.checkSemicolons(cleanCode, errors);

    // Check for common Arduino function usage
    this.checkArduinoFunctions(cleanCode, warnings);

    // Check for variable declarations
    this.checkVariableDeclarations(cleanCode, warnings);

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  private removeCommentsAndStrings(code: string): string {
    // Remove single-line comments
    let cleaned = code.replace(/\/\/.*$/gm, '');
    
    // Remove multi-line comments
    cleaned = cleaned.replace(/\/\*[\s\S]*?\*\//g, '');
    
    // Remove string literals
    cleaned = cleaned.replace(/"[^"]*"/g, '""');
    cleaned = cleaned.replace(/'[^']*'/g, "''");
    
    return cleaned;
  }

  private checkBraceBalance(code: string): number {
    let balance = 0;
    for (const char of code) {
      if (char === '{') balance++;
      if (char === '}') balance--;
    }
    return balance;
  }

  private checkParenthesesBalance(code: string): number {
    let balance = 0;
    for (const char of code) {
      if (char === '(') balance++;
      if (char === ')') balance--;
    }
    return balance;
  }

  private checkSemicolons(code: string, errors: string[]): void {
    const lines = code.split('\n');
    const statementKeywords = ['digitalWrite', 'analogWrite', 'pinMode', 'delay', 'Serial.print', 'Serial.begin'];
    
    lines.forEach((line, index) => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('//') && !trimmed.startsWith('/*')) {
        const hasStatement = statementKeywords.some(keyword => trimmed.includes(keyword));
        if (hasStatement && !trimmed.endsWith(';') && !trimmed.endsWith('{') && !trimmed.endsWith('}')) {
          errors.push(`Line ${index + 1}: Missing semicolon after statement`);
        }
      }
    });
  }

  private checkArduinoFunctions(code: string, warnings: string[]): void {
    const commonMistakes = [
      { pattern: /digitalRead\(\s*\d+\s*\)/, message: "Consider using pinMode() before digitalRead()" },
      { pattern: /analogWrite\(\s*A\d+\s*,/, message: "analogWrite() should be used with PWM pins, not analog pins" },
      { pattern: /delay\(\s*[0-9]{4,}\s*\)/, message: "Very long delays (>1000ms) might make your program unresponsive" }
    ];

    commonMistakes.forEach(({ pattern, message }) => {
      if (pattern.test(code)) {
        warnings.push(message);
      }
    });
  }

  private checkVariableDeclarations(code: string, warnings: string[]): void {
    // Check for variables used without declaration
    const variablePattern = /\b([a-zA-Z_][a-zA-Z0-9_]*)\s*=/g;
    const declarationPattern = /\b(int|float|bool|char|String|byte|long|double)\s+([a-zA-Z_][a-zA-Z0-9_]*)/g;
    
    const usedVariables = new Set<string>();
    const declaredVariables = new Set<string>();
    
    let match;
    while ((match = variablePattern.exec(code)) !== null) {
      usedVariables.add(match[1]);
    }
    
    while ((match = declarationPattern.exec(code)) !== null) {
      declaredVariables.add(match[2]);
    }
    
    usedVariables.forEach(variable => {
      if (!declaredVariables.has(variable) && !this.isArduinoKeyword(variable)) {
        warnings.push(`Variable '${variable}' may not be declared`);
      }
    });
  }

  private isArduinoKeyword(word: string): boolean {
    const keywords = [
      'HIGH', 'LOW', 'INPUT', 'OUTPUT', 'INPUT_PULLUP',
      'A0', 'A1', 'A2', 'A3', 'A4', 'A5',
      'LED_BUILTIN', 'Serial'
    ];
    return keywords.includes(word);
  }

  async compile(code: string): Promise<{ success: boolean; errors: string[]; warnings: string[]; bytecode?: string }> {
    // First validate syntax
    const syntaxResult = await this.validateSyntax(code);
    
    if (!syntaxResult.valid) {
      return {
        success: false,
        errors: syntaxResult.errors,
        warnings: syntaxResult.warnings
      };
    }

    // Simulate compilation process
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    // Generate mock bytecode for successful compilation
    const bytecode = this.generateMockBytecode(code);

    return {
      success: true,
      errors: [],
      warnings: syntaxResult.warnings,
      bytecode
    };
  }

  private generateMockBytecode(code: string): string {
    // Generate a mock bytecode representation
    const hash = this.simpleHash(code);
    return `Arduino bytecode (${code.length} bytes) - Hash: ${hash}`;
  }

  private simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16);
  }
}