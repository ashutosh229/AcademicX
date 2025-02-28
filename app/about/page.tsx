import { GraduationCap, Users, BookOpen, Code } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">About AcademicX</h1>
          <p className="text-lg text-gray-600">
            Empowering students through collaborative learning and resource sharing
          </p>
        </div>

        <Card className="p-8 mb-12">
          <h2 className="text-2xl font-semibold mb-6 flex items-center">
            <BookOpen className="mr-2 h-6 w-6 text-primary" />
            Our Mission
          </h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            AcademicX was created with a simple mission: to enhance the academic experience by providing a platform where students can share insights, resources, and feedback about their courses.
          </p>
          <p className="text-gray-700 leading-relaxed">
            We believe that collaborative learning leads to better outcomes for everyone. By creating a space where knowledge can be freely shared and discussed, we aim to help students make informed decisions about their academic journey and excel in their studies.
          </p>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <GraduationCap className="mr-2 h-5 w-5 text-primary" />
              For Students
            </h2>
            <ul className="space-y-2 text-gray-700">
              <li>• Access comprehensive course information</li>
              <li>• Share and discover valuable resources</li>
              <li>• Provide feedback on courses you've taken</li>
              <li>• Make informed decisions about your academic path</li>
              <li>• Connect with peers through shared experiences</li>
            </ul>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Users className="mr-2 h-5 w-5 text-primary" />
              For Viewers
            </h2>
            <ul className="space-y-2 text-gray-700">
              <li>• Browse course offerings and details</li>
              <li>• View student feedback and ratings</li>
              <li>• Explore available academic resources</li>
              <li>• Get insights into the academic environment</li>
              <li>• Make informed decisions about potential enrollment</li>
            </ul>
          </Card>
        </div>

        <Card className="p-8">
          <h2 className="text-2xl font-semibold mb-6 flex items-center">
            <Code className="mr-2 h-6 w-6 text-primary" />
            Development Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Lead Developer</h3>
              <p className="text-gray-700">Rahul Sharma</p>
              <p className="text-gray-600 text-sm">Computer Science, 2023</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">UI/UX Designer</h3>
              <p className="text-gray-700">Priya Patel</p>
              <p className="text-gray-600 text-sm">Design, 2024</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Backend Developer</h3>
              <p className="text-gray-700">Amit Kumar</p>
              <p className="text-gray-600 text-sm">Computer Science, 2023</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Project Manager</h3>
              <p className="text-gray-700">Neha Singh</p>
              <p className="text-gray-600 text-sm">Management, 2022</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}