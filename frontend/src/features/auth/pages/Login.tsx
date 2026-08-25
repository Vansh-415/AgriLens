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

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function Login() {
  useDocumentTitle('Sign In — AgriLens');
  useLockLightTheme();

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
          Sign in to your account
        </h2>
        <p className="text-xs sm:text-sm text-[#5c4a42]">
          Or{' '}
          <Link to="/register" className="font-bold text-[#16a34a] hover:text-[#15803d] transition-colors underline-offset-2 hover:underline">
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="bg-white/95 backdrop-blur-xl border border-[#eaddd7] shadow-xl rounded-3xl overflow-hidden">
          <CardContent className="p-6 sm:p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
                autoComplete="current-password"
                placeholder="••••••••"
                error={errors.password?.message}
                {...register('password')}
              />

              <div className="flex items-center justify-between text-xs sm:text-sm">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-[#16a34a] focus:ring-[#16a34a] border-[#d2bab0] rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-xs sm:text-sm text-[#5c4a42] font-medium cursor-pointer">
                    Remember me
                  </label>
                </div>

                <Link to="/forgot-password" className="font-bold text-xs sm:text-sm text-[#16a34a] hover:text-[#15803d] transition-colors">
                  Forgot password?
                </Link>
              </div>

              {serverError && (
                <div className="p-3 text-xs sm:text-sm text-[#b91c1c] bg-[#fee2e2] border border-[#fca5a5] rounded-xl font-medium">
                  {serverError}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-[#16a34a] hover:bg-[#15803d] text-white font-extrabold rounded-full py-3.5 shadow-md shadow-[#16a34a]/20 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer min-h-[44px]"
                isLoading={isSubmitting}
              >
                Sign in
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
