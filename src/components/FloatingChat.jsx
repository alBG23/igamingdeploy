
import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, Bot, Loader2, Maximize2, Minimize2, Send, User, X, BookOpen, BarChart3, LineChart, FileText, PieChart } from 'lucide-react';
import { InvokeLLM } from "@/api/integrations";
import { User as UserEntity } from "@/api/entities";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import ChatDataVisualizer from './chat/ChatDataVisualizer';

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I\'m your iGaming Analytics Assistant. How can I help you? Ask me to show data in charts or tables.', type: 'text' }
  ]);
  const [input, setInput] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isApiConfigured, setIsApiConfigured] = useState(true);
  const [userTrainingLoaded, setUserTrainingLoaded] = useState(false);
  const messagesEndRef = useRef(null);
  
  useEffect(() => {
    const checkApiKey = async () => {
      try {
        const user = await UserEntity.me();
        if (user && user.openai_api_key) {
          setIsApiConfigured(true);
          if (user.ai_terms || user.ai_guidelines || user.ai_training_data) {
            setUserTrainingLoaded(true);
          }
        }
      } catch (error) {
        console.error("Error checking API key:", error);
      }
    };
    
    checkApiKey();
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const detectChartType = (text) => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('pie chart') || lowerText.includes('distribution') || lowerText.includes('breakdown')) {
      return 'pie';
    } else if (lowerText.includes('line chart') || lowerText.includes('trend') || lowerText.includes('over time') || lowerText.includes('historical')) {
      return 'line';
    } else if (lowerText.includes('bar chart') || lowerText.includes('comparison') || lowerText.includes('compare')) {
      return 'chart';
    }
    return 'chart';
  };

  const detectVisualizationType = (text) => {
    const lowerText = text.toLowerCase();
    if (
      lowerText.includes('chart') || 
      lowerText.includes('graph') || 
      lowerText.includes('plot') || 
      lowerText.includes('visualize') || 
      lowerText.includes('visualization')
    ) {
      return detectChartType(text);
    }
    
    if (
      lowerText.includes('table') || 
      lowerText.includes('tabulate') || 
      lowerText.includes('grid')
    ) {
      return 'table';
    }
    
    if (
      lowerText.includes('report') || 
      lowerText.includes('summary') || 
      lowerText.includes('overview')
    ) {
      return 'report';
    }
    
    return null;
  };

  const generateMockDataForVisualization = (type, query) => {
    const lowerQuery = query.toLowerCase();
    if (type === 'chart' || type === 'bar') {
      if (lowerQuery.includes('game') || lowerQuery.includes('casino') || lowerQuery.includes('category')) {
        return [
          { category: 'Slots', value: 42500 },
          { category: 'Table Games', value: 28350 },
          { category: 'Live Casino', value: 37800 },
          { category: 'Sports', value: 19500 },
          { category: 'Poker', value: 15200 }
        ];
      } else if (lowerQuery.includes('country') || lowerQuery.includes('geo') || lowerQuery.includes('region')) {
        return [
          { category: 'UK', value: 35400 },
          { category: 'Germany', value: 29300 },
          { category: 'Sweden', value: 25600 },
          { category: 'Denmark', value: 18900 },
          { category: 'Finland', value: 15700 }
        ];
      } else if (lowerQuery.includes('deposit') || lowerQuery.includes('payment')) {
        return [
          { category: 'Credit Card', value: 38500 },
          { category: 'e-Wallets', value: 32700 },
          { category: 'Bank Transfer', value: 24300 },
          { category: 'Crypto', value: 18600 },
          { category: 'Other', value: 9800 }
        ];
      } else {
        return [
          { category: 'Slots', value: 42500 },
          { category: 'Table Games', value: 28350 },
          { category: 'Live Casino', value: 37800 },
          { category: 'Sports', value: 19500 },
          { category: 'Poker', value: 15200 }
        ];
      }
    } else if (type === 'pie') {
      if (lowerQuery.includes('game') || lowerQuery.includes('casino') || lowerQuery.includes('category')) {
        return [
          { name: 'Slots', value: 42 },
          { name: 'Table Games', value: 28 },
          { name: 'Live Casino', value: 38 },
          { name: 'Sports', value: 20 },
          { name: 'Poker', value: 15 }
        ];
      } else if (lowerQuery.includes('device') || lowerQuery.includes('platform')) {
        return [
          { name: 'Mobile', value: 65 },
          { name: 'Desktop', value: 30 },
          { name: 'Tablet', value: 5 }
        ];
      } else if (lowerQuery.includes('deposit') || lowerQuery.includes('payment')) {
        return [
          { name: 'Credit Card', value: 38 },
          { name: 'e-Wallets', value: 33 },
          { name: 'Bank Transfer', value: 24 },
          { name: 'Crypto', value: 19 },
          { name: 'Other', value: 10 }
        ];
      } else {
        return [
          { name: 'Casual', value: 45 },
          { name: 'Regular', value: 30 },
          { name: 'VIP', value: 15 },
          { name: 'Inactive', value: 10 }
        ];
      }
    } else if (type === 'line') {
      if (lowerQuery.includes('ggr') || lowerQuery.includes('revenue') || lowerQuery.includes('income')) {
        return [
          { date: 'Jan', ggr: 32000, ngr: 24000 },
          { date: 'Feb', ggr: 35800, ngr: 27500 },
          { date: 'Mar', ggr: 40200, ngr: 31800 },
          { date: 'Apr', ggr: 38500, ngr: 29700 },
          { date: 'May', ggr: 42100, ngr: 33600 },
          { date: 'Jun', ggr: 45800, ngr: 36400 }
        ];
      } else if (lowerQuery.includes('player') || lowerQuery.includes('user')) {
        return [
          { date: 'Jan', active: 3200, new: 840 },
          { date: 'Feb', active: 3580, new: 920 },
          { date: 'Mar', active: 4020, new: 1050 },
          { date: 'Apr', active: 3850, new: 980 },
          { date: 'May', active: 4210, new: 1120 },
          { date: 'Jun', active: 4580, new: 1240 }
        ];
      } else if (lowerQuery.includes('conversion') || lowerQuery.includes('retention')) {
        return [
          { date: 'Jan', conversion: 22.4, retention: 42.5 },
          { date: 'Feb', conversion: 23.8, retention: 43.2 },
          { date: 'Mar', conversion: 25.1, retention: 45.8 },
          { date: 'Apr', conversion: 24.5, retention: 44.3 },
          { date: 'May', conversion: 26.2, retention: 46.5 },
          { date: 'Jun', conversion: 27.1, retention: 48.2 }
        ];
      } else {
        return [
          { date: 'Jan', ggr: 32000, ngr: 24000, deposits: 48000 },
          { date: 'Feb', ggr: 35800, ngr: 27500, deposits: 52000 },
          { date: 'Mar', ggr: 40200, ngr: 31800, deposits: 58000 },
          { date: 'Apr', ggr: 38500, ngr: 29700, deposits: 54000 },
          { date: 'May', ggr: 42100, ngr: 33600, deposits: 60000 },
          { date: 'Jun', ggr: 45800, ngr: 36400, deposits: 65000 }
        ];
      }
    } else if (type === 'table') {
      if (lowerQuery.includes('metrics') || lowerQuery.includes('kpi') || lowerQuery.includes('overview')) {
        return [
          { metric: 'GGR', value: '$124,500', change: '+12.5%' },
          { metric: 'NGR', value: '$98,700', change: '+8.2%' },
          { metric: 'Active Players', value: '4,278', change: '+5.8%' },
          { metric: 'New Sign-ups', value: '843', change: '+2.1%' },
          { metric: 'Conversion Rate', value: '22.5%', change: '-0.8%' }
        ];
      } else if (lowerQuery.includes('affiliate') || lowerQuery.includes('marketing')) {
        return [
          { affiliate: 'Affiliate A', players: 845, revenue: '$28,500', cpa: '$35' },
          { affiliate: 'Affiliate B', players: 620, revenue: '$19,800', cpa: '$32' },
          { affiliate: 'Affiliate C', players: 540, revenue: '$16,200', cpa: '$30' },
          { affiliate: 'Affiliate D', players: 380, revenue: '$12,500', cpa: '$33' },
          { affiliate: 'Affiliate E', players: 320, revenue: '$9,800', cpa: '$31' }
        ];
      } else if (lowerQuery.includes('game') || lowerQuery.includes('popular')) {
        return [
          { game: 'Book of Dead', provider: 'Play\'n GO', spins: '124,500', ggr: '$18,700' },
          { game: 'Starburst', provider: 'NetEnt', spins: '98,700', ggr: '$15,200' },
          { game: 'Gonzo\'s Quest', provider: 'NetEnt', spins: '85,200', ggr: '$13,800' },
          { game: 'Sweet Bonanza', provider: 'Pragmatic', spins: '76,500', ggr: '$12,300' },
          { game: 'Wolf Gold', provider: 'Pragmatic', spins: '68,900', ggr: '$10,500' }
        ];
      } else {
        return [
          { metric: 'GGR', value: '$124,500', change: '+12.5%' },
          { metric: 'NGR', value: '$98,700', change: '+8.2%' },
          { metric: 'Active Players', value: '4,278', change: '+5.8%' },
          { metric: 'New Sign-ups', value: '843', change: '+2.1%' },
          { metric: 'Conversion Rate', value: '22.5%', change: '-0.8%' }
        ];
      }
    } else if (type === 'report') {
      return [
        { 
          title: 'Revenue Overview', 
          subtitle: 'Last 30 days performance',
          content: 'GGR reached $124,500 with a 12.5% increase over the previous period. Slots remain the most popular game category contributing 38% of total GGR.'
        },
        {
          title: 'Player Activity',
          content: 'Active players increased by 5.8% to 4,278. Player retention rate is at 42% which is above industry average.'
        },
        {
          title: 'Recommendations',
          content: '1. Increase marketing for live casino games which show the highest ROI\n2. Review table games which are showing lower engagement\n3. Target churn risk players with personalized offers'
        }
      ];
    }
    
    return [];
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage = { role: 'user', content: input, type: 'text' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);
    
    try {
      const visualizationType = detectVisualizationType(input);
      
      if (visualizationType) {
        let explanation = '';
        
        if (visualizationType === 'pie' || visualizationType === 'chart' || visualizationType === 'line') {
          explanation = `Here's a ${visualizationType === 'chart' ? 'bar' : visualizationType} chart showing the data you requested. This visualization uses sample data to illustrate typical patterns in iGaming analytics.`;
        } else if (visualizationType === 'table') {
          explanation = "Here's a table with the data you requested. This shows sample metrics that would typically be analyzed in iGaming operations.";
        } else if (visualizationType === 'report') {
          explanation = "I've prepared a brief report based on your request. This includes sample insights and recommendations based on typical iGaming performance metrics.";
        }
        
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: explanation,
          type: 'text'
        }]);
        
        const mockData = generateMockDataForVisualization(visualizationType, input);
        
        setTimeout(() => {
          setMessages(prev => [...prev, { 
            role: 'assistant', 
            content: {
              type: visualizationType,
              title: input,
              data: mockData
            },
            type: 'visualization'
          }]);
        }, 500);
        
      } else {
        let response = "I don't have specific data about your iGaming platform, but I can provide general insights about the industry. Feel free to ask me to show specific data in charts or tables.";
        
        const lowerInput = input.toLowerCase();
        
        if (lowerInput.includes('ggr') || lowerInput.includes('revenue')) {
          response = "GGR (Gross Gaming Revenue) is a key metric in iGaming. It represents the total amount wagered minus the winnings paid to players. Ask me to 'show GGR in a chart' to visualize sample data.";
        } else if (lowerInput.includes('player') || lowerInput.includes('user')) {
          response = "Player metrics like acquisition, retention, and activity are crucial for iGaming success. Ask me to 'show player trends in a line chart' to visualize sample data.";
        } else if (lowerInput.includes('conversion') || lowerInput.includes('retention')) {
          response = "Conversion and retention are critical KPIs for iGaming businesses. Industry averages vary, but successful operators typically achieve 25-30% conversion from registration to first deposit, and 40-45% 30-day retention. Ask me to 'show conversion trends' to visualize sample data.";
        } else if (lowerInput.includes('affiliate') || lowerInput.includes('marketing')) {
          response = "Affiliate marketing is a major acquisition channel for iGaming. Effective programs typically offer revenue share (25-45%) or CPA ($35-$200 depending on market). Ask me to 'show affiliate performance in a table' to see sample data.";
        } else if (lowerInput.includes('game') || lowerInput.includes('casino') || lowerInput.includes('popular')) {
          response = "Game popularity varies by market, but slots typically generate 40-60% of casino GGR, followed by live dealer games (15-30%) and table games (10-20%). Ask me to 'show game category distribution in a pie chart' to visualize sample data.";
        } else if (lowerInput.includes('chart') || lowerInput.includes('table') || lowerInput.includes('report')) {
          response = "I can generate sample visualizations for iGaming data. Try asking me to 'show GGR trends in a line chart', 'display player segments in a pie chart', or 'create a table of key metrics'.";
        } else if (lowerInput.includes('hello') || lowerInput.includes('hi') || lowerInput.includes('hey')) {
          response = "Hello! I'm your iGaming Analytics Assistant. You can ask me questions about iGaming metrics or request sample visualizations. Try saying 'show me GGR by game category' or 'create a player retention chart'.";
        }
        
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: response, 
          type: 'text' 
        }]);
      }
    } catch (error) {
      console.error("Error processing message:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-5 right-5 h-14 w-14 rounded-full bg-indigo-600 hover:bg-indigo-700 shadow-lg"
      >
        <Bot className="h-6 w-6 text-white" />
      </Button>
    );
  }

  return (
    <Card className={`fixed bottom-5 right-5 ${isExpanded ? 'w-[90vw] h-[90vh] max-w-4xl' : 'w-96 h-[550px]'} shadow-xl transition-all duration-200 z-50 flex flex-col overflow-hidden`}>
      <CardHeader className="p-3 border-b flex flex-row items-center justify-between space-y-0 shrink-0">
        <CardTitle className="text-md flex items-center">
          <Bot className="h-5 w-5 mr-2 text-indigo-600" />
          iGaming AI Assistant
          {!isApiConfigured ? (
            <span className="text-xs ml-2 text-red-500">(Demo Mode)</span>
          ) : userTrainingLoaded ? (
            <Badge className="ml-2 text-xs bg-green-100 text-green-800">
              <BookOpen className="h-3 w-3 mr-1" /> 
              Trained
            </Badge>
          ) : null}
        </CardTitle>
        <div className="flex space-x-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <div className="flex-grow overflow-hidden relative">
        <ScrollArea className="absolute inset-0 h-full">
          <div className="p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.type === 'visualization' ? (
                  <div className="w-full max-w-full bg-white rounded-lg shadow p-3 border">
                    <div className="flex items-center gap-2 mb-2">
                      {message.content.type === 'chart' && <BarChart3 className="h-5 w-5 text-indigo-600" />}
                      {message.content.type === 'line' && <LineChart className="h-5 w-5 text-indigo-600" />}
                      {message.content.type === 'pie' && <PieChart className="h-5 w-5 text-indigo-600" />}
                      {message.content.type === 'report' && <FileText className="h-5 w-5 text-indigo-600" />}
                      <h3 className="font-medium text-sm truncate">{message.content.title}</h3>
                    </div>
                    <div className="max-w-full overflow-hidden">
                      <ChatDataVisualizer 
                        type={message.content.type} 
                        data={message.content.data} 
                      />
                    </div>
                  </div>
                ) : (
                  <div
                    className={`flex items-start space-x-2 max-w-[85%] ${
                      message.role === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'
                    }`}
                  >
                    <div
                      className={`p-1 rounded-full shrink-0 ${
                        message.role === 'user' ? 'bg-indigo-100' : 'bg-gray-100'
                      }`}
                    >
                      {message.role === 'user' ? (
                        <User className="h-5 w-5 text-indigo-600" />
                      ) : (
                        <Bot className="h-5 w-5 text-gray-600" />
                      )}
                    </div>
                    <div
                      className={`p-3 rounded-lg break-words ${
                        message.role === 'user'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <div className="text-sm whitespace-pre-wrap break-words">{message.content}</div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
            
            {isLoading && (
              <div className="flex justify-center my-2">
                <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
              </div>
            )}
            
            {error && (
              <Alert variant="destructive" className="my-2">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
        </ScrollArea>
      </div>
      
      <CardFooter className="p-3 pt-2 border-t shrink-0">
        <div className="flex w-full items-center space-x-2">
          <Textarea
            placeholder="Type your message or ask for charts, tables, reports..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 h-10 min-h-0 py-2 resize-none"
            disabled={isLoading}
          />
          <Button
            size="icon"
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading}
            className="h-10 w-10 shrink-0 bg-indigo-600 hover:bg-indigo-700"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
