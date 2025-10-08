'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUser } from '@/contexts/user/UserContext';
import { Post, Todo, User } from '@/services/api';
import axios from 'axios';
import Image from 'next/image';
import * as React from 'react';
import FeedbackForm from './FeedbackForm';

type Props = {
  user: User;
  todos: Todo[];
  feedback: Post[];
};

export default function CandidateDetail({ user, todos, feedback }: Props) {
  const [feedbacks, setFeedbacks] = React.useState<Post[]>(feedback);
  const { user: loginUser } = useUser();
  const role = loginUser?.role || 'guest';
  const canSubmitFeedback = ['admin', 'panelist'].includes(role);

  const handleFeedbackSubmit = async (newFb: Post) => {
    try {
      // Call API to save feedback
      const res = await axios.post(`/posts?userId=${user.id}`, newFb);
      setFeedbacks((prev) => [res.data, ...prev]);
    } catch (err) {
      console.error('Error submitting feedback:', err);
      setFeedbacks((prev) => [newFb, ...prev]); // fallback
    }
  };

  return (
    <div className='p-6 w-full space-y-6'>
      <h2 className='text-3xl font-bold mb-4'>
        Candidate: {user.firstName} {user.lastName}
      </h2>

      <Tabs defaultValue='profile' className='w-full'>
        <TabsList className='mb-6 space-x-2 h-full'>
          <TabsTrigger className='cursor-pointer text-base' value='profile'>
            Profile
          </TabsTrigger>
          <TabsTrigger className='cursor-pointer text-base' value='schedule'>
            Schedule
          </TabsTrigger>
          {canSubmitFeedback && (
            <TabsTrigger className='cursor-pointer text-base' value='feedback'>
              Feedback
            </TabsTrigger>
          )}
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value='profile'>
          <Card className='space-y-4'>
            <CardHeader className='space-y-2'>
              <div className='flex items-center gap-4'>
                <Image
                  src={user.image}
                  alt={`${user.firstName} ${user.lastName}`}
                  height={100}
                  width={100}
                  className='w-24 h-24 rounded-full object-cover border'
                />
                <div>
                  <CardTitle>
                    {user.firstName} {user.lastName}
                  </CardTitle>
                  <CardDescription>{user.company.title}</CardDescription>
                </div>
              </div>
              <CardDescription>
                Candidate&apos;s profile and company details.
              </CardDescription>
            </CardHeader>
            <CardContent className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
              <div>
                <p className='text-sm text-muted-foreground'>Email</p>
                <p>{user.email}</p>
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>Phone</p>
                <p>{user.phone}</p>
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>Age</p>
                <p>{user.age}</p>
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>Company</p>
                <p>{user.company.name}</p>
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>Department</p>
                <p>{user.company.department}</p>
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>Title</p>
                <p>{user.company.title}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Schedule Tab */}
        <TabsContent value='schedule'>
          <div className='space-y-4'>
            {todos.length ? (
              todos.map((todo) => (
                <Card key={todo.id}>
                  <CardHeader className='flex flex-row items-center justify-between p-4 pb-2'>
                    <div className='flex flex-col gap-y-3'>
                      <CardTitle className='text-base font-semibold'>
                        {todo.todo}
                      </CardTitle>
                      <CardDescription className='text-sm text-muted-foreground'>
                        Task ID: {todo.id}
                      </CardDescription>
                    </div>
                    <div>
                      <span
                        className={`w-28 h-8 flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          todo.completed
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {todo.completed ? '✅ Completed' : '⏳ Pending'}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className='-mt-4 pb-4 px-4 text-sm text-muted-foreground'>
                    {todo.completed
                      ? 'This task has been completed successfully.'
                      : 'This task is still in progress or scheduled.'}
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className='p-6 text-muted-foreground'>
                  No schedule items found.
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Feedback Tab */}
        <TabsContent value='feedback'>
          <div className='space-y-6'>
            {canSubmitFeedback && (
              <FeedbackForm
                userId={user.id}
                onFeedbackSubmit={handleFeedbackSubmit}
              />
            )}
            <div className='space-y-3'>
              {feedbacks.map((fb) => (
                <Card key={fb.id}>
                  <CardContent>
                    <p className='font-medium'>{fb.title}</p>
                    <p className='whitespace-pre-wrap text-sm text-muted-foreground'>
                      {fb.body}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
