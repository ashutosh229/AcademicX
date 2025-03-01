'use client';

import { useSession } from 'next-auth/react';
import EditProfileForm from './edit-profile-form';
import { getUserByEmail } from '@/lib/auth-utils';

export default function EditProfilePage() {
  const { data: session } = useSession();
  
  // Get user data from our mock database
  const user = session?.user?.email ? getUserByEmail(session.user.email) : null;

  if (!user || user.role !== 'student') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
          <p className="text-gray-600 mt-2">
            Only students can access this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <EditProfileForm user={user} />
      </div>
    </div>
  );
}