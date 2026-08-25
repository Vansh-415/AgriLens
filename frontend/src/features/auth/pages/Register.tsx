import { useDocumentTitle } from '../../../hooks/useDocumentTitle';
import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useForm as useHookForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../../context/AuthContext';
import { useLockLightTheme } from '../../../hooks/useTheme';
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
  useDocumentTitle('Create Account — AgriLens');
  useLockLightTheme();

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
    <div
      data-theme="light"
      className="min-h-screen bg-[#f4fcf0] flex flex-col justify-center py-10 sm:py-16 px-4 sm:px-6 lg:px-8 font-sans selection:bg-[#16a34a] selection:text-white"
    >
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <div className="flex justify-center">
          <Link to="/" aria-label="AgriLens Home">
            <AgriLensLogo size="lg" />
          </Link>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#19100e] font-heading pt-2">
          Create a new account
        </h2>
        <p className="text-xs sm:text-sm text-[#5c4a42]">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-[#16a34a] hover:text-[#15803d] transition-colors underline-offset-2 hover:underline">
            Sign in instead
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="bg-white/95 backdrop-blur-xl border border-[#eaddd7] shadow-xl rounded-3xl overflow-hidden">
          <CardContent className="p-6 sm:p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Full Name"
                type="text"
                autoComplete="name"
                placeholder="Ramesh Patel"
                error={errors.full_name?.message}
                {...register('full_name')}
              />

              <Input
                label="Email address"
                type="email"
                autoComplete="email"
                placeholder="farmer@agrilens.in"
                error={errors.email?.message}
                {...register('email')}
              />

              <Input
                label="Password"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                error={errors.password?.message}
                {...register('password')}
              />

              <Input
                label="Confirm Password"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                error={errors.confirmPassword?.message}
                {...register('confirmPassword')}
              />

              {serverError && (
                <div className="p-3 text-xs sm:text-sm text-[#b91c1c] bg-[#fee2e2] border border-[#fca5a5] rounded-xl font-medium">
                  {serverError}
                </div>
              )}

              <div className="pt-2">
                <Button
                  type="submit"
                  className="w-full bg-[#16a34a] hover:bg-[#15803d] text-white font-extrabold rounded-full py-3.5 shadow-md shadow-[#16a34a]/20 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer min-h-[44px]"
                  isLoading={isSubmitting}
                >
                  Create Account
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
