import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, User, Code, Cpu, BookOpen } from "lucide-react";
import { BlogPost } from "@/types/blog";

interface BlogCardProps {
  post: BlogPost;
  onClick: () => void;
}

export function BlogCard({ post, onClick }: BlogCardProps) {
  return (
    <Card 
      className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-accent/50 bg-card"
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-xl font-heading font-semibold text-foreground line-clamp-2">
            {post.title}
          </CardTitle>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            {post.author}
          </div>
          <div className="flex items-center gap-1">
            <CalendarDays className="h-4 w-4" />
            {post.date}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* Section previews */}
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center justify-center p-4 bg-muted rounded-lg">
              <div className="text-center">
                <BookOpen className="h-6 w-6 mx-auto mb-2 text-primary" />
                <span className="text-sm font-medium">Theory</span>
              </div>
            </div>
            <div className="flex items-center justify-center p-4 bg-muted rounded-lg">
              <div className="text-center">
                <Code className="h-6 w-6 mx-auto mb-2 text-accent" />
                <span className="text-sm font-medium">Code</span>
              </div>
            </div>
            <div className="flex items-center justify-center p-4 bg-muted rounded-lg">
              <div className="text-center">
                <Cpu className="h-6 w-6 mx-auto mb-2 text-primary" />
                <span className="text-sm font-medium">Simulation</span>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}