
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InvokeLLM } from "@/api/integrations";
import { 
  Brain, 
  Settings, 
  Send, 
  Loader2, 
  Sparkles, 
  RefreshCw, 
  Download, 
  Book, 
  BarChart, 
  LineChart, 
  Zap, 
  MessageSquare, 
  GraduationCap, 
  User, 
  TrendingUp, 
  Shield, 
  ShieldCheck, 
  AlertCircle, 
  Upload, 
  Database, 
  FileText,
  CheckCircle2,
  Monitor,
  Cpu,
  PanelLeft,
  Volume2
} from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogHeader, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

// Helper component for file icons
const TableFile = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="8" y1="13" x2="16" y2="13" />
      <line x1="8" y1="17" x2="16" y2="17" />
      <line x1="10" y1="9" x2="12" y2="9" />
    </svg>
  );
};

export default function AIInsights() {
  const [activeTab, setActiveTab] = useState('chat');
  const [activePage, setActivePage] = useState('insights');
  const [aiInput, setAiInput] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedDataSource, setSelectedDataSource] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [conversations, setConversations] = useState([
    { 
      role: 'assistant', 
      content: 'Hello! I\'m your AI Analytics Assistant. How can I help you analyze your gaming data today?'
    }
  ]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [selectedAiModel, setSelectedAiModel] = useState('gpt-4');
  const [selectedVoice, setSelectedVoice] = useState('alloy'); // Default voice
  const [isTrainingOpen, setIsTrainingOpen] = useState(false);
  const [trainingInput, setTrainingInput] = useState('');
  const [generalTrainingText, setGeneralTrainingText] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioSrc, setAudioSrc] = useState('');
  const [termInput, setTermInput] = useState('');
  const [trainingTerms, setTrainingTerms] = useState([
    { term: 'GGR', definition: 'Gross Gaming Revenue - total bets minus total wins' },
    { term: 'NGR', definition: 'Net Gaming Revenue - GGR minus bonuses and taxes' },
    { term: 'FTD', definition: 'First Time Depositor - a player who has made their first deposit' },
    { term: 'CPA', definition: 'Cost Per Acquisition - marketing cost to acquire one new depositing player' },
    { term: 'LTV', definition: 'Lifetime Value - expected total revenue from a player over their lifetime' }
  ]);
  const [priorityInput, setPriorityInput] = useState('');
  const [trainingPriorities, setTrainingPriorities] = useState([
    'Maintain strict compliance with gambling regulations',
    'Protect customer data and privacy at all costs',
    'Always suggest responsible gambling practices',
    'Focus on player retention and engagement metrics',
    'Highlight anomalies in payment processing'
  ]);
  
  const audioRef = useRef(null);
  
  // Connected platforms for demo
  const connectedPlatforms = [
    { 
      name: 'PostgreSQL Database', 
      status: 'connected', 
      lastSync: '10 minutes ago',
      details: 'Main data warehouse - 142 tables'
    },
    { 
      name: 'BigQuery', 
      status: 'connected', 
      lastSync: '25 minutes ago',
      details: 'Marketing data - 37 tables'
    },
    { 
      name: 'MongoDB', 
      status: 'error', 
      lastSync: '3 hours ago',
      details: 'Connection error: Authentication failed'
    },
    { 
      name: 'Affiliate API', 
      status: 'connected', 
      lastSync: '1 hour ago',
      details: 'Connected to 3 affiliate platforms'
    }
  ];

  const sampleInsights = [
    {
      id: 1,
      title: 'Player Churn Risk',
      description: 'VIP players from Germany show 23% higher churn risk this month',
      category: 'player_behavior',
      severity: 'high',
      trend: 'increasing',
      date: '2023-04-12',
      recommendations: [
        'Review recent bonus terms for German market',
        'Check for payment processing issues with German payment providers',
        'Analyze competitor promotions in this region'
      ]
    },
    {
      id: 2,
      title: 'Deposit Method Performance',
      description: 'Credit card acceptance rate dropped 8% in the last week',
      category: 'payments',
      severity: 'medium',
      trend: 'decreasing',
      date: '2023-04-10',
      recommendations: [
        'Investigate changes with payment processor',
        'Check for recent regulatory changes',
        'Review error logs from payment gateway'
      ]
    },
    {
      id: 3,
      title: 'Game Performance Outlier',
      description: 'New slot "Mystic Fortune" shows 40% above average engagement',
      category: 'content',
      severity: 'low',
      trend: 'steady',
      date: '2023-04-05',
      recommendations: [
        'Increase promotion of this game to new players',
        'Analyze player segments most engaged with this content',
        'Consider featuring in welcome bonus offers'
      ]
    }
  ];
  
  // Function to handle adding a new training term
  const handleAddTerm = () => {
    if (termInput.trim() === '') return;
    
    const parts = termInput.split(':');
    if (parts.length < 2) return;
    
    const newTerm = {
      term: parts[0].trim(),
      definition: parts.slice(1).join(':').trim()
    };
    
    setTrainingTerms([...trainingTerms, newTerm]);
    setTermInput('');
  };
  
  // Function to handle adding a new priority
  const handleAddPriority = () => {
    if (priorityInput.trim() === '') return;
    
    setTrainingPriorities([...trainingPriorities, priorityInput.trim()]);
    setPriorityInput('');
  };
  
  // Function to generate audio
  const generateAudio = async (text) => {
    setIsPlaying(true);
    setAudioProgress(10);
    
    try {
      // In a real implementation, this would call a text-to-speech API
      // Here we simulate with a sample audio file
      await new Promise(resolve => setTimeout(resolve, 1500));
      setAudioProgress(50);
      
      // Sample audio URL (would be returned from TTS API in real implementation)
      const demoAudioUrl = "https://actions.google.com/sounds/v1/science_fiction/alien_beam.ogg";
      setAudioSrc(demoAudioUrl);
      setAudioProgress(100);
      
      if (audioRef.current) {
        audioRef.current.onended = () => {
          setIsPlaying(false);
        };
        audioRef.current.play();
      }
    } catch (error) {
      console.error("Audio generation error:", error);
      setIsPlaying(false);
    }
  };
  
  // Function to toggle audio playback
  const toggleAudio = () => {
    if (isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlaying(false);
    } else {
      if (audioRef.current && audioSrc) {
        audioRef.current.play();
        setIsPlaying(true);
      } else {
        // Create sample text from the active insight
        const textToRead = "This is a sample audio message that would be generated with the selected voice in a real implementation. The actual implementation would integrate with a text-to-speech service.";
        generateAudio(textToRead);
      }
    }
  };
  
  // Function to handle training submission
  const handleTrainAI = async () => {
    if (trainingInput.trim() === '') return;
    
    setIsProcessing(true);
    
    try {
      // Simulating API call for training
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Reset the training input and close the dialog
      setTrainingInput('');
      setIsTrainingOpen(false);
      
      // Show confirmation message
      alert('AI training data has been successfully submitted!');
    } catch (error) {
      console.error('Training error:', error);
      alert('There was an error training the AI');
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Function to handle voice selection
  const handleVoiceChange = (voice) => {
    setSelectedVoice(voice);
    // In a real implementation, this would update the voice setting
    console.log(`Voice changed to: ${voice}`);
  };
  
  // Function to handle AI model selection  
  const handleModelChange = (model) => {
    setSelectedAiModel(model);
    // In a real implementation, this would update the model setting
    console.log(`AI model changed to: ${model}`);
  };

  // Handle sending a message to the AI
  const handleSendMessage = async () => {
    if (!aiInput.trim()) return;
    
    const newMessage = {
      role: 'user',
      content: aiInput
    };
    
    setConversations(prev => [...prev, newMessage]);
    setAiInput('');
    
    setIsProcessing(true);
    try {
      const response = await InvokeLLM({
        prompt: `You are an iGaming analytics assistant helping with this question: "${aiInput}". 
                Provide a helpful, insightful response based on typical iGaming industry patterns.
                
                Terms to understand:
                ${trainingTerms.map(t => `${t.term}: ${t.definition}`).join('\n')}
                
                Priority considerations:
                ${trainingPriorities.join('\n')}
                
                ${generalTrainingText ? `Additional context:\n${generalTrainingText}` : ''}`
      });

      setConversations(prev => [...prev, {
        role: 'assistant',
        content: response
      }]);
    } catch (error) {
      console.error('Error getting response:', error);
      setConversations(prev => [...prev, {
        role: 'assistant',
        content: "I'm sorry, I encountered an error processing your request. Please try again."
      }]);
    }
    
    setIsProcessing(false);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <audio 
        ref={audioRef} 
        src={audioSrc} 
        style={{ display: 'none' }}
      />
      
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">AI Insights</h1>
            <p className="text-gray-500 mt-1">
              Access AI-powered analytics and insights for your gaming operations
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Tabs defaultValue={activePage} className="w-[400px]">
              <TabsList>
                <TabsTrigger 
                  value="insights" 
                  onClick={() => setActivePage('insights')}
                  className="flex items-center gap-1"
                >
                  <Sparkles className="h-4 w-4" />
                  Insights
                </TabsTrigger>
                <TabsTrigger 
                  value="assistant" 
                  onClick={() => setActivePage('assistant')}
                  className="flex items-center gap-1"
                >
                  <MessageSquare className="h-4 w-4" />
                  Assistant
                </TabsTrigger>
                <TabsTrigger 
                  value="training" 
                  onClick={() => setActivePage('training')}
                  className="flex items-center gap-1"
                >
                  <GraduationCap className="h-4 w-4" />
                  Training
                </TabsTrigger>
              </TabsList>
            </Tabs>
            
            <Dialog open={showSettings} onOpenChange={setShowSettings}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Settings
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>AI Model Configuration</DialogTitle>
                  <DialogDescription>
                    Choose and configure the AI models that power your analytics
                  </DialogDescription>
                </DialogHeader>
                
                <Tabs defaultValue="models">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="models">AI Models</TabsTrigger>
                    <TabsTrigger value="voice">Voice Settings</TabsTrigger>
                    <TabsTrigger value="data">Data Sources</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="models" className="space-y-4 mt-4">
                    <h3 className="text-lg font-medium">Select AI Model</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <Card 
                        className={`cursor-pointer border-2 ${selectedAiModel === 'gpt-4' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'}`}
                        onClick={() => handleModelChange('gpt-4')}
                      >
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Brain className="h-5 w-5 text-indigo-600" />
                            OpenAI GPT-4
                          </CardTitle>
                          <CardDescription>
                            Most capable model for complex analytics and insights
                          </CardDescription>
                        </CardHeader>
                      </Card>
                      
                      <Card 
                        className={`cursor-pointer border-2 ${selectedAiModel === 'gpt-3.5' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'}`}
                        onClick={() => handleModelChange('gpt-3.5')}
                      >
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Zap className="h-5 w-5 text-amber-500" />
                            OpenAI GPT-3.5
                          </CardTitle>
                          <CardDescription>
                            Faster responses for routine analytics questions
                          </CardDescription>
                        </CardHeader>
                      </Card>
                      
                      <Card 
                        className={`cursor-pointer border-2 ${selectedAiModel === 'claude-3' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'}`}
                        onClick={() => handleModelChange('claude-3')}
                      >
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <BarChart className="h-5 w-5 text-purple-600" />
                            Anthropic Claude 3
                          </CardTitle>
                          <CardDescription>
                            Excellent for analytical reasoning and data understanding
                          </CardDescription>
                        </CardHeader>
                      </Card>
                      
                      <Card 
                        className={`cursor-pointer border-2 ${selectedAiModel === 'gemini-pro' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'}`}
                        onClick={() => handleModelChange('gemini-pro')}
                      >
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <LineChart className="h-5 w-5 text-blue-600" />
                            Google Gemini Pro
                          </CardTitle>
                          <CardDescription>
                            Strong multimodal capabilities for chart and image analysis
                          </CardDescription>
                        </CardHeader>
                      </Card>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="voice" className="space-y-4 mt-4">
                    <h3 className="text-lg font-medium">Voice Settings</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Select a voice for audio responses and report readouts
                    </p>
                    
                    <RadioGroup value={selectedVoice} onValueChange={handleVoiceChange} className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="alloy" id="alloy" />
                        <Label htmlFor="alloy" className="cursor-pointer">
                          <div>
                            <div className="font-medium">Alloy</div>
                            <div className="text-sm text-gray-500">Neutral voice with balanced tone</div>
                          </div>
                        </Label>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="ml-auto"
                          onClick={() => {
                            handleVoiceChange('alloy');
                            toggleAudio();
                          }}
                        >
                          <Volume2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="echo" id="echo" />
                        <Label htmlFor="echo" className="cursor-pointer">
                          <div>
                            <div className="font-medium">Echo</div>
                            <div className="text-sm text-gray-500">Male voice with deeper tones</div>
                          </div>
                        </Label>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="ml-auto"
                          onClick={() => {
                            handleVoiceChange('echo');
                            toggleAudio();
                          }}
                        >
                          <Volume2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="nova" id="nova" />
                        <Label htmlFor="nova" className="cursor-pointer">
                          <div>
                            <div className="font-medium">Nova</div>
                            <div className="text-sm text-gray-500">Female voice with professional tone</div>
                          </div>
                        </Label>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="ml-auto"
                          onClick={() => {
                            handleVoiceChange('nova');
                            toggleAudio();
                          }}
                        >
                          <Volume2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="shimmer" id="shimmer" />
                        <Label htmlFor="shimmer" className="cursor-pointer">
                          <div>
                            <div className="font-medium">Shimmer</div>
                            <div className="text-sm text-gray-500">Female voice with higher pitch</div>
                          </div>
                        </Label>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="ml-auto"
                          onClick={() => {
                            handleVoiceChange('shimmer');
                            toggleAudio();
                          }}
                        >
                          <Volume2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </RadioGroup>
                    
                    {isPlaying && (
                      <div className="mt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Playing sample...</span>
                          <Button variant="ghost" size="sm" onClick={toggleAudio}>
                            Stop
                          </Button>
                        </div>
                        <Progress value={audioProgress} className="h-2" />
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="data" className="space-y-4 mt-4">
                    <h3 className="text-lg font-medium">Connected Data Sources</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Select which data sources the AI can access for insights
                    </p>
                    
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Source</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Last Sync</TableHead>
                          <TableHead>Access</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {connectedPlatforms.map((platform, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{platform.name}</TableCell>
                            <TableCell>
                              {platform.status === 'connected' ? (
                                <Badge className="bg-green-100 text-green-800">Connected</Badge>
                              ) : (
                                <Badge className="bg-red-100 text-red-800">Error</Badge>
                              )}
                            </TableCell>
                            <TableCell>{platform.lastSync}</TableCell>
                            <TableCell>
                              <Checkbox defaultChecked={platform.status === 'connected'} />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TabsContent>
                </Tabs>
                
                <DialogFooter className="mt-6">
                  <Button variant="outline" onClick={() => setShowSettings(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setShowSettings(false)}>
                    Save Settings
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        {activePage === 'insights' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>AI-Generated Insights</CardTitle>
                <CardDescription>
                  Key findings and anomalies detected in your data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sampleInsights.map((insight) => (
                    <Card key={insight.id} className="overflow-hidden">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{insight.title}</CardTitle>
                            <CardDescription className="mt-1">
                              {insight.description}
                            </CardDescription>
                          </div>
                          <div className="flex gap-2">
                            <Badge 
                              className={
                                insight.severity === 'high' 
                                  ? 'bg-red-100 text-red-800' 
                                  : insight.severity === 'medium'
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-blue-100 text-blue-800'
                              }
                            >
                              {insight.severity} priority
                            </Badge>
                            <Badge className="bg-gray-100 text-gray-800">
                              {insight.category.replace('_', ' ')}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-3">
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Recommendations:</h4>
                          <ul className="space-y-1 pl-5 list-disc text-sm">
                            {insight.recommendations.map((rec, idx) => (
                              <li key={idx}>{rec}</li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between pt-0 border-t bg-gray-50">
                        <span className="text-xs text-gray-500">
                          Generated on {insight.date}
                        </span>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" onClick={toggleAudio}>
                            <Volume2 className="h-4 w-4 mr-2" />
                            Listen
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Export
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        {activePage === 'assistant' && (
          <Card className="h-[calc(100vh-240px)]">
            <CardHeader className="p-4 flex justify-between flex-row items-center">
              <div>
                <CardTitle className="text-xl">Analytics Assistant</CardTitle>
                <CardDescription>
                  Ask questions about your data, player behavior, or revenue metrics
                </CardDescription>
              </div>
              <div className="flex items-center">
                <Select value={selectedAiModel} onValueChange={handleModelChange}>
                  <SelectTrigger className="h-8 w-44">
                    <SelectValue placeholder="Select AI model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-4">GPT-4</SelectItem>
                    <SelectItem value="gpt-3.5">GPT-3.5</SelectItem>
                    <SelectItem value="claude-3">Claude 3</SelectItem>
                    <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-hidden">
              <ScrollArea className="h-[calc(100vh-380px)] p-4">
                {conversations.map((message, index) => (
                  <div 
                    key={index} 
                    className={`mb-4 flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[80%] rounded-lg px-4 py-2 ${
                        message.role === 'user' 
                          ? 'bg-indigo-600 text-white' 
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
            <CardFooter className="p-4 border-t">
              <div className="w-full flex gap-2">
                <Textarea
                  placeholder="Ask a question about your analytics data..."
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  className="flex-1 resize-none"
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={isProcessing || !aiInput.trim()}
                  className="h-auto"
                >
                  {isProcessing ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </CardFooter>
          </Card>
        )}
        
        {activePage === 'training' && (
          <Card>
            <CardHeader>
              <CardTitle>Train Your AI Assistant</CardTitle>
              <CardDescription>
                Customize the AI to understand your specific business terminology, metrics, and KPIs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-3">
                <h3 className="text-lg font-medium">General Instructions & Guidelines</h3>
                <Textarea
                  value={generalTrainingText}
                  onChange={(e) => setGeneralTrainingText(e.target.value)}
                  placeholder="Add general instructions about the industry, your business, what AI should or should not do, confidentiality requirements, etc."
                  className="min-h-[150px]"
                />
                <Button 
                  onClick={() => alert('General instructions saved!')} 
                  className="w-fit"
                  disabled={!generalTrainingText.trim()}
                >
                  Save General Instructions
                </Button>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-1 gap-3">
                <h3 className="text-lg font-medium">Add Training Terms</h3>
                <div className="flex gap-2">
                  <Input value={termInput} onChange={(e) => setTermInput(e.target.value)} placeholder="Term: Definition" />
                  <Button onClick={handleAddTerm}>Add Term</Button>
                </div>
                <div className="border rounded-lg p-3 bg-gray-50">
                  {trainingTerms.map((term, index) => (
                    <div key={index} className="flex justify-between py-1 border-b last:border-0">
                      <span className="font-medium">{term.term}</span>
                      <span className="text-gray-600">{term.definition}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                <h3 className="text-lg font-medium">Add Training Priorities</h3>
                <div className="flex gap-2">
                  <Input value={priorityInput} onChange={(e) => setPriorityInput(e.target.value)} placeholder="Priority" />
                  <Button onClick={handleAddPriority}>Add Priority</Button>
                </div>
                <div className="border rounded-lg p-3 bg-gray-50">
                  <ul className="space-y-1 list-disc pl-5">
                    {trainingPriorities.map((priority, index) => (
                      <li key={index}>
                        <span>{priority}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div>
                <Button onClick={handleTrainAI} disabled={isProcessing}>
                  {isProcessing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Train AI with All Data
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
