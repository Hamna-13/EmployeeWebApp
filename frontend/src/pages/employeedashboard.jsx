import React from 'react';
import CheckInBox from '../components/employeecheckin';
import WeeklyHoursChart from '../components/weeklyhourschart';
import WelcomeSection from '../components/welcomesection';
import TodaysDetailsBox from '../components/todaydetailsbox';
import RecentAttendance from '../components/recentattendance';

export default function EmployeeDashboard() {
  return (
    <div className="p-6 space-y-6">
      <WelcomeSection />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
  <CheckInBox />
  <TodaysDetailsBox />
</div>

<div className="grid grid-cols-1 gap-6">
  <RecentAttendance />
  <WeeklyHoursChart />
</div>

    </div>
  );
}
