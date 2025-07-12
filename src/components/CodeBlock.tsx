import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CodeTab {
  name: string;
  language: string;
  content: string;
}

interface CodeBlockProps {
  title: string;
  language: string;
  content: string;
  tabs?: CodeTab[];
}

export function CodeBlock({ title, language, content, tabs }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const formatCode = (code: string, lang: string) => {
    const lines = code.split('\n');
    return (
      <div className="code-block font-mono text-sm">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-accent/20">
          <span className="text-accent font-medium">{lang.toUpperCase()}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => copyToClipboard(code)}
            className="text-accent hover:text-accent-foreground hover:bg-accent/20"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
        <pre className="whitespace-pre-wrap overflow-x-auto">
          {lines.map((line, index) => (
            <div key={index} className="flex">
              <span className="text-muted-foreground mr-4 select-none w-8 text-right">
                {index + 1}
              </span>
              <span className="flex-1">{line}</span>
            </div>
          ))}
        </pre>
      </div>
    );
  };

  if (tabs && tabs.length > 0) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-heading font-semibold text-foreground">{title}</h3>
        <Tabs defaultValue={tabs[0].name} className="w-full">
          <TabsList className="grid w-full grid-cols-auto bg-muted">
            {tabs.map((tab) => (
              <TabsTrigger 
                key={tab.name} 
                value={tab.name}
                className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
              >
                {tab.name}
              </TabsTrigger>
            ))}
          </TabsList>
          {tabs.map((tab) => (
            <TabsContent key={tab.name} value={tab.name}>
              {formatCode(tab.content, tab.language)}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-heading font-semibold text-foreground">{title}</h3>
      {formatCode(content, language)}
    </div>
  );
}