import React, { useState } from 'react';
import { format, startOfWeek, addDays, addWeeks, subWeeks, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

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

// Updated sample data with full week and multiple projects
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

export function WeeklyTimesheet() {
  const [currentDate, setCurrentDate] = useState(new Date());
  
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-4">
        <h2 className="text-2xl font-bold">Weekly Timesheet</h2>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateWeek('prev')}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="font-medium">
            {format(startOfCurrentWeek, 'MMM d')} - {format(addDays(startOfCurrentWeek, 6), 'MMM d, yyyy')}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateWeek('next')}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-12rem)] rounded-md border">
        <div className="min-w-[1000px]">
          {/* Header */}
          <div className="grid grid-cols-8 bg-muted p-4 sticky top-0 z-10">
            <div className="font-semibold">Project</div>
            {weekDays.map((day, index) => (
              <div key={index} className="font-semibold text-center">
                {format(day, 'EEE')}<br />
                {format(day, 'MMM d')}
              </div>
            ))}
          </div>

          {/* Project Rows */}
          <div className="divide-y">
            {sampleData.timeSheetEntries.map((project, projectIndex) => (
              <div key={projectIndex} className="grid grid-cols-8 hover:bg-muted/50">
                <div className="p-4 flex flex-col">
                  <span className="font-medium">{project.projectName}</span>
                  <span className="text-sm text-muted-foreground">{project.projectID}</span>
                </div>
                {weekDays.map((day, dayIndex) => {
                  const entry = getEntryForDate(project.entries, day);
                  return (
                    <div key={dayIndex} className="p-2 border-l">
                      <Card className="h-full">
                        <CardContent className="p-3 space-y-1">
                          {entry ? (
                            <>
                              <div className="font-medium">{entry.hour} hrs</div>
                              <div className="text-sm text-muted-foreground line-clamp-2">
                                {entry.remark}
                              </div>
                            </>
                          ) : (
                            <div className="flex items-center justify-center h-full text-muted-foreground">
                              N/A
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}