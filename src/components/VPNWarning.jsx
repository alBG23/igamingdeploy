import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export default function VPNWarning() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <Alert className="bg-amber-50 border-amber-200 flex items-start justify-between">
      <div className="flex">
        <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 mr-2 flex-shrink-0" />
        <AlertDescription className="text-amber-800">
          <p className="font-medium">VPN Detected</p>
          <p className="text-sm mt-1">
            You appear to be using a VPN or proxy. This might affect some functionality in our platform. 
            If you're experiencing loading issues, try disabling your VPN for optimal performance.
          </p>
        </AlertDescription>
      </div>
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-8 w-8 p-0 flex-shrink-0" 
        onClick={() => setDismissed(true)}
      >
        <X className="h-4 w-4" />
      </Button>
    </Alert>
  );
}