
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { User } from "@/api/entities";
import { InvokeLLM } from "@/api/integrations";
import { Brain, RefreshCw, Key, XCircle, Loader2, AlertTriangle, CheckCircle, Lock, FileText, Zap, BarChart3, Users, TrendingUp, SendIcon, Book, Settings, Upload } from 'lucide-react';
import OpenAIConnectionCheck from '../components/ai/OpenAIConnectionCheck';
import OpenAITraining from '../components/ai/OpenAITraining';

export default function AIInsights() {
  const [activeTab, setActiveTab] = useState('question');
  const [metrics, setMetrics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [aiModel, setAiModel] = useState('gpt4');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [showApiKeyConfig, setShowApiKeyConfig] = useState(false);
  const [isApiKeyConfigured, setIsApiKeyConfigured] = useState(false);
  const [isGeneratingResponse, setIsGeneratingResponse] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [apiStatus, setApiStatus] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);

  useEffect(() => {
    fetchMetrics();
    checkApiKeyConfiguration();
  }, []);

  const fetchMetrics = async () => {
    setIsLoading(true);
    try {
      setTimeout(() => {
        setMetrics({
          ggr: 385000,
          ggr_growth: 12.5,
          ngr: 310000,
          ngr_growth: 8.2,
          active_players: 4700,
          active_players_growth: 5.8,
          new_players: 850,
          new_players_growth: -2.3,
          conversion_rate: 22.5,
          conversion_rate_growth: 1.2
        });
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching metrics:", error);
      setIsLoading(false);
    }
  };

  const checkApiKeyConfiguration = async () => {
    try {
      const user = await User.me();
      if (user && user.openai_api_key) {
        console.log("API key is configured in user profile");
        setIsApiKeyConfigured(true);
        
        try {
          const testResponse = await InvokeLLM({
            prompt: "Test connection. Respond with OK.",
            add_context_from_internet: false
          });
          
          console.log("API test response:", testResponse);
          
          if (testResponse && typeof testResponse === 'string') {
            setApiStatus("connected");
          } else {
            console.log("Unexpected test response format");
            setApiStatus("error");
          }
        } catch (testError) {
          console.error("API test error:", testError);
          setApiStatus("error");
        }
      } else {
        console.log("API key is not configured");
        setIsApiKeyConfigured(false);
        setApiStatus("not_configured");
      }
    } catch (error) {
      console.error("Error checking API key configuration:", error);
      setIsApiKeyConfigured(false);
      setApiStatus("error");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleQuestionSubmit();
    }
  };

  const handleQuestionSubmit = async () => {
    if (!question.trim()) return;
    
    setIsGeneratingResponse(true);
    setErrorMessage(null);
    
    const newMessage = { type: 'user', content: question };
    setChatHistory(prev => [...prev, newMessage]);
    
    try {
      console.log("Sending question to OpenAI:", question);
      
      const user = await User.me();
      if (!user?.openai_api_key) {
        throw new Error("OpenAI API key not configured");
      }

      const uniqueRequestId = Math.random().toString(36).substring(2, 10);
      
      const response = await InvokeLLM({
        prompt: `You are a helpful AI assistant. Answer the following question directly and concisely.
Do not add any analytics or data insights unless specifically asked.
Do not make assumptions or add information that wasn't requested.
Just answer exactly what was asked.

Question: ${question}

${metrics ? `Available metrics if needed:
- GGR: $${metrics.ggr.toLocaleString()} (${metrics.ggr_growth > 0 ? '+' : ''}${metrics.ggr_growth}%)
- NGR: $${metrics.ngr.toLocaleString()} (${metrics.ngr_growth > 0 ? '+' : ''}${metrics.ngr_growth}%)
- Active Players: ${metrics.active_players.toLocaleString()} (${metrics.active_players_growth > 0 ? '+' : ''}${metrics.active_players_growth}%)
- New Players: ${metrics.new_players.toLocaleString()} (${metrics.new_players_growth > 0 ? '+' : ''}${metrics.new_players_growth}%)
- Conversion Rate: ${metrics.conversion_rate}% (${metrics.conversion_rate_growth > 0 ? '+' : ''}${metrics.conversion_rate_growth}%)` : ''}

Previous conversation for context:
${chatHistory.map(msg => `${msg.type === 'user' ? 'User' : 'Assistant'}: ${msg.content}`).join('\n')}

Start your response with OPENAI-${uniqueRequestId}: and then provide your answer.
Remember: Only answer what was asked, nothing more.`,
        add_context_from_internet: false
      });
      
      if (!response || typeof response !== 'string') {
        throw new Error("Invalid response from OpenAI");
      }
      
      if (!response.includes(`OPENAI-${uniqueRequestId}`)) {
        throw new Error("Response verification failed. The response may not be coming from your OpenAI API.");
      }
      
      const cleanedResponse = response.replace(`OPENAI-${uniqueRequestId}: `, '');
      
      setChatHistory(prev => [...prev, { type: 'assistant', content: cleanedResponse }]);
      setQuestion('');
      
    } catch (error) {
      console.error("Error generating AI response:", error);
      setErrorMessage(`Error: ${error.message || "Failed to generate response"}. Please verify your OpenAI API key is correctly configured and has available credits.`);
    } finally {
      setIsGeneratingResponse(false);
    }
  };

  const handleGenerateInsights = async () => {
    setIsGeneratingResponse(true);
    setErrorMessage(null);
    
    try {
      const response = await InvokeLLM({
        prompt: `Analyze the following metrics and provide 3-5 key insights. Focus on trends, anomalies, and actionable recommendations:

Metrics:
- GGR: $${metrics.ggr.toLocaleString()} (${metrics.ggr_growth}% growth)
- NGR: $${metrics.ngr.toLocaleString()} (${metrics.ngr_growth}% growth)
- Active Players: ${metrics.active_players.toLocaleString()} (${metrics.active_players_growth}% growth)
- New Players: ${metrics.new_players.toLocaleString()} (${metrics.new_players_growth}% growth)
- Conversion Rate: ${metrics.conversion_rate}% (${metrics.conversion_rate_growth}% growth)

Format your response as bullet points, with clear insights and specific recommendations.`,
        add_context_from_internet: false
      });

      setChatHistory(prev => [...prev, 
        { type: 'system', content: 'Generating automated insights...' },
        { type: 'assistant', content: response }
      ]);
    } catch (error) {
      setErrorMessage("Failed to generate insights: " + error.message);
    } finally {
      setIsGeneratingResponse(false);
    }
  };

  const handleCreateReport = async () => {
    setIsGeneratingResponse(true);
    setErrorMessage(null);
    
    try {
      const response = await InvokeLLM({
        prompt: `Create a comprehensive iGaming performance report based on the following metrics:

Metrics:
- GGR: $${metrics.ggr.toLocaleString()} (${metrics.ggr_growth}% growth)
- NGR: $${metrics.ngr.toLocaleString()} (${metrics.ngr_growth}% growth)
- Active Players: ${metrics.active_players.toLocaleString()} (${metrics.active_players_growth}% growth)
- New Players: ${metrics.new_players.toLocaleString()} (${metrics.new_players_growth}% growth)
- Conversion Rate: ${metrics.conversion_rate}% (${metrics.conversion_rate_growth}% growth)

Structure the report with:
1. Executive Summary
2. Key Performance Indicators
3. Growth Analysis
4. Areas of Concern
5. Recommendations

Format with clear headings and bullet points.`,
        add_context_from_internet: false
      });

      setChatHistory(prev => [...prev, 
        { type: 'system', content: 'Generating AI report...' },
        { type: 'assistant', content: response }
      ]);
    } catch (error) {
      setErrorMessage("Failed to generate report: " + error.message);
    } finally {
      setIsGeneratingResponse(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">AI Insights</h1>
            <p className="text-gray-500">
              Get intelligent insights from your data using AI
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Select value={aiModel} onValueChange={setAiModel}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select AI model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt4">GPT-4 (Recommended)</SelectItem>
                <SelectItem value="gpt35">GPT-3.5 Turbo</SelectItem>
                <SelectItem value="claude">Anthropic Claude</SelectItem>
                <SelectItem value="trained">Your Trained Model</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              variant={isApiKeyConfigured ? "outline" : "default"}
              size="sm"
              onClick={() => setShowApiKeyConfig(!showApiKeyConfig)}
              className={isApiKeyConfigured ? "" : "bg-indigo-600 hover:bg-indigo-700"}
            >
              <Key className="h-4 w-4 mr-2" />
              {isApiKeyConfigured ? (
                <>
                  Configure API Key 
                  <Badge className={`ml-2 ${
                    apiStatus === "connected" ? "bg-green-100 text-green-800" : 
                    apiStatus === "error" ? "bg-red-100 text-red-800" : 
                    "bg-amber-100 text-amber-800"
                  }`}>
                    {apiStatus === "connected" ? "Connected" : 
                     apiStatus === "error" ? "Error" : 
                     "Status Unknown"}
                  </Badge>
                </>
              ) : (
                "Configure API Key"
              )}
            </Button>
          </div>
        </div>
        
        {showApiKeyConfig && (
          <OpenAIConnectionCheck />
        )}
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="question">Ask a Question</TabsTrigger>
            <TabsTrigger value="train">Train AI</TabsTrigger>
            <TabsTrigger value="data">Generate Insights</TabsTrigger>
            <TabsTrigger value="reports">AI Reports</TabsTrigger>
          </TabsList>
          
          <TabsContent value="question">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Chat with AI Assistant</CardTitle>
                    <CardDescription>
                      Ask questions about your iGaming data
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ScrollArea className="h-[400px] pr-4">
                      {chatHistory.map((message, index) => (
                        <div 
                          key={index} 
                          className={`mb-4 ${
                            message.type === 'user' ? 'flex justify-end' : 'flex justify-start'
                          }`}
                        >
                          <div 
                            className={`max-w-[80%] rounded-lg px-4 py-2 ${
                              message.type === 'user' 
                                ? 'bg-indigo-600 text-white' 
                                : message.type === 'system'
                                ? 'bg-gray-100 text-gray-600 italic'
                                : 'bg-white border text-gray-800'
                            }`}
                          >
                            <div className="whitespace-pre-wrap">{message.content}</div>
                          </div>
                        </div>
                      ))}
                    </ScrollArea>
                    
                    <div className="flex gap-2">
                      <Textarea 
                        placeholder="Ask a question..."
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-1"
                        rows={3}
                      />
                      <Button 
                        onClick={handleQuestionSubmit}
                        disabled={!question.trim() || isGeneratingResponse}
                        className="self-end"
                      >
                        {isGeneratingResponse ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <SendIcon className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    
                    {errorMessage && (
                      <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>{errorMessage}</AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              <div className="lg:col-span-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => setQuestion("What's our current GGR?")}
                    >
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Check GGR
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => setQuestion("How many active players do we have?")}
                    >
                      <Users className="mr-2 h-4 w-4" />
                      Active Players
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => setQuestion("What's our conversion rate trend?")}
                    >
                      <TrendingUp className="mr-2 h-4 w-4" />
                      Conversion Rate
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="train">
            <OpenAITraining />
          </TabsContent>
          
          <TabsContent value="data">
            <Card>
              <CardHeader>
                <CardTitle>Automated Insights</CardTitle>
                <CardDescription>Generate AI-powered insights from your data</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={handleGenerateInsights}
                  disabled={isGeneratingResponse}
                  className="w-full"
                >
                  {isGeneratingResponse ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Brain className="mr-2 h-4 w-4" />
                  )}
                  Generate Insights
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>AI-Generated Reports</CardTitle>
                <CardDescription>Create comprehensive reports using AI</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={handleCreateReport}
                  disabled={isGeneratingResponse}
                  className="w-full"
                >
                  {isGeneratingResponse ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <FileText className="mr-2 h-4 w-4" />
                  )}
                  Generate Report
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
