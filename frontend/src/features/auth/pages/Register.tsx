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
import { AgriLensLogo } from '../../../components/ui/AgriLensLogo';

const registerSchema = z.object({
  full_name: z.string().min(2, "Full name is required"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export function Register() {
  useDocumentTitle('Create Account');

  const { register: registerUser, isAuthenticated } = useAuth();
  const [serverError, setServerError] = React.useState('');
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useHookForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema)
  });

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      setServerError('');
      await registerUser({
        full_name: data.full_name,
        email: data.email,
        password: data.password
      });
    } catch (err: any) {
      setServerError(err.response?.data?.message || err.response?.data?.detail || 'An error occurred during registration');
    }
  };

  return (
    <div className="min-h-screen bg-earth-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <AgriLensLogo size="lg" />
        </div>
        <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-earth-900">
          Create a new account
        </h2>
        <p className="mt-2 text-center text-sm text-earth-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500 transition-colors">
            Sign in instead
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Input
                label="Full Name"
                type="text"
                autoComplete="name"
                error={errors.full_name?.message}
                {...register('full_name')}
              />

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
                autoComplete="new-password"
                error={errors.password?.message}
                {...register('password')}
              />

              <Input
                label="Confirm Password"
                type="password"
                autoComplete="new-password"
                error={errors.confirmPassword?.message}
                {...register('confirmPassword')}
              />

              {serverError && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                  {serverError}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold"
                isLoading={isSubmitting}
              >
                Create Account
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
