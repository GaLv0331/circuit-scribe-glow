import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Play, RotateCcw, Eye, EyeOff, Lightbulb } from "lucide-react";
import { Question, CompilationResult } from "@/types/questions";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface CodeEditorProps {
  question: Question;
}

export function CodeEditor({ question }: CodeEditorProps) {
  const [code, setCode] = useState(question.starterCode);
  const [compilationResult, setCompilationResult] = useState<CompilationResult | null>(null);
  const [isCompiling, setIsCompiling] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [showHints, setShowHints] = useState(false);

  const simulateCompilation = async (code: string): Promise<CompilationResult> => {
    // Simulate compilation delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Basic syntax checking simulation
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check for common issues
    if (!code.includes('void setup()')) {
      errors.push("Missing 'void setup()' function");
    }
    if (!code.includes('void loop()')) {
      errors.push("Missing 'void loop()' function");
    }
    if (code.includes('TODO')) {
      warnings.push("Code contains TODO comments - make sure to complete implementation");
    }

    // Check for specific question requirements
    if (question.id === "1") {
      if (!code.includes('pinMode') && !code.includes('TODO')) {
        errors.push("Missing pinMode() function call");
      }
      if (!code.includes('digitalWrite') && !code.includes('TODO')) {
        errors.push("Missing digitalWrite() function call");
      }
    }

    const success = errors.length === 0;
    const output = success 
      ? `Compilation successful!\n\nExpected behavior: ${question.expectedOutput}\n\nCode uploaded to Arduino successfully.`
      : "Compilation failed. Please fix the errors and try again.";

    return {
      success,
      output,
      errors: errors.length > 0 ? errors : undefined,
      warnings: warnings.length > 0 ? warnings : undefined
    };
  };

  const handleCompile = async () => {
    setIsCompiling(true);
    setCompilationResult(null);
    
    try {
      const result = await simulateCompilation(code);
      setCompilationResult(result);
    } catch (error) {
      setCompilationResult({
        success: false,
        errors: ["Compilation service unavailable. Please try again later."]
      });
    } finally {
      setIsCompiling(false);
    }
  };

  const handleReset = () => {
    setCode(question.starterCode);
    setCompilationResult(null);
    setShowSolution(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Question Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-xl font-heading">{question.title}</CardTitle>
              <p className="text-muted-foreground">{question.description}</p>
            </div>
            <Badge className={getDifficultyColor(question.difficulty)}>
              {question.difficulty}
            </Badge>
          </div>
          <div className="flex flex-wrap gap-2">
            {question.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </CardHeader>
      </Card>

      {/* Code Editor */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Arduino Code Editor</CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowHints(!showHints)}
              >
                <Lightbulb className="h-4 w-4 mr-2" />
                Hints
              </Button>
              {question.solution && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSolution(!showSolution)}
                >
                  {showSolution ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                  Solution
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={handleReset}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Hints Section */}
          {showHints && question.hints && (
            <Collapsible open={showHints} onOpenChange={setShowHints}>
              <CollapsibleContent>
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="pt-4">
                    <h4 className="font-medium mb-2 text-blue-800">💡 Hints:</h4>
                    <ul className="space-y-1 text-sm text-blue-700">
                      {question.hints.map((hint, index) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>{hint}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </CollapsibleContent>
            </Collapsible>
          )}

          {/* Solution Section */}
          {showSolution && question.solution && (
            <Card className="bg-green-50 border-green-200">
              <CardContent className="pt-4">
                <h4 className="font-medium mb-2 text-green-800">✅ Solution:</h4>
                <pre className="bg-green-100 p-3 rounded text-sm font-mono text-green-800 overflow-x-auto">
                  {question.solution}
                </pre>
              </CardContent>
            </Card>
          )}

          {/* Code Editor */}
          <div className="space-y-2">
            <Textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="min-h-80 font-mono text-sm bg-gray-50"
              placeholder="Write your Arduino code here..."
            />
            <div className="flex gap-2">
              <Button 
                onClick={handleCompile} 
                disabled={isCompiling}
                className="bg-accent hover:bg-accent/90"
              >
                <Play className="h-4 w-4 mr-2" />
                {isCompiling ? 'Compiling...' : 'Compile & Upload'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Compilation Results */}
      {compilationResult && (
        <Card>
          <CardHeader>
            <CardTitle className={`text-lg ${compilationResult.success ? 'text-green-600' : 'text-red-600'}`}>
              {compilationResult.success ? '✅ Compilation Successful' : '❌ Compilation Failed'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {compilationResult.output && (
              <div className="bg-gray-100 p-3 rounded font-mono text-sm">
                <pre className="whitespace-pre-wrap">{compilationResult.output}</pre>
              </div>
            )}
            
            {compilationResult.errors && (
              <div className="space-y-2">
                <h4 className="font-medium text-red-600">Errors:</h4>
                <ul className="space-y-1">
                  {compilationResult.errors.map((error, index) => (
                    <li key={index} className="text-red-600 text-sm flex items-start">
                      <span className="mr-2">•</span>
                      <span>{error}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {compilationResult.warnings && (
              <div className="space-y-2">
                <h4 className="font-medium text-yellow-600">Warnings:</h4>
                <ul className="space-y-1">
                  {compilationResult.warnings.map((warning, index) => (
                    <li key={index} className="text-yellow-600 text-sm flex items-start">
                      <span className="mr-2">•</span>
                      <span>{warning}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}