'use client';

import { format } from 'date-fns';
import { useMemo, useState } from 'react';
import { DateRange } from 'react-day-picker';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { useUser } from '@/contexts/user/UserContext';
import { BarChart3, CalendarDays, UserCheck } from 'lucide-react';

// eslint-disable-next-line
const dummyData: any = {
  admin: [
    {
      day: 'Mon',
      interviews: 3,
      feedback: 4.2,
      noShows: 1,
      interviewer: 'Alice',
    },
    {
      day: 'Tue',
      interviews: 2,
      feedback: 3.8,
      noShows: 0,
      interviewer: 'Bob',
    },
    {
      day: 'Wed',
      interviews: 4,
      feedback: 4.5,
      noShows: 1,
      interviewer: 'Alice',
    },
    {
      day: 'Thu',
      interviews: 1,
      feedback: 4.0,
      noShows: 0,
      interviewer: 'Charlie',
    },
    {
      day: 'Fri',
      interviews: 3,
      feedback: 4.3,
      noShows: 0,
      interviewer: 'Bob',
    },
  ],
  ta_member: [
    {
      day: 'Mon',
      interviews: 2,
      feedback: 4.1,
      noShows: 1,
      interviewer: 'Dev',
    },
    {
      day: 'Tue',
      interviews: 1,
      feedback: 3.9,
      noShows: 0,
      interviewer: 'Eve',
    },
    {
      day: 'Wed',
      interviews: 3,
      feedback: 4.4,
      noShows: 1,
      interviewer: 'Dev',
    },
    {
      day: 'Thu',
      interviews: 2,
      feedback: 4.2,
      noShows: 0,
      interviewer: 'Eve',
    },
    {
      day: 'Fri',
      interviews: 1,
      feedback: 4.5,
      noShows: 0,
      interviewer: 'Dev',
    },
  ],
  panelist: [
    {
      day: 'Mon',
      interviews: 1,
      feedback: 4.0,
      noShows: 0,
      interviewer: 'Frank',
    },
    {
      day: 'Tue',
      interviews: 3,
      feedback: 4.5,
      noShows: 0,
      interviewer: 'Grace',
    },
    {
      day: 'Wed',
      interviews: 2,
      feedback: 4.2,
      noShows: 1,
      interviewer: 'Frank',
    },
    {
      day: 'Thu',
      interviews: 2,
      feedback: 3.9,
      noShows: 0,
      interviewer: 'Grace',
    },
    {
      day: 'Fri',
      interviews: 1,
      feedback: 4.1,
      noShows: 0,
      interviewer: 'Frank',
    },
  ],
};

export default function DashboardPage() {
  const { user } = useUser();
  const [role, setRole] = useState(user?.role || 'guest');
  const [interviewer, setInterviewer] = useState('');
  const [date, setDate] = useState<DateRange | undefined>();

  const filteredData = useMemo(() => {
    // eslint-disable-next-line
    let data: any = dummyData[role];
    if (interviewer.trim()) {
      data = data.filter((d: { interviewer: string }) =>
        d.interviewer.toLowerCase().includes(interviewer.toLowerCase())
      );
    }
    // Optional: filter by date here if you had actual dates
    return data;
  }, [role, interviewer]);

  const totalInterviews = filteredData.reduce(
    // eslint-disable-next-line
    (a: any, b: { interviews: any }) => a + b.interviews,
    0
  );
  const avgFeedback =
    // eslint-disable-next-line
    filteredData.reduce((a: any, b: { feedback: any }) => a + b.feedback, 0) /
      filteredData.length || 0;
  const totalNoShows = filteredData.reduce(
    // eslint-disable-next-line
    (a: any, b: { noShows: any }) => a + b.noShows,
    0
  );

  const metrics = [
    {
      title: 'Interviews This Week',
      value: totalInterviews,
      icon: CalendarDays,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      title: 'Avg Feedback Score',
      value: avgFeedback.toFixed(1),
      icon: BarChart3,
      color: 'bg-green-100 text-green-600',
    },
    {
      title: 'No Shows',
      value: totalNoShows,
      icon: UserCheck,
      color: 'bg-red-100 text-red-600',
    },
  ];

  return (
    <div className='p-6 space-y-8 w-full'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-semibold'>{role} Dashboard Overview</h1>
      </div>

      {/* Filters */}
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
        <div className='space-y-1'>
          <Label>Role</Label>
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger>
              <SelectValue placeholder='Select Role' />
            </SelectTrigger>
            <SelectContent hidden>
              <SelectItem value='admin'>Admin</SelectItem>
              <SelectItem value='ta_member'>TA Member</SelectItem>
              <SelectItem value='panelist'>Panelist</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className='space-y-1'>
          <Label>Interviewer</Label>
          <Input
            placeholder='Enter interviewer name'
            value={interviewer}
            onChange={(e) => setInterviewer(e.target.value)}
          />
        </div>

        <div className='space-y-1'>
          <Label>Date Range</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant='outline'
                className='w-full justify-start text-left font-normal'
              >
                {date?.from
                  ? date.to
                    ? `${format(date.from, 'MMM dd')} - ${format(
                        date.to,
                        'MMM dd'
                      )}`
                    : format(date.from, 'MMM dd')
                  : 'Select date range'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-0' align='start'>
              <Calendar
                mode='range'
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* KPI Cards */}
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card
              key={metric.title}
              className='border shadow-sm hover:shadow-md transition'
            >
              <CardHeader className='flex items-center justify-between'>
                <CardTitle className='text-sm font-medium'>
                  {metric.title}
                </CardTitle>
                <div className={`${metric.color} p-1 rounded-full`}>
                  <Icon size={20} />
                </div>
              </CardHeader>
              <CardContent>
                <p className='text-3xl font-semibold'>{metric.value}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Chart Section */}
      <Card className='border shadow-sm'>
        <CardHeader>
          <CardTitle>Weekly Performance</CardTitle>
        </CardHeader>
        <CardContent className='h-80'>
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart
              data={filteredData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='day' />
              <YAxis />
              <Tooltip wrapperClassName='dark:text-black' />
              <Legend />
              <Bar
                dataKey='interviews'
                name='Interviews'
                fill='hsl(var(--blue))'
                radius={[6, 6, 0, 0]}
              />
              <Bar
                dataKey='noShows'
                name='No Shows'
                fill='hsl(var(--red))'
                radius={[6, 6, 0, 0]}
              />
              <Bar
                dataKey='feedback'
                name='Avg Feedback'
                fill='hsl(var(--green))'
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
