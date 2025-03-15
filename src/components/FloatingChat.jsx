import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Brain, ChevronDown, SendIcon, X } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([
    { 
      type: 'assistant', 
      content: 'Hello! I\'m your iGaming Analytics Assistant. How can I help you today?' 
    }
  ]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    
    // Add user message
    setMessages(prev => [...prev, { type: 'user', content: inputValue }]);
    
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        type: 'assistant', 
        content: 'I understand you\'re asking about analytics data. This is a demo assistant - in a production environment, I would be connected to your actual gaming data to provide specific insights.' 
      }]);
    }, 1000);
    
    setInputValue('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
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
          <Card className="w-80 sm:w-96 shadow-xl border-gray-200 overflow-hidden">
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
            
            <ScrollArea className="h-72">
              <CardContent className="p-4 space-y-4">
                {messages.map((message, index) => (
                  <div 
                    key={index} 
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                        message.type === 'user' 
                          ? 'bg-indigo-600 text-white' 
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
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
                  disabled={!inputValue.trim()}
                >
                  <SendIcon className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        )}
      </div>
    </>
  );
}