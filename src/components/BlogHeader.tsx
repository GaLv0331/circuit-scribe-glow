import { Button } from "@/components/ui/button";
import { Plus, Zap } from "lucide-react";

interface BlogHeaderProps {
  onCreatePost: () => void;
}

export function BlogHeader({ onCreatePost }: BlogHeaderProps) {
  return (
    <header className="bg-card border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-card/80">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
              <Zap className="h-6 w-6 text-accent-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-heading font-bold text-foreground">
                Circuit Scribe
              </h1>
              <p className="text-sm text-muted-foreground">
                Electronics & Electrical Engineering Blog
              </p>
            </div>
          </div>
          
          <Button 
            onClick={onCreatePost}
            className="bg-accent hover:bg-accent/90 text-accent-foreground font-medium"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Post
          </Button>
        </div>
      </div>
    </header>
  );
}