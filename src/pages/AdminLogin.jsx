
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { User, Key, ArrowRight, AlertCircle, Info, CheckCircle2, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import VPNWarning from '../components/VPNWarning';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [resetSubmitted, setResetSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const [otpCode, setOtpCode] = useState('');
  const [showOtpForm, setShowOtpForm] = useState(false);
  
  const navigate = useNavigate();
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      if (!email.includes('@') || password.length < 6) {
        throw new Error('Invalid email or password');
      }
      setShowOtpForm(true);
      
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleOtpVerification = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      if (otpCode.length !== 6 || !/^\d+$/.test(otpCode)) {
        throw new Error('Invalid verification code');
      }
      
      localStorage.setItem('adminUser', JSON.stringify({
        email,
        role: 'admin',
        name: email.split('@')[0],
        company: 'iGaming Analytics Admin',
        isLoggedIn: true
      }));
      
      navigate(createPageUrl('Admin'));
    } catch (err) {
      setError(err.message || 'Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePasswordReset = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      setResetSubmitted(true);
      setIsLoading(false);
    }, 1500);
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-2">
            <div className="bg-red-600 text-white p-3 rounded-full">
              <Shield className="h-6 w-6" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white">iGaming Analytics</h1>
          <p className="text-gray-300 mt-1">Admin Portal</p>
        </div>
        
        <div className="mb-4">
          <VPNWarning />
        </div>
        
        <Card className="border-0 shadow-xl">
          {showOtpForm ? (
            <div>
              <CardHeader>
                <CardTitle>Two-Factor Authentication</CardTitle>
                <CardDescription>
                  Enter the verification code sent to your device
                </CardDescription>
              </CardHeader>
              <CardContent>
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                <form onSubmit={handleOtpVerification}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="otp">Verification Code</Label>
                      <Input 
                        id="otp" 
                        type="text" 
                        placeholder="123456" 
                        className="text-center tracking-widest text-lg"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        maxLength={6}
                        required
                      />
                    </div>
                    
                    <Alert className="bg-blue-50 border-blue-200">
                      <Info className="h-4 w-4 text-blue-600" />
                      <AlertDescription className="text-blue-800">
                        For demo purposes, enter any 6-digit code to continue.
                      </AlertDescription>
                    </Alert>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-red-600 hover:bg-red-700" 
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Verifying...</span>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <span>Verify Code</span>
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </div>
                      )}
                    </Button>
                    
                    <div className="flex justify-between text-sm">
                      <Button 
                        variant="link" 
                        className="p-0 h-auto text-red-600"
                        onClick={() => setShowOtpForm(false)}
                      >
                        Back to login
                      </Button>
                      <Button 
                        variant="link" 
                        className="p-0 h-auto text-red-600"
                      >
                        Resend code
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </div>
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full mb-4">
                <TabsTrigger value="login" className="flex-1">Login</TabsTrigger>
                <TabsTrigger value="reset" className="flex-1">Reset Password</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <CardHeader>
                  <CardTitle>Admin Access</CardTitle>
                  <CardDescription>
                    Log in to the administrator dashboard
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {error && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  
                  <form onSubmit={handleLogin}>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                            <User className="h-5 w-5" />
                          </div>
                          <Input 
                            id="email" 
                            type="email" 
                            placeholder="admin@igaming.com" 
                            className="pl-10"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label htmlFor="password">Password</Label>
                        </div>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                            <Key className="h-5 w-5" />
                          </div>
                          <Input 
                            id="password" 
                            type="password" 
                            className="pl-10"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-red-600 hover:bg-red-700" 
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <div className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Logging in...</span>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <span>Log in</span>
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </div>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="text-sm text-center w-full">
                    <span className="text-gray-500">Client Portal? </span>
                    <Button 
                      variant="link" 
                      className="p-0 h-auto text-red-600"
                      onClick={() => navigate(createPageUrl('ClientLogin'))}
                    >
                      Log in as client
                    </Button>
                  </div>
                </CardFooter>
              </TabsContent>
              
              <TabsContent value="reset">
                <CardHeader>
                  <CardTitle>Reset Admin Password</CardTitle>
                  <CardDescription>
                    We'll send you a link to reset your password
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {resetSubmitted ? (
                    <div className="py-4">
                      <Alert className="bg-green-50 border-green-200">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800">
                          Password reset link sent! Check your email inbox for instructions.
                        </AlertDescription>
                      </Alert>
                    </div>
                  ) : (
                    <form onSubmit={handlePasswordReset}>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="reset-email">Email</Label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                              <User className="h-5 w-5" />
                            </div>
                            <Input 
                              id="reset-email" 
                              type="email" 
                              placeholder="admin@igaming.com" 
                              className="pl-10"
                              value={resetEmail}
                              onChange={(e) => setResetEmail(e.target.value)}
                              required
                            />
                          </div>
                        </div>
                        
                        <Alert className="bg-blue-50 border-blue-200">
                          <Info className="h-4 w-4 text-blue-600" />
                          <AlertDescription className="text-blue-800">
                            Enter the admin email address associated with your account. IT security approval may be required.
                          </AlertDescription>
                        </Alert>
                        
                        <Button 
                          type="submit" 
                          className="w-full bg-red-600 hover:bg-red-700" 
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <div className="flex items-center">
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              <span>Sending...</span>
                            </div>
                          ) : "Send Reset Link"}
                        </Button>
                      </div>
                    </form>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="text-sm text-center w-full">
                    <Button 
                      variant="link" 
                      className="p-0 h-auto text-red-600"
                      onClick={() => setActiveTab('login')}
                    >
                      Back to login
                    </Button>
                  </div>
                </CardFooter>
              </TabsContent>
            </Tabs>
          )}
        </Card>
      </div>
    </div>
  );
}
