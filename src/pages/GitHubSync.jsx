import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Github, GitBranch, GitCommit, History, Check, AlertCircle, ArrowUpDown, RefreshCw, Code, Download, Upload, Clock, ChevronDown, ExternalLink, Link as LinkIcon, HelpCircle } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { InvokeLLM } from "@/api/integrations";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function GitHubSync() {
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [repoUrl, setRepoUrl] = useState('');
  const [personalAccessToken, setPersonalAccessToken] = useState('');
  const [activeTab, setActiveTab] = useState('sync');
  const [syncHistory, setSyncHistory] = useState([]);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [syncMessage, setSyncMessage] = useState("");
  const [showCommitDetail, setShowCommitDetail] = useState(false);
  const [selectedCommitDetail, setSelectedCommitDetail] = useState(null);
  const [showLimitationsInfo, setShowLimitationsInfo] = useState(false);
  
  useEffect(() => {
    // Check localStorage for saved connection state
    const savedConnection = localStorage.getItem('githubConnection');
    if (savedConnection) {
      const connectionData = JSON.parse(savedConnection);
      setConnected(true);
      setRepoUrl(connectionData.repoUrl);
      setSyncHistory(connectionData.history || []);
    }
  }, []);
  
  const mockCommits = [
    {
      id: 'c23a4b5',
      date: '2023-07-15T14:23:18Z',
      message: 'Update PnL dashboard with revenue vs costs chart',
      author: 'developer@example.com',
      status: 'synced',
      files_changed: 3,
      additions: 145,
      deletions: 27,
      branch: 'main',
      commit_url: '',
      changes: [
        { file: 'pages/PnLDashboard.js', changes: '+120, -20', type: 'modified' },
        { file: 'components/finance/RevenueCostTimeline.js', changes: '+15, -5', type: 'modified' },
        { file: 'components/finance/CostDistributionCharts.js', changes: '+10, -2', type: 'modified' }
      ]
    },
    {
      id: 'f89d2e1',
      date: '2023-07-14T09:45:33Z',
      message: 'Fix conversion funnel component animation',
      author: 'developer@example.com',
      status: 'synced',
      files_changed: 1,
      additions: 28,
      deletions: 12,
      branch: 'main',
      commit_url: '',
      changes: [
        { file: 'components/executive/ConversionFunnel.js', changes: '+28, -12', type: 'modified' }
      ]
    },
    {
      id: 'a37b9c4',
      date: '2023-07-12T16:12:05Z',
      message: 'Add executive dashboard with KPI trends',
      author: 'developer@example.com',
      status: 'synced',
      files_changed: 5,
      additions: 310,
      deletions: 0,
      branch: 'main',
      commit_url: '',
      changes: [
        { file: 'pages/ExecutiveDashboard.js', changes: '+180, -0', type: 'added' },
        { file: 'components/executive/TrendSummary.js', changes: '+45, -0', type: 'added' },
        { file: 'components/executive/KPICard.js', changes: '+35, -0', type: 'added' },
        { file: 'components/executive/AlertsPanel.js', changes: '+40, -0', type: 'added' },
        { file: 'components/executive/ConversionFunnel.js', changes: '+10, -0', type: 'added' }
      ]
    },
    {
      id: '5e8f1d2',
      date: '2023-07-10T11:38:27Z',
      message: 'Initial platform setup with core metrics',
      author: 'developer@example.com',
      status: 'synced',
      files_changed: 12,
      additions: 560,
      deletions: 0,
      branch: 'main',
      commit_url: '',
      changes: [
        { file: 'pages/Dashboard.js', changes: '+150, -0', type: 'added' },
        { file: 'components/dashboard/MetricsOverview.js', changes: '+85, -0', type: 'added' },
        { file: 'components/dashboard/AnomalyDetection.js', changes: '+65, -0', type: 'added' },
        { file: 'components/dashboard/PaymentAnalytics.js', changes: '+70, -0', type: 'added' },
        { file: 'layout.js', changes: '+110, -0', type: 'added' },
        { file: 'entities/MetricsData.json', changes: '+30, -0', type: 'added' },
        { file: 'entities/AnomalyAlert.json', changes: '+20, -0', type: 'added' }
      ]
    }
  ];
  
  const handleConnect = async () => {
    if (!repoUrl || !personalAccessToken) return;
    
    setConnecting(true);
    setErrorMessage("");
    
    try {
      // Extract username and repo name from URL for display
      let repoPath = '';
      try {
        const url = new URL(repoUrl);
        const pathParts = url.pathname.split('/').filter(part => part);
        if (pathParts.length >= 2) {
          repoPath = `${pathParts[0]}/${pathParts[1]}`;
        }
      } catch (e) {
        repoPath = repoUrl.replace('https://github.com/', '');
      }
      
      // Simulate API connection to validate GitHub credentials
      const response = await InvokeLLM({
        prompt: `You're a GitHub API simulator. A user is trying to connect to a repository at ${repoUrl} with a personal access token. Please simulate a successful response that would be returned from GitHub when validating credentials. Include repository information. Response should be very brief.`,
        add_context_from_internet: false
      });
      
      // Generate mock commit URLs
      const updatedMockCommits = mockCommits.map(commit => {
        // Only generate URL if the repoPath is valid
        const commitUrl = repoPath ? `https://github.com/${repoPath}/commit/${commit.id}` : '';
        return { ...commit, commit_url: commitUrl };
      });
      
      // Save connection data to localStorage
      const connectionData = {
        repoUrl,
        repoPath,
        tokenHash: btoa(personalAccessToken).substring(0, 10), // Don't store actual token, just a hash for verification
        history: updatedMockCommits
      };
      localStorage.setItem('githubConnection', JSON.stringify(connectionData));
      
      setConnected(true);
      setSyncHistory(updatedMockCommits);
      console.log("Successfully connected to GitHub repository");
      
      // Show limitations info after connecting
      setShowLimitationsInfo(true);
    } catch (error) {
      console.error("Error connecting to GitHub:", error);
      setErrorMessage("Failed to connect to GitHub repository. Please check your credentials and try again.");
    } finally {
      setConnecting(false);
    }
  };
  
  const handleSync = async () => {
    setSyncing(true);
    setSyncSuccess(null);
    setSyncMessage("");
    
    try {
      // Get repo path for constructing URLs
      const connectionData = JSON.parse(localStorage.getItem('githubConnection') || '{}');
      const repoPath = connectionData.repoPath || '';
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create a new commit record
      const commitId = Math.random().toString(36).substring(2, 8);
      const commitUrl = repoPath ? `https://github.com/${repoPath}/commit/${commitId}` : '';
      
      const newCommit = {
        id: commitId,
        date: new Date().toISOString(),
        message: 'Sync: Updated analytics configuration and dashboard layouts',
        author: 'developer@example.com',
        status: 'synced',
        files_changed: 3,
        additions: 87,
        deletions: 15,
        branch: 'main',
        commit_url: commitUrl,
        changes: [
          { file: 'pages/Dashboard.js', changes: '+45, -8', type: 'modified' },
          { file: 'components/FloatingChat.js', changes: '+32, -5', type: 'modified' },
          { file: 'pages/AIInsights.js', changes: '+10, -2', type: 'modified' }
        ]
      };
      
      // Update sync history
      const updatedHistory = [newCommit, ...syncHistory];
      setSyncHistory(updatedHistory);
      
      // Update localStorage
      connectionData.history = updatedHistory;
      localStorage.setItem('githubConnection', JSON.stringify(connectionData));
      
      setSyncSuccess(true);
      setSyncMessage(`Successfully simulated syncing changes for demonstration`);
      console.log("Successfully simulated GitHub sync");
      
      // Set this commit as the selected one to show details
      setSelectedCommitDetail(newCommit);
      setShowCommitDetail(true);
      
      // Show limitations info after syncing
      setTimeout(() => {
        setShowLimitationsInfo(true);
      }, 1000);
      
    } catch (error) {
      console.error("Error syncing with GitHub:", error);
      setSyncSuccess(false);
      setSyncMessage("Failed to sync with GitHub. Please check your connection and try again.");
    } finally {
      setSyncing(false);
    }
  };
  
  const handleRestore = async () => {
    setRestoring(true);
    
    try {
      // Simulate restore operation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Show success message and update history
      const updatedHistory = syncHistory.map(commit => {
        if (commit.id === selectedVersion.id) {
          return { ...commit, status: 'restored' };
        }
        return commit;
      });
      
      setSyncHistory(updatedHistory);
      
      // Update localStorage
      const connectionData = JSON.parse(localStorage.getItem('githubConnection'));
      connectionData.history = updatedHistory;
      localStorage.setItem('githubConnection', JSON.stringify(connectionData));
      
      console.log(`Restored to version ${selectedVersion.id}`);
    } catch (error) {
      console.error("Error restoring version:", error);
    } finally {
      setRestoring(false);
      setShowRestoreConfirm(false);
    }
  };
  
  const handleDisconnect = () => {
    // Show confirmation dialog
    if (window.confirm("Are you sure you want to disconnect from GitHub? This will remove all sync history.")) {
      // Remove connection data from localStorage
      localStorage.removeItem('githubConnection');
      
      // Reset state
      setConnected(false);
      setRepoUrl('');
      setPersonalAccessToken('');
      setSyncHistory([]);
      setSyncSuccess(null);
      setShowCommitDetail(false);
      setShowLimitationsInfo(false);
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  const getFileIcon = (fileName) => {
    if (fileName.endsWith('.js')) return <Code className="h-4 w-4 text-yellow-600" />;
    if (fileName.endsWith('.json')) return <Code className="h-4 w-4 text-blue-600" />;
    if (fileName.endsWith('.css')) return <Code className="h-4 w-4 text-purple-600" />;
    return <Code className="h-4 w-4 text-gray-600" />;
  };
  
  const getTypeColor = (type) => {
    switch (type) {
      case 'added': return 'bg-green-50 text-green-700 border-green-200';
      case 'modified': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'removed': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">GitHub Sync</h1>
          <p className="text-gray-500 mt-1">
            Sync your analytics configuration with GitHub for version control and restore capabilities
          </p>
        </div>
        
        {showLimitationsInfo && (
          <Alert className="bg-blue-50 border-blue-200 text-blue-800">
            <AlertDescription className="flex items-start gap-2">
              <HelpCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium mb-1">Demo Mode Notice</p>
                <p className="text-sm">
                  This is a simulated GitHub integration for demonstration purposes. Due to browser security limitations, 
                  the app can't directly push to GitHub repositories. In a production environment, this would be implemented 
                  with a secure backend service that performs the actual GitHub operations.
                </p>
                <div className="mt-2">
                  <Button variant="outline" size="sm" className="text-xs" onClick={() => setShowLimitationsInfo(false)}>
                    Dismiss
                  </Button>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="sync">
              <Github className="w-4 h-4 mr-2" />
              GitHub Connection
            </TabsTrigger>
            <TabsTrigger value="versions" disabled={!connected}>
              <History className="w-4 h-4 mr-2" />
              Version History
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="sync" className="p-4 bg-white rounded-lg border mt-4">
            {!connected ? (
              <div className="space-y-4">
                <CardHeader className="px-0 pt-0">
                  <CardTitle>Connect to GitHub</CardTitle>
                  <CardDescription>
                    Link your GitHub repository to enable version control for your analytics configuration
                  </CardDescription>
                </CardHeader>
                
                {errorMessage && (
                  <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-800">
                    <AlertDescription className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      {errorMessage}
                    </AlertDescription>
                  </Alert>
                )}
                
                <Alert className="bg-amber-50 border-amber-200">
                  <AlertDescription className="flex items-center gap-2 text-amber-800">
                    <HelpCircle className="h-4 w-4 text-amber-600" />
                    <span>This is a demonstration of how GitHub integration would work. No actual GitHub operations will be performed.</span>
                  </AlertDescription>
                </Alert>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="repo-url">GitHub Repository URL</Label>
                    <Input 
                      id="repo-url"
                      placeholder="https://github.com/username/repository" 
                      value={repoUrl}
                      onChange={(e) => setRepoUrl(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="pat">Personal Access Token</Label>
                    <Input 
                      id="pat"
                      type="password"
                      placeholder="ghp_xxxxxxxxxx" 
                      value={personalAccessToken}
                      onChange={(e) => setPersonalAccessToken(e.target.value)}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Not required for demo, but you can enter any value for simulation
                    </p>
                  </div>
                </div>
                
                <Button 
                  onClick={handleConnect}
                  disabled={!repoUrl || !personalAccessToken || connecting}
                  className="w-full mt-4"
                >
                  {connecting ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Github className="h-4 w-4 mr-2" />
                      Connect to GitHub (Demo)
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Github className="h-5 w-5 text-green-600" />
                    <div>
                      <h3 className="font-medium">Connected to GitHub (Demo)</h3>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <span>{repoUrl.replace('https://github.com/', '')}</span>
                        <a 
                          href={repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                          aria-label="Open in GitHub"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                  
                  <Button variant="outline" size="sm" onClick={handleDisconnect}>
                    Disconnect
                  </Button>
                </div>
                
                <Collapsible>
                  <CollapsibleTrigger asChild>
                    <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-3 rounded-md transition-colors">
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                      <h3 className="font-medium">Sync Settings</h3>
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="pl-6 py-2 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="sync-frequency">Sync Frequency</Label>
                          <Select defaultValue="manual">
                            <SelectTrigger id="sync-frequency">
                              <SelectValue placeholder="Select frequency" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="manual">Manual</SelectItem>
                              <SelectItem value="hourly">Hourly</SelectItem>
                              <SelectItem value="daily">Daily</SelectItem>
                              <SelectItem value="onchange">On Every Change</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label htmlFor="branch">Branch</Label>
                          <Select defaultValue="main">
                            <SelectTrigger id="branch">
                              <SelectValue placeholder="Select branch" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="main">main</SelectItem>
                              <SelectItem value="develop">develop</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
                
                {syncSuccess !== null && (
                  <Alert className={syncSuccess ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-800"}>
                    <AlertDescription className="flex items-center gap-2">
                      {syncSuccess ? (
                        <>
                          <Check className="h-4 w-4" />
                          <span>{syncMessage || "Demo: Successfully simulated sync with GitHub repository"}</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-4 w-4" />
                          <span>{syncMessage || "Failed to sync with GitHub repository. Please try again."}</span>
                        </>
                      )}
                    </AlertDescription>
                  </Alert>
                )}
                
                <Alert className="bg-blue-50 border-blue-200 text-blue-800">
                  <AlertDescription className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>Last synced (demo): {syncHistory.length > 0 ? formatDate(syncHistory[0].date) : 'Never'}</span>
                  </AlertDescription>
                </Alert>
                
                <div className="flex gap-4">
                  <Button 
                    className="flex-1" 
                    onClick={handleSync}
                    disabled={syncing}
                  >
                    {syncing ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Simulating Sync...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Sync Now (Demo)
                      </>
                    )}
                  </Button>
                  
                  <Button variant="outline" className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Pull Latest (Demo)
                  </Button>
                </div>
                
                {showCommitDetail && selectedCommitDetail && (
                  <div className="mt-6 border rounded-lg overflow-hidden">
                    <div className="bg-gray-50 p-4 border-b">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{selectedCommitDetail.message}</h3>
                          <p className="text-sm text-gray-500 mt-1">
                            <span className="font-mono">{selectedCommitDetail.id}</span> • {formatDate(selectedCommitDetail.date)}
                          </p>
                        </div>
                        {selectedCommitDetail.commit_url && (
                          <div className="text-sm text-blue-600 flex items-center">
                            <span className="mr-1">Simulated GitHub link</span>
                            <ExternalLink className="h-3.5 w-3.5" />
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <div className="flex justify-between text-sm text-gray-500 mb-4">
                        <span>{selectedCommitDetail.files_changed} files would be changed</span>
                        <span className="flex gap-3">
                          <span className="text-green-600">+{selectedCommitDetail.additions}</span>
                          <span className="text-red-600">-{selectedCommitDetail.deletions}</span>
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        {selectedCommitDetail.changes.map((change, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded border">
                            <div className="flex items-center gap-2">
                              {getFileIcon(change.file)}
                              <span className="text-sm">{change.file}</span>
                              <Badge variant="outline" className={getTypeColor(change.type)}>
                                {change.type}
                              </Badge>
                            </div>
                            <span className="text-sm font-mono">{change.changes}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="versions" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span>Version History</span>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 ml-2">Demo</Badge>
                </CardTitle>
                <CardDescription>
                  View and restore previous versions in this demonstration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Commit</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="w-[100px]">Changes</TableHead>
                      <TableHead className="w-[100px]">Status</TableHead>
                      <TableHead className="w-[120px] text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {syncHistory.map((commit) => (
                      <TableRow key={commit.id}>
                        <TableCell className="font-mono text-sm">
                          <div className="flex items-center gap-1">
                            {commit.id.substring(0, 7)}
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="text-blue-600 cursor-help">
                                    <HelpCircle className="h-3.5 w-3.5" />
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Demo - Not a real GitHub commit</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            {commit.message}
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="ml-2 h-5 p-0 text-blue-600"
                              onClick={() => {
                                setSelectedCommitDetail(commit);
                                setShowCommitDetail(true);
                                setActiveTab('sync');
                              }}
                            >
                              <LinkIcon className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(commit.date)}</TableCell>
                        <TableCell>
                          <span className="flex gap-2 text-sm">
                            <span className="text-green-600">+{commit.additions || '?'}</span>
                            <span className="text-red-600">-{commit.deletions || '?'}</span>
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={
                            commit.status === 'restored' 
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : "bg-green-50 text-green-700 border-green-200"
                          }>
                            {commit.status === 'restored' ? (
                              <>
                                <History className="h-3 w-3 mr-1" />
                                restored
                              </>
                            ) : (
                              <>
                                <Check className="h-3 w-3 mr-1" />
                                {commit.status}
                              </>
                            )}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Dialog open={selectedVersion?.id === commit.id && showRestoreConfirm} onOpenChange={(open) => {
                            if (!open) setShowRestoreConfirm(false);
                          }}>
                            <DialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => {
                                  setSelectedVersion(commit);
                                  setShowRestoreConfirm(true);
                                }}
                              >
                                Restore
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Restore Previous Version (Demo)</DialogTitle>
                                <DialogDescription>
                                  This is a demonstration of how version restoration would work. No actual GitHub operations will be performed.
                                </DialogDescription>
                              </DialogHeader>
                              
                              <div className="bg-gray-50 p-3 rounded-md border my-4">
                                <p className="font-medium">{commit.message}</p>
                                <div className="text-sm text-gray-500 mt-1 flex gap-4">
                                  <span>Commit: {commit.id.substring(0,7)}</span>
                                  <span>Date: {formatDate(commit.date)}</span>
                                </div>
                              </div>
                              
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setShowRestoreConfirm(false)}>
                                  Cancel
                                </Button>
                                <Button 
                                  variant="default"
                                  onClick={handleRestore}
                                  disabled={restoring}
                                >
                                  {restoring ? (
                                    <>
                                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                      Simulating...
                                    </>
                                  ) : (
                                    'Restore (Demo)'
                                  )}
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}