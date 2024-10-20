import React from 'react';
import { WeeklyTimesheet } from '@/components/WeeklyTimesheet';

const TimesheetPage: React.FC = () => {

  return (
    <div className="container mx-auto p-4">
      <WeeklyTimesheet />
    </div>

  );
};

export default TimesheetPage;