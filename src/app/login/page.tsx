'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';

import ErrorMessage from '@/components/ErrorMessage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useUser } from '@/contexts/user/UserContext';
import { loginUser } from '@/services/api';
import { UserRoles } from '@/types/constant';

// Zod schema
const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
  role: z
    .enum(Object.keys(UserRoles))
    .refine((val) => !!val, { message: 'Please select a role' }),
});

type FormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login } = useUser();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: 'emilys',
      password: 'emilyspass',
      role: 'admin',
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await loginUser(data.username, data.password);
      login(data);
      if (UserRoles[data.role as keyof typeof UserRoles]) {
        router.push(`/${data.role}`);
      } else {
        toast.error('Invalid role selected');
      }
    } catch {
      toast.error('Invalid credentials');
    }
  };

  return (
    <div className='flex justify-center items-center h-screen transition-colors duration-300'>
      <Card className='w-96 shadow-lg border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-300'>
        <CardHeader>
          <CardTitle className='text-center text-2xl font-semibold'>
            Welcome Back
          </CardTitle>
          <h4 className='text-center'>Login to continue</h4>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
            {/* Username */}
            <div className='space-y-1'>
              <Label htmlFor='username'>Username</Label>
              <Input
                id='username'
                placeholder='Enter your username'
                {...register('username')}
              />
              <ErrorMessage message={errors?.username?.message} />
            </div>

            {/* Password */}
            <div className='space-y-1'>
              <Label htmlFor='password'>Password</Label>
              <Input
                id='password'
                type='password'
                placeholder='Enter your password'
                {...register('password')}
              />
              <ErrorMessage message={errors?.password?.message} />
            </div>

            {/* Role */}
            <div className='space-y-1'>
              <Label>Role</Label>
              <Controller
                name='role'
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Select Role' />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(UserRoles).map((key) => (
                        <SelectItem key={key} value={key}>
                          {UserRoles[key as keyof typeof UserRoles]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <ErrorMessage message={errors?.role?.message} />
            </div>

            {/* Submit */}
            <Button
              type='submit'
              className='w-full'
              disabled={isSubmitting || !isValid}
            >
              {isSubmitting ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
