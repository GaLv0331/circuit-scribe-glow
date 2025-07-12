import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, BookOpen, Code, Cpu, CalendarDays, User } from "lucide-react";
import { BlogPost } from "@/types/blog";
import { CodeBlock } from "@/components/CodeBlock";
import { CircuitDiagram } from "@/components/CircuitDiagram";

interface BlogPostDetailProps {
  post: BlogPost;
  onBack: () => void;
}

export function BlogPostDetail({ post, onBack }: BlogPostDetailProps) {
  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <Button
        variant="ghost"
        onClick={onBack}
        className="mb-6 hover:bg-muted"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Posts
      </Button>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-foreground mb-4">
          {post.title}
        </h1>
        
        <div className="flex items-center gap-6 text-muted-foreground mb-4">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>{post.author}</span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            <span>{post.date}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Content Sections */}
      <div className="space-y-8">
        {/* Theory Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <BookOpen className="h-5 w-5" />
              {post.theory.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-slate max-w-none">
              <div className="whitespace-pre-wrap text-foreground leading-relaxed">
                {post.theory.content}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Code Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-accent">
              <Code className="h-5 w-5" />
              Code Implementation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CodeBlock
              title={post.code.title}
              language={post.code.language}
              content={post.code.content}
              tabs={post.code.tabs}
            />
          </CardContent>
        </Card>

        {/* Simulation Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Cpu className="h-5 w-5" />
              {post.simulation.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <CircuitDiagram circuitData={post.simulation.circuitData} />
              <div className="text-muted-foreground">
                {post.simulation.description}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}