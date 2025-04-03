import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Github, Info, Lock } from "lucide-react";

export default function ExportProjectModal() {
  const [repoUrl, setRepoUrl] = React.useState('https://github.com/your-username/your-repo.git');
  const [isExporting, setIsExporting] = React.useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Project exported successfully!');
    } catch (error) {
      alert('Failed to export project. Please check your repository URL.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Export Project</CardTitle>
        <CardDescription>
          Export your project to a GitHub repository
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Project Export</AlertTitle>
          <AlertDescription>
            Export your project to a GitHub repository for version control and collaboration.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="repo-url">Repository URL</Label>
            <Input
              id="repo-url"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="https://github.com/username/repository.git"
            />
            <p className="text-sm text-gray-500">
              Enter the URL of your GitHub repository
            </p>
          </div>

          <Alert>
            <Lock className="h-4 w-4" />
            <AlertTitle>Security Note</AlertTitle>
            <AlertDescription>
              Ensure your repository is properly secured and access is restricted to authorized users.
            </AlertDescription>
          </Alert>

          <Button 
            className="w-full" 
            onClick={handleExport}
            disabled={!repoUrl || isExporting}
          >
            {isExporting ? 'Exporting...' : 'Export to GitHub'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}