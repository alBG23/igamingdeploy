import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

export default function OpenAIConfig() {
  const [apiKey, setApiKey] = React.useState('');
  const [model, setModel] = React.useState('gpt-4-turbo-preview');
  const [isSaving, setIsSaving] = React.useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Save configuration to your backend
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
      alert('Configuration saved successfully!');
    } catch (error) {
      alert('Failed to save configuration. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>OpenAI Configuration</CardTitle>
        <CardDescription>
          Configure your OpenAI API settings for AI-powered features
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>API Key Security</AlertTitle>
          <AlertDescription>
            Your API key is stored securely and only used for your AI operations.
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <Label htmlFor="api-key">API Key</Label>
          <Input
            id="api-key"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-..."
          />
          <p className="text-sm text-gray-500">
            Your OpenAI API key. You can find this in your OpenAI account settings.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="model">Model</Label>
          <Input
            id="model"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder="gpt-4-turbo-preview"
          />
          <p className="text-sm text-gray-500">
            The OpenAI model to use for AI operations. Default is gpt-4-turbo-preview.
          </p>
        </div>

        <Button 
          className="w-full" 
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save Configuration'}
        </Button>
      </CardContent>
    </Card>
  );
}
