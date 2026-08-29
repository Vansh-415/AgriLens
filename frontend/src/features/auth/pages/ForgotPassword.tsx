import React from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle';
import { useLockLightTheme } from '../../../hooks/useTheme';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Card, CardContent } from '../../../components/ui/Card';
import { AgriLensLogo } from '../../../components/ui/AgriLensLogo';
import { authService } from '../../../services/authService';
import { formatApiError } from '../../../utils/apiErrors';

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export function ForgotPassword() {
  useDocumentTitle('Reset Password — AgriLens');
  useLockLightTheme();

  const [success, setSuccess] = React.useState(false);
  const [serverError, setServerError] = React.useState('');
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema)
  });

  const onSubmit = async (data: ForgotPasswordValues) => {
    try {
      setServerError('');
      await authService.forgotPassword(data.email);
      setSuccess(true);
    } catch (err: any) {
      setServerError(formatApiError(err, 'Failed to process password reset request'));
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
          Reset your password
        </h2>
        <p className="text-xs sm:text-sm text-[#5c4a42]">
          Or{' '}
          <Link to="/login" className="font-bold text-[#16a34a] hover:text-[#15803d] transition-colors underline-offset-2 hover:underline">
            return to login
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="bg-white/95 backdrop-blur-xl border border-[#eaddd7] shadow-xl rounded-3xl overflow-hidden">
          <CardContent className="p-6 sm:p-8">
            {success ? (
              <div className="text-center space-y-4">
                <div className="p-3 bg-[#dcfce7] border-l-4 border-[#16a34a] text-[#15803d] text-xs sm:text-sm rounded-xl font-medium">
                  If an account exists for that email, we have sent password reset instructions.
                </div>
                <Link to="/login">
                  <Button variant="outline" className="w-full mt-4 border border-[#d2bab0] text-[#271a17] rounded-full py-3">
                    Return to login
                  </Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <Input
                  label="Email address"
                  type="email"
                  autoComplete="email"
                  placeholder="farmer@agrilens.in"
                  error={errors.email?.message}
                  {...register('email')}
                />
                
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
                  Send reset link
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
