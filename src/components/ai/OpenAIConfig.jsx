
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge"; // Added missing Badge import
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { User } from "@/api/entities";
import { Separator } from "@/components/ui/separator";
import { InvokeLLM } from "@/api/integrations";
import { 
  Key, 
  Check, 
  AlertTriangle, 
  XCircle, 
  Loader2, 
  RefreshCw, 
  Save,
  Brain,
  Shield,
  Lock
} from 'lucide-react';

export default function OpenAIConfig() {
  const [apiKey, setApiKey] = useState('');
  const [organizationId, setOrganizationId] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [userData, setUserData] = useState(null);
  const [model, setModel] = useState('gpt-4');
  const [activeTab, setActiveTab] = useState('api-key');
  const [isApiKeyVisible, setIsApiKeyVisible] = useState(false);
  const [defaultModel, setDefaultModel] = useState('gpt-4');
  const [autoSave, setAutoSave] = useState(true);
  const [showAdminNotice, setShowAdminNotice] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('unknown');

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const user = await User.me();
        setUserData(user);
        console.log("User data loaded:", user);
        
        if (user.openai_api_key) {
          setApiKey(user.openai_api_key);
          setShowAdminNotice(false);
          setConnectionStatus('connected');
        } else {
          setApiKey('');
          if (user.role === 'admin') {
            setShowAdminNotice(true);
          }
        }
        
        if (user.openai_org_id) {
          setOrganizationId(user.openai_org_id);
        }
        
        if (user.openai_default_model) {
          setDefaultModel(user.openai_default_model);
          setModel(user.openai_default_model);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    
    loadUserData();
  }, []);

  const testApiKey = async () => {
    if (!apiKey) {
      setTestResult({
        success: false,
        message: "Please enter an API key first"
      });
      return;
    }
    
    setLoading(true);
    setTestResult(null);
    
    try {
      await User.updateMyUserData({
        openai_api_key: apiKey,
        openai_org_id: organizationId || undefined,
        openai_default_model: model
      });
      
      const response = await InvokeLLM({
        prompt: "This is a test to verify OpenAI API key configuration. Please respond with 'API key is valid and working correctly'.",
        add_context_from_internet: false
      });
      
      console.log("Test response:", response);
      
      if (response && typeof response === 'string') {
        setTestResult({
          success: true,
          message: "API key is working correctly!"
        });
        setConnectionStatus('connected');
        
        if (autoSave) {
          setTestResult({
            success: true,
            message: "API key is working correctly and has been saved to your profile!"
          });
        }
      } else {
        setTestResult({
          success: false,
          message: "Received a response, but it doesn't look right. The API key might still be valid but there may be an issue with the integration."
        });
      }
    } catch (error) {
      console.error("API test error:", error);
      setTestResult({
        success: false,
        message: `Error: ${error.message || "Failed to connect to OpenAI API"}`
      });
      setConnectionStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const saveApiKey = async () => {
    if (!apiKey) {
      setTestResult({
        success: false,
        message: "Please enter an API key first"
      });
      return;
    }
    
    setSaving(true);
    
    try {
      await User.updateMyUserData({
        openai_api_key: apiKey,
        openai_org_id: organizationId || undefined,
        openai_default_model: model
      });
      
      setTestResult({
        success: true,
        message: "API key and settings saved successfully! Please reload the page for changes to take effect."
      });
      setConnectionStatus('connected');
      
      const updatedUser = await User.me();
      setUserData(updatedUser);
      
    } catch (error) {
      console.error("Error saving API key:", error);
      setTestResult({
        success: false,
        message: `Error saving API key: ${error.message}`
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5 text-indigo-600" />
          OpenAI API Configuration
          {connectionStatus === 'connected' && (
            <Badge className="bg-green-100 text-green-800 ml-2">Connected</Badge>
          )}
        </CardTitle>
        <CardDescription>
          Configure your OpenAI API key to enable AI features
        </CardDescription>
      </CardHeader>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <div className="px-6">
          <TabsList className="w-full">
            <TabsTrigger value="api-key">API Key Setup</TabsTrigger>
            <TabsTrigger value="models">Model Settings</TabsTrigger>
            <TabsTrigger value="advanced">Advanced Options</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="api-key" className="p-0">
          <CardContent className="space-y-4 pt-6">
            {showAdminNotice && (
              <Alert className="bg-amber-50 border-amber-200">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-700">
                  As an admin, you can provide your own OpenAI API key for this account, or contact Base44 
                  support to enable the platform-level OpenAI integration.
                </AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="api-key" className="text-sm font-medium">
                OpenAI API Key
              </Label>
              <div className="relative">
                <Input
                  id="api-key"
                  type={isApiKeyVisible ? "text" : "password"}
                  placeholder="sk-..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="pr-10"
                />
                <button 
                  type="button"
                  onClick={() => setIsApiKeyVisible(!isApiKeyVisible)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {isApiKeyVisible ? (
                    <Shield className="h-4 w-4" />
                  ) : (
                    <Lock className="h-4 w-4" />
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500">
                You can find your API key in your OpenAI account at{" "}
                <a 
                  href="https://platform.openai.com/api-keys" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-indigo-600 hover:underline"
                >
                  platform.openai.com/api-keys
                </a>
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="org-id" className="text-sm font-medium">
                Organization ID (Optional)
              </Label>
              <Input
                id="org-id"
                type="text"
                placeholder="org-..."
                value={organizationId}
                onChange={(e) => setOrganizationId(e.target.value)}
              />
              <p className="text-xs text-gray-500">
                For users who belong to multiple organizations. Leave blank if unsure.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button 
                onClick={testApiKey} 
                disabled={loading || !apiKey}
                className="flex-1"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Test Connection
              </Button>
              
              <Button 
                onClick={saveApiKey} 
                disabled={saving || !apiKey} 
                variant="outline"
                className="flex-1"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save API Key
              </Button>
            </div>
            
            {testResult && (
              <Alert className={`${testResult.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                {testResult.success ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
                <AlertDescription className={`${testResult.success ? 'text-green-700' : 'text-red-700'}`}>
                  {testResult.message}
                </AlertDescription>
              </Alert>
            )}
            
            <Alert className="bg-blue-50 border-blue-200">
              <AlertTriangle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-700">
                Important: After saving your API key, you may need to reload the page for changes to fully take effect.
              </AlertDescription>
            </Alert>
          </CardContent>
        </TabsContent>
        
        <TabsContent value="models" className="p-0">
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Label htmlFor="default-model" className="text-sm font-medium">
                Default Model
              </Label>
              <Select value={model} onValueChange={setModel}>
                <SelectTrigger id="default-model">
                  <SelectValue placeholder="Select a model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4">GPT-4 (Most Powerful)</SelectItem>
                  <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                  <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo (Faster, Lower Cost)</SelectItem>
                  <SelectItem value="gpt-3.5-turbo-16k">GPT-3.5 Turbo 16k (Extended Context)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                This model will be used by default for all AI operations in Base44.
              </p>
            </div>
            
            <div className="pt-4">
              <Button onClick={saveApiKey} disabled={saving}>
                {saving ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save Model Settings
              </Button>
            </div>
          </CardContent>
        </TabsContent>
        
        <TabsContent value="advanced" className="p-0">
          <CardContent className="space-y-4 pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-save" className="text-sm font-medium">
                  Auto-save after successful test
                </Label>
                <p className="text-xs text-gray-500">
                  Automatically save API key when test is successful
                </p>
              </div>
              <Switch
                id="auto-save"
                checked={autoSave}
                onCheckedChange={setAutoSave}
              />
            </div>
            
            <Separator className="my-4" />
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium">About OpenAI API Keys</h3>
              <p className="text-sm text-gray-600">
                Your API key is stored securely in your Base44 user profile and is only used for 
                making requests to OpenAI's API. The key never leaves our secure environment.
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Usage of the OpenAI API will be billed directly to your OpenAI account based on
                your usage. Base44 does not charge additional fees for using your own API key.
              </p>
            </div>
            
            <Alert className="bg-blue-50 border-blue-200 mt-4">
              <Brain className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-700">
                Enterprise customers: Contact your Base44 account manager to discuss options for platform-level
                OpenAI integration that doesn't require individual API keys.
              </AlertDescription>
            </Alert>
          </CardContent>
        </TabsContent>
      </Tabs>
      
      <CardFooter className="flex justify-between border-t bg-gray-50 p-6">
        <div className="text-sm text-gray-500">
          {userData?.openai_api_key ? "API key configured" : "No API key configured"}
        </div>
        
        <Button variant="ghost" onClick={() => window.open("https://platform.openai.com/docs/api-reference", "_blank")}>
          OpenAI API Documentation
        </Button>
      </CardFooter>
    </Card>
  );
}
