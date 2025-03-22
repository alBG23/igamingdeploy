import React from 'react';
import { ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

const COLORS = ['#4F46E5', '#0EA5E9', '#10B981', '#8B5CF6', '#F59E0B', '#EC4899'];

export default function ChatDataVisualizer({ type, data }) {
  if (!data || data.length === 0) {
    return <div className="p-4 text-center text-gray-500">No data available to visualize</div>;
  }

  const renderChart = () => {
    try {
      if (type === 'chart') {
        return (
          <div className="h-[180px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={data} 
                margin={{ top: 5, right: 5, left: 0, bottom: 20 }}
                layout="horizontal"
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="category" 
                  tick={{ fontSize: 10 }} 
                  height={40} 
                  angle={-35} 
                  textAnchor="end"
                />
                <YAxis width={30} tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ fontSize: '11px' }} />
                <Legend wrapperStyle={{ fontSize: 10, bottom: 0 }} />
                <Bar dataKey="value" fill="#4F46E5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );
      } else if (type === 'pie') {
        return (
          <div className="h-[180px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => 
                    `${name?.substring(0, 7)}${name?.length > 7 ? '...' : ''}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ fontSize: '11px' }} />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: 10, bottom: 0 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        );
      } else if (type === 'line') {
        const keys = Object.keys(data[0]).filter(key => key !== 'date');
        return (
          <div className="h-[180px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart 
                data={data} 
                margin={{ top: 5, right: 5, left: 0, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 10 }} 
                  height={30}
                />
                <YAxis width={30} tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ fontSize: '11px' }} />
                <Legend wrapperStyle={{ fontSize: 10, bottom: 0 }} />
                {keys.map((key, index) => (
                  <Line 
                    key={key}
                    type="monotone" 
                    dataKey={key} 
                    stroke={COLORS[index % COLORS.length]} 
                    activeDot={{ r: 4 }} 
                    strokeWidth={2}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        );
      }
    } catch (error) {
      console.error('Error rendering chart:', error);
      return <div className="p-4 text-center text-red-500">Error rendering chart: {error.message}</div>;
    }
    
    return <div className="p-4 text-center text-gray-500">Unsupported chart type</div>;
  };

  if (type === 'table') {
    return (
      <ScrollArea className="max-h-[180px] w-full">
        <Table>
          <TableHeader>
            <TableRow>
              {Object.keys(data[0]).map((header) => (
                <TableHead key={header} className="whitespace-nowrap px-2 py-1 text-xs">
                  {header.charAt(0).toUpperCase() + header.slice(1).replace(/_/g, ' ')}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, i) => (
              <TableRow key={i}>
                {Object.values(row).map((value, j) => (
                  <TableCell key={j} className="px-2 py-1 text-xs">
                    {value}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    );
  } else if (type === 'report') {
    return (
      <ScrollArea className="max-h-[180px] w-full">
        <div className="space-y-3 w-full">
          {data.map((section, index) => (
            <div key={index} className="border rounded-md p-2">
              <h3 className="font-medium text-xs">{section.title}</h3>
              {section.subtitle && <p className="text-xs text-gray-500">{section.subtitle}</p>}
              <p className="text-xs mt-1 whitespace-pre-line">{section.content}</p>
            </div>
          ))}
        </div>
      </ScrollArea>
    );
  } else {
    return renderChart();
  }
}