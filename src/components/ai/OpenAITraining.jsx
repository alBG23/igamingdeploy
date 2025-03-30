
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User } from "@/api/entities";
import { InvokeLLM } from "@/api/integrations";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { 
  CheckCircle, 
  AlertTriangle, 
  Upload, 
  RefreshCw, 
  FileText, 
  Loader2, 
  Save, 
  Brain, 
  BookText,
  Lock,
  HelpCircle,
  Edit
} from 'lucide-react';

export default function OpenAITraining() {
  const [activeTab, setActiveTab] = useState('guidelines');
  const [loading, setLoading] = useState(false);
  const [savingLoading, setSavingLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(null);
  const [trainingData, setTrainingData] = useState({
    guidelines: '',
    terms: '',
    trainingData: ''
  });
  const [isAutoAnalyzeEnabled, setIsAutoAnalyzeEnabled] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [validation, setValidation] = useState({
    guidelines: { status: 'pending', feedback: '' },
    terms: { status: 'pending', feedback: '' },
    trainingData: { status: 'pending', feedback: '' }
  });
  const [validationInProgress, setValidationInProgress] = useState(false);

  useEffect(() => {
    fetchExistingData();
  }, []);

  const fetchExistingData = async () => {
    setLoading(true);
    try {
      const user = await User.me();
      
      if (user) {
        setTrainingData({
          guidelines: user.ai_guidelines || getDefaultGuidelines(),
          terms: user.ai_terms || getDefaultTerms(),
          trainingData: user.ai_training_data || ''
        });
        
        if (user.ai_guidelines) setValidation(prev => ({ ...prev, guidelines: { status: 'valid', feedback: '' }}));
        if (user.ai_terms) setValidation(prev => ({ ...prev, terms: { status: 'valid', feedback: '' }}));
        if (user.ai_training_data) setValidation(prev => ({ ...prev, trainingData: { status: 'valid', feedback: '' }}));
        
        if (user.ai_last_update) {
          setLastSaved(new Date(user.ai_last_update));
        }
      }
    } catch (error) {
      console.error("Error fetching existing data:", error);
      setMessage("Failed to load existing training data.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const saveTrainingData = async () => {
    setSavingLoading(true);
    try {
      await User.updateMyUserData({
        ai_guidelines: trainingData.guidelines,
        ai_terms: trainingData.terms,
        ai_training_data: trainingData.trainingData,
        ai_last_update: new Date().toISOString()
      });
      
      setMessage("Training data saved successfully!");
      setMessageType("success");
      setLastSaved(new Date());
    } catch (error) {
      console.error("Error saving training data:", error);
      setMessage("Failed to save training data.");
      setMessageType("error");
    } finally {
      setSavingLoading(false);
    }
  };

  const validateSection = async (section) => {
    if (validationInProgress) {
      setMessage("Another validation is in progress. Please wait a moment before trying again.");
      setMessageType("error");
      return;
    }

    setValidationInProgress(true);
    setValidation(prev => ({ 
      ...prev, 
      [section]: { status: 'validating', feedback: '' }
    }));

    try {
      const content = trainingData[section];
      if (!content || content.trim().length < 50) {
        setValidation(prev => ({ 
          ...prev, 
          [section]: { 
            status: 'invalid', 
            feedback: 'Content is too short. Please provide more detailed information.' 
          }
        }));
        setValidationInProgress(false);
        return;
      }

      const trimmedContent = content.length > 1500 ? 
        content.substring(0, 1500) + "... [content truncated for analysis]" : 
        content;

      try {
        const response = await validateWithRetry(section, trimmedContent, 3);
        
        setValidation(prev => ({ 
          ...prev, 
          [section]: { 
            status: response.valid ? 'valid' : 'invalid',
            feedback: response.feedback,
            score: response.score,
            suggestions: response.suggestions
          }
        }));
      } catch (error) {
        console.error(`Error validating ${section} after retries:`, error);
        setValidation(prev => ({ 
          ...prev, 
          [section]: { 
            status: 'error', 
            feedback: `Rate limit exceeded. Please try again in a few minutes.` 
          }
        }));
        setMessage("OpenAI API rate limit reached. Please try validation again in a few minutes.");
        setMessageType("error");
      }
    } catch (error) {
      console.error(`Error validating ${section}:`, error);
      setValidation(prev => ({ 
        ...prev, 
        [section]: { 
          status: 'error', 
          feedback: `Error during validation: ${error.message}` 
        }
      }));
    } finally {
      setValidationInProgress(false);
    }
  };

  const validateWithRetry = async (section, content, maxRetries) => {
    let retries = 0;
    while (retries < maxRetries) {
      try {
        const response = await InvokeLLM({
          prompt: `You are an AI training expert. Review the following ${section} content that will be used to train an AI assistant for an iGaming analytics platform:

---BEGIN CONTENT---
${content}
---END CONTENT---

Analyze the quality and effectiveness of this content for training an AI. Keep your response concise.
Provide your assessment in the following JSON format:
{
  "valid": true/false,
  "score": 1-10,
  "feedback": "Your concise feedback (max 100 words)",
  "suggestions": ["Short suggestion 1", "Short suggestion 2", "Short suggestion 3"]
}`,
          response_json_schema: {
            type: "object",
            properties: {
              valid: { type: "boolean" },
              score: { type: "number" },
              feedback: { type: "string" },
              suggestions: { type: "array", items: { type: "string" } }
            }
          },
          add_context_from_internet: false
        });
        
        return response;
      } catch (error) {
        retries++;
        console.warn(`Validation attempt ${retries} failed. ${maxRetries - retries} retries left.`);
        
        if (error.message && error.message.includes("429")) {
          await new Promise(resolve => setTimeout(resolve, 3000 * retries));
        } else if (retries >= maxRetries) {
          throw error;
        }
      }
    }
    
    throw new Error("Maximum retries exceeded");
  };

  const getDefaultGuidelines = () => {
    return `# AI Assistant Guidelines for iGaming Analytics

## Purpose
You are an AI assistant specialized in iGaming analytics. Your purpose is to help users understand their gaming data, generate insights, visualize trends, and make data-driven decisions.

## Tone and Style
- Be professional but conversational
- Explain complex analytics concepts in simple terms
- Be concise in explanations unless the user asks for more detail
- Use industry-standard terminology for iGaming analytics

## iGaming Knowledge
You should demonstrate expertise in:
- Key iGaming metrics (GGR, NGR, deposits, withdrawals, etc.)
- Player acquisition, retention, and conversion metrics
- Game performance analytics
- Affiliate marketing performance
- Regulatory compliance considerations

## Response Format
- When asked for charts or visualizations, always generate them instead of explaining why you can't
- Use tables for structured data
- For insights, use bullet points for better readability
- Include actionable recommendations when appropriate

## Data Handling
- Reference historical trends when analyzing metrics
- Compare current performance against industry benchmarks when possible
- Identify anomalies and potential areas of concern
- Suggest optimizations based on data analysis

## Prohibited Actions
- Never mention real player data or personal information
- Don't speculate on specific regulatory decisions
- Don't provide legal advice
- Don't suggest potentially non-compliant marketing tactics

## Examples of Good Responses
When asked "Show me GGR trends":
- Generate a line chart showing GGR over time
- Highlight key periods of growth or decline
- Mention potential factors affecting performance
- Suggest ways to improve or maintain positive trends`;
  };

  const getDefaultTerms = () => {
    return `# iGaming Analytics Terminology Guide

## Core Metrics
- GGR (Gross Gaming Revenue): Total bets minus total wins
- NGR (Net Gaming Revenue): GGR minus bonuses and taxes
- Deposits: Total monetary value added to player accounts
- Withdrawals: Total monetary value removed from player accounts
- Turnover: Total amount wagered by players
- Hold: Percentage of wagers retained by the operator

## Player Metrics
- FTD (First Time Depositor): A player making their first deposit
- Active Player: Player who has placed at least one bet within a specific time period
- Churn Rate: Percentage of players who stop playing within a defined period
- Conversion Rate: Percentage of registrations that convert to depositing players
- LTV (Lifetime Value): Expected revenue from a player over their entire relationship
- RFM (Recency, Frequency, Monetary): Method for segmenting players by activity patterns

## Acquisition Metrics
- CPA (Cost Per Acquisition): Cost to acquire a new depositing player
- CPR (Cost Per Registration): Cost to acquire a new registration
- ROI (Return On Investment): Revenue generated divided by marketing spend
- Payback Period: Time required to recover acquisition costs through player revenue

## Game Performance
- RTP (Return To Player): Percentage of wagers returned to players as winnings
- House Edge: Operator's statistical advantage (1 - RTP)
- Game Contribution: Percentage of GGR contributed by each game type
- Slot RTP: Return to player ratio for slot games
- Table Game Hold: Percentage of bets retained in table games

## Affiliate Terms
- Revenue Share: Percentage of player revenue paid to affiliates
- CPA Deal: Fixed payment for each acquired player
- Hybrid Deal: Combination of revenue share and CPA payment models
- Negative Carryover: When negative player balances carry to the next period

## Analytics Concepts
- Cohort Analysis: Tracking groups of players who registered during the same period
- A/B Testing: Comparing two versions of a variable to determine performance
- Predictive Analytics: Using data to forecast future player behavior
- Segmentation: Dividing players into distinct groups based on behavior or demographics

## Regulatory Terms
- KYC (Know Your Customer): Process of verifying player identity
- AML (Anti-Money Laundering): Procedures to prevent illegal money activities
- Responsible Gaming Tools: Features to promote safe gambling behavior
- Self-Exclusion: Player option to block access to gambling services`;
  };

  const getValidationStatusIcon = (status) => {
    switch (status) {
      case 'valid':
        return <CheckCircle className="text-green-500 h-5 w-5" />;
      case 'invalid':
        return <AlertTriangle className="text-amber-500 h-5 w-5" />;
      case 'validating':
        return <Loader2 className="text-blue-500 h-5 w-5 animate-spin" />;
      case 'error':
        return <AlertTriangle className="text-red-500 h-5 w-5" />;
      default:
        return <HelpCircle className="text-gray-400 h-5 w-5" />;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Train Your AI Assistant
        </CardTitle>
        <CardDescription>
          Customize how your AI assistant responds by providing specific guidelines, terminology, and sample queries
        </CardDescription>
      </CardHeader>

      <CardContent>
        {message && (
          <Alert className={`mb-4 ${messageType === 'success' ? 'bg-green-50 text-green-800 border-green-200' : 'bg-red-50 text-red-800 border-red-200'}`}>
            <AlertDescription>
              {message}
            </AlertDescription>
          </Alert>
        )}

        <div className="mb-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Switch 
              id="auto-analyze" 
              checked={isAutoAnalyzeEnabled}
              onCheckedChange={setIsAutoAnalyzeEnabled}
            />
            <Label htmlFor="auto-analyze">Automatically analyze content</Label>
          </div>
          
          <div className="text-xs text-gray-500">
            {lastSaved ? `Last saved: ${lastSaved.toLocaleString()}` : 'Not saved yet'}
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="guidelines" className="flex gap-2 items-center">
              <FileText className="h-4 w-4" />
              Guidelines
              {validation.guidelines.status !== 'pending' && 
                getValidationStatusIcon(validation.guidelines.status)}
            </TabsTrigger>
            <TabsTrigger value="terms" className="flex gap-2 items-center">
              <BookText className="h-4 w-4" />
              Terminology
              {validation.terms.status !== 'pending' && 
                getValidationStatusIcon(validation.terms.status)}
            </TabsTrigger>
            <TabsTrigger value="training" className="flex gap-2 items-center">
              <Brain className="h-4 w-4" />
              Sample Queries
              {validation.trainingData.status !== 'pending' && 
                getValidationStatusIcon(validation.trainingData.status)}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="guidelines">
            <div className="space-y-4">
              <div>
                <Label className="flex items-center gap-2 mb-2">
                  <Edit className="h-4 w-4" />
                  Response Style and Knowledge Guidelines
                </Label>
                <Textarea 
                  placeholder="Define how your AI assistant should respond, what knowledge it should demonstrate, and general behavior guidelines..."
                  className="h-[400px] font-mono text-sm"
                  value={trainingData.guidelines}
                  onChange={(e) => {
                    setTrainingData(prev => ({ ...prev, guidelines: e.target.value }));
                    if (isAutoAnalyzeEnabled && e.target.value.length > 100 && !validationInProgress) {
                      const debounce = setTimeout(() => {
                        validateSection('guidelines');
                      }, 5000);
                      return () => clearTimeout(debounce);
                    }
                  }}
                />
              </div>

              {validation.guidelines.status !== 'pending' && validation.guidelines.feedback && (
                <Alert className={validation.guidelines.status === 'valid' ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}>
                  <AlertDescription className="text-sm">
                    <p className="font-medium">{validation.guidelines.status === 'valid' ? 'Feedback:' : 'Improvement suggestions:'}</p>
                    <p>{validation.guidelines.feedback}</p>
                    
                    {validation.guidelines.suggestions && (
                      <div className="mt-2">
                        <ul className="list-disc pl-5 space-y-1">
                          {validation.guidelines.suggestions.map((suggestion, index) => (
                            <li key={index} className="text-xs">{suggestion}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => setTrainingData(prev => ({ ...prev, guidelines: getDefaultGuidelines() }))}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reset to Default
                </Button>
                <Button 
                  onClick={() => validateSection('guidelines')}
                  disabled={validation.guidelines.status === 'validating' || validationInProgress}
                >
                  {validation.guidelines.status === 'validating' ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle className="mr-2 h-4 w-4" />
                  )}
                  Validate Guidelines
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="terms">
            <div className="space-y-4">
              <div>
                <Label className="flex items-center gap-2 mb-2">
                  <BookText className="h-4 w-4" />
                  Industry Terminology and Definitions
                </Label>
                <Textarea 
                  placeholder="Define iGaming industry terms, metrics, and concepts your AI should understand..."
                  className="h-[400px] font-mono text-sm"
                  value={trainingData.terms}
                  onChange={(e) => {
                    setTrainingData(prev => ({ ...prev, terms: e.target.value }));
                    if (isAutoAnalyzeEnabled && e.target.value.length > 100 && !validationInProgress) {
                      const debounce = setTimeout(() => {
                        validateSection('terms');
                      }, 5000);
                      return () => clearTimeout(debounce);
                    }
                  }}
                />
              </div>

              {validation.terms.status !== 'pending' && validation.terms.feedback && (
                <Alert className={validation.terms.status === 'valid' ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}>
                  <AlertDescription className="text-sm">
                    <p className="font-medium">{validation.terms.status === 'valid' ? 'Feedback:' : 'Improvement suggestions:'}</p>
                    <p>{validation.terms.feedback}</p>
                    
                    {validation.terms.suggestions && (
                      <div className="mt-2">
                        <ul className="list-disc pl-5 space-y-1">
                          {validation.terms.suggestions.map((suggestion, index) => (
                            <li key={index} className="text-xs">{suggestion}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => setTrainingData(prev => ({ ...prev, terms: getDefaultTerms() }))}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reset to Default
                </Button>
                <Button 
                  onClick={() => validateSection('terms')}
                  disabled={validation.terms.status === 'validating' || validationInProgress}
                >
                  {validation.terms.status === 'validating' ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle className="mr-2 h-4 w-4" />
                  )}
                  Validate Terminology
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="training">
            <div className="space-y-4">
              <div>
                <Label className="flex items-center gap-2 mb-2">
                  <Brain className="h-4 w-4" />
                  Sample Queries and Expected Responses
                </Label>
                <Alert className="mb-3">
                  <AlertDescription className="text-sm">
                    <p>Provide example queries and ideal responses to teach your AI how to handle specific requests. Format as:</p>
                    <pre className="p-2 bg-gray-100 rounded mt-1 text-xs overflow-auto">
                      User: What is our current GGR?<br/>
                      Assistant: Our current GGR is $124,500, which is a 12.5% increase from the previous period. This growth is primarily driven by slots and live dealer games.
                    </pre>
                  </AlertDescription>
                </Alert>
                <Textarea 
                  placeholder="Add sample conversations with expected responses..."
                  className="h-[400px] font-mono text-sm"
                  value={trainingData.trainingData}
                  onChange={(e) => {
                    setTrainingData(prev => ({ ...prev, trainingData: e.target.value }));
                    if (isAutoAnalyzeEnabled && e.target.value.length > 100 && !validationInProgress) {
                      const debounce = setTimeout(() => {
                        validateSection('trainingData');
                      }, 5000);
                      return () => clearTimeout(debounce);
                    }
                  }}
                />
              </div>

              {validation.trainingData.status !== 'pending' && validation.trainingData.feedback && (
                <Alert className={validation.trainingData.status === 'valid' ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}>
                  <AlertDescription className="text-sm">
                    <p className="font-medium">{validation.trainingData.status === 'valid' ? 'Feedback:' : 'Improvement suggestions:'}</p>
                    <p>{validation.trainingData.feedback}</p>
                    
                    {validation.trainingData.suggestions && (
                      <div className="mt-2">
                        <ul className="list-disc pl-5 space-y-1">
                          {validation.trainingData.suggestions.map((suggestion, index) => (
                            <li key={index} className="text-xs">{suggestion}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setTrainingData(prev => ({ 
                      ...prev, 
                      trainingData: `User: Show me a chart of our GGR by game category
Assistant: Here's a bar chart showing our GGR breakdown by game category. Slots are leading with $42,500, followed by Live Casino at $37,800. Table Games and Sports betting are also significant contributors.

User: What's our current conversion rate?
Assistant: Our current registration-to-deposit conversion rate is 22.5%, which is down 0.8% from the previous period. While this is slightly below our target of 25%, it remains above the industry average of 20%.

User: Compare our player retention with industry benchmarks
Assistant: Our 30-day player retention rate is currently 42%, which is 5% above the industry average of 37%. Our VIP segment shows the highest retention at 68%, while our casual player segment is at 38%.

User: Show me deposit trends for the last 6 months
Assistant: Here's a line chart showing deposit trends over the last 6 months. We can see a steady increase from January to June, with a particularly strong performance in March. The average monthly growth rate is 8.2%.

User: Generate a report on our affiliate performance
Assistant: I've prepared a report on affiliate performance:

Revenue Overview:
- Total affiliate-generated GGR: $348,500
- Top-performing affiliate: Affiliate A with $28,500 revenue
- Fastest-growing affiliate: Affiliate C with 32% growth MoM

Player Activity:
- Players from affiliates have a 28% higher retention rate
- Affiliate players deposit 22% more on average than non-affiliate players

Recommendations:
1. Increase commission for top-performing affiliates
2. Review and optimize underperforming affiliate campaigns
3. Consider offering enhanced CPA deals to affiliates with high-quality player acquisition

User: What metrics should I focus on to improve player retention?
Assistant: To improve player retention, focus on these key metrics:
1. Churn rate - identify when and why players leave
2. Game variety engagement - track how many different games players try
3. Bonus acceptance and playthrough rates
4. Average session time and frequency
5. Customer support response time and satisfaction
6. Payment processing speed and success rate

I recommend setting up a retention dashboard that tracks these metrics across player segments to identify targeted improvement opportunities.`
                    }))
                  }}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Load Sample Data
                </Button>
                <Button 
                  onClick={() => validateSection('trainingData')}
                  disabled={validation.trainingData.status === 'validating' || validationInProgress}
                >
                  {validation.trainingData.status === 'validating' ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle className="mr-2 h-4 w-4" />
                  )}
                  Validate Examples
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={fetchExistingData} disabled={loading}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
          Reload Data
        </Button>
        <Button onClick={saveTrainingData} disabled={savingLoading} className="bg-indigo-600 hover:bg-indigo-700">
          {savingLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Save Training Data
        </Button>
      </CardFooter>
    </Card>
  );
}
