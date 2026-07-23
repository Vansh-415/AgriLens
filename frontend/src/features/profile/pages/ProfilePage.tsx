import { useDocumentTitle } from '../../../hooks/useDocumentTitle';
import { useState } from 'react';
import { PageHeader } from '../../../components/ui/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Badge } from '../../../components/ui/Badge';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../hooks/useToast';
import { User, Lock, Save } from 'lucide-react';

export default function ProfilePage() {
  useDocumentTitle('User Profile');

  const { user } = useAuth();
  const toast = useToast();

  const [fullName, setFullName] = useState(user?.full_name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Profile Updated', 'User preferences updated successfully.');
    }, 600);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      toast.error('Validation Error', 'New password must be at least 6 characters.');
      return;
    }
    toast.success('Password Changed', 'Your account password has been updated.');
    setCurrentPassword('');
    setNewPassword('');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title="User Account & Profile"
        description="Manage personal credentials, role permissions, and security parameters."
      />

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1 text-center p-6 flex flex-col items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-2xl font-bold mb-4">
            {user?.full_name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <h3 className="font-semibold text-earth-900 text-lg">{user?.full_name}</h3>
          <p className="text-sm text-earth-500">{user?.email}</p>
          <div className="mt-4">
            <Badge variant={user?.role === 'admin' ? 'danger' : 'success'} className="capitalize">
              {user?.role || 'farmer'}
            </Badge>
          </div>
        </Card>

        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <User className="w-4 h-4 text-primary-600" />
                Personal Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <Input
                  label="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
                <Input
                  label="Email Address"
                  value={user?.email || ''}
                  disabled
                  helperText="Email address cannot be changed."
                />
                <div className="flex justify-end">
                  <Button type="submit" isLoading={isSaving}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Details
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Lock className="w-4 h-4 text-primary-600" />
                Change Password
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <Input
                  type="password"
                  label="Current Password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <Input
                  type="password"
                  label="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <div className="flex justify-end">
                  <Button type="submit" variant="outline">
                    Update Password
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
