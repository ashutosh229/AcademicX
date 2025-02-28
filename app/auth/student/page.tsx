import StudentLoginForm from './student-form';

export default function StudentLoginPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-b from-white to-gray-50">
      <div className="w-full max-w-md">
        <StudentLoginForm />
      </div>
    </div>
  );
}