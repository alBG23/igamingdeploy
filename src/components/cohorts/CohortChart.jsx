import React, { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export default function CohortChart({ title, data, valueKey, formatValue = (val) => val }) {
  // Process data for the chart
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    // Get unique cohorts (FTD months) and sort chronologically
    const cohorts = [...new Set(data.map(d => d.ftd_month))].sort();
    
    // Get all month numbers
    const monthNumbers = [...new Set(data.map(d => d.month_number))].sort((a, b) => a - b);
    
    // Create a chart data point for each month number
    return monthNumbers.map(month => {
      const dataPoint = {
        name: month === 0 ? 'Month 0' : `M+${month}`,
        month
      };
      
      // Add a data point for each cohort
      cohorts.forEach(cohort => {
        const cohortMonthData = data.find(d => d.ftd_month === cohort && d.month_number === month);
        const value = cohortMonthData ? cohortMonthData[valueKey] : 0;
        
        // Use the cohort as the key, but format it nicely
        const key = cohort.replace('-', '_');
        dataPoint[key] = value;
        
        // Also add a formatted label for the cohort
        dataPoint[`${key}_label`] = formatCohortDate(cohort);
      });
      
      return dataPoint;
    });
  }, [data, valueKey]);
  
  const formatCohortDate = (dateStr) => {
    try {
      const [year, month] = dateStr.split('-');
      return `${month}/${year}`;
    } catch (e) {
      return dateStr;
    }
  };
  
  // Get colors for chart lines
  const colors = [
    "#4f46e5", "#06b6d4", "#f43f5e", "#10b981", "#f59e0b", 
    "#8b5cf6", "#ec4899", "#14b8a6", "#f97316", "#6366f1"
  ];
  
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center py-10 text-gray-500">No data available for the selected filters</p>
        </CardContent>
      </Card>
    );
  }
  
  // Extract unique cohorts for the legend
  const cohorts = [...new Set(data.map(d => d.ftd_month))].sort();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => {
                  // Extract the actual cohort from the name
                  const cohort = name.split('_')[0] + '-' + name.split('_')[1];
                  return [formatValue(value), formatCohortDate(cohort)];
                }}
              />
              <Legend 
                formatter={(value) => {
                  // Replace underscore with dash and format
                  if (value.includes('_')) {
                    const parts = value.split('_');
                    return formatCohortDate(`${parts[0]}-${parts[1]}`);
                  }
                  return value;
                }}
              />
              
              {cohorts.map((cohort, index) => {
                const key = cohort.replace('-', '_');
                return (
                  <Line
                    key={cohort}
                    type="monotone"
                    dataKey={key}
                    name={key}
                    stroke={colors[index % colors.length]}
                    activeDot={{ r: 8 }}
                    strokeWidth={2}
                  />
                );
              })}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}