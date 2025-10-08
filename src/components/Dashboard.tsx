'use client';

import { format } from 'date-fns';
import { useMemo, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

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

import { useUser } from '@/contexts/user/UserContext';
import { UserRoles } from '@/types/constant';
import { BarChart3, CalendarDays, UserCheck } from 'lucide-react';
import { usePathname } from 'next/navigation';

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
  const pathname = usePathname();

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
        <h1 className='text-2xl font-semibold'>
          {UserRoles[pathname.replace('/', '') as keyof typeof UserRoles]}{' '}
          Dashboard Overview
        </h1>
      </div>

      {/* Filters */}
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
        <div className='space-y-1'>
          <Label>Role</Label>
          <Input value={role} readOnly />
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
          <ChartContainer
            config={{
              interviews: { label: 'Interviews', color: 'var(--chart-1)' },
              noShows: { label: 'No Shows', color: 'var(--chart-2)' },
              feedback: { label: 'Avg Feedback', color: 'var(--chart-3)' },
            }}
            className='h-full w-full'
          >
            <AreaChart data={filteredData} className='w-full h-full'>
              <defs>
                <linearGradient id='fillInterviews' x1='0' y1='0' x2='0' y2='1'>
                  <stop
                    offset='5%'
                    stopColor='var(--chart-1)'
                    stopOpacity={0.8}
                  />
                  <stop
                    offset='95%'
                    stopColor='var(--chart-1)'
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id='fillNoShows' x1='0' y1='0' x2='0' y2='1'>
                  <stop
                    offset='5%'
                    stopColor='var(--chart-2)'
                    stopOpacity={0.8}
                  />
                  <stop
                    offset='95%'
                    stopColor='var(--chart-2)'
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id='fillFeedback' x1='0' y1='0' x2='0' y2='1'>
                  <stop
                    offset='5%'
                    stopColor='var(--chart-3)'
                    stopOpacity={0.8}
                  />
                  <stop
                    offset='95%'
                    stopColor='var(--chart-3)'
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey='day'
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => `${value}`}
                    indicator='dot'
                  />
                }
              />
              <Area
                dataKey='interviews'
                type='natural'
                fill='url(#fillInterviews)'
                stroke='var(--chart-1)'
                stackId='a'
              />
              <Area
                dataKey='noShows'
                type='natural'
                fill='url(#fillNoShows)'
                stroke='var(--chart-2)'
                stackId='a'
              />
              <Area
                dataKey='feedback'
                type='natural'
                fill='url(#fillFeedback)'
                stroke='var(--chart-3)'
                stackId='a'
              />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
