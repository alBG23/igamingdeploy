import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Brain, Upload, CheckCircle, Zap, Save, RotateCw, Trash, PlusCircle, List, HelpCircle, Sparkles, Info, FileText } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { InvokeLLM, UploadFile } from "@/api/integrations";

export default function AITrainingModule({ onClose }) {
  const [activeTab, setActiveTab] = useState('terminology');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [trainingsaved, setTrainingSaved] = useState(false);
  
  // Terminology training state
  const [terminology, setTerminology] = useState([
    { term: 'GGR', description: 'Gross Gaming Revenue - Total bets minus total wins' },
    { term: 'NGR', description: 'Net Gaming Revenue - GGR minus bonuses and provider fees' },
    { term: 'FTD', description: 'First Time Depositor - A player who makes their first deposit' },
    { term: 'Hold %', description: 'The percentage of wagers retained by the operator' },
    { term: 'Churn', description: 'When a player stops being active on the platform' }
  ]);
  const [newTerm, setNewTerm] = useState({ term: '', description: '' });
  
  // Document training state
  const [documents, setDocuments] = useState([]);
  const [documentDescription, setDocumentDescription] = useState('');
  
  // Analysis training state
  const [analysisInstructions, setAnalysisInstructions] = useState('Focus on player retention metrics and flag any unusual churn patterns. Pay special attention to high-value players and their betting patterns.');
  
  // Response formatting state
  const [responseSettings, setResponseSettings] = useState({
    includeGraphs: true,
    suggestActions: true,
    highlightAnomalies: true,
    showConfidenceScores: false,
    formatAsCsv: false,
    maxLength: 'standard' // 'concise', 'standard', 'detailed'
  });

  const handleTerminologyAdd = () => {
    if (newTerm.term && newTerm.description) {
      setTerminology([...terminology, newTerm]);
      setNewTerm({ term: '', description: '' });
    }
  };

  const handleTerminologyDelete = (index) => {
    const updatedTerminology = [...terminology];
    updatedTerminology.splice(index, 1);
    setTerminology(updatedTerminology);
  };

  const handleDocumentUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploadingFile(true);
    try {
      // In a real implementation, this would upload to your document storage
      // and potentially extract content for AI training
      const response = await UploadFile({ file });
      
      setDocuments([...documents, {
        name: file.name,
        size: file.size,
        type: file.type,
        description: documentDescription,
        url: response.file_url,
        uploadDate: new Date().toISOString()
      }]);
      setDocumentDescription('');
    } catch (error) {
      console.error('Error uploading file:', error);
    }
    setUploadingFile(false);
  };

  const handleDocumentDelete = (index) => {
    const updatedDocuments = [...documents];
    updatedDocuments.splice(index, 1);
    setDocuments(updatedDocuments);
  };

  const handleResponseSettingChange = (setting, value) => {
    setResponseSettings({
      ...responseSettings,
      [setting]: value
    });
  };

  const handleSaveTraining = async () => {
    setIsLoading(true);
    
    try {
      // In a real implementation, this would save all training data to your backend
      // and update the AI model's behavior
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setTrainingSaved(true);
      setTimeout(() => setTrainingSaved(false), 3000);
    } catch (error) {
      console.error('Error saving training data:', error);
    }
    
    setIsLoading(false);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Brain className="mr-2 h-5 w-5 text-indigo-600" />
          AI Assistant Training
        </CardTitle>
        <CardDescription>
          Customize how the AI analyzes your iGaming data and presents insights
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="terminology">Gaming Terminology</TabsTrigger>
            <TabsTrigger value="documents">Reference Documents</TabsTrigger>
            <TabsTrigger value="analysis">Analysis Instructions</TabsTrigger>
            <TabsTrigger value="responses">Response Formatting</TabsTrigger>
          </TabsList>
          
          <TabsContent value="terminology">
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-md flex items-start mb-4">
                <Info className="h-5 w-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                <div className="text-sm text-blue-700">
                  <p>Add industry-specific terminology to help the AI understand gaming metrics and concepts correctly.</p>
                  <p className="mt-1">This will improve the accuracy of insights and recommendations.</p>
                </div>
              </div>
              
              <div className="flex space-x-4">
                <div className="flex-1">
                  <Label htmlFor="term">Term or Abbreviation</Label>
                  <Input
                    id="term"
                    value={newTerm.term}
                    onChange={(e) => setNewTerm({...newTerm, term: e.target.value})}
                    placeholder="e.g., ARPU, RTP, KYC"
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="description">Description</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="description"
                      value={newTerm.description}
                      onChange={(e) => setNewTerm({...newTerm, description: e.target.value})}
                      placeholder="Define what this term means"
                    />
                    <Button onClick={handleTerminologyAdd} disabled={!newTerm.term || !newTerm.description}>
                      <PlusCircle className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </div>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-2">
                <h3 className="font-medium">Defined Gaming Terminology</h3>
                <ScrollArea className="h-[300px] border rounded-md p-4">
                  <div className="space-y-3">
                    {terminology.map((item, index) => (
                      <div key={index} className="flex justify-between items-start bg-gray-50 p-3 rounded-md">
                        <div>
                          <p className="font-medium">{item.term}</p>
                          <p className="text-sm text-gray-600">{item.description}</p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleTerminologyDelete(index)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="documents">
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-md flex items-start mb-4">
                <Info className="h-5 w-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                <div className="text-sm text-blue-700">
                  <p>Upload industry reports, regulatory guidelines, or company documentation to ground the AI's understanding.</p>
                  <p className="mt-1">These documents will be referenced when analyzing data and generating insights.</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="documentDescription">Document Description</Label>
                <Input
                  id="documentDescription"
                  value={documentDescription}
                  onChange={(e) => setDocumentDescription(e.target.value)}
                  placeholder="What information does this document contain?"
                />
              </div>
              
              <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6">
                <div className="space-y-2 text-center">
                  <div className="flex justify-center">
                    <FileText className="h-10 w-10 text-gray-400" />
                  </div>
                  <div className="text-sm text-gray-500">
                    <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                      <span>Upload a file</span>
                      <input 
                        id="file-upload" 
                        name="file-upload" 
                        type="file" 
                        className="sr-only" 
                        onChange={handleDocumentUpload}
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PDF, Word, Excel, CSV up to 10MB
                  </p>
                  {uploadingFile && (
                    <div className="flex justify-center mt-2">
                      <RotateCw className="h-5 w-5 animate-spin text-indigo-600" />
                    </div>
                  )}
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-2">
                <h3 className="font-medium">Uploaded Reference Documents</h3>
                <ScrollArea className="h-[200px] border rounded-md p-4">
                  <div className="space-y-3">
                    {documents.map((doc, index) => (
                      <div key={index} className="flex justify-between items-start bg-gray-50 p-3 rounded-md">
                        <div className="flex items-start gap-3">
                          <FileText className="h-5 w-5 text-indigo-600 mt-0.5" />
                          <div>
                            <p className="font-medium">{doc.name}</p>
                            <p className="text-xs text-gray-500">{formatFileSize(doc.size)}</p>
                            {doc.description && (
                              <p className="text-sm text-gray-600 mt-1">{doc.description}</p>
                            )}
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDocumentDelete(index)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    {documents.length === 0 && (
                      <p className="text-center text-gray-500 py-4">No documents uploaded yet</p>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="analysis">
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-md flex items-start mb-4">
                <Info className="h-5 w-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                <div className="text-sm text-blue-700">
                  <p>Provide specific instructions on how the AI should analyze your gaming data.</p>
                  <p className="mt-1">Customize focus areas, metrics to prioritize, and specific patterns to watch for.</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="analysisInstructions">Analysis Instructions</Label>
                <Textarea
                  id="analysisInstructions"
                  value={analysisInstructions}
                  onChange={(e) => setAnalysisInstructions(e.target.value)}
                  placeholder="Provide detailed instructions for how the AI should analyze your data..."
                  className="min-h-[200px]"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                      Analysis Priorities
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <Switch id="priorityRevenue" defaultChecked />
                        <Label htmlFor="priorityRevenue" className="ml-2">Prioritize revenue trends</Label>
                      </div>
                      <div className="flex items-center">
                        <Switch id="priorityChurn" defaultChecked />
                        <Label htmlFor="priorityChurn" className="ml-2">Identify churn warning signs</Label>
                      </div>
                      <div className="flex items-center">
                        <Switch id="priorityFraud" defaultChecked />
                        <Label htmlFor="priorityFraud" className="ml-2">Flag suspicious patterns</Label>
                      </div>
                      <div className="flex items-center">
                        <Switch id="priorityLTV" defaultChecked />
                        <Label htmlFor="priorityLTV" className="ml-2">Calculate player LTV</Label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center">
                      <AlertCircle className="h-4 w-4 mr-2 text-amber-600" />
                      Alert Thresholds
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <Switch id="alertRevenue" defaultChecked />
                        <Label htmlFor="alertRevenue" className="ml-2">Revenue drop > 15%</Label>
                      </div>
                      <div className="flex items-center">
                        <Switch id="alertConversion" defaultChecked />
                        <Label htmlFor="alertConversion" className="ml-2">Conversion rate drop > 5%</Label>
                      </div>
                      <div className="flex items-center">
                        <Switch id="alertHold" defaultChecked />
                        <Label htmlFor="alertHold" className="ml-2">Unusual hold % changes</Label>
                      </div>
                      <div className="flex items-center">
                        <Switch id="alertWhales" defaultChecked />
                        <Label htmlFor="alertWhales" className="ml-2">VIP activity changes</Label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="responses">
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-md flex items-start mb-4">
                <Info className="h-5 w-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                <div className="text-sm text-blue-700">
                  <p>Customize how the AI presents insights and analytics to you.</p>
                  <p className="mt-1">Set your preferences for visualizations, detail level, and recommendations.</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Content Preferences</h3>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="includeGraphs" className="flex-1">Include visualizations and charts</Label>
                    <Switch 
                      id="includeGraphs"
                      checked={responseSettings.includeGraphs}
                      onCheckedChange={(checked) => handleResponseSettingChange('includeGraphs', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="suggestActions" className="flex-1">Suggest actionable recommendations</Label>
                    <Switch 
                      id="suggestActions"
                      checked={responseSettings.suggestActions}
                      onCheckedChange={(checked) => handleResponseSettingChange('suggestActions', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="highlightAnomalies" className="flex-1">Highlight anomalies and outliers</Label>
                    <Switch 
                      id="highlightAnomalies"
                      checked={responseSettings.highlightAnomalies}
                      onCheckedChange={(checked) => handleResponseSettingChange('highlightAnomalies', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="showConfidenceScores" className="flex-1">Show confidence scores for predictions</Label>
                    <Switch 
                      id="showConfidenceScores"
                      checked={responseSettings.showConfidenceScores}
                      onCheckedChange={(checked) => handleResponseSettingChange('showConfidenceScores', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="formatAsCsv" className="flex-1">Format results as exportable tables</Label>
                    <Switch 
                      id="formatAsCsv"
                      checked={responseSettings.formatAsCsv}
                      onCheckedChange={(checked) => handleResponseSettingChange('formatAsCsv', checked)}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium">Response Format</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <div className="flex items-center space-x-2">
                        <input 
                          type="radio" 
                          id="concise" 
                          name="maxLength" 
                          value="concise"
                          checked={responseSettings.maxLength === 'concise'}
                          onChange={() => handleResponseSettingChange('maxLength', 'concise')}
                          className="h-4 w-4 text-indigo-600"
                        />
                        <Label htmlFor="concise">Concise</Label>
                      </div>
                      <div className="text-xs text-gray-500">
                        Brief bullet points with key findings only
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-2">
                      <div className="flex items-center space-x-2">
                        <input 
                          type="radio" 
                          id="standard" 
                          name="maxLength" 
                          value="standard"
                          checked={responseSettings.maxLength === 'standard'}
                          onChange={() => handleResponseSettingChange('maxLength', 'standard')}
                          className="h-4 w-4 text-indigo-600"
                        />
                        <Label htmlFor="standard">Standard</Label>
                      </div>
                      <div className="text-xs text-gray-500">
                        Balanced detail with insights and key metrics
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-2">
                      <div className="flex items-center space-x-2">
                        <input 
                          type="radio" 
                          id="detailed" 
                          name="maxLength" 
                          value="detailed"
                          checked={responseSettings.maxLength === 'detailed'}
                          onChange={() => handleResponseSettingChange('maxLength', 'detailed')}
                          className="h-4 w-4 text-indigo-600"
                        />
                        <Label htmlFor="detailed">Detailed</Label>
                      </div>
                      <div className="text-xs text-gray-500">
                        Comprehensive analysis with supporting data and context
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t">
                    <h3 className="font-medium mb-2">Insight Types to Include</h3>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <Badge className="justify-center" variant="outline">Performance Metrics</Badge>
                      <Badge className="justify-center" variant="outline">Trend Analysis</Badge>
                      <Badge className="justify-center" variant="outline">Player Behavior</Badge>
                      <Badge className="justify-center" variant="outline">Financial Insights</Badge>
                      <Badge className="justify-center" variant="outline">Regulatory Flags</Badge>
                      <Badge className="justify-center" variant="outline">Competitor Comparison</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <div className="flex items-center gap-2">
          {trainingsaved && (
            <span className="text-green-600 flex items-center text-sm">
              <CheckCircle className="h-4 w-4 mr-1" />
              Training saved successfully
            </span>
          )}
          <Button onClick={handleSaveTraining} disabled={isLoading}>
            {isLoading ? (
              <>
                <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Save Training Configuration
              </>
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}