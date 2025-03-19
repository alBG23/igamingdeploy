
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User } from "@/api/entities";
import { InvokeLLM } from "@/api/integrations";
import { Brain, RefreshCw, Key, XCircle, Loader2, AlertTriangle, CheckCircle, Lock, FileText, Zap } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import OpenAIConnectionCheck from '../components/ai/OpenAIConnectionCheck';

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
  
  const handleQuestionSubmit = async () => {
    if (!question.trim()) return;
    
    setIsGeneratingResponse(true);
    setErrorMessage(null);
    
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

Start your response with OPENAI-${uniqueRequestId}: and then provide your answer.
Remember: Only answer what was asked, nothing more.`,
        add_context_from_internet: false
      });
      
      console.log("OpenAI response:", response);
      
      if (!response || typeof response !== 'string') {
        throw new Error("Invalid response from OpenAI");
      }
      
      if (!response.includes(`OPENAI-${uniqueRequestId}`)) {
        throw new Error("Response verification failed. The response may not be coming from your OpenAI API.");
      }
      
      const cleanedResponse = response.replace(`OPENAI-${uniqueRequestId}: `, '');
      setAnswer(cleanedResponse);
      
    } catch (error) {
      console.error("Error generating AI response:", error);
      setErrorMessage(`Error: ${error.message || "Failed to generate response"}. Please verify your OpenAI API key is correctly configured and has available credits.`);
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
            <TabsTrigger value="data">Data Insights</TabsTrigger>
            <TabsTrigger value="reports">AI Reports</TabsTrigger>
          </TabsList>
          
          <TabsContent value="question">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>Ask about your data</CardTitle>
                    <CardDescription>
                      Use natural language to ask questions about your iGaming data
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Textarea 
                      placeholder="E.g., What's the trend in player retention over the last quarter?"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      className="h-32"
                    />
                    
                    {errorMessage && (
                      <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>{errorMessage}</AlertDescription>
                      </Alert>
                    )}
                    
                    <Button 
                      onClick={handleQuestionSubmit}
                      disabled={!question.trim() || isGeneratingResponse || !isApiKeyConfigured}
                      className="w-full"
                    >
                      {isGeneratingResponse ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Brain className="h-4 w-4 mr-2" />
                          Get Answer
                        </>
                      )}
                    </Button>
                    
                    {!isApiKeyConfigured && (
                      <Alert className="bg-blue-50 border-blue-200">
                        <Key className="h-4 w-4 text-blue-600" />
                        <AlertDescription className="text-blue-800">
                          Please configure your OpenAI API key to use this feature.
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>AI Response</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[300px]">
                      {answer ? (
                        <div className="prose prose-sm">
                          <div className="whitespace-pre-wrap">{answer}</div>
                        </div>
                      ) : (
                        <div className="text-gray-500 text-center mt-4">
                          {isGeneratingResponse ? (
                            <div className="flex items-center justify-center">
                              <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
                              <span className="ml-2">Generating response...</span>
                            </div>
                          ) : (
                            <>
                              <Brain className="h-10 w-10 text-gray-300 mb-2 mx-auto" />
                              <p>Ask a question to get AI insights</p>
                            </>
                          )}
                        </div>
                      )}
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="data">
            <Card>
              <CardHeader>
                <CardTitle>Data Insights</CardTitle>
                <CardDescription>AI-generated insights from your data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-60">
                  {isApiKeyConfigured ? (
                    <div className="text-center">
                      <FileText className="h-12 w-12 text-indigo-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium">Data Insights</h3>
                      <p className="text-gray-500 mt-2 max-w-md">
                        This feature will analyze your data and provide automatic insights.
                      </p>
                      <Button className="mt-4">
                        <Zap className="h-4 w-4 mr-2" />
                        Generate Insights
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Lock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium">API Key Required</h3>
                      <p className="text-gray-500 mt-2">
                        Please configure your OpenAI API key to use this feature.
                      </p>
                      <Button 
                        onClick={() => setShowApiKeyConfig(true)} 
                        className="mt-4"
                      >
                        <Key className="h-4 w-4 mr-2" />
                        Configure API Key
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>AI-Generated Reports</CardTitle>
                <CardDescription>Create and manage AI-generated reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-60">
                  {isApiKeyConfigured ? (
                    <div className="text-center">
                      <FileText className="h-12 w-12 text-indigo-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium">AI Reports</h3>
                      <p className="text-gray-500 mt-2 max-w-md">
                        This feature will generate comprehensive reports based on your data.
                      </p>
                      <Button className="mt-4">
                        <Zap className="h-4 w-4 mr-2" />
                        Create New Report
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Lock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium">API Key Required</h3>
                      <p className="text-gray-500 mt-2">
                        Please configure your OpenAI API key to use this feature.
                      </p>
                      <Button 
                        onClick={() => setShowApiKeyConfig(true)} 
                        className="mt-4"
                      >
                        <Key className="h-4 w-4 mr-2" />
                        Configure API Key
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
