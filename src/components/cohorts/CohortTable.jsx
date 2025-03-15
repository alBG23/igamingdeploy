import React, { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from 'date-fns';

export default function CohortTable({ title, description, data, valueKey, formatValue = (val) => val }) {
  const cohortData = useMemo(() => {
    if (!data || data.length === 0) return { cohorts: [], monthNumbers: [], table: {} };
    
    // Get unique cohorts (FTD months) and sort chronologically
    const cohorts = [...new Set(data.map(d => d.ftd_month))].sort();
    
    // Get all month numbers
    const monthNumbers = [...new Set(data.map(d => d.month_number))].sort((a, b) => a - b);
    
    // Create a map of cohort -> month -> value
    const table = {};
    
    cohorts.forEach(cohort => {
      table[cohort] = {};
      
      monthNumbers.forEach(month => {
        const cohortMonthData = data.find(d => d.ftd_month === cohort && d.month_number === month);
        table[cohort][month] = cohortMonthData ? cohortMonthData[valueKey] : null;
      });
    });
    
    return { cohorts, monthNumbers, table };
  }, [data, valueKey]);
  
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center py-10 text-gray-500">No data available for the selected filters</p>
        </CardContent>
      </Card>
    );
  }

  const formatCohortDate = (dateStr) => {
    try {
      const [year, month] = dateStr.split('-');
      return `${month}/${year}`;
    } catch (e) {
      return dateStr;
    }
  };
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-medium">FTD Cohort</TableHead>
              {cohortData.monthNumbers.map(month => (
                <TableHead key={month} className="text-right">
                  {month === 0 ? 'Month 0' : `M+${month}`}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {cohortData.cohorts.map(cohort => (
              <TableRow key={cohort}>
                <TableCell className="font-medium">
                  {formatCohortDate(cohort)}
                </TableCell>
                {cohortData.monthNumbers.map(month => (
                  <TableCell key={month} className="text-right">
                    {cohortData.table[cohort][month] !== null 
                      ? formatValue(cohortData.table[cohort][month]) 
                      : '-'}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}