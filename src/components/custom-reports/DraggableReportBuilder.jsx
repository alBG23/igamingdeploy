import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Trash, 
  MoreHorizontal, 
  MoveVertical,
  ArrowUpDown, 
  ListFilter,
  Eye,
  LayoutGrid
} from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

export default function DraggableReportBuilder({ 
  availableTables, 
  tablesWithColumns, 
  selectedTables, 
  setSelectedTables, 
  selectedColumns, 
  setSelectedColumns, 
  filters, 
  setFilters, 
  sortBy, 
  setSortBy,
  onRunReport
}) {
  const [filterOperation, setFilterOperation] = useState('equals');
  const [filterColumn, setFilterColumn] = useState('');
  const [filterValue, setFilterValue] = useState('');
  const [sortColumn, setSortColumn] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState({ type: '', id: '' });

  const onDragEnd = (result) => {
    const { source, destination, draggableId, type } = result;

    // Dropped outside the list
    if (!destination) {
      return;
    }

    // Handle different types of drag operations
    if (type === 'table') {
      // Table was dragged into selected tables
      if (source.droppableId === 'availableTables' && destination.droppableId === 'selectedTables') {
        const table = availableTables.find(t => t.id === draggableId);
        if (table && !selectedTables.some(t => t.id === table.id)) {
          setSelectedTables([...selectedTables, table]);
        }
      } 
      // Reordering selected tables
      else if (source.droppableId === 'selectedTables' && destination.droppableId === 'selectedTables') {
        const newItems = Array.from(selectedTables);
        const [moved] = newItems.splice(source.index, 1);
        newItems.splice(destination.index, 0, moved);
        setSelectedTables(newItems);
      }
    } 
    else if (type === 'column') {
      // Column was dragged into selected columns
      if (source.droppableId.startsWith('tableColumns') && destination.droppableId === 'selectedColumns') {
        const tableId = source.droppableId.replace('tableColumns-', '');
        const column = tablesWithColumns[tableId]?.find(c => c.id === draggableId);
        
        if (column && !selectedColumns.some(c => c.id === column.id)) {
          setSelectedColumns([...selectedColumns, column]);
        }
      } 
      // Reordering selected columns
      else if (source.droppableId === 'selectedColumns' && destination.droppableId === 'selectedColumns') {
        const newItems = Array.from(selectedColumns);
        const [moved] = newItems.splice(source.index, 1);
        newItems.splice(destination.index, 0, moved);
        setSelectedColumns(newItems);
      }
    }
  };

  const handleAddFilter = () => {
    if (filterColumn && filterOperation && filterValue) {
      const newFilter = {
        id: `filter-${filters.length + 1}`,
        column: filterColumn,
        operation: filterOperation,
        value: filterValue
      };
      setFilters([...filters, newFilter]);
      setFilterColumn('');
      setFilterValue('');
    }
  };

  const handleAddSort = () => {
    if (sortColumn) {
      const newSort = {
        id: `sort-${sortBy.length + 1}`,
        column: sortColumn,
        direction: sortDirection
      };
      setSortBy([...sortBy, newSort]);
      setSortColumn('');
    }
  };

  const handleDeleteItem = () => {
    if (itemToDelete.type === 'table') {
      setSelectedTables(selectedTables.filter(t => t.id !== itemToDelete.id));
    } else if (itemToDelete.type === 'column') {
      setSelectedColumns(selectedColumns.filter(c => c.id !== itemToDelete.id));
    } else if (itemToDelete.type === 'filter') {
      setFilters(filters.filter(f => f.id !== itemToDelete.id));
    } else if (itemToDelete.type === 'sort') {
      setSortBy(sortBy.filter(s => s.id !== itemToDelete.id));
    }
    setShowDeleteDialog(false);
  };

  const confirmDelete = (type, id) => {
    setItemToDelete({ type, id });
    setShowDeleteDialog(true);
  };

  return (
    <div className="space-y-6">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Available Tables */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Available Tables</CardTitle>
            </CardHeader>
            <CardContent>
              <Droppable droppableId="availableTables" type="table">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-2"
                  >
                    {availableTables.map((table, index) => (
                      <Draggable key={table.id} draggableId={table.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="flex items-center justify-between p-2 bg-white rounded-md border hover:bg-gray-50 cursor-move"
                          >
                            <div className="flex items-center">
                              <MoveVertical className="h-4 w-4 mr-2 text-gray-400" />
                              <span>{table.name}</span>
                              <Badge variant="outline" className="ml-2 text-xs">
                                {table.columns} columns
                              </Badge>
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {table.category}
                            </Badge>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </CardContent>
          </Card>

          {/* Selected Tables & Columns */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Selected Tables</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Droppable droppableId="selectedTables" type="table">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-2 min-h-[40px]"
                    >
                      {selectedTables.length === 0 && (
                        <div className="text-center p-4 border border-dashed rounded-md text-gray-500">
                          Drag tables here to add them to your report
                        </div>
                      )}
                      {selectedTables.map((table, index) => (
                        <Draggable key={table.id} draggableId={table.id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className="p-3 bg-white rounded-md border hover:bg-gray-50"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center">
                                  <span {...provided.dragHandleProps}>
                                    <MoveVertical className="h-4 w-4 mr-2 text-gray-400 cursor-move" />
                                  </span>
                                  <span className="font-medium">{table.name}</span>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => confirmDelete('table', table.id)}
                                >
                                  <Trash className="h-4 w-4 text-gray-500" />
                                </Button>
                              </div>
                              
                              <Droppable droppableId={`tableColumns-${table.id}`} type="column">
                                {(provided) => (
                                  <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className="pl-4 space-y-1"
                                  >
                                    {tablesWithColumns[table.id]?.map((column, idx) => (
                                      <Draggable key={column.id} draggableId={column.id} index={idx}>
                                        {(provided) => (
                                          <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            className="flex items-center justify-between p-1 rounded-sm hover:bg-gray-100 text-sm cursor-move"
                                          >
                                            <span>{column.name}</span>
                                            <Badge variant="outline" className="text-xs">
                                              {column.type}
                                            </Badge>
                                          </div>
                                        )}
                                      </Draggable>
                                    ))}
                                    {provided.placeholder}
                                  </div>
                                )}
                              </Droppable>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Selected Columns */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg font-medium">Report Columns</CardTitle>
            </CardHeader>
            <CardContent>
              <Droppable droppableId="selectedColumns" type="column">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-2 min-h-[200px]"
                  >
                    {selectedColumns.length === 0 && (
                      <div className="text-center p-4 border border-dashed rounded-md text-gray-500">
                        Drag columns here to include them in your report
                      </div>
                    )}
                    {selectedColumns.map((column, index) => (
                      <Draggable key={column.id} draggableId={column.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="flex items-center justify-between p-2 bg-white rounded-md border hover:bg-gray-50 cursor-move"
                          >
                            <div className="flex items-center">
                              <MoveVertical className="h-4 w-4 mr-2 text-gray-400" />
                              <span>{column.name}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Badge variant="outline" className="text-xs">
                                {column.table}
                              </Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => confirmDelete('column', column.id)}
                              >
                                <Trash className="h-4 w-4 text-gray-500" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </CardContent>
          </Card>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                  <div className="md:col-span-1">
                    <Select value={filterColumn} onValueChange={setFilterColumn}>
                      <SelectTrigger>
                        <SelectValue placeholder="Column" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedColumns.map(column => (
                          <SelectItem key={column.id} value={column.id}>
                            {column.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-1">
                    <Select value={filterOperation} onValueChange={setFilterOperation}>
                      <SelectTrigger>
                        <SelectValue placeholder="Operation" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="equals">Equals</SelectItem>
                        <SelectItem value="contains">Contains</SelectItem>
                        <SelectItem value="startsWith">Starts with</SelectItem>
                        <SelectItem value="endsWith">Ends with</SelectItem>
                        <SelectItem value="greaterThan">Greater than</SelectItem>
                        <SelectItem value="lessThan">Less than</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-1">
                    <Input
                      placeholder="Value"
                      value={filterValue}
                      onChange={(e) => setFilterValue(e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-1">
                    <Button onClick={handleAddFilter} className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </div>
                </div>

                <div className="space-y-2 min-h-[100px]">
                  {filters.length === 0 && (
                    <div className="text-center p-4 border border-dashed rounded-md text-gray-500">
                      No filters added yet
                    </div>
                  )}
                  {filters.map((filter) => {
                    const column = selectedColumns.find(c => c.id === filter.column);
                    return (
                      <div key={filter.id} className="flex items-center justify-between p-2 bg-white rounded-md border">
                        <div className="flex items-center">
                          <ListFilter className="h-4 w-4 mr-2 text-gray-400" />
                          <span>
                            {column?.name || filter.column} {filter.operation} "{filter.value}"
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => confirmDelete('filter', filter.id)}
                        >
                          <Trash className="h-4 w-4 text-gray-500" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sorting */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Sorting</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <div className="md:col-span-1">
                    <Select value={sortColumn} onValueChange={setSortColumn}>
                      <SelectTrigger>
                        <SelectValue placeholder="Column" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedColumns.map(column => (
                          <SelectItem key={column.id} value={column.id}>
                            {column.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-1">
                    <Select value={sortDirection} onValueChange={setSortDirection}>
                      <SelectTrigger>
                        <SelectValue placeholder="Direction" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="asc">Ascending</SelectItem>
                        <SelectItem value="desc">Descending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-1">
                    <Button onClick={handleAddSort} className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </div>
                </div>

                <div className="space-y-2 min-h-[100px]">
                  {sortBy.length === 0 && (
                    <div className="text-center p-4 border border-dashed rounded-md text-gray-500">
                      No sorting rules added yet
                    </div>
                  )}
                  {sortBy.map((sort) => {
                    const column = selectedColumns.find(c => c.id === sort.column);
                    return (
                      <div key={sort.id} className="flex items-center justify-between p-2 bg-white rounded-md border">
                        <div className="flex items-center">
                          <ArrowUpDown className="h-4 w-4 mr-2 text-gray-400" />
                          <span>
                            {column?.name || sort.column} ({sort.direction === 'asc' ? 'Ascending' : 'Descending'})
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => confirmDelete('sort', sort.id)}
                        >
                          <Trash className="h-4 w-4 text-gray-500" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DragDropContext>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => {
          setSelectedTables([]);
          setSelectedColumns([]);
          setFilters([]);
          setSortBy([]);
        }}>
          Reset
        </Button>
        
        <Button onClick={onRunReport} disabled={selectedColumns.length === 0}>
          <Eye className="h-4 w-4 mr-2" />
          Run Report
        </Button>
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to remove this item?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteItem}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}