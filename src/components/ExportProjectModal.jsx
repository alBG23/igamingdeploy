import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle, Github, GitBranch, ArrowUpToLine } from 'lucide-react';

export default function ExportProjectModal({ open, onOpenChange, onExport }) {
  const [isLoading, setIsLoading] = useState(false);
  const [exportType, setExportType] = useState('complete');
  const [commitMessage, setCommitMessage] = useState('');
  const [repoUrl, setRepoUrl] = useState('https://github.com/base44dev/i-gaming-insight-f6c3b3fd.git');
  const [cloneRepoUrl, setCloneRepoUrl] = useState('https://github.com/alBG23/i-gaming-insight-clone');
  const [useCloneRepo, setUseCloneRepo] = useState(true);

  const handleExport = () => {
    setIsLoading(true);
    
    // Send export type to parent
    onExport({ 
      exportType, 
      commitMessage, 
      repositories: [
        repoUrl,
        ...(useCloneRepo ? [cloneRepoUrl] : [])
      ]
    });

    // Simulate export process
    setTimeout(() => {
      setIsLoading(false);
      
      // Show success message
      const exportMessage = exportType === 'complete' 
        ? 'Complete project structure has been exported'
        : 'Source code has been exported';
        
      const reposMessage = useCloneRepo
        ? `Main repository: ${repoUrl}\nClone repository: ${cloneRepoUrl}`
        : `Repository: ${repoUrl}`;
        
      alert(`Export successful!\n\n${exportMessage}\n\n${reposMessage}`);
      
      onOpenChange(false);
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Github className="h-5 w-5" />
            Export Project to GitHub
          </DialogTitle>
          <DialogDescription>
            Push your project to GitHub repositories
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-3">
            <h3 className="font-medium">Export Options</h3>
            <RadioGroup value={exportType} onValueChange={setExportType}>
              <div className="flex items-start space-x-2">
                <RadioGroupItem value="complete" id="complete" />
                <Label htmlFor="complete" className="font-normal">
                  <span className="font-medium">Complete Project</span>
                  <p className="text-sm text-gray-500 mt-1">
                    Export all project files and folders including components, entities, and configurations
                  </p>
                </Label>
              </div>
              <div className="flex items-start space-x-2">
                <RadioGroupItem value="src" id="src" />
                <Label htmlFor="src" className="font-normal">
                  <span className="font-medium">Source Code Only</span>
                  <p className="text-sm text-gray-500 mt-1">
                    Export just the source code (.js, .jsx files) without folder structure
                  </p>
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="commit-message">Commit Message</Label>
            <Input 
              id="commit-message" 
              value={commitMessage}
              onChange={(e) => setCommitMessage(e.target.value)}
              placeholder="Describe your changes..."
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="repo-url">Main Repository URL</Label>
            <Input 
              id="repo-url" 
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="clone-repo-url">Clone Repository URL</Label>
              <div className="flex items-center gap-2">
                <Label htmlFor="use-clone" className="text-sm text-gray-500">Use clone repo</Label>
                <input 
                  type="checkbox" 
                  id="use-clone"
                  checked={useCloneRepo}
                  onChange={() => setUseCloneRepo(!useCloneRepo)}
                  className="h-4 w-4"
                />
              </div>
            </div>
            <Input 
              id="clone-repo-url" 
              value={cloneRepoUrl}
              onChange={(e) => setCloneRepoUrl(e.target.value)}
              disabled={!useCloneRepo}
              className={!useCloneRepo ? "opacity-50" : ""}
            />
          </div>
          
          {exportType === 'complete' && (
            <Alert className="bg-amber-50 border-amber-100">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-700">
                Complete project export requires proper Git permissions and may take longer to process.
              </AlertDescription>
            </Alert>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleExport} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <ArrowUpToLine className="mr-2 h-4 w-4" />
                Export to GitHub
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}