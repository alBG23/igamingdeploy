import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, FileText, FileSpreadsheet, FileJson } from 'lucide-react';
import { FileLoadingIndicator } from "@/components/ui/file-loading-indicator";

export default function DataImportFilePicker({ onFileSelected }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('idle'); // idle, loading, success, error
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setError('');
    setUploadStatus('idle');
    
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fileExtension = file.name.split('.').pop().toLowerCase();
      
      // Check if file type is supported
      if (!['csv', 'json', 'xlsx', 'xls'].includes(fileExtension)) {
        setError('Unsupported file format. Please use CSV, JSON, or Excel files.');
        return;
      }
      
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('File too large. Maximum file size is 10MB.');
        return;
      }
      
      setSelectedFile(file);
      
      // Auto-start upload if a handler is provided
      if (onFileSelected) {
        simulateUpload(file);
      }
    }
  };

  const simulateUpload = (file) => {
    setUploadStatus('loading');
    setUploadProgress(0);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prevProgress) => {
        const newProgress = prevProgress + Math.random() * 10;
        
        if (newProgress >= 100) {
          clearInterval(interval);
          setUploadProgress(100);
          
          setTimeout(() => {
            setUploadStatus('success');
            if (onFileSelected) onFileSelected(file);
          }, 500);
          
          return 100;
        }
        
        return newProgress;
      });
    }, 300);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setUploadProgress(0);
    setUploadStatus('idle');
    setError('');
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileName) => {
    if (!fileName) return <FileText />;
    
    const extension = fileName.split('.').pop().toLowerCase();
    
    switch (extension) {
      case 'csv':
        return <FileSpreadsheet className="text-green-500" />;
      case 'json':
        return <FileJson className="text-orange-500" />;
      case 'xlsx':
      case 'xls':
        return <FileText className="text-blue-500" />;
      default:
        return <FileText />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="file-upload">Upload File</Label>
        
        {!selectedFile && (
          <div>
            <Input
              id="file-upload"
              type="file"
              accept=".csv,.json,.xlsx,.xls"
              onChange={handleFileChange}
              className={error ? "border-red-300" : ""}
            />
            {error && (
              <p className="text-xs text-red-500 mt-1">{error}</p>
            )}
          </div>
        )}
        
        {selectedFile && (
          <div className="space-y-2">
            <FileLoadingIndicator 
              status={uploadStatus}
              percentage={uploadProgress}
              fileName={selectedFile.name}
              fileSize={formatFileSize(selectedFile.size)}
              error={error}
            />
            
            {uploadStatus !== 'loading' && (
              <div className="flex justify-end">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRemoveFile}
                  className="flex gap-1"
                >
                  <X className="h-4 w-4" /> Remove
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}