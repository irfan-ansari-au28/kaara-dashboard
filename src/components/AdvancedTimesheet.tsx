import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface TimeEntry {
  projectID?: string;
  Date: string
  hour: number
  remark: string
}

interface ProjectEntry {
  projectID: string
  entries: TimeEntry[]
}

interface TimesheetData {
  EmployeeId: string
  timeSheetEntries: ProjectEntry[]
}

// Sample data (you would fetch this from your API)
const sampleData: TimesheetData = {
    "EmployeeId": "KAR2490",
    "timeSheetEntries": [
      {
        "projectID": "P20",
        "entries": [
          {
            "Date": "2023-07-03",
            "hour": 8,
            "remark": "Monday worked on Ticket 234"
          },
          {
            "Date": "2023-07-04",
            "hour": 7,
            "remark": "Tuesday: Code review and bug fixes"
          },
          {
            "Date": "2023-07-05",
            "hour": 8,
            "remark": "Wednesday: Implemented new feature"
          }
        ]
      },
      {
        "projectID": "P21",
        "entries": [
          {
            "Date": "2023-07-06",
            "hour": 6,
            "remark": "Thursday: Project kickoff meeting and planning"
          },
          {
            "Date": "2023-07-07",
            "hour": 8,
            "remark": "Friday: Started development on new module"
          }
        ]
      },
      {
        "projectID": "P22",
        "entries": [
          {
            "Date": "2023-07-10",
            "hour": 8,
            "remark": "Monday: Continued work on new module"
          },
          {
            "Date": "2023-07-11",
            "hour": 7,
            "remark": "Tuesday: Testing and bug fixes"
          }
        ]
      },
      {
        "projectID": "P23",
        "entries": [
          {
            "Date": "2023-07-12",
            "hour": 8,
            "remark": "Wednesday: Client meeting and requirement gathering"
          },
          {
            "Date": "2023-07-13",
            "hour": 8,
            "remark": "Thursday: Started implementation of client requirements"
          }
        ]
      },
      {
        "projectID": "P24",
        "entries": [
          {
            "Date": "2023-07-14",
            "hour": 6,
            "remark": "Friday: Code review and documentation"
          },
          {
            "Date": "2023-07-17",
            "hour": 8,
            "remark": "Monday: Continued implementation and testing"
          }
        ]
      }
    ]
  }
  export function AdvancedTimesheet() {
    const [timesheetData, setTimesheetData] = useState<TimesheetData>(sampleData)
    const [currentWeek, setCurrentWeek] = useState(0)
    const [selectedEntry, setSelectedEntry] = useState<TimeEntry | null>(null)
  
    useEffect(() => {
      console.log("Component mounted")
      // Fetch data from API and update state
    }, [])
  
    const handleWeekChange = (direction: 'prev' | 'next') => {
      if (direction === 'prev') {
        setCurrentWeek(currentWeek - 1)
      } else {
        setCurrentWeek(currentWeek + 1)
      }
    }
  
    const handleEntryClick = (entry: TimeEntry | null, date: string) => {
      if (entry) {
        setSelectedEntry(entry)
      } else {
        setSelectedEntry({
          Date: date,
          hour: 0,
          remark: ''
        })
      }
    }
  
    const handleEntrySave = (entry: TimeEntry) => {
      // Call API to save entry
      console.log("Saving entry:", entry)
      setSelectedEntry(null)
    }
  
    const getWeekDates = (): string[] => {
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - startDate.getDay() + (currentWeek * 7))
      
      return Array.from({ length: 7 }, (_, i) => {
        const date = new Date(startDate)
        date.setDate(date.getDate() + i)
        return date.toISOString().split('T')[0]
      })
    }
  
    const getEntryForDate = (date: string): TimeEntry | null => {
      for (const projectEntry of timesheetData.timeSheetEntries) {
        const entry = projectEntry.entries.find(e => e.Date === date)
        if (entry) return entry
      }
      return null
    }
  
    const weekDates = getWeekDates()
    console.log("Week dates:", weekDates)
  
    return (
      <div className="space-y-4">
        <div className=" flex justify-between">
          <Button onClick={() => handleWeekChange('prev')}>
            <ChevronLeft size={20} />
          </Button>
          <Button onClick={() => handleWeekChange('next')}>
            <ChevronRight size={20} />
          </Button>
        </div>
  
        <div className="grid grid-cols-7 gap-4">
          {weekDates.map((date, index) => (
            <div key={index} className="bg-white p-4 rounded shadow">
              <p className="text-sm">{getEntryForDate(date)?.hour ?? 0} hours</p>
              <p className="text-sm truncate">{getEntryForDate(date)?.remark ?? ''}</p>
              <Button onClick={() => handleEntryClick(getEntryForDate(date), date)}>Edit</Button>
            </div>
          ))}
        </div>
  
        {selectedEntry && (
          <Dialog open={selectedEntry !== null}>
            <DialogTrigger asChild>
              <Button onClick={() => setSelectedEntry(null)}>Close</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>Edit Entry</DialogTitle>
              <form>
                <Input
                  type="date"
                  value={selectedEntry.Date}
                  onChange={(e) => setSelectedEntry({ ...selectedEntry, Date: e.target.value })}
                />
                <Input
                  type="number"
                  value={selectedEntry.hour}
                  onChange={(e) => setSelectedEntry({ ...selectedEntry, hour: Number(e.target.value) })}
                />
                <Input
                  value={selectedEntry.remark}
                  onChange={(e) => setSelectedEntry({ ...selectedEntry, remark: e.target.value })}
                />
                <Select value={selectedEntry.projectID}>
                  {timesheetData.timeSheetEntries.map((projectEntry) => (
                    <SelectItem key={projectEntry.projectID} value={projectEntry.projectID}>
                      {projectEntry.projectID}
                    </SelectItem>
                  ))}
                </Select>
                <Button onClick={() => handleEntrySave(selectedEntry)}>Save</Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>
    )
  }