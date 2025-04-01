
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Github, Lock, GitBranch, RefreshCw, Download, ArrowDownToLine, Loader2, CheckCircle2, AlertCircle, InfoIcon, ArrowUpToLine } from "lucide-react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function GitHubSync() {
  const [activeTab, setActiveTab] = useState('setup');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [repoUrl, setRepoUrl] = useState('');
  const [cloneRepoUrl, setCloneRepoUrl] = useState('');
  const [syncToClone, setSyncToClone] = useState(true);
  const [selectedBranch, setSelectedBranch] = useState('main');
  const [exportHistory, setExportHistory] = useState([
    { id: 1, date: '2023-06-15 14:32', status: 'success', commit: 'a8e72f9', message: 'Updated player segmentation logic' },
    { id: 2, date: '2023-06-10 09:15', status: 'success', commit: '5c4d1e3', message: 'Added new affiliate tracking' },
    { id: 3, date: '2023-06-05 16:45', status: 'failed', commit: '', message: 'Network error during sync' }
  ]);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const handleConnect = () => {
    if (!repoUrl) return;
    
    setIsLoading(true);
    
    // Simulate API connection
    setTimeout(() => {
      setIsConnected(true);
      setIsLoading(false);
    }, 1500);
  };
  
  const handleExport = () => {
    setIsLoading(true);
    
    // Simulate export
    setTimeout(() => {
      const commitHash = Math.random().toString(16).substring(2, 8);
      const newExport = {
        id: exportHistory.length + 1,
        date: new Date().toLocaleString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        }),
        status: 'success',
        commit: commitHash,
        message: 'Export from analytics dashboard',
        repositories: [repoUrl]
      };

      // If clone repo is configured and sync is enabled, add it to repositories
      if (syncToClone && cloneRepoUrl) {
        newExport.repositories.push(cloneRepoUrl);
      }
      
      setExportHistory([newExport, ...exportHistory]);
      setIsLoading(false);
      
      if (syncToClone && cloneRepoUrl) {
        alert(`Changes successfully pushed to:
1. Main repository: ${repoUrl}
2. Clone repository: ${cloneRepoUrl}

Commit hash: ${commitHash}`);
      } else {
        alert(`Changes pushed to main repository: ${repoUrl}\nCommit hash: ${commitHash}`);
      }
    }, 2000);
  };
  
  const handleImport = () => {
    setIsLoading(true);
    
    // Simulate import
    setTimeout(() => {
      setIsLoading(false);
      alert('Import successful! The application has been updated with the selected GitHub version.');
    }, 2000);
  };

  const handleSaveCloneSettings = () => {
    setIsUpdating(true);
    // Simulate saving
    setTimeout(() => {
      setIsUpdating(false);
      alert('Clone repository settings saved successfully');
    }, 1000);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">GitHub Sync</h1>
          <p className="text-gray-500 mt-1">
            Connect your analytics to GitHub for version control and collaboration
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="setup" className="flex items-center gap-2">
              <Github className="h-4 w-4" />
              GitHub Setup
            </TabsTrigger>
            <TabsTrigger value="export" className="flex items-center gap-2">
              <ArrowUpToLine className="h-4 w-4" />
              Export to GitHub
            </TabsTrigger>
            <TabsTrigger value="import" className="flex items-center gap-2">
              <ArrowDownToLine className="h-4 w-4" />
              Import from GitHub
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Sync History
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="setup">
            <Card>
              <CardHeader>
                <CardTitle>Connect to GitHub Repository</CardTitle>
                <CardDescription>
                  Link your analytics to a GitHub repository for version control
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isConnected ? (
                  <div className="space-y-4">
                    <div className="bg-green-50 border border-green-200 rounded-md p-4 flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-green-800">Connected to GitHub</h3>
                        <p className="text-green-700 text-sm">
                          Your analytics is connected to {repoUrl}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <Label>Active Branch</Label>
                      <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select branch" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="main">main</SelectItem>
                          <SelectItem value="develop">develop</SelectItem>
                          <SelectItem value="staging">staging</SelectItem>
                          <SelectItem value="feature/affiliate-tracking">feature/affiliate-tracking</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Update clone repository setup */}
                    <div className="space-y-3 border-t pt-4 mt-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="clone-repo-url">Clone Repository (Optional)</Label>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">Sync to clone</span>
                          <Switch 
                            checked={syncToClone} 
                            onCheckedChange={setSyncToClone} 
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Input 
                          id="clone-repo-url" 
                          placeholder="https://github.com/yourusername/your-clone-repo" 
                          value={cloneRepoUrl} 
                          onChange={(e) => setCloneRepoUrl(e.target.value)}
                        />
                        <Button 
                          onClick={handleSaveCloneSettings}
                          disabled={isUpdating || !cloneRepoUrl}
                          size="sm"
                          className="w-full"
                        >
                          {isUpdating ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="h-4 w-4 mr-2" />
                              Save Clone Settings
                            </>
                          )}
                        </Button>
                      </div>
                      <p className="text-sm text-gray-500">
                        When you export changes, they will also be pushed to this clone repository
                      </p>
                    </div>
                    
                    <div className="pt-2">
                      <Button onClick={() => setIsConnected(false)} variant="outline">
                        Disconnect
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="repo-url">GitHub Repository URL</Label>
                      <Input 
                        id="repo-url" 
                        placeholder="https://github.com/yourusername/your-repo" 
                        value={repoUrl} 
                        onChange={(e) => setRepoUrl(e.target.value)}
                      />
                    </div>
                    
                    <Alert className="bg-blue-50 border-blue-100">
                      <InfoIcon className="h-4 w-4 text-blue-600" />
                      <AlertDescription className="text-blue-700">
                        Make sure your repository has proper access permissions set up
                      </AlertDescription>
                    </Alert>
                    
                    <div className="pt-2">
                      <Button 
                        onClick={handleConnect} 
                        disabled={!repoUrl || isLoading} 
                        className="gap-2"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Connecting...
                          </>
                        ) : (
                          <>
                            <Lock className="h-4 w-4" />
                            Connect Repository
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="export">
            <Card>
              <CardHeader>
                <CardTitle>Export to GitHub</CardTitle>
                <CardDescription>
                  Push your current analytics configuration to GitHub
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!isConnected ? (
                  <Alert className="bg-amber-50 border-amber-100">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                    <AlertDescription className="text-amber-700">
                      Please connect to a GitHub repository first
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="commit-message">Commit Message</Label>
                      <Input 
                        id="commit-message" 
                        placeholder="Describe your changes..." 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Target Branch</Label>
                      <Select defaultValue={selectedBranch}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select branch" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="main">main</SelectItem>
                          <SelectItem value="develop">develop</SelectItem>
                          <SelectItem value="staging">staging</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {cloneRepoUrl && (
                      <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-100 rounded-md">
                        <div className="flex-shrink-0">
                          <Github className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-grow">
                          <p className="text-sm text-blue-700">
                            <strong>Clone Sync:</strong> Changes will also be pushed to {cloneRepoUrl}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <Switch 
                            checked={syncToClone} 
                            onCheckedChange={setSyncToClone} 
                            className="data-[state=checked]:bg-blue-600"
                          />
                        </div>
                      </div>
                    )}
                    
                    <div className="bg-blue-50 border border-blue-100 rounded-md p-4">
                      <h3 className="font-medium text-blue-800">Export will include:</h3>
                      <ul className="mt-2 space-y-1 text-sm text-blue-700">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Custom analytics dashboards
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Alert configurations
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          AI training configuration
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Custom reports
                        </li>
                      </ul>
                    </div>
                    
                    <div className="pt-2">
                      <Button 
                        onClick={handleExport} 
                        disabled={isLoading} 
                        className="gap-2"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Exporting...
                          </>
                        ) : (
                          <>
                            <ArrowUpToLine className="h-4 w-4" />
                            Export to GitHub
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="import">
            <Card>
              <CardHeader>
                <CardTitle>Import from GitHub</CardTitle>
                <CardDescription>
                  Restore a previous version from your GitHub repository
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!isConnected ? (
                  <Alert className="bg-amber-50 border-amber-100">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                    <AlertDescription className="text-amber-700">
                      Please connect to a GitHub repository first
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Commit to Import</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select commit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="a8e72f9">a8e72f9 - Updated player segmentation logic</SelectItem>
                          <SelectItem value="5c4d1e3">5c4d1e3 - Added new affiliate tracking</SelectItem>
                          <SelectItem value="3b2e7c1">3b2e7c1 - Initial commit</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Source Branch</Label>
                      <Select defaultValue={selectedBranch}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select branch" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="main">main</SelectItem>
                          <SelectItem value="develop">develop</SelectItem>
                          <SelectItem value="staging">staging</SelectItem>
                          <SelectItem value="feature/affiliate-tracking">feature/affiliate-tracking</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Alert className="bg-amber-50 border-amber-100">
                      <AlertCircle className="h-4 w-4 text-amber-600" />
                      <AlertDescription className="text-amber-700">
                        <strong>Warning:</strong> This will replace your current dashboard configuration. 
                        Make sure to export your current changes if needed.
                      </AlertDescription>
                    </Alert>
                    
                    <div className="pt-2">
                      <Button 
                        onClick={handleImport} 
                        disabled={isLoading} 
                        className="gap-2"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Importing...
                          </>
                        ) : (
                          <>
                            <ArrowDownToLine className="h-4 w-4" />
                            Import from GitHub
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Sync History</CardTitle>
                <CardDescription>
                  View your GitHub synchronization history
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Commit</TableHead>
                        <TableHead>Message</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {exportHistory.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.date}</TableCell>
                          <TableCell>
                            {item.status === 'success' ? (
                              <Badge className="bg-green-100 text-green-800">Success</Badge>
                            ) : (
                              <Badge className="bg-red-100 text-red-800">Failed</Badge>
                            )}
                          </TableCell>
                          <TableCell>{item.commit || '—'}</TableCell>
                          <TableCell>{item.message}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
