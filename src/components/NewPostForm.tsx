import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, Plus, X } from "lucide-react";
import { BlogPost } from "@/types/blog";
import { Badge } from "@/components/ui/badge";

interface NewPostFormProps {
  onSave: (post: BlogPost) => void;
  onCancel: () => void;
}

export function NewPostForm({ onSave, onCancel }: NewPostFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    tags: [] as string[],
    newTag: "",
    theory: {
      title: "",
      content: "",
    },
    code: {
      title: "",
      language: "javascript",
      content: "",
    },
    simulation: {
      title: "",
      description: "",
    },
  });

  const addTag = () => {
    if (formData.newTag.trim() && !formData.tags.includes(formData.newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, prev.newTag.trim()],
        newTag: ""
      }));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = () => {
    const newPost: BlogPost = {
      id: Date.now().toString(),
      title: formData.title,
      author: formData.author,
      date: new Date().toLocaleDateString(),
      tags: formData.tags,
      theory: formData.theory,
      code: formData.code,
      simulation: {
        title: formData.simulation.title,
        description: formData.simulation.description,
        circuitData: {
          components: [
            // Sample circuit for demo
            {
              id: "v1",
              type: "voltage_source" as const,
              position: { x: 100, y: 200 },
              value: "5V"
            },
            {
              id: "r1",
              type: "resistor" as const,
              position: { x: 300, y: 200 },
              value: "1kΩ"
            },
            {
              id: "gnd1",
              type: "ground" as const,
              position: { x: 100, y: 300 }
            }
          ],
          connections: [
            { from: "v1", to: "r1" },
            { from: "v1", to: "gnd1" }
          ]
        }
      }
    };

    onSave(newPost);
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={onCancel}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Cancel
        </Button>
        <Button onClick={handleSubmit} className="bg-accent hover:bg-accent/90">
          <Save className="h-4 w-4 mr-2" />
          Save Post
        </Button>
      </div>

      <div className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Post Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter post title..."
              />
            </div>
            
            <div>
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                placeholder="Enter author name..."
              />
            </div>

            <div>
              <Label>Tags</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={formData.newTag}
                  onChange={(e) => setFormData(prev => ({ ...prev, newTag: e.target.value }))}
                  placeholder="Add a tag..."
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                />
                <Button type="button" onClick={addTag} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => removeTag(tag)} 
                    />
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Theory Section */}
        <Card>
          <CardHeader>
            <CardTitle>Theory Section</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="theory-title">Section Title</Label>
              <Input
                id="theory-title"
                value={formData.theory.title}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  theory: { ...prev.theory, title: e.target.value }
                }))}
                placeholder="Theory section title..."
              />
            </div>
            <div>
              <Label htmlFor="theory-content">Content</Label>
              <Textarea
                id="theory-content"
                value={formData.theory.content}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  theory: { ...prev.theory, content: e.target.value }
                }))}
                placeholder="Write your theory explanation..."
                className="min-h-32"
              />
            </div>
          </CardContent>
        </Card>

        {/* Code Section */}
        <Card>
          <CardHeader>
            <CardTitle>Code Section</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="code-title">Section Title</Label>
              <Input
                id="code-title"
                value={formData.code.title}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  code: { ...prev.code, title: e.target.value }
                }))}
                placeholder="Code section title..."
              />
            </div>
            <div>
              <Label htmlFor="code-language">Programming Language</Label>
              <Input
                id="code-language"
                value={formData.code.language}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  code: { ...prev.code, language: e.target.value }
                }))}
                placeholder="e.g., javascript, python, arduino..."
              />
            </div>
            <div>
              <Label htmlFor="code-content">Code</Label>
              <Textarea
                id="code-content"
                value={formData.code.content}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  code: { ...prev.code, content: e.target.value }
                }))}
                placeholder="Paste your code here..."
                className="min-h-40 font-mono text-sm"
              />
            </div>
          </CardContent>
        </Card>

        {/* Simulation Section */}
        <Card>
          <CardHeader>
            <CardTitle>Simulation Section</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="simulation-title">Section Title</Label>
              <Input
                id="simulation-title"
                value={formData.simulation.title}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  simulation: { ...prev.simulation, title: e.target.value }
                }))}
                placeholder="Simulation section title..."
              />
            </div>
            <div>
              <Label htmlFor="simulation-description">Description</Label>
              <Textarea
                id="simulation-description"
                value={formData.simulation.description}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  simulation: { ...prev.simulation, description: e.target.value }
                }))}
                placeholder="Describe your circuit simulation..."
                className="min-h-32"
              />
            </div>
            <div className="text-sm text-muted-foreground">
              <p>* Circuit diagram will be automatically generated with basic components for now.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}