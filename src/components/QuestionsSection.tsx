import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Code, BookOpen } from "lucide-react";
import { Question } from "@/types/questions";
import { CodeEditor } from "@/components/CodeEditor";

interface QuestionsSectionProps {
  questions: Question[];
}

export function QuestionsSection({ questions }: QuestionsSectionProps) {
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);

  if (selectedQuestion) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <Button
          variant="ghost"
          onClick={() => setSelectedQuestion(null)}
          className="mb-6 hover:bg-muted"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Questions
        </Button>
        <CodeEditor question={selectedQuestion} />
      </div>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const groupedQuestions = questions.reduce((acc, question) => {
    if (!acc[question.difficulty]) {
      acc[question.difficulty] = [];
    }
    acc[question.difficulty].push(question);
    return acc;
  }, {} as Record<string, Question[]>);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-foreground mb-4">
          Arduino Programming Questions
        </h1>
        <p className="text-muted-foreground text-lg">
          Practice your Arduino programming skills with these interactive coding challenges.
          Each question includes a code editor with compilation and hints.
        </p>
      </div>

      {/* Questions by Difficulty */}
      <div className="space-y-8">
        {['Beginner', 'Intermediate', 'Advanced'].map((difficulty) => {
          const questionsInDifficulty = groupedQuestions[difficulty] || [];
          if (questionsInDifficulty.length === 0) return null;

          return (
            <div key={difficulty} className="space-y-4">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-heading font-semibold text-foreground">
                  {difficulty} Level
                </h2>
                <Badge className={getDifficultyColor(difficulty)}>
                  {questionsInDifficulty.length} question{questionsInDifficulty.length !== 1 ? 's' : ''}
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {questionsInDifficulty.map((question) => (
                  <Card 
                    key={question.id}
                    className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-accent/50 bg-card"
                    onClick={() => setSelectedQuestion(question)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg font-heading font-semibold text-foreground line-clamp-2">
                          {question.title}
                        </CardTitle>
                        <Badge className={getDifficultyColor(question.difficulty)}>
                          {question.difficulty}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {question.description}
                      </p>
                    </CardHeader>

                    <CardContent>
                      <div className="space-y-4">
                        {/* Preview Icons */}
                        <div className="flex items-center justify-center gap-4">
                          <div className="flex items-center justify-center p-3 bg-muted rounded-lg">
                            <div className="text-center">
                              <BookOpen className="h-5 w-5 mx-auto mb-1 text-primary" />
                              <span className="text-xs font-medium">Question</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-center p-3 bg-muted rounded-lg">
                            <div className="text-center">
                              <Code className="h-5 w-5 mx-auto mb-1 text-accent" />
                              <span className="text-xs font-medium">Code Editor</span>
                            </div>
                          </div>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1">
                          {question.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {question.tags.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{question.tags.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {questions.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No questions available yet. Check back soon!</p>
        </div>
      )}
    </div>
  );
}