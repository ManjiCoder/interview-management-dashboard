'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Post } from '@/services/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import ErrorMessage from './ErrorMessage';

const feedbackSchema = z.object({
  overallScore: z
    .string()
    .min(1, { message: 'Score must be between 1 and 10' })
    .max(10, { message: 'Score must be between 1 and 10' }),
  strengths: z
    .string()
    .min(5, { message: 'Please provide at least 5 characters for strengths' }),
  improvements: z.string().min(5, {
    message: 'Please provide at least 5 characters for improvements',
  }),
});

type FeedbackFormData = z.infer<typeof feedbackSchema>;

type FeedbackFormProps = {
  userId: number;
  onFeedbackSubmit: (newFeedback: Post) => void;
};

export default function FeedbackForm({
  userId,
  onFeedbackSubmit,
}: FeedbackFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackSchema),
    mode: 'onChange',
  });

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: FeedbackFormData) => {
    setLoading(true);

    // Simulate feedback object (replace this with actual API call if needed)
    const newFeedback: Post = {
      id: Math.random(),
      userId,
      title: `Score: ${data.overallScore}`,
      body: `**Strengths:** ${data.strengths}\n\n**Improvements:** ${data.improvements}`,
      reactions: 0,
      tags: [],
    };

    // Simulate delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    onFeedbackSubmit(newFeedback);
    reset();
    setLoading(false);
  };

  return (
    <Card>
      <CardHeader className='space-y-1'>
        <CardTitle>Submit Feedback</CardTitle>
        <CardDescription>
          Share your evaluation for the candidate.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div className='space-y-1'>
            <Label>Overall Score (1-10)</Label>
            <Input
              type='number'
              {...register('overallScore')}
              placeholder='Enter overall score'
            />
            <ErrorMessage message={errors.overallScore?.message} />
          </div>

          <div className='space-y-1'>
            <Label>Strengths</Label>
            <Textarea
              rows={3}
              {...register('strengths')}
              placeholder='Enter candidate strengths'
            />
            <ErrorMessage message={errors.strengths?.message} />
          </div>

          <div className='space-y-1'>
            <Label>Areas for Improvement</Label>
            <Textarea
              rows={3}
              {...register('improvements')}
              placeholder='Enter areas for improvement'
            />
            <ErrorMessage message={errors.improvements?.message} />
          </div>

          <Button
            type='submit'
            disabled={!isValid || loading}
            className='w-full'
          >
            {loading ? 'Submitting...' : 'Submit Feedback'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
