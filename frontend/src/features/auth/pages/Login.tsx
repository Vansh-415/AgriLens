import { useDocumentTitle } from '../../../hooks/useDocumentTitle';
import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useForm as useHookForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../../context/AuthContext';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Card, CardContent } from '../../../components/ui/Card';
import { Leaf } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function Login() {
  useDocumentTitle('Sign In');

  const { login, isAuthenticated } = useAuth();
  const [serverError, setServerError] = React.useState('');
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useHookForm<LoginFormValues>({
    resolver: zodResolver(loginSchema)
  });

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setServerError('');
      await login(data);
    } catch (err: any) {
      setServerError(err.response?.data?.message || err.response?.data?.detail || 'Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen bg-earth-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="bg-primary-600 p-2 rounded-xl shadow-sm">
            <Leaf className="h-8 w-8 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-earth-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-earth-600">
          Or{' '}
          <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500 transition-colors">
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Input
                label="Email address"
                type="email"
                autoComplete="email"
                error={errors.email?.message}
                {...register('email')}
              />
              
              <Input
                label="Password"
                type="password"
                autoComplete="current-password"
                error={errors.password?.message}
                {...register('password')}
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-earth-300 text-primary-600 focus:ring-primary-500"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-earth-900">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link to="/forgot-password" className="font-medium text-primary-600 hover:text-primary-500">
                    Forgot your password?
                  </Link>
                </div>
              </div>

              {serverError && (
                <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-md">
                  {serverError}
                </div>
              )}

              <Button type="submit" className="w-full" isLoading={isSubmitting}>
                Sign in
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
