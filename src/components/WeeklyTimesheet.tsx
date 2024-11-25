import React, { useState } from 'react';
import { format, startOfWeek, addDays, addWeeks, subWeeks, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface TimeEntry {
  Date: string;
  hour: number;
  remark: string;
  leave: boolean;
}

interface ProjectEntry {
  projectID: string;
  projectName: string;
  entries: TimeEntry[];
}

interface TimesheetData {
  EmployeeId: string;
  // totalLeaves: number,
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
          "remark": "Frontend development",
          "leave": false,
        },
        {
          "Date": "2024-10-15",
          "hour": 7,
          "remark": "API integration",
          "leave": false,
        },
        {
          "Date": "2024-10-16",
          "hour": 8,
          "remark": "Bug fixes",
          "leave": false,
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
          "remark": "Planning meeting",
          "leave": false,
        },
        {
          "Date": "2024-10-17",
          "hour": 8,
          "remark": "UI implementation",
          "leave": false,
        },
        {
          "Date": "2024-10-18",
          "hour": 6,
          "remark": "Testing",
          "leave": false,
        }
      ]
    }
  ],
  // totalLeaves: 0
};

const hoursList = [
  { title: "4 hours(half day)", value: 4 },
  { title: "8 hours(Full day)", value: 8 },
]

interface EditDialogProps {
  entry?: TimeEntry;
  date: Date;
  projectName: string;
  onSave: (hours: number, remark: string) => void;
  isLimitReached: boolean;
  onCancel: (hours: number, remark: string, setRemark: any, setHours: any, handleCheckboxChange: any, entry: any) => void;
}

