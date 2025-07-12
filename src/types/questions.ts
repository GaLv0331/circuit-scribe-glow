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
}

export interface CompilationResult {
  success: boolean;
  output?: string;
  errors?: string[];
  warnings?: string[];
}