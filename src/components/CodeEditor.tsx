import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Play, RotateCcw, Eye, EyeOff, Lightbulb } from "lucide-react";
import { Question, CompilationResult, JudgeResult } from "@/types/questions";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ArduinoJudge } from "@/services/arduinoJudge";
import { Progress } from "@/components/ui/progress";

interface CodeEditorProps {
  question: Question;
}

export function CodeEditor({ question }: CodeEditorProps) {
  const [code, setCode] = useState(question.starterCode);
  const [judgeResult, setJudgeResult] = useState<JudgeResult | null>(null);
  const [isCompiling, setIsCompiling] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const judge = ArduinoJudge.getInstance();

  const handleCompileAndJudge = async () => {
    setIsCompiling(true);
    setJudgeResult(null);
    
    try {
      const result = await judge.judgeCode(code, question);
      setJudgeResult(result);
    } catch (error) {
      setJudgeResult({
        success: false,
        score: 0,
        maxScore: question.testCases.length,
        testResults: [],
        executionTime: 0,
        feedback: "Judge service unavailable. Please try again later."
      });
    } finally {
      setIsCompiling(false);
    }
  };

  const handleReset = () => {
    setCode(question.starterCode);
    setJudgeResult(null);
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
                onClick={handleCompileAndJudge} 
                disabled={isCompiling}
                className="bg-accent hover:bg-accent/90"
              >
                <Play className="h-4 w-4 mr-2" />
                {isCompiling ? 'Judging...' : 'Compile & Test'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Judge Results */}
      {judgeResult && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className={`text-lg ${judgeResult.success ? 'text-green-600' : 'text-red-600'}`}>
                {judgeResult.success ? '✅ All Tests Passed!' : '❌ Some Tests Failed'}
              </CardTitle>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  Score: {judgeResult.score}/{judgeResult.maxScore}
                </span>
                <Progress 
                  value={(judgeResult.score / judgeResult.maxScore) * 100} 
                  className="w-20"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Overall Feedback */}
            <div className="bg-gray-100 p-3 rounded">
              <pre className="whitespace-pre-wrap text-sm">{judgeResult.feedback}</pre>
            </div>

            {/* Execution Stats */}
            <div className="flex gap-4 text-sm text-muted-foreground">
              <span>Execution Time: {judgeResult.executionTime}ms</span>
              {judgeResult.memoryUsage && (
                <span>Memory Usage: {judgeResult.memoryUsage} bytes</span>
              )}
            </div>

            {/* Test Results */}
            {judgeResult.testResults.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium">Test Results:</h4>
                {judgeResult.testResults.map((testResult, index) => (
                  <div 
                    key={testResult.testCase.id}
                    className={`p-3 rounded border ${
                      testResult.passed 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-red-50 border-red-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">
                        {testResult.passed ? '✅' : '❌'} {testResult.testCase.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {testResult.executionTime}ms
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {testResult.testCase.description}
                    </p>
                    {testResult.error && (
                      <p className="text-sm text-red-600">
                        Error: {testResult.error}
                      </p>
                    )}
                    {testResult.actualValue !== undefined && testResult.expectedValue !== undefined && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">Expected: </span>
                        <span className="font-mono">{testResult.expectedValue}</span>
                        <span className="text-muted-foreground"> | Got: </span>
                        <span className="font-mono">{testResult.actualValue}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}