function EditDialog({ entry, date, projectName, onSave, isLimitReached, onCancel }: EditDialogProps) {

  const [hours, setHours] = useState(hoursList[0].value);
  const [remark, setRemark] = useState(entry?.remark || '');
  const [isLeave, setIsLeave] = useState(false);

  const [isLeaveCancelled, setIsLeaveCancelled] = useState(false);

  const handleCheckboxChange = () => {
    setIsLeave(!isLeave);
    if (!isLeave) {
      setRemark("I am on leave for today.");
    } else {
      setRemark("");
    }
  };

  React.useEffect(() => {
    if (entry) {
      setHours(entry.hour);
      setRemark(entry.remark);
      setIsLeave(entry.leave);
    } else {
      setHours(hoursList[0].value);
      setRemark('');
      setIsLeave(false);
    }
  }, [entry]);

  const handleCancelLeave = (hours: any, remark: any, setRemark: any, setHours: any, handleCheckboxChange: any) => {
    onCancel(hours, remark, setRemark, setHours, handleCheckboxChange, entry); // Call cancel function
    setIsLeaveCancelled(true); // Hide cancel button
  };

  return (
    <DialogContent className="sm:max-w-[425px] w-[300px] sm:w-[425px] text-[12px] rounded-lg">
      <DialogHeader>
        <DialogTitle>
          {entry ? 'Edit Timesheet Entry' : 'Add Timesheet Entry'}
        </DialogTitle>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="space-y-2">
          <p className="font-medium text-[12px] sm:text-[14px]">Date: {format(date, 'PPP')}</p>
          <p className="text-[12px] sm:text-[14px] font-medium">Project: {projectName}</p>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="markAsLeave"
              className="mr-2"
              checked={isLeave}
              onChange={handleCheckboxChange}
            />
            <label htmlFor="markAsLeave" className="text-[12px] sm:text-[14px] font-medium">
              Mark as Leave
            </label>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[12px] sm:text-[14px] font-medium">Hours</label>
          <Select value={hours.toString()} onValueChange={(value) => {
            setHours(Number(value))
          }
          }>
            <SelectTrigger>
              <SelectValue placeholder="Select hours" />
            </SelectTrigger>
            <SelectContent>
              {hoursList.map((item, i) => (
                <SelectItem key={i} value={item.value.toString()}>
                  {item.title}
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
        <DialogClose asChild>
          <Button onClick={() => onSave(hours, remark)}
            disabled={isLimitReached || remark.length == 0}>
            Save Entry
          </Button>

        </DialogClose>
        {isLimitReached && (
          <div className="flex justify-center text-red-500 text-[12px] mt-[-12px]">
            You have taken the limit of 8 leaves.
          </div>
        )}
        {entry ?(
          <>
          <DialogClose asChild>
          <Button onClick={() => onCancel(hours, remark, setRemark, setHours , handleCheckboxChange,entry)} >
              Cancle Leave
            </Button>
            </DialogClose>
            </>): (<> </>)}

{/* {entry && !isLeaveCancelled && ( // Only show cancel button if leave is not cancelled
          <DialogClose asChild>
            <Button onClick={() => handleCancelLeave(hours, remark, setRemark, setHours, () => setIsLeave(false))}>
              Cancel Leave
            </Button>
          </DialogClose>
        )} */}
      </div>
    </DialogContent>
  );
}

export function WeeklyTimesheet() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [timesheet, setTimesheet] = useState(sampleData);
  const [isLimitReached, setIsLimitReached] = useState(false);

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
    const res = localStorage.getItem('Data');
    let parsedData: any[] = [];
    if (res !== null) {
      parsedData = JSON.parse(res);
      if (parsedData.length >= 8) {
        setIsLimitReached(true);
        return;
      } else {
        setIsLimitReached(false);
      }
    }
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
          remark,
          leave: true
        };

        if (existingEntryIndex >= 0) {
          project.entries[existingEntryIndex] = newEntry;
        } else {
          project.entries.push(newEntry);
        }
      }

      const data = {
        projectId: projectId,
        date: format(date, 'yyyy-MM-dd'),
        hours,
        remark,
      };

      const res = localStorage.getItem('Data');
      let parsedArray: any[] = [];

      if (res) {
        parsedArray = JSON.parse(res);
      }

      const indexToUpdate = parsedArray.findIndex((item: any) =>
        item.date === data.date && item.projectId === data.projectId
      );

      if (indexToUpdate !== -1) {
        parsedArray[indexToUpdate].hours = data.hours;
        parsedArray[indexToUpdate].remark = data.remark;
      } else {
        parsedArray.push(data);
      }
      localStorage.setItem('Data', JSON.stringify(parsedArray));
      return newTimesheet;
    });
  };

  const handleCancelEntry = (project: any, projectId: string, date: Date, hours: number, remark: string, setRemark: any, setHours: any, handleCheckboxChange: any, entry: any) => {
    const res: any = localStorage.getItem('Data');
    // let parsedData: any[] = [];

    entry.leave = false;

    if (!res) return;

    let parsedArray: any[] = JSON.parse(res);

    const data = {
      projectId: projectId,
      date: format(date, 'yyyy-MM-dd'),
      hours,
      remark,
      leave: false
    };

    const indexToDelete = parsedArray.findIndex((item: any) =>
      item.date === data.date && item.projectId === data.projectId
    );

    if (indexToDelete !== -1) {
      const cancel = parsedArray[indexToDelete]
      console.log("ddddL", cancel)
      parsedArray.splice(indexToDelete, 1);
      localStorage.setItem('Data', JSON.stringify(parsedArray));
      setTimesheet(prev => {
        const newTimesheet = { ...prev };

        return newTimesheet;
      });
    }

    setRemark("");
    setHours(hoursList[0].value);
    handleCheckboxChange();
  }

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
                    const isLeaveEntry =
                      entry && entry.remark.length > 0;
                    return (
                      <div key={dayIndex} className="p-2 border-l">
                        <Dialog >
                          <DialogTrigger asChild>
                            <Card className={`${entry?.leave ? "bg-red-100" : "bg-white-100"} h-full flex items-center justify-center cursor-pointer transition-colors ${entry ? (entry.hour >= 8 ? 'border-green-200' : 'border-grey-200') : ''
                              }`}>

                              <CardContent className="p-3 space-y-1">
                                {entry ? (
                                  <>
                                    <div
                                      className={`text-sm font-medium ${isLeaveEntry ? "text-red-500" : ""}`}
                                    >
                                      {isLeaveEntry ? ("") : (`${entry.hour} hrs`)}

                                      {/* {entry.hour} hrs */}
                                    </div>
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger>
                                          <div className="flex justify-center items-center text-sm text-muted-foreground line-clamp-2">
                                            {entry.leave ? (
                                              <div className="text-red-500 text-[16px] p-1 rounded flex justify-center items-center">
                                                A
                                              </div>
                                            ) : (
                                              <div className='flex items-center text-center justify-center h-full text-xs sm:text-sm md:text-base text-muted-foreground'>
                                                N/A
                                              </div>
                                            )}
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
                            onCancel={(hours, remark, setRemark, setHours, handleCheckboxChange) => handleCancelEntry(project, project.projectID, day, hours, remark, setRemark, setHours, handleCheckboxChange, entry)}
                            isLimitReached={isLimitReached}
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