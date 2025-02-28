'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { GraduationCap, AlertCircle } from 'lucide-react';
import { isAuthorizedStudent } from '@/lib/auth';
import { useAuth } from '@/lib/auth';

export default function StudentLoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!isAuthorizedStudent(email)) {
      setError('Please use your institutional email (@iitbhilai.ac.in)');
      setIsLoading(false);
      return;
    }

    const success = await login(email);
    if (success) {
      router.push('/courses');
    } else {
      setError('Login failed. Please try again.');
    }
    setIsLoading(false);
  };

  return (
    <Card className="p-6">
      <div className="flex justify-center mb-6">
        <GraduationCap className="h-12 w-12 text-primary" />
      </div>

      <h1 className="text-2xl font-bold text-center mb-6">
        Student Login
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">University Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="your.email@iitbhilai.ac.in"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-600 text-sm">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? 'Verifying...' : 'Continue'}
        </Button>
      </form>
    </Card>
  );
}