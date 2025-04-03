import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, Lock } from "lucide-react";

export default function EnvironmentVariablesGuide() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Environment Variables</CardTitle>
        <CardDescription>
          Configure your application settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>About Environment Variables</AlertTitle>
          <AlertDescription>
            Environment variables are used to configure your application's behavior and connect to external services.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Required Variables</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
              <li><code>OPENAI_API_KEY</code> - Your OpenAI API key</li>
              <li><code>DATABASE_URL</code> - Database connection string</li>
              <li><code>NODE_ENV</code> - Application environment (development/production)</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Optional Variables</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
              <li><code>PORT</code> - Server port (default: 3000)</li>
              <li><code>LOG_LEVEL</code> - Logging level (default: info)</li>
              <li><code>CORS_ORIGIN</code> - CORS allowed origins</li>
            </ul>
          </div>

          <Alert>
            <Lock className="h-4 w-4" />
            <AlertTitle>Security Note</AlertTitle>
            <AlertDescription>
              Never commit environment variables to version control. Use a .env file for local development.
            </AlertDescription>
          </Alert>
        </div>
      </CardContent>
    </Card>
  );
}
