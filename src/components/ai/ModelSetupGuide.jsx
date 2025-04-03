import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

const modelConfigs = {
  openai: {
    title: "OpenAI",
    description: "Configure your OpenAI API key and model settings",
    fields: [
      {
        id: "apiKey",
        label: "API Key",
        type: "password",
        placeholder: "sk-...",
        description: "Your OpenAI API key"
      },
      {
        id: "model",
        label: "Model",
        type: "text",
        placeholder: "gpt-4-turbo-preview",
        description: "The model to use for AI operations"
      }
    ]
  },
  anthropic: {
    title: "Anthropic",
    description: "Configure your Anthropic API key and model settings",
    fields: [
      {
        id: "apiKey",
        label: "API Key",
        type: "password",
        placeholder: "sk-ant-...",
        description: "Your Anthropic API key"
      },
      {
        id: "model",
        label: "Model",
        type: "text",
        placeholder: "claude-3-opus-20240229",
        description: "The model to use for AI operations"
      }
    ]
  }
};

export default function ModelSetupGuide({ selectedModel, onModelChange }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Model Configuration</CardTitle>
        <CardDescription>
          Configure your AI model settings and API keys
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedModel} onValueChange={onModelChange}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="openai">OpenAI</TabsTrigger>
            <TabsTrigger value="anthropic">Anthropic</TabsTrigger>
          </TabsList>
          
          {Object.entries(modelConfigs).map(([modelId, config]) => (
            <TabsContent key={modelId} value={modelId}>
              <div className="space-y-4">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>API Key Security</AlertTitle>
                  <AlertDescription>
                    Your API key is stored securely and only used for your AI operations.
                  </AlertDescription>
                </Alert>
                
                {config.fields.map((field) => (
                  <div key={field.id} className="space-y-2">
                    <Label htmlFor={field.id}>{field.label}</Label>
                    <Input
                      id={field.id}
                      type={field.type}
                      placeholder={field.placeholder}
                    />
                    <p className="text-sm text-gray-500">{field.description}</p>
                  </div>
                ))}
                
                <Button className="w-full">Save Configuration</Button>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}