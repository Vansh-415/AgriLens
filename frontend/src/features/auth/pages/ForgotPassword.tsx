import React from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Card, CardContent } from '../../../components/ui/Card';
import { Leaf } from 'lucide-react';
import { authService } from '../../../services/authService';

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export function ForgotPassword() {
  const [success, setSuccess] = React.useState(false);
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema)
  });

  const onSubmit = async (data: ForgotPasswordValues) => {
    try {
      await authService.forgotPassword(data.email);
      setSuccess(true);
    } catch (err) {
      console.error(err);
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
          Reset your password
        </h2>
        <p className="mt-2 text-center text-sm text-earth-600">
          Or{' '}
          <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500 transition-colors">
            return to login
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          <CardContent className="pt-6">
            {success ? (
              <div className="text-center space-y-4">
                <div className="p-3 bg-green-50 border-l-4 border-green-500 text-green-700 text-sm rounded-md">
                  If an account exists for that email, we have sent password reset instructions.
                </div>
                <Link to="/login">
                  <Button variant="outline" className="w-full mt-4">Return to login</Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Input
                  label="Email address"
                  type="email"
                  autoComplete="email"
                  error={errors.email?.message}
                  {...register('email')}
                />
                
                <Button type="submit" className="w-full" isLoading={isSubmitting}>
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
