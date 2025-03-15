import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bar, BarChart, CartesianGrid, Cell, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Edit, Save, Trash, Download } from 'lucide-react';

export default function AffiliateTargets({ budget, targetFTDs }) {
  const [isEditing, setIsEditing] = useState(false);
  const [affiliateTargets, setAffiliateTargets] = useState([
    { id: 1, name: 'BetFinderPro', cpa: 65, targetFTDs: 180, budget: 11700, roi: 2.4, performance: 'high' },
    { id: 2, name: 'CasinoCompare', cpa: 80, targetFTDs: 150, budget: 12000, roi: 2.1, performance: 'medium' },
    { id: 3, name: 'GamingAffiliates', cpa: 55, targetFTDs: 210, budget: 11550, roi: 2.7, performance: 'high' },
    { id: 4, name: 'SlotPartners', cpa: 70, targetFTDs: 120, budget: 8400, roi: 1.9, performance: 'medium' },
    { id: 5, name: 'CasinoHunter', cpa: 90, targetFTDs: 100, budget: 9000, roi: 1.8, performance: 'low' },
    { id: 6, name: 'GamblingPro', cpa: 75, targetFTDs: 140, budget: 10500, roi: 2.2, performance: 'medium' },
    { id: 7, name: 'BonusFinder', cpa: 85, targetFTDs: 110, budget: 9350, roi: 2.0, performance: 'medium' }
  ]);

  const [editedTargets, setEditedTargets] = useState([...affiliateTargets]);

  const getPerformanceColor = (performance) => {
    switch (performance) {
      case 'high': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-amber-100 text-amber-800';
      case 'low': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleInputChange = (id, field, value) => {
    setEditedTargets(prev => 
      prev.map(target => 
        target.id === id 
          ? { 
              ...target, 
              [field]: field === 'name' ? value : Number(value),
              budget: field === 'cpa' ? Number(value) * target.targetFTDs : field === 'targetFTDs' ? Number(value) * target.cpa : target.budget
            } 
          : target
      )
    );
  };

  const saveChanges = () => {
    setAffiliateTargets([...editedTargets]);
    setIsEditing(false);
  };

  const cancelChanges = () => {
    setEditedTargets([...affiliateTargets]);
    setIsEditing(false);
  };

  const totalBudget = affiliateTargets.reduce((sum, target) => sum + target.budget, 0);
  const totalFTDs = affiliateTargets.reduce((sum, target) => sum + target.targetFTDs, 0);
  const averageCPA = totalBudget / totalFTDs;

  const chartData = affiliateTargets.map(affiliate => ({
    name: affiliate.name,
    ftds: affiliate.targetFTDs,
    budget: affiliate.budget
  }));

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Affiliate Targets</CardTitle>
          <CardDescription>Distribution of target FTDs and budget across affiliates</CardDescription>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" size="sm" onClick={cancelChanges}>
                Cancel
              </Button>
              <Button size="sm" onClick={saveChanges}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Targets
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
              <YAxis yAxisId="left" orientation="left" label={{ value: 'Target FTDs', angle: -90, position: 'insideLeft' }} />
              <YAxis yAxisId="right" orientation="right" label={{ value: 'Budget ($)', angle: 90, position: 'insideRight' }} />
              <Tooltip formatter={(value, name) => [name === 'ftds' ? value : `$${value.toLocaleString()}`, name === 'ftds' ? 'Target FTDs' : 'Budget']} />
              <Legend />
              <Bar yAxisId="left" dataKey="ftds" name="Target FTDs" fill="#8884d8" />
              <Bar yAxisId="right" dataKey="budget" name="Budget ($)" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Total Affiliate Budget</p>
            <p className="text-2xl font-bold">${totalBudget.toLocaleString()}</p>
            <p className="text-xs text-gray-500">
              {Math.round((totalBudget / budget) * 100)}% of total marketing budget
            </p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Target FTDs from Affiliates</p>
            <p className="text-2xl font-bold">{totalFTDs.toLocaleString()}</p>
            <p className="text-xs text-gray-500">
              {Math.round((totalFTDs / targetFTDs) * 100)}% of total target FTDs
            </p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Average CPA</p>
            <p className="text-2xl font-bold">${averageCPA.toFixed(2)}</p>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Affiliate</TableHead>
              <TableHead>CPA ($)</TableHead>
              <TableHead>Target FTDs</TableHead>
              <TableHead>Budget ($)</TableHead>
              <TableHead>Est. ROI</TableHead>
              <TableHead>Performance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {editedTargets.map((affiliate) => (
              <TableRow key={affiliate.id}>
                <TableCell>
                  {isEditing ? (
                    <Input
                      value={affiliate.name}
                      onChange={(e) => handleInputChange(affiliate.id, 'name', e.target.value)}
                      className="h-8"
                    />
                  ) : (
                    <div className="font-medium">{affiliate.name}</div>
                  )}
                </TableCell>
                <TableCell>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={affiliate.cpa}
                      onChange={(e) => handleInputChange(affiliate.id, 'cpa', e.target.value)}
                      className="h-8 w-20"
                    />
                  ) : (
                    `$${affiliate.cpa}`
                  )}
                </TableCell>
                <TableCell>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={affiliate.targetFTDs}
                      onChange={(e) => handleInputChange(affiliate.id, 'targetFTDs', e.target.value)}
                      className="h-8 w-20"
                    />
                  ) : (
                    affiliate.targetFTDs.toLocaleString()
                  )}
                </TableCell>
                <TableCell>${affiliate.budget.toLocaleString()}</TableCell>
                <TableCell>{affiliate.roi}x</TableCell>
                <TableCell>
                  <Badge className={getPerformanceColor(affiliate.performance)}>
                    {affiliate.performance}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="mt-4 flex justify-end">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export to CSV
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}