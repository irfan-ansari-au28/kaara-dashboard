import React, { useState } from 'react';
import { format, startOfWeek, addDays, addWeeks, subWeeks, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface TimeEntry {
  Date: string;
  hour: number;
  remark: string;
}

interface ProjectEntry {
  projectID: string;
  projectName: string;
  entries: TimeEntry[];
}

interface TimesheetData {
  EmployeeId: string;
  timeSheetEntries: ProjectEntry[];
}

// Sample data remains the same
const sampleData: TimesheetData = {
  "EmployeeId": "KAR2490",
  "timeSheetEntries": [
    {
      "projectID": "P20",
      "projectName": "Web Portal Development",
      "entries": [
        {
          "Date": "2024-10-14",
          "hour": 8,
          "remark": "Frontend development"
        },
        {
          "Date": "2024-10-15",
          "hour": 7,
          "remark": "API integration"
        },
        {
          "Date": "2024-10-16",
          "hour": 8,
          "remark": "Bug fixes"
        }
      ]
    },
    {
      "projectID": "P21",
      "projectName": "Mobile App",
      "entries": [
        {
          "Date": "2024-10-14",
          "hour": 1,
          "remark": "Planning meeting"
        },
        {
          "Date": "2024-10-17",
          "hour": 8,
          "remark": "UI implementation"
        },
        {
          "Date": "2024-10-18",
          "hour": 6,
          "remark": "Testing"
        }
      ]
    }
  ]
};

interface EditDialogProps {
  entry?: TimeEntry;
  date: Date;
  projectName: string;
  onSave: (hours: number, remark: string) => void;
}

function EditDialog({ entry, date, projectName, onSave }: EditDialogProps) {
  const [hours, setHours] = useState(entry?.hour || 0);
  const [remark, setRemark] = useState(entry?.remark || '');

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>
          {entry ? 'Edit Timesheet Entry' : 'Add Timesheet Entry'}
        </DialogTitle>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="space-y-2">
          <p className="text-sm font-medium">Date: {format(date, 'PPP')}</p>
          <p className="text-sm font-medium">Project: {projectName}</p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Hours</label>
          <Select value={hours.toString()} onValueChange={(value) => setHours(Number(value))}>
            <SelectTrigger>
              <SelectValue placeholder="Select hours" />
            </SelectTrigger>
            <SelectContent>
              {[...Array(13)].map((_, i) => (
                <SelectItem key={i} value={i.toString()}>
                  {i} hours
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Remarks</label>
          <Textarea
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            placeholder="Enter remarks"
          />
        </div>
        <Button onClick={() => onSave(hours, remark)}>
          Save Entry
        </Button>
      </div>
    </DialogContent>
  );
}

export function WeeklyTimesheet() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [timesheet, setTimesheet] = useState(sampleData);
  
  const startOfCurrentWeek = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = [...Array(7)].map((_, i) => addDays(startOfCurrentWeek, i));

  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentDate(direction === 'prev' ? subWeeks(currentDate, 1) : addWeeks(currentDate, 1));
  };

  const getEntryForDate = (projectEntries: TimeEntry[], date: Date) => {
    return projectEntries.find(entry => 
      isSameDay(new Date(entry.Date), date)
    );
  };

  const handleSaveEntry = (projectId: string, date: Date, hours: number, remark: string) => {
    setTimesheet(prev => {
      const newTimesheet = { ...prev };
      const project = newTimesheet.timeSheetEntries.find(p => p.projectID === projectId);
      if (project) {
        const existingEntryIndex = project.entries.findIndex(e => 
          isSameDay(new Date(e.Date), date)
        );
        
        const newEntry = {
          Date: format(date, 'yyyy-MM-dd'),
          hour: hours,
          remark
        };

        if (existingEntryIndex >= 0) {
          project.entries[existingEntryIndex] = newEntry;
        } else {
          project.entries.push(newEntry);
        }
      }
      return newTimesheet;
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-0 sm:px-4">
        <h2        
        className='font-bold text-[12px] md:text-[14px] lg:text-[24px] xl:text-[24px]'>
          Weekly Timesheet</h2>
        <div className="flex items-center gap-1 sm:gap-4">
          <Button
            variant="outline"
            size="icon"
            className="h-6 w-5.8 sm:h-8 sm:w-8"
            onClick={() => navigateWeek('prev')}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="font-medium text-[12px] md:text-[14px] lg:text-[24px] xl:text-[24px]">
            {format(startOfCurrentWeek, 'MMM d')} - {format(addDays(startOfCurrentWeek, 6), 'MMM d, yyyy')}
          </span>
          <Button
            variant="outline"
            size="icon"
            className="h-6 w-5.8 sm:h-8 sm:w-8"
            onClick={() => navigateWeek('next')}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

        <ScrollArea >
  <div className="h-[calc(100vh-12rem)] w-auto sm:w-[300px] md:w-auto rounded-md border overflow-x-auto">
  <div className="min-w-[900px] sm:min-w-[950px] lg:min-w-[1000px] ">
      <div className="grid grid-cols-8 bg-muted p-4 sticky top-0 z-10 pt-3 pb-3 sm:pt-4 sm:pb-4 ">
        <div className="text-[12px] font-semibold flex items-center sm:flex-none sm:items-start md:text-[14px] lg:text-[16px] xl:text-[16px]">Project</div>
        {weekDays.map((day, index) => (
          <div key={index} className="text-[12px] font-semibold text-center md:text-[14px] lg:text-[16px] xl:text-[16px]">
            {format(day, 'EEE')}<br />
            {format(day, 'MMM d')}
          </div>
        ))}
      </div>

      <div className="divide-y">
        {timesheet.timeSheetEntries.map((project, projectIndex) => (
          <div key={projectIndex} className="grid grid-cols-8 hover:bg-muted/50">
                <div className='p-3 md:p-2 lg:p-4 flex flex-col'>
              <span className="font-medium text-xs sm:text-sm leading-3 sm:leading-normal md:text-[14px] md:leading-normal">{project.projectName}</span>
              <span className="text-xs md:text-sm text-muted-foreground ">{project.projectID}</span>
            </div>
            {weekDays.map((day, dayIndex) => {
              const entry = getEntryForDate(project.entries, day);
              return (
                <div key={dayIndex} className="p-2 border-l">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Card className={`h-full cursor-pointer transition-colors ${
                        entry ? (entry.hour >= 8 ? 'border-green-200' : 'border-red-200') : ''
                      }`}>
                        <CardContent className="p-3 space-y-1">
                          {entry ? (
                            <>
                              <div className="font-medium text-sm md:text-base">{entry.hour} hrs</div>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <div className="text-xs md:text-sm text-muted-foreground line-clamp-2">
                                      {entry.remark}
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="max-w-xs">{entry.remark}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </>
                          ) : (
                            <div className='flex items-center justify-center h-full text-xs sm:text-sm md:text-base text-muted-foreground'>
                              N/A
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </DialogTrigger>
                    <EditDialog
                      entry={entry}
                      date={day}
                      projectName={project.projectName}
                      onSave={(hours, remark) => handleSaveEntry(project.projectID, day, hours, remark)}
                    />
                  </Dialog>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  </div>
        </ScrollArea>
    </div>
  );
}