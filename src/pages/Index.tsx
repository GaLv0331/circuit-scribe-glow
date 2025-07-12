import { useState } from "react";
import { BlogHeader } from "@/components/BlogHeader";
import { BlogCard } from "@/components/BlogCard";
import { BlogPostDetail } from "@/components/BlogPostDetail";
import { NewPostForm } from "@/components/NewPostForm";
import { samplePosts } from "@/data/samplePosts";
import { BlogPost } from "@/types/blog";
import { useToast } from "@/hooks/use-toast";

type ViewMode = 'list' | 'detail' | 'create';

const Index = () => {
  const [posts, setPosts] = useState<BlogPost[]>(samplePosts);
  const [currentView, setCurrentView] = useState<ViewMode>('list');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const { toast } = useToast();

  const handleCreatePost = () => {
    setCurrentView('create');
  };

  const handlePostClick = (post: BlogPost) => {
    setSelectedPost(post);
    setCurrentView('detail');
  };

  const handleSavePost = (newPost: BlogPost) => {
    setPosts(prev => [newPost, ...prev]);
    setCurrentView('list');
    toast({
      title: "Post Created!",
      description: "Your electronics blog post has been published successfully.",
    });
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedPost(null);
  };

  if (currentView === 'create') {
    return <NewPostForm onSave={handleSavePost} onCancel={handleBackToList} />;
  }

  if (currentView === 'detail' && selectedPost) {
    return <BlogPostDetail post={selectedPost} onBack={handleBackToList} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <BlogHeader onCreatePost={handleCreatePost} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <BlogCard
              key={post.id}
              post={post}
              onClick={() => handlePostClick(post)}
            />
          ))}
        </div>
        
        {posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No posts yet. Create your first electronics blog post!</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
