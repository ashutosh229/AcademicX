'use client';

import { useState } from 'react';
import { User, updateUserProfile } from '@/lib/auth-utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { UserCircle, Save, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface EditProfileFormProps {
  user: User;
}

export default function EditProfileForm({ user }: EditProfileFormProps) {
  const router = useRouter();
  const { update } = useSession();
  const [formData, setFormData] = useState({
    name: user.name,
    batch: user.batch || '',
    branch: user.branch || ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess(false);

    try {
      const updatedUser = updateUserProfile(user.id, {
        name: formData.name,
        batch: formData.batch,
        branch: formData.branch
      });

      if (!updatedUser) {
        throw new Error('Failed to update profile');
      }

      // Update the session with new user data
      await update({
        ...user,
        name: formData.name,
      });

      setSuccess(true);
      
      // Simulate API delay
      setTimeout(() => {
        router.push('/courses');
      }, 1500);
    } catch (err) {
      setError('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-8">
      <div className="flex items-center gap-4 mb-6">
        <UserCircle className="h-12 w-12 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">Edit Profile</h1>
          <p className="text-gray-600">{user.email}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="batch">Batch Year</Label>
          <Input
            id="batch"
            value={formData.batch}
            onChange={(e) => setFormData(prev => ({ ...prev, batch: e.target.value }))}
            placeholder="e.g., 2023"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="branch">Branch</Label>
          <Input
            id="branch"
            value={formData.branch}
            onChange={(e) => setFormData(prev => ({ ...prev, branch: e.target.value }))}
            placeholder="e.g., Computer Science"
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-600 text-sm">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-green-50 text-green-600 p-3 rounded-md text-sm">
            Profile updated successfully! Redirecting...
          </div>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </Card>
  );
}