import React from 'react';
import { cn } from '@/lib/utils';

const models = [
  {
    id: 'openai',
    name: 'OpenAI',
    description: 'Advanced AI model for natural language processing'
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    description: 'Claude AI model for complex reasoning'
  }
];

export default function ExternalAISelector({ selectedModel, onModelChange }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {models.map((model) => (
          <div
            key={model.id}
            className={cn(
              "p-4 border rounded-lg cursor-pointer transition-colors",
              selectedModel === model.id
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            )}
            onClick={() => onModelChange(model.id)}
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-2 rounded-full",
                selectedModel === model.id ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"
              )}>
                {model.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-medium">{model.name}</h3>
                <p className="text-sm text-gray-500">{model.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-yellow-50 text-yellow-800 rounded-md text-sm">
        <p className="font-medium mb-1">⚠️ External API Setup Required</p>
        <p>To use these external models, you need to:</p>
        <ol className="list-decimal ml-4 mt-2 space-y-1">
          <li>Register for API access on their respective websites</li>
          <li>Enter your API keys in Settings</li>
          <li>Configure rate limits and budget constraints</li>
        </ol>
      </div>
    </div>
  );
}