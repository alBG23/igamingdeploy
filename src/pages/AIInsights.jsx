import React, { useState, useEffect } from 'react';
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
  FileText
} from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

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
  const [activeTab, setActiveTab] = useState('assistant');
  const [userQuery, setUserQuery] = useState('');
  const [thinking, setThinking] = useState(false);
  const [conversation, setConversation] = useState([
    {
      role: 'assistant',
      content: 'Hello! I\'m your iGaming Analytics Assistant. Ask me anything about your data, player behavior, or revenue metrics. You can also train me to understand your specific business terminology and priorities.'
    }
  ]);
  const [suggestions, setSuggestions] = useState([
    'What are the main reasons for player churn in the last 30 days?',
    'Which games have the highest player value and retention?',
    'Analyze our payment processing and identify optimization opportunities',
    'Which acquisition channels bring the highest LTV players?'
  ]);
  const [isTraining, setIsTraining] = useState(false);
  const [generatedInsights, setGeneratedInsights] = useState([]);
  const [insightLoading, setInsightLoading] = useState(false);
  
  const handleSendMessage = async () => {
    if (!userQuery.trim()) return;
    
    const newMessage = {
      role: 'user',
      content: userQuery
    };
    
    setConversation(prev => [...prev, newMessage]);
    setThinking(true);
    setUserQuery('');
    
    try {
      // In a real implementation, this would send the user's query to your LLM
      // with proper context about their gaming data
      const response = await InvokeLLM({
        prompt: `You are an iGaming analytics assistant helping with this question: ${userQuery}. 
                Provide a helpful, insightful response based on typical iGaming industry patterns.
                Include specific metrics and suggestions where appropriate.`,
        add_context_from_internet: false
      });
      
      setConversation(prev => [...prev, {
        role: 'assistant',
        content: response
      }]);
      
      // Generate new suggestions based on the conversation
      const newSuggestions = await generateSuggestions(userQuery);
      setSuggestions(newSuggestions);
      
    } catch (error) {
      console.error('Error getting response:', error);
      setConversation(prev => [...prev, {
        role: 'assistant',
        content: "I'm sorry, I encountered an error processing your request. Please try again."
      }]);
    }
    
    setThinking(false);
  };
  
  const generateSuggestions = async (lastQuery) => {
    // In a real implementation, this would generate contextual follow-up questions
    // based on the conversation so far
    
    // For this demo, we'll use preset suggestions based on simple keyword matching
    if (lastQuery.toLowerCase().includes('churn')) {
      return [
        'What player segments have the highest churn rate?',
        'How does our bonus strategy impact retention?',
        'Which games have the highest retention rates?',
        'What is our current reactivation success rate?'
      ];
    } else if (lastQuery.toLowerCase().includes('game') || lastQuery.toLowerCase().includes('slot')) {
      return [
        'Which game providers have the best ROI?',
        'What is the average session length by game type?',
        'Which slots have the highest average bet size?',
        'How does game popularity vary by geography?'
      ];
    } else if (lastQuery.toLowerCase().includes('payment') || lastQuery.toLowerCase().includes('deposit')) {
      return [
        'What is our payment success rate by method?',
        'Which payment processors have the lowest fees?',
        'What\'s our average time to withdrawal completion?',
        'Where do most payment failures occur in the funnel?'
      ];
    } else {
      return [
        'What player segments should we focus on for VIP programs?',
        'How effective are our current acquisition strategies?',
        'What are the key factors driving our NGR fluctuations?',
        'How do we compare to industry benchmarks?'
      ];
    }
  };
  
  // For the Auto-Insights tab
  useEffect(() => {
    if (activeTab === 'auto-insights' && generatedInsights.length === 0) {
      generateInsight();
    }
  }, [activeTab]);
  
  const generateInsight = async () => {
    setInsightLoading(true);
    
    try {
      // In a real implementation, this would analyze your actual data
      // and generate insights based on anomalies, patterns, etc.
      
      const insights = [
        {
          id: 1,
          title: "Payment Friction Analysis",
          category: "payments",
          description: "Analysis of payment completion rates by payment method and geography.",
          details: "Credit card payments show a 14% drop in completion rate for players from Germany compared to the previous month. The primary drop-off occurs during the 3D Secure verification step. This represents approximately €9,500 in potentially lost deposits. Recommend investigating recent changes to 3D Secure implementation for German banks, and implementing a smart routing system that detects potential issues and offers alternative payment methods.",
          trend: "negative",
          impact: "medium",
          confidence: 87
        },
        {
          id: 2,
          title: "VIP Player Betting Pattern Shift",
          category: "player",
          description: "Detected significant changes in VIP player betting behavior.",
          details: "Your top 50 VIP players have shifted 28% of their betting activity from slots to live casino games in the past 30 days. This correlates with the recent promotional focus on Evolution Gaming's new live dealer experiences. This segment now generates 34% of total GGR, up from 29%. Recommend expanding live casino game offerings and considering a dedicated VIP live dealer table with branded elements.",
          trend: "positive",
          impact: "high",
          confidence: 92
        },
        {
          id: 3,
          title: "Affiliate ROI Analysis",
          category: "marketing",
          description: "Performance evaluation of affiliate marketing channels.",
          details: "Affiliates focused on SEO content are delivering 2.3x better player value compared to paid social affiliates. Players from content-focused affiliates show 41% higher retention at the 30-day mark and 27% higher average deposit values. However, volume from these channels is 65% lower. Recommend renegotiating terms with top-performing content affiliates to incentivize volume increases, potentially with tiered commission structures.",
          trend: "neutral",
          impact: "medium",
          confidence: 84
        }
      ];
      
      setGeneratedInsights(insights);
    } catch (error) {
      console.error('Error generating insights:', error);
    }
    
    setInsightLoading(false);
  };
  
  // For the Training tab
  const handleStartTraining = () => {
    setIsTraining(true);
    
    // Simulate training process
    setTimeout(() => {
      setIsTraining(false);
    }, 5000);
  };
  
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Insights</h1>
          <p className="text-gray-500 mt-1">
            Access AI-powered analytics and insights for your gaming operations
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="assistant" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Analytics Assistant
            </TabsTrigger>
            <TabsTrigger value="auto-insights" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Auto-Insights
            </TabsTrigger>
            <TabsTrigger value="training" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Training
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="assistant">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Main Chat Area - Takes 3/4 of the screen on large displays */}
              <div className="lg:col-span-3 space-y-4">
                <Card className="h-[calc(100vh-240px)]">
                  <CardHeader className="border-b p-4">
                    <CardTitle className="text-xl flex items-center">
                      <Brain className="h-5 w-5 mr-2 text-indigo-600" />
                      Analytics Assistant
                    </CardTitle>
                    <CardDescription>
                      Ask questions about your data, player behavior, or revenue metrics
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="p-0 flex-1 overflow-hidden">
                    <ScrollArea className="h-[calc(100vh-380px)] p-4">
                      {conversation.map((message, index) => (
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
                      
                      {thinking && (
                        <div className="mb-4 flex justify-start">
                          <div className="bg-gray-100 text-gray-800 rounded-lg px-4 py-2">
                            <div className="flex space-x-2">
                              <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                              <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{animationDelay: '0.2s'}}></div>
                              <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{animationDelay: '0.4s'}}></div>
                            </div>
                          </div>
                        </div>
                      )}
                    </ScrollArea>
                  </CardContent>
                  
                  <CardFooter className="p-4 border-t">
                    <div className="w-full flex gap-2">
                      <Textarea
                        placeholder="Ask a question about your analytics data..."
                        value={userQuery}
                        onChange={(e) => setUserQuery(e.target.value)}
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
                        disabled={thinking || !userQuery.trim()}
                        className="h-auto"
                      >
                        {thinking ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <Send className="h-5 w-5" />
                        )}
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </div>
              
              {/* Suggestions Panel - Takes 1/4 of the screen on large displays */}
              <div className="space-y-4">
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg">Suggested Questions</CardTitle>
                    <CardDescription>
                      Click on any suggestion to ask the assistant
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="space-y-2">
                      {suggestions.map((suggestion, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          className="w-full justify-start text-left h-auto py-2"
                          onClick={() => {
                            setUserQuery(suggestion);
                            handleSendMessage();
                          }}
                          disabled={thinking}
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg">Support</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="space-y-4">
                      <p className="text-sm text-gray-500">
                        The assistant can help with data analysis, identify player trends, analyze marketing effectiveness, and more.
                      </p>
                      
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Examples:</h4>
                        <ul className="text-sm text-gray-500 space-y-1 list-disc list-inside">
                          <li>Analyze player churn patterns</li>
                          <li>Identify highest value games</li>
                          <li>Compare revenue across geo regions</li>
                          <li>Evaluate bonus campaign ROI</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="auto-insights">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Automatically Generated Insights</h2>
                <Button 
                  onClick={generateInsight} 
                  disabled={insightLoading}
                  className="gap-2"
                >
                  {insightLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Generate New Insights
                    </>
                  )}
                </Button>
              </div>
              
              {insightLoading ? (
                <div className="flex flex-col items-center justify-center p-12">
                  <Loader2 className="h-12 w-12 text-indigo-600 animate-spin mb-4" />
                  <h3 className="text-lg font-medium mb-2">Analyzing Your Data</h3>
                  <p className="text-gray-500 mb-6 text-center max-w-md">
                    Our AI is scanning through your analytics data to identify patterns, anomalies, and opportunities.
                  </p>
                  <Progress value={45} className="w-full max-w-md" />
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {generatedInsights.map((insight) => (
                    <Card key={insight.id} className="overflow-hidden">
                      <CardHeader className="p-4 pb-0">
                        <div className="flex justify-between">
                          <Badge className={
                            insight.category === 'payments' ? 'bg-blue-100 text-blue-800' :
                            insight.category === 'player' ? 'bg-green-100 text-green-800' :
                            'bg-purple-100 text-purple-800'
                          }>
                            {insight.category}
                          </Badge>
                          <Badge variant="outline" className={
                            insight.trend === 'positive' ? 'bg-green-50 text-green-800 border-green-200' :
                            insight.trend === 'negative' ? 'bg-red-50 text-red-800 border-red-200' :
                            'bg-gray-50 text-gray-800 border-gray-200'
                          }>
                            {insight.trend === 'positive' && <TrendingUp className="h-3 w-3 mr-1" />}
                            {insight.trend === 'negative' && <TrendingUp className="h-3 w-3 mr-1 rotate-180" />}
                            {insight.trend.charAt(0).toUpperCase() + insight.trend.slice(1)}
                          </Badge>
                        </div>
                        <CardTitle className="mt-2">{insight.title}</CardTitle>
                        <CardDescription>{insight.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="p-4">
                        <p className="text-gray-700">{insight.details}</p>
                      </CardContent>
                      <div className="px-4 py-2 bg-gray-50 border-t flex justify-between items-center">
                        <div className="flex items-center gap-1 text-gray-500 text-sm">
                          <ShieldCheck className="h-4 w-4" />
                          <span>Confidence: {insight.confidence}%</span>
                        </div>
                        <Badge className={
                          insight.impact === 'high' ? 'bg-red-100 text-red-800' :
                          insight.impact === 'medium' ? 'bg-amber-100 text-amber-800' :
                          'bg-blue-100 text-blue-800'
                        }>
                          {insight.impact} impact
                        </Badge>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
              
              {generatedInsights.length > 0 && (
                <div className="flex justify-center mt-6">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export All Insights
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <div className="p-6 text-center">
                        <h3 className="text-lg font-medium mb-2">Export Format</h3>
                        <p className="text-gray-500 mb-4">Choose a format to export insights</p>
                        <div className="flex justify-center gap-3">
                          <Button variant="outline" className="w-28">
                            <FileText className="h-4 w-4 mr-2" />
                            PDF
                          </Button>
                          <Button variant="outline" className="w-28">
                            <TableFile className="h-4 w-4 mr-2" />
                            CSV
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="training">
            <Card>
              <CardHeader>
                <CardTitle>Train Your AI Assistant</CardTitle>
                <CardDescription>
                  Customize the AI to understand your specific business terminology, metrics, and KPIs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-amber-50 border border-amber-200 rounded-md p-4 text-amber-800">
                  <h3 className="flex items-center font-medium">
                    <AlertCircle className="h-5 w-5 mr-2 text-amber-600" />
                    Why train your AI?
                  </h3>
                  <p className="mt-1 text-sm">
                    Training improves the AI's understanding of your specific iGaming business context, terminology, and priorities. 
                    This leads to more accurate and relevant insights that align with your business goals.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h3 className="text-lg font-medium">Custom Terminology</h3>
                    <p className="text-sm text-gray-500">
                      Define terms, acronyms, and metrics specific to your organization
                    </p>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Input placeholder="Term (e.g., ARPD)" />
                        <Input placeholder="Definition" />
                      </div>
                      <div className="flex gap-2">
                        <Input placeholder="Term" />
                        <Input placeholder="Definition" />
                      </div>
                      <Button variant="outline" size="sm" className="w-full">
                        + Add More Terms
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-lg font-medium">Business Priorities</h3>
                    <p className="text-sm text-gray-500">
                      Rank your business goals to help the AI focus on what matters most
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Select defaultValue="acquisition">
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="acquisition">Player Acquisition</SelectItem>
                            <SelectItem value="retention">Player Retention</SelectItem>
                            <SelectItem value="reactivation">Player Reactivation</SelectItem>
                            <SelectItem value="ltv">Lifetime Value</SelectItem>
                            <SelectItem value="conversion">Conversion Rate</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select defaultValue="high">
                          <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Importance" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="critical">Critical</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center gap-3">
                        <Select defaultValue="retention">
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="acquisition">Player Acquisition</SelectItem>
                            <SelectItem value="retention">Player Retention</SelectItem>
                            <SelectItem value="reactivation">Player Reactivation</SelectItem>
                            <SelectItem value="ltv">Lifetime Value</SelectItem>
                            <SelectItem value="conversion">Conversion Rate</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select defaultValue="critical">
                          <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Importance" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="critical">Critical</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button variant="outline" size="sm" className="w-full">
                        + Add More Priorities
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-lg font-medium">Data Context</h3>
                  <p className="text-sm text-gray-500">
                    Upload business documents to help the AI understand your operation
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border border-dashed rounded-md p-8 flex flex-col items-center justify-center text-center">
                      <Upload className="h-8 w-8 text-gray-400 mb-2" />
                      <h4 className="font-medium">Upload Documents</h4>
                      <p className="text-sm text-gray-500 mt-1">
                        Drag & drop or click to upload PDFs, Excels, etc.
                      </p>
                      <Button variant="outline" size="sm" className="mt-3">
                        Browse Files
                      </Button>
                    </div>
                    <div className="border rounded-md p-4">
                      <h4 className="font-medium mb-2">Connected Data Sources</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm p-2 bg-green-50 rounded border border-green-100">
                          <span className="flex items-center">
                            <Database className="h-4 w-4 text-green-600 mr-2" />
                            PostgreSQL Database
                          </span>
                          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Connected</Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm p-2 rounded border">
                          <span className="flex items-center">
                            <LineChart className="h-4 w-4 text-gray-500 mr-2" />
                            Google Analytics
                          </span>
                          <Button variant="ghost" size="sm" className="h-7 text-xs">Connect</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t p-4">
                <Button variant="outline">
                  Reset to Defaults
                </Button>
                <Button 
                  disabled={isTraining}
                  onClick={handleStartTraining}
                >
                  {isTraining ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Training in Progress...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Start Training
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}