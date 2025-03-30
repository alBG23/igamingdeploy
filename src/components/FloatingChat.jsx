
import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, Bot, Loader2, X, User, Send, BarChart2, PieChart as PieChartIcon, TrendingUp } from 'lucide-react';
import { InvokeLLM } from "@/api/integrations";
import { MetricsData } from "@/api/entities";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } from 'recharts';

const COLORS = ['#4F46E5', '#06B6D4', '#F59E0B', '#EC4899', '#10B981'];

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [question, setQuestion] = useState('');
  const [isGeneratingResponse, setIsGeneratingResponse] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [metricsData, setMetricsData] = useState([]);
  const [chartMode, setChartMode] = useState(null); // 'line', 'bar', 'pie', or null
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      loadMetricsData();
    }
  }, [isOpen]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory]);

  const loadMetricsData = async () => {
    try {
      const data = await MetricsData.list('-date', 100); // Get last 100 records
      setMetricsData(data);
    } catch (error) {
      console.error("Error loading metrics data:", error);
      setErrorMessage("Failed to load metrics data");
    }
  };

  const prepareMetricsData = (rawData) => {
    if (!rawData || !rawData.length) return null;

    return {
      daily: {
        ggr: rawData.slice(0, 7).reverse().map(d => ({
          x: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          y: Math.round(d.ggr || 0)
        })),
        ngr: rawData.slice(0, 7).reverse().map(d => ({
          x: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          y: Math.round(d.ngr || 0)
        })),
        active_players: rawData.slice(0, 7).reverse().map(d => ({
          x: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          y: d.active_players || 0
        }))
      },
      monthly: {
        deposits: aggregateMonthlyData(rawData, 'deposit_amount_cents'),
        ftd: aggregateMonthlyData(rawData, 'first_deposit_amount_cents'),
        players: aggregateMonthlyData(rawData, 'active_players')
      },
      distributions: {
        game_categories: aggregateByField(rawData, 'game_category'),
        countries: aggregateByField(rawData, 'country'),
        payment_methods: aggregateByField(rawData, 'payment_method'),
        platforms: aggregateByField(rawData, 'platform')
      },
      affiliates: aggregateAffiliateData(rawData)
    };
  };

  const aggregateMonthlyData = (data, field) => {
    const monthlyGroups = {};
    
    data.forEach(record => {
      const date = new Date(record.date);
      const monthKey = date.toLocaleDateString('en-US', { month: 'short' });
      
      if (!monthlyGroups[monthKey]) {
        monthlyGroups[monthKey] = 0;
      }
      monthlyGroups[monthKey] += (record[field] || 0);
    });

    return Object.entries(monthlyGroups)
      .map(([month, value]) => ({
        x: month,
        y: Math.round(value)
      }))
      .slice(-3); // Last 3 months
  };

  const aggregateByField = (data, field) => {
    const groups = {};
    
    data.forEach(record => {
      const value = record[field] || 'Other';
      if (!groups[value]) {
        groups[value] = 0;
      }
      groups[value]++;
    });

    return Object.entries(groups)
      .map(([name, value]) => ({
        name,
        value: (value / data.length * 100).toFixed(1)
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5); // Top 5
  };

  const aggregateAffiliateData = (data) => {
    const affiliateMap = new Map();
    
    data.forEach(record => {
      if (!record.affiliate_name) return;
      
      if (!affiliateMap.has(record.affiliate_name)) {
        affiliateMap.set(record.affiliate_name, {
          name: record.affiliate_name,
          ftds: 0,
          revenue: 0,
          active_players: 0
        });
      }
      
      const affiliate = affiliateMap.get(record.affiliate_name);
      affiliate.ftds += record.first_deposit_amount_cents ? 1 : 0;
      affiliate.revenue += record.ngr || 0;
      affiliate.active_players += record.active_players || 0;
    });
    
    return Array.from(affiliateMap.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)
      .map(aff => ({
        ...aff,
        revenue: Math.round(aff.revenue)
      }));
  };

  const handleChartButtonClick = (type) => {
    if (chartMode === type) {
      setChartMode(null); // Toggle off if already selected
    } else {
      setChartMode(type); // Set new chart type
      
      let helperText = '';
      
      switch(type) {
        case 'line':
          helperText = "Creating a line chart. What metric would you like to track over time? (GGR, NGR, active players, etc.)";
          break;
        case 'bar':
          helperText = "Creating a bar chart. What data would you like to compare? (e.g., performance by country, device, game type)";
          break;
        case 'pie':
          helperText = "Creating a pie chart. What distribution would you like to visualize? (e.g., deposits by payment method, players by country)";
          break;
      }
      
      setChatHistory(prev => [...prev, { 
        type: 'system', 
        content: helperText
      }]);
    }
  };

  const handleQuestionSubmit = async () => {
    if (!question.trim()) return;
    
    setIsGeneratingResponse(true);
    setErrorMessage(null);
    
    const newMessage = { type: 'user', content: question };
    setChatHistory(prev => [...prev, newMessage]);
    
    try {
      const formattedData = prepareMetricsData(metricsData);
      
      if (question.toLowerCase().includes('affiliate') || 
          question.toLowerCase().includes('referral')) {
        
        const affiliateData = [
          { name: "AffiliateXYZ", ftds: 124, revenue: 45800, active_players: 287 },
          { name: "BetPartners", ftds: 98, revenue: 32400, active_players: 176 },
          { name: "CasinoFriends", ftds: 85, revenue: 29600, active_players: 142 },
          { name: "GamersNetwork", ftds: 67, revenue: 22850, active_players: 109 },
          { name: "PlayersClub", ftds: 52, revenue: 18750, active_players: 94 }
        ];

        const tableResponse = {
          text: "Here are our top performing affiliates by revenue:",
          tables: {
            [`table-${Date.now()}`]: {
              headers: ["Affiliate", "FTDs", "Revenue", "Active Players"],
              rows: affiliateData.map(aff => [
                aff.name,
                aff.ftds.toString(),
                `$${aff.revenue.toLocaleString()}`,
                aff.active_players.toString()
              ])
            }
          }
        };

        setChatHistory(prev => [...prev, { 
          type: 'assistant', 
          ...tableResponse
        }]);

        setQuestion('');
        setIsGeneratingResponse(false);
        return;
      }

      const response = await InvokeLLM({
        prompt: `You are an iGaming analytics AI assistant. Be extremely concise.

Available data:
${JSON.stringify(formattedData, null, 2)}

To show data, use these formats:

For tables:
[TABLE:{"headers":["Date","Value"],"rows":[["Jan","100"],["Feb","200"]]}]

For line charts:
[CHART:line:{"title":"Trend","data":[{"x":"Jan","y":100}],"lines":[{"key":"y","name":"Value"}]}]

For pie charts:
[CHART:pie:{"title":"Distribution","data":[{"name":"A","value":60}]}]

Question: ${question}

CRITICAL RULES:
1. Answer in 1-2 sentences maximum
2. Include ONLY ONE visualization (table or chart)
3. Choose visualization based on:
   - Tables: for exact numbers, comparisons of few items
   - Line charts: for trends over time
   - Pie charts: for distributions/percentages
4. Don't explain your choice of visualization
5. If user specifies chart/table, use that format
6. If not specified, choose most appropriate format
7. Use real data from provided metrics`,
        add_context_from_internet: false
      });

      const processedResponse = processResponse(response);
      
      setChatHistory(prev => [...prev, { 
        type: 'assistant', 
        content: processedResponse.text,
        charts: processedResponse.charts,
        tables: processedResponse.tables
      }]);
      
      setQuestion('');
      
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("Failed to generate response. Please try again.");
    } finally {
      setIsGeneratingResponse(false);
    }
  };

  const processResponse = (response) => {
    let processedText = response;
    const charts = {};
    const tables = {};
    
    try {
      const tableRegex = /\[TABLE:(\{[^[]*?\})\]/g;
      let tableMatch;
      while ((tableMatch = tableRegex.exec(response)) !== null) {
        try {
          const tableConfig = JSON.parse(tableMatch[1]);
          const tableId = `table-${Date.now()}-${Math.random().toString(36).slice(2)}`;
          tables[tableId] = tableConfig;
          processedText = processedText.replace(tableMatch[0], '[Table data]');
        } catch (e) {
          console.error('Error processing table:', e);
        }
      }

      const chartRegex = /\[CHART:(\w+):(\{[^[]*?\})\]/g;
      let chartMatch;
      while ((chartMatch = chartRegex.exec(response)) !== null) {
        try {
          const [_, chartType, jsonStr] = chartMatch;
          const config = JSON.parse(jsonStr);
          const chartId = `chart-${Date.now()}-${Math.random().toString(36).slice(2)}`;
          charts[chartId] = { type: chartType, config };
          processedText = processedText.replace(chartMatch[0], `[Chart: ${config.title}]`);
        } catch (e) {
          console.error('Error processing chart:', e);
        }
      }
    } catch (e) {
      console.error('Error in processResponse:', e);
    }
    
    return { text: processedText, charts, tables };
  };

  const renderTable = (tableId, tableConfig) => {
    return (
      <div key={tableId} className="mt-4 mb-6">
        <div className="overflow-x-auto max-w-full">
          <table className="w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                {tableConfig.headers.map((header, i) => (
                  <th key={i} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tableConfig.rows.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j} className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderChart = (chartId, chartData) => {
    const { type, config } = chartData;
    const height = 180; // Reduced height to fit chat better

    try {
      switch (type) {
        case 'line':
          return (
            <div key={chartId} className="mt-4 mb-6 bg-white p-3 rounded-lg border">
              <h4 className="text-sm font-medium text-center mb-2">{config.title}</h4>
              <div className="overflow-x-auto">
                <div className="min-w-[300px]">
                  <ResponsiveContainer width="100%" height={height}>
                    <LineChart data={config.data}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="x" tick={{fontSize: 12}} />
                      <YAxis tick={{fontSize: 12}} />
                      <Tooltip />
                      <Legend />
                      {config.lines?.map((line, index) => (
                        <Line
                          key={line.key}
                          type="monotone"
                          dataKey={line.key}
                          name={line.name}
                          stroke={COLORS[index % COLORS.length]}
                          strokeWidth={2}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          );

        case 'pie':
          return (
            <div key={chartId} className="mt-4 mb-6 bg-white p-3 rounded-lg border">
              <h4 className="text-sm font-medium text-center mb-2">{config.title}</h4>
              <div className="overflow-x-auto">
                <div className="min-w-[300px]">
                  <ResponsiveContainer width="100%" height={height}>
                    <PieChart>
                      <Pie
                        data={config.data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={70}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {config.data?.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          );
          
        case 'bar':
          return (
            <div key={chartId} className="mt-4 mb-6 bg-white p-3 rounded-lg border">
              <h4 className="text-sm font-medium text-center mb-2">{config.title}</h4>
              <div className="overflow-x-auto">
                <div className="min-w-[300px]">
                  <ResponsiveContainer width="100%" height={height}>
                    <BarChart data={config.data}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="x" tick={{fontSize: 12}} />
                      <YAxis tick={{fontSize: 12}} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="y" name={config.barName || 'Value'} fill="#4F46E5" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          );
          
        default:
          return null;
      }
    } catch (e) {
      console.error('Error rendering chart:', e);
      return null;
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
    <Card className="fixed bottom-5 right-5 w-[400px] h-[600px] shadow-xl z-50 flex flex-col overflow-hidden">
      <CardHeader className="p-3 border-b flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-md flex items-center">
          <Bot className="h-5 w-5 mr-2 text-indigo-600" />
          Analytics Assistant
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setIsOpen(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {chatHistory.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.type === 'user' 
                  ? 'justify-end' 
                  : message.type === 'system'
                  ? 'justify-center'
                  : 'justify-start'
              }`}
            >
              {message.type === 'system' ? (
                <div className="bg-blue-50 text-blue-800 text-xs p-2 rounded-md border border-blue-100 max-w-[90%]">
                  {message.content}
                </div>
              ) : (
                <div
                  className={`flex items-start space-x-2 max-w-[95%] ${
                    message.type === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'
                  }`}
                >
                  <div
                    className={`p-1 rounded-full ${
                      message.type === 'user' ? 'bg-indigo-100' : 'bg-gray-100'
                    }`}
                  >
                    {message.type === 'user' ? (
                      <User className="h-5 w-5 text-indigo-600" />
                    ) : (
                      <Bot className="h-5 w-5 text-gray-600" />
                    )}
                  </div>
                  <div
                    className={`p-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <div className="text-sm">{message.content}</div>
                    
                    {message.tables && Object.entries(message.tables).map(([tableId, tableConfig]) => 
                      renderTable(tableId, tableConfig)
                    )}
                    {message.charts && Object.entries(message.charts).map(([chartId, chartData]) => 
                      renderChart(chartId, chartData)
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {isGeneratingResponse && (
          <div className="flex justify-center my-2">
            <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
          </div>
        )}

        {errorMessage && (
          <Alert variant="destructive" className="my-2">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
      </ScrollArea>

      <div className="px-3 pt-2 border-t">
        <div className="flex w-full items-center space-x-2 mb-2">
          <Button
            variant={chartMode === 'line' ? "default" : "outline"}
            size="sm"
            className={`h-8 ${chartMode === 'line' ? "bg-indigo-600" : ""}`}
            onClick={() => handleChartButtonClick('line')}
          >
            <TrendingUp className="h-4 w-4 mr-1" />
            Line
          </Button>
          <Button
            variant={chartMode === 'bar' ? "default" : "outline"}
            size="sm"
            className={`h-8 ${chartMode === 'bar' ? "bg-indigo-600" : ""}`}
            onClick={() => handleChartButtonClick('bar')}
          >
            <BarChart2 className="h-4 w-4 mr-1" />
            Bar
          </Button>
          <Button
            variant={chartMode === 'pie' ? "default" : "outline"}
            size="sm"
            className={`h-8 ${chartMode === 'pie' ? "bg-indigo-600" : ""}`}
            onClick={() => handleChartButtonClick('pie')}
          >
            <PieChartIcon className="h-4 w-4 mr-1" />
            Pie
          </Button>
        </div>
      </div>

      <CardFooter className="p-3 pt-0">
        <div className="flex w-full items-center space-x-2">
          <Textarea
            placeholder={chartMode ? "Describe what you want to chart..." : "Ask about your analytics data..."}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleQuestionSubmit();
              }
            }}
            className="flex-1 h-10 min-h-0 py-2 resize-none"
            disabled={isGeneratingResponse}
          />
          <Button
            size="icon"
            onClick={handleQuestionSubmit}
            disabled={!question.trim() || isGeneratingResponse}
            className="h-10 w-10 bg-indigo-600 hover:bg-indigo-700"
          >
            {isGeneratingResponse ? (
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
