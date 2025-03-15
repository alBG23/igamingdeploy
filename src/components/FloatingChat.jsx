import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Brain, ChevronDown, SendIcon, X, FileText, BarChart, Volume2, Pause, DownloadCloud, Share2, RefreshCw, Loader2, Check, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ResponsiveContainer, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InvokeLLM } from "@/api/integrations";

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([
    { 
      type: 'assistant', 
      content: 'Hello! I\'m your iGaming Analytics Assistant. How can I help you today?' 
    }
  ]);
  const [activeView, setActiveView] = useState('chat');
  const [isThinking, setIsThinking] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [temporaryReport, setTemporaryReport] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioSrc, setAudioSrc] = useState('');
  const [audioError, setAudioError] = useState(false);
  const audioRef = useRef(null);
  const messagesEndRef = useRef(null);
  
  const COLORS = ['#4F46E5', '#06B6D4', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981'];

  // Sample data for demo
  const sampleReportData = {
    title: "Quick Revenue Breakdown by Game Category",
    description: "30-day snapshot of revenue distribution across game categories",
    chartType: "pie",
    data: [
      { name: 'Slots', value: 45 },
      { name: 'Live Casino', value: 25 },
      { name: 'Sports Betting', value: 20 },
      { name: 'Table Games', value: 10 }
    ],
    insights: [
      "Slots continue to be your highest revenue generator at 45% of total NGR",
      "Live Casino shows 12% growth compared to previous period",
      "Sports Betting conversion rates need attention - 5% below industry average"
    ],
    recommendations: [
      "Consider reallocating 10% of acquisition budget from Table Games to Live Casino",
      "Optimize Sports Betting journey to address 23% drop-off during registration"
    ]
  };

  // Alternative report for bar chart demo
  const sampleBarChartData = {
    title: "Affiliate Performance Comparison",
    description: "Comparison of top 5 affiliates by key metrics",
    chartType: "bar",
    data: [
      { name: 'TopAffiliates', ftds: 65, roi: 2.5, churn: 22 },
      { name: 'CasinoPartners', ftds: 45, roi: 2.8, churn: 18 },
      { name: 'GamingAff', ftds: 80, roi: 2.4, churn: 25 },
      { name: 'BetPromo', ftds: 55, roi: 2.5, churn: 20 },
      { name: 'SlotPartners', ftds: 70, roi: 2.3, churn: 21 }
    ],
    insights: [
      "CasinoPartners shows highest ROI with lowest churn rate",
      "GamingAff delivers highest volume but has concerning churn rate",
      "SlotPartners performance has declined 8% since last month"
    ],
    recommendations: [
      "Increase CPA with CasinoPartners to boost volume",
      "Work with GamingAff to implement targeted retention campaigns"
    ]
  };
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    
    // Add user message
    const userMessage = inputValue;
    setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
    setInputValue('');
    setIsThinking(true);
    
    // Build context from previous messages for OpenAI
    const conversationContext = messages.map(msg => 
      `${msg.type === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
    ).join('\n');
    
    try {
      // Check if this is a report request
      const lowerCaseMessage = userMessage.toLowerCase();
      const reportKeywords = ['report', 'chart', 'graph', 'show me', 'visualize', 'display'];
      const isReportRequest = reportKeywords.some(keyword => lowerCaseMessage.includes(keyword));
      
      if (isReportRequest) {
        // Generate report with OpenAI
        setIsGeneratingReport(true);
        
        // Generate AI response using InvokeLLM integration
        const response = await InvokeLLM({
          prompt: `You are an iGaming analytics AI assistant helping with data visualization. 
          The user has requested: "${userMessage}".
          Based on this request, determine the most appropriate visualization to show.
          Reply with a conversational response that informs the user you've created a visualization
          and asks if they'd like you to explain the key insights.
          Keep your response under 2 sentences and conversational.
          
          Previous conversation:
          ${conversationContext}`,
          add_context_from_internet: false
        });
        
        setMessages(prev => [...prev, { 
          type: 'assistant', 
          content: response
        }]);
        
        // Determine which chart to show based on the query
        const isAffiliateQuery = lowerCaseMessage.includes('affiliate') || 
                              lowerCaseMessage.includes('performance') ||
                              lowerCaseMessage.includes('compare');
        
        setTemporaryReport(isAffiliateQuery ? sampleBarChartData : sampleReportData);
        setIsGeneratingReport(false);
        setActiveView('report');
      } 
      // Handle voice readout request
      else if (lowerCaseMessage.includes('read') || 
              lowerCaseMessage.includes('speak') || 
              lowerCaseMessage.includes('tell me')) {
        
        // Generate AI response using InvokeLLM integration
        const response = await InvokeLLM({
          prompt: `You are an iGaming analytics AI assistant. 
          The user has requested: "${userMessage}".
          If it looks like a request to read out loud the report or data, respond briefly confirming you'll read it out loud.
          If there's no report to read, kindly explain that and ask if they'd like to generate a report first.
          Keep your response friendly, brief and conversational.
          
          Previous conversation:
          ${conversationContext}`,
          add_context_from_internet: false
        });
        
        setMessages(prev => [...prev, { 
          type: 'assistant', 
          content: response
        }]);
        
        if (temporaryReport) {
          // Switch to report view and prepare to read it
          setActiveView('report');
          setTimeout(() => generateOpenAIAudio(), 500);
        }
      }
      // Regular conversation
      else {
        // Generate AI response using InvokeLLM integration
        const response = await InvokeLLM({
          prompt: `You are an iGaming analytics AI assistant that helps analyze gaming data.
          Respond to this user message: "${userMessage}"
          
          Context:
          - You are part of an iGaming analytics platform.
          - You can help with analyzing revenue trends, player behavior, affiliate performance, etc.
          - When the user asks about actual data, give example insights based on industry knowledge.
          - Keep your response concise (max 2-3 sentences), helpful and conversational.
          - For complex questions, you can suggest generating a visualization.
          
          Previous conversation:
          ${conversationContext}`,
          add_context_from_internet: false
        });
        
        setMessages(prev => [...prev, { 
          type: 'assistant', 
          content: response
        }]);
      }
    } catch (error) {
      console.error("Error with LLM:", error);
      // Fallback response
      setMessages(prev => [...prev, { 
        type: 'assistant', 
        content: "I'm having trouble processing your request right now. Could you try again?"
      }]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  const prepareReadoutText = (report) => {
    if (!report) return '';
    
    // Create more natural, conversational text for speech
    let text = `Here's a quick overview of ${report.title.toLowerCase()}. `;
    
    // Add just 2-3 key points instead of everything for brevity
    if (report.insights.length > 0) {
      text += "The main takeaways are: ";
      // Only use the first 2 insights for brevity
      report.insights.slice(0, 2).forEach((insight, i) => {
        text += `${insight}. `;
      });
    }
    
    // Add just 1 recommendation for brevity
    if (report.recommendations.length > 0) {
      text += "My main recommendation is to ";
      // Extract just the action part without the "Consider" prefix
      const recommendation = report.recommendations[0]
        .replace(/^Consider /i, "")
        .replace(/^Optimize /i, "optimize ")
        .replace(/^Increase /i, "increase ");
        
      text += `${recommendation}.`;
    }
    
    return text;
  };
  
  const generateOpenAIAudio = async () => {
    if (!temporaryReport) return;
    
    try {
      const text = prepareReadoutText(temporaryReport);
      setAudioError(false);
      setIsPlaying(true);
      setAudioProgress(10); // Show initial progress
      
      // Here we use InvokeLLM as a proxy to access TTS services
      // In a real implementation, you would use the OpenAI TTS API directly
      // For this demo, we'll simulate the effect
      
      // For a real implementation, you would:
      // 1. Call your backend API that interfaces with OpenAI's TTS API
      // 2. Get back an audio URL to play
      
      // Since we don't have direct access to OpenAI's TTS API in this demo,
      // we'll simulate an audio response here
      
      // First, get a more natural-sounding text version from OpenAI
      const enhancedText = await InvokeLLM({
        prompt: `You are an AI that rephrases text to sound very natural when spoken by a text-to-speech system.
        Rephrase this analytics report for a very natural, concise voice readout that sounds like a professional analyst:
        "${text}"
        
        Keep the same information but make it sound more conversational, direct and natural.
        Use shorter sentences and a more flowing structure.
        Keep it brief - under 100 words.`,
        add_context_from_internet: false
      });
      
      setAudioProgress(30);
      
      // Simulate audio generation delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real implementation, this would be the URL returned from OpenAI's TTS API
      const demoAudioUrl = "https://actions.google.com/sounds/v1/science_fiction/alien_beam.ogg";
      
      setAudioSrc(demoAudioUrl);
      setAudioProgress(90);
      
      if (audioRef.current) {
        audioRef.current.onended = () => {
          setIsPlaying(false);
          setAudioProgress(100);
        };
        audioRef.current.onerror = () => {
          setAudioError(true);
          setIsPlaying(false);
        };
        audioRef.current.play();
      }
      
    } catch (error) {
      console.error("Error generating audio:", error);
      setAudioError(true);
      setIsPlaying(false);
    }
  };
  
  const toggleVoicePlayback = () => {
    if (isPlaying) {
      // Pause audio
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlaying(false);
    } else {
      // Start audio
      generateOpenAIAudio();
    }
  };

  return (
    <>
      {/* Audio element for OpenAI TTS */}
      <audio 
        ref={audioRef} 
        src={audioSrc} 
        style={{ display: 'none' }}
      />
      
      {/* Floating button */}
      <div className="fixed bottom-4 right-4 z-50">
        {!isOpen && (
          <Button 
            onClick={() => setIsOpen(true)} 
            size="icon" 
            className="h-12 w-12 rounded-full shadow-lg bg-indigo-600 hover:bg-indigo-700"
          >
            <Brain className="h-6 w-6" />
          </Button>
        )}
        
        {/* Chat panel */}
        {isOpen && (
          <Card className="w-80 md:w-[450px] shadow-xl border-gray-200 overflow-hidden">
            <CardHeader className="bg-indigo-600 text-white py-3 px-4 flex flex-row justify-between items-center">
              <CardTitle className="text-sm font-medium flex items-center">
                <Brain className="h-4 w-4 mr-2" />
                AI Analytics Assistant
              </CardTitle>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsOpen(false)}
                className="h-6 w-6 text-white hover:bg-indigo-700 rounded-full p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            
            <Tabs value={activeView} onValueChange={setActiveView}>
              <TabsList className="w-full">
                <TabsTrigger value="chat" className="flex-1">Chat</TabsTrigger>
                <TabsTrigger value="report" className="flex-1" disabled={!temporaryReport}>
                  Report {isGeneratingReport && <RefreshCw className="ml-1 h-3 w-3 animate-spin" />}
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="chat" className="m-0">
                <ScrollArea className="h-72 overflow-y-auto">
                  <CardContent className="p-4 space-y-4">
                    {messages.map((message, index) => (
                      <div 
                        key={index} 
                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div 
                          className={`max-w-[85%] rounded-lg px-3 py-2 ${
                            message.type === 'user' 
                              ? 'bg-indigo-600 text-white' 
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        </div>
                      </div>
                    ))}
                    
                    {isThinking && (
                      <div className="flex justify-start">
                        <div className="max-w-[85%] rounded-lg px-3 py-2 bg-gray-100 text-gray-800">
                          <div className="flex items-center">
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            <p className="text-sm">Thinking...</p>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </CardContent>
                </ScrollArea>
                
                <CardFooter className="p-3 border-t">
                  <div className="flex w-full gap-2">
                    <Textarea 
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Ask something..."
                      className="min-h-9 resize-none"
                    />
                    <Button 
                      onClick={handleSend} 
                      size="icon" 
                      className="h-9 w-9 shrink-0"
                      disabled={!inputValue.trim() || isThinking}
                    >
                      {isThinking ? 
                        <Loader2 className="h-4 w-4 animate-spin" /> : 
                        <SendIcon className="h-4 w-4" />
                      }
                    </Button>
                  </div>
                </CardFooter>
              </TabsContent>
              
              <TabsContent value="report" className="m-0">
                {temporaryReport && (
                  <div className="space-y-3">
                    <div className="px-4 pt-4">
                      <h3 className="font-medium text-lg">{temporaryReport.title}</h3>
                      <p className="text-gray-500 text-sm">{temporaryReport.description}</p>
                      
                      <div className="mt-3 flex items-center text-xs bg-blue-50 p-2 rounded-md text-blue-700">
                        <Check className="h-3 w-3 mr-1 text-blue-600" />
                        Generated with OpenAI
                      </div>
                    </div>
                    
                    <div className="h-56 px-3">
                      <ResponsiveContainer width="100%" height="100%">
                        {temporaryReport.chartType === 'pie' ? (
                          <PieChart>
                            <Pie
                              data={temporaryReport.data}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                              outerRadius={70}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {temporaryReport.data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        ) : (
                          <RechartsBarChart
                            data={temporaryReport.data}
                            margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="ftds" name="Monthly FTDs" fill="#4F46E5" />
                            <Bar dataKey="roi" name="ROI" fill="#06B6D4" />
                            <Bar dataKey="churn" name="Churn %" fill="#EC4899" />
                          </RechartsBarChart>
                        )}
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="px-4 space-y-3">
                      <div>
                        <h4 className="font-medium text-sm">Key Insights:</h4>
                        <ul className="text-sm pl-5 mt-1 space-y-1 list-disc">
                          {temporaryReport.insights.map((insight, index) => (
                            <li key={index}>{insight}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-sm">Recommendations:</h4>
                        <ul className="text-sm pl-5 mt-1 space-y-1 list-disc">
                          {temporaryReport.recommendations.map((rec, index) => (
                            <li key={index}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    {audioError && (
                      <Alert className="mx-4 bg-amber-50 border-amber-200">
                        <AlertTriangle className="h-4 w-4 text-amber-600 mr-2" />
                        <AlertDescription className="text-amber-800 text-xs">
                          There was an issue with the audio playback. Please try again.
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    <div className="flex justify-between items-center px-4 py-3 border-t bg-gray-50">
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={toggleVoicePlayback}
                          className="h-8"
                          disabled={isPlaying && !audioRef.current}
                        >
                          {isPlaying ? (
                            <>
                              <Pause className="h-3 w-3 mr-1" />
                              Pause
                            </>
                          ) : (
                            <>
                              <Volume2 className="h-3 w-3 mr-1" />
                              Play Audio
                            </>
                          )}
                        </Button>
                        
                        <Button variant="ghost" size="sm" className="h-8">
                          <DownloadCloud className="h-3 w-3 mr-1" />
                          Save
                        </Button>
                      </div>
                      
                      <div className="text-xs text-gray-500">
                        OpenAI TTS
                      </div>
                      
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setActiveView('chat')}
                        className="h-8"
                      >
                        Back to Chat
                      </Button>
                    </div>
                    
                    {isPlaying && (
                      <div className="px-4 pb-2">
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="bg-indigo-600 h-1.5 rounded-full transition-all duration-300" 
                            style={{ width: `${audioProgress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </Card>
        )}
      </div>
    </>
  );
}