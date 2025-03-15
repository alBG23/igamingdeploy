import React from 'react';
import { ArrowDown, CheckCircle2, AlertTriangle, XCircle, TrendingUp, TrendingDown, HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

export default function ConversionFunnel({ data }) {
  if (!data || !data.stages || data.stages.length === 0) {
    return <div className="h-[400px] flex items-center justify-center text-gray-500">No funnel data available</div>;
  }
  
  const getHealthIcon = (health) => {
    switch (health) {
      case 'good':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'critical':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <HelpCircle className="h-4 w-4 text-gray-400" />;
    }
  };
  
  const getFunnelColor = (index, health) => {
    // Base colors for funnel sections
    const colors = [
      '#e45252', // Red (top)
      '#ff9f45', // Orange 
      '#ffd166', // Yellow
      '#4ecdc4', // Teal
      '#61a0ff', // Blue
      '#6665dd', // Indigo
      '#8c6bb1'  // Purple (bottom)
    ];
    
    // Override colors based on health
    if (health === 'critical') return '#e53e3e';
    if (health === 'warning') return '#f6ad55';
    if (health === 'good') return colors[index % colors.length];
    
    return colors[index % colors.length];
  };
  
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toLocaleString();
  };
  
  const formatCurrency = (num) => {
    return '€' + formatNumber(num);
  };
  
  return (
    <div className="py-4 max-w-xl mx-auto">
      <div className="grid grid-cols-1 gap-6">
        <div className="relative">
          <div className="mx-auto max-w-[90%] md:max-w-[80%]">
            {data.stages.map((stage, index) => {
              const totalStages = data.stages.length;
              const stageHeight = 70; // pixels
              
              // Calculate width for funnel trapezoid
              const topWidthPercent = 100 - (index * (70 / totalStages));
              const bottomWidthPercent = 100 - ((index + 1) * (70 / totalStages));
              
              // Create funnel shape using CSS
              return (
                <TooltipProvider key={stage.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="relative mx-auto cursor-pointer text-white mb-2">
                        {/* Funnel segment */}
                        <div 
                          style={{
                            height: `${stageHeight}px`,
                            backgroundColor: getFunnelColor(index, stage.health),
                            width: `${topWidthPercent}%`,
                            clipPath: `polygon(0 0, 100% 0, ${(bottomWidthPercent / topWidthPercent) * 100}% 100%, 0 100%)`,
                            WebkitClipPath: `polygon(0 0, 100% 0, ${(bottomWidthPercent / topWidthPercent) * 100}% 100%, 0 100%)`,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '0 10px',
                            textAlign: 'center',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                            zIndex: totalStages - index
                          }}
                        >
                          <div className="font-medium text-sm">{stage.name}</div>
                          <div className="font-bold text-lg">
                            {stage.id === 'revenue' ? formatCurrency(stage.value) : formatNumber(stage.value)}
                          </div>
                          {stage.conversion && (
                            <div className="text-xs text-white/90">
                              {stage.conversion}% conv.
                            </div>
                          )}
                        </div>
                        
                        {/* Label on the side showing conversion rate */}
                        {stage.conversion && (
                          <div className="hidden md:block absolute right-0 top-1/2 transform translate-x-[105%] -translate-y-1/2 bg-white text-gray-900 rounded-md px-2 py-1 text-xs shadow-sm border">
                            {stage.conversion}% conv.
                          </div>
                        )}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="w-56">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span>{stage.name}</span>
                          <div className="flex items-center">
                            {getHealthIcon(stage.health)}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <div className="text-gray-500">Current</div>
                            <div className="font-medium">
                              {stage.id === 'revenue' ? formatCurrency(stage.value) : formatNumber(stage.value)}
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-500">Previous</div>
                            <div className="font-medium">
                              {stage.id === 'revenue' ? formatCurrency(stage.previousValue) : formatNumber(stage.previousValue)}
                            </div>
                          </div>
                        </div>
                        {stage.conversion && (
                          <div>
                            <div className="text-gray-500 text-sm">Conversion Rate</div>
                            <div className="font-medium">{stage.conversion}%</div>
                          </div>
                        )}
                        <div className="text-xs text-gray-500">{stage.description}</div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}