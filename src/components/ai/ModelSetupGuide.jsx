import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ExternalLink, Copy, Check } from 'lucide-react';

export default function ModelSetupGuide({ selectedModel }) {
  const [copied, setCopied] = React.useState(false);
  
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const guides = {
    qwen: {
      title: "Alibaba Qwen Setup",
      description: "Configure your Qwen API connection",
      apiUrl: "https://api.qwen.ai/v1",
      setupSteps: [
        "Create a free account at qwen.ai",
        "Navigate to API Keys in your dashboard",
        "Generate a new API key with appropriate permissions",
        "Copy the API key and paste it below",
      ],
      docLink: "https://help.aliyun.com/document_detail/2399481.html",
      sampleCode: `
const response = await fetch('https://api.qwen.ai/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    model: 'qwen-max',
    messages: [
      { role: 'user', content: 'Tell me about iGaming analytics' }
    ]
  })
});
const data = await response.json();
`
    },
    deepseek: {
      title: "DeepSeek Setup",
      description: "Configure your DeepSeek API connection",
      apiUrl: "https://api.deepseek.com/v1",
      setupSteps: [
        "Sign up for a DeepSeek account",
        "Go to API section in your account settings",
        "Generate a new API key",
        "Copy the API key and paste it below"
      ],
      docLink: "https://platform.deepseek.com/docs",
      sampleCode: `
const response = await fetch('https://api.deepseek.com/v1/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    model: 'deepseek-coder',
    prompt: 'Analyze this iGaming data',
    max_tokens: 1000
  })
});
const data = await response.json();
`
    },
    base44ai: {
      title: "Base44 AI",
      description: "Default integration - already configured",
      setupSteps: [
        "No setup required - this is the default model"
      ]
    }
  };

  const guide = guides[selectedModel];

  if (!guide) {
    return <div>Select a model to see setup instructions</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{guide.title}</CardTitle>
        <CardDescription>{guide.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {guide.setupSteps.map((step, index) => (
          <div key={index} className="flex items-start gap-2">
            <div className="bg-blue-100 text-blue-700 rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0 mt-0.5">
              {index + 1}
            </div>
            <p>{step}</p>
          </div>
        ))}

        {selectedModel !== 'base44ai' && (
          <>
            <div className="pt-4">
              <Label htmlFor={`${selectedModel}-api-key`}>API Key</Label>
              <div className="flex mt-1.5">
                <Input
                  id={`${selectedModel}-api-key`}
                  type="password"
                  placeholder="Enter your API key"
                  className="flex-1"
                />
                <Button className="ml-2">Save</Button>
              </div>
            </div>

            <div className="pt-2">
              <Label htmlFor={`${selectedModel}-api-url`}>API Endpoint</Label>
              <Input
                id={`${selectedModel}-api-url`}
                value={guide.apiUrl}
                readOnly
                className="mt-1.5"
              />
            </div>

            <Tabs defaultValue="code" className="mt-4">
              <TabsList>
                <TabsTrigger value="code">Sample Code</TabsTrigger>
                <TabsTrigger value="docs">Documentation</TabsTrigger>
              </TabsList>
              <TabsContent value="code" className="mt-2">
                <div className="relative">
                  <pre className="bg-gray-50 p-4 rounded-md text-sm overflow-x-auto">{guide.sampleCode}</pre>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-2 right-2"
                    onClick={() => handleCopy(guide.sampleCode)}
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="docs" className="mt-2">
                <div className="bg-gray-50 p-4 rounded-md">
                  <a 
                    href={guide.docLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:underline"
                  >
                    Official {selectedModel === 'qwen' ? 'Qwen' : 'DeepSeek'} Documentation
                    <ExternalLink className="ml-1 h-4 w-4" />
                  </a>
                  <p className="mt-2 text-sm text-gray-600">
                    Refer to the official documentation for detailed API specifications,
                    pricing information, and advanced configuration options.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </CardContent>
      {selectedModel !== 'base44ai' && (
        <CardFooter className="flex justify-end gap-2 pt-0">
          <Button variant="outline">Test Connection</Button>
          <Button>Apply Settings</Button>
        </CardFooter>
      )}
    </Card>
  );
}