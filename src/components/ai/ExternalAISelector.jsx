import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Brain, Zap, Sparkles, Stars } from 'lucide-react';

export default function ExternalAISelector({ selectedModel, onModelChange }) {
  // List of models we support connecting to
  const models = [
    {
      id: 'base44ai',
      name: 'Base44 AI',
      description: 'Default model (InvokeLLM integration)',
      icon: Brain
    },
    {
      id: 'qwen',
      name: 'Alibaba Qwen',
      description: 'Open-source model from Alibaba',
      icon: Sparkles
    },
    {
      id: 'deepseek',
      name: 'DeepSeek',
      description: 'Advanced open-source large language model',
      icon: Stars
    }
  ];

  return (
    <Card>
      <CardContent className="pt-6">
        <RadioGroup value={selectedModel} onValueChange={onModelChange} className="space-y-4">
          {models.map((model) => {
            const Icon = model.icon;
            return (
              <div key={model.id} className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-50 cursor-pointer">
                <RadioGroupItem value={model.id} id={model.id} />
                <Label htmlFor={model.id} className="flex items-center cursor-pointer flex-1">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${model.id === 'base44ai' ? 'bg-blue-100 text-blue-700' : 
                      model.id === 'qwen' ? 'bg-orange-100 text-orange-700' : 
                      'bg-purple-100 text-purple-700'}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium">{model.name}</div>
                      <div className="text-sm text-gray-500">{model.description}</div>
                    </div>
                  </div>
                </Label>
              </div>
            );
          })}
        </RadioGroup>

        <div className="mt-6 p-4 bg-yellow-50 text-yellow-800 rounded-md text-sm">
          <p className="font-medium mb-1">⚠️ External API Setup Required</p>
          <p>To use these external models, you need to:</p>
          <ol className="list-decimal ml-4 mt-2 space-y-1">
            <li>Register for API access on their respective websites</li>
            <li>Enter your API keys in Settings</li>
            <li>Configure rate limits and budget constraints</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}