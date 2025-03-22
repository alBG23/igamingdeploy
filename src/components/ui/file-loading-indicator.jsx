import React from 'react';
import { Loader2 } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { AlertCircle, CheckCircle } from 'lucide-react';

export function FileLoadingIndicator({ status, percentage = 0, fileName = '', fileSize = '', error = '' }) {
  return (
    <div className="w-full border rounded-md p-3 my-2">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2 text-sm">
          {status === 'loading' && (
            <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
          )}
          {status === 'success' && (
            <CheckCircle className="h-4 w-4 text-green-500" />
          )}
          {status === 'error' && (
            <AlertCircle className="h-4 w-4 text-red-500" />
          )}
          <span className="font-medium truncate max-w-[200px]">{fileName}</span>
          {fileSize && <span className="text-gray-500 text-xs">({fileSize})</span>}
        </div>
        {status === 'loading' && (
          <span className="text-xs font-medium text-indigo-600">{percentage}%</span>
        )}
      </div>
      
      {status === 'loading' && (
        <Progress value={percentage} className="h-1.5 w-full" />
      )}
      
      {status === 'error' && error && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
}