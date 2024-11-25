import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from '@/components/ui/button';
import { format, addDays, isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Popover, PopoverTrigger, PopoverContent } from '@radix-ui/react-popover';
import { cn } from "@/lib/utils";
import { CalendarIcon } from '@radix-ui/react-icons';
import { DayPicker } from 'react-day-picker';
import { enUS } from 'date-fns/locale';
import './custom.css';
// import { Card, CardContent, CardHeader, CardTitle } from "@ui/card"

const DashboardOverview: React.FC = () => (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    <Card className='dark:bg-[#262626]'>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">$45,231.89</div>
        <p className="text-xs text-muted-foreground">+20.1% from last month</p>
      </CardContent>
    </Card>
    {/* Add more cards for other metrics */}
  </div>
);

ChartJS.register(ArcElement, Tooltip, Legend);

interface DashboardLeaveProps {
  className?: string;
}

const DashboardLeave: React.FC<DashboardLeaveProps> = ({ className }) => {
  const [leaves, setLeaves] = useState<any[]>([]);
  const [totalLeaves, setTotalLeaves] = useState<number>(8);
  // const [takenLeaves, setTakenLeaves] = useState<number>(0);

  const [fullDayLeaves, setFullDayLeaves] = useState<number>(0);
  const [halfDayLeaves, setHalfDayLeaves] = useState<number>(0);
  const [date, setDate] = React.useState<any>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });

  console.log("leavewdwdwdwd:", leaves)

  useEffect(() => {
    const res = localStorage.getItem('Data');
    try {
      if (res) {
        const parsedData = JSON.parse(res);
        const filteredLeaves = parsedData.filter((item: any) => {
          const leaveDate = new Date(item.date);
          return (
            item.hours > 0 && 
            isWithinInterval(leaveDate, { start: startOfDay(date.from), end: endOfDay(date.to) })
          );
        });
        console.log("filteredLeaves:", filteredLeaves)

        const totalHalfDayLeaves = filteredLeaves.filter((item: any) => item.hours == 4 || item.hours == 5)
        const totalFullDayLeaves = filteredLeaves.filter((item: any) => item.hours == 8)
        console.log("totalHalfDayLeavesL", totalHalfDayLeaves)
        setHalfDayLeaves(totalHalfDayLeaves.length);
        setFullDayLeaves(totalFullDayLeaves.length)


        setLeaves(filteredLeaves);
        // setTakenLeaves(filteredLeaves.length);
        setTotalLeaves(8); 
      }
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
  }, [date]);

  console.log("halfDayLeaves:", halfDayLeaves)

  const remainingLeaves = totalLeaves - (halfDayLeaves / 2 + fullDayLeaves);

  const pieChartData = {
    labels: ['Half Days', 'Full Days', 'Remaining Leaves'],
    datasets: [
      {
        data: [halfDayLeaves, fullDayLeaves, remainingLeaves],
        backgroundColor: ['#FF6384', '#2C80D3', '#228B22'],
        hoverBackgroundColor: ['#FF4380', '#36A2D0', '#228B22'],
      },
    ],
  };

  const customLocale = {
    ...enUS,
    localize: {
      ...enUS.localize,
      day: (n: any) => {
        const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
        return dayLabels[n];
      },
    },
  };


  return (
    <>
      <div className="space-y-4 ">
        <div className="justify-end flex items-center gap-1 sm:gap-4 p-[6px]">
          <div className={cn("grid gap-2 ", className)}>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "w-auto justify-start text-left font-normal ",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon />
                  {date?.from ? (
                    date.to ? (
                      <> <div className='text-[16px] font-bold'>
                        {format(date.from, "LLL dd, y")} -{" "}
                        {format(date.to, "LLL dd, y")}
                      </div>
                      </>
                    ) : (
                      format(date.from, "LLL dd, y")
                    )
                  ) : (
                    <span className='text-[12px] sm:text-[20px]'>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className=" w-auto p-[10px] h-auto p-0 text-[16px] mt-[2px] bg-secondary flex items-center justify-center "
                align="end">
                <div className='flex'>
                  <div className='p-[6px]'>
                    <DayPicker
                      mode="range"
                      selected={date}
                      onSelect={setDate}
                      defaultMonth={date?.from || new Date()}
                      numberOfMonths={1}
                      locale={customLocale}
                      classNames={{
                        selected: 'bg-primary text-primary-foreground m-12',
                        day: 'calendar-date text-[10px] sm:text-[15px] m-0 p-[2px] sm:p-[4px] ',
                        weekday: 'text-[12px]',
                        chevron: 'DayPicker-Chevron w-4 h-4 sm:w-6 sm:h-6 text-white flex items-center rounded-full justify-end cursor-pointer transition-transform transform bg-secondary hover:bg-slate-300',
                        nav: 'flex justify-between items-center ',
                      }}
                    />
                  </div>
                  <div className='p-[6px]'>
                    <DayPicker
                      mode="range"
                      selected={date}
                      onSelect={setDate}
                      defaultMonth={date?.from || new Date()}
                      numberOfMonths={1}
                      locale={customLocale}
                      classNames={{
                        selected: 'bg-primary text-primary-foreground m-12 ',
                        day: 'calendar-date text-[10px] sm:text-[15px] m-0 p-[2px] sm:p-[4px] ',
                        weekday: 'text-[12px]',
                        chevron: 'DayPicker-Chevron w-4 h-4 sm:w-6 sm:h-6 text-white flex items-center rounded-full justify-end cursor-pointer transition-transform transform bg-secondary hover:bg-slate-300',
                        nav: 'flex justify-between items-center'
                      }}
                    />
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto font-semibold ">
        <table className="min-w-full border-collapse border border-gray-300 font-semibold ">
          <thead>
            <tr className="bg-gray-100 text-[12px] sm:text-[16px] dark:bg-[#262626]">
              <th className="border border-gray-300 px-4 py-2 ">Date</th>
              <th className="border border-gray-300 px-4 py-2">Hours</th>
              <th className="border border-gray-300 px-4 py-2">Remark</th>
              <th className="border border-gray-300 px-4 py-2">Project ID</th>
            </tr>
          </thead>
          <tbody>
            {leaves.length > 0 ? (
              leaves.map((leave, index) => (

                <tr key={index} className="hover:bg-gray-100 dark:hover:bg-[#262626] text-[12px] sm:text-[16px] leading-3 sm:leading-normal">
                  <td className="border border-gray-300 px-4 py-2">{leave.date}</td>
                  <td className="border border-gray-300 px-4 py-2">{leave.hours}</td>
                  <td className="border border-gray-300 px-4 py-2">{leave.remark}</td>
                  <td className="border border-gray-300 px-4 py-2">{leave.projectId}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="border border-gray-300 px-4 py-2 text-center">
                  No leaves data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="lg:w-[40%] md:w-[95%] w-[100%] p-[8px]">
        <h2 className="font-medium">Leave Summary</h2>
        <Doughnut
          data={pieChartData}
          options={{
            plugins: {
              legend: {
                position: 'right',
                labels: {
                  boxWidth: 10,
                  padding: 20,
                },
              },
            },
          }}
        />
      </div>
    </>
  );
}

const DashboardAnalytics: React.FC = () => (
  <div>
    <h2 className="text-2xl font-bold mb-4">Analytics</h2>
    {/* Add charts or analytics components here */}
  </div>
);

const Dashboard: React.FC = () => {
  return (
    <Routes>
      <Route index element={<DashboardOverview />} />
      <Route path="overview" element={<DashboardOverview />} />
      <Route path="analytics" element={<DashboardAnalytics />} />
      <Route path='leave' element={<DashboardLeave />} />
    </Routes>
  );
};

export default Dashboard;