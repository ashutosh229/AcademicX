import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BookOpen,
  Code,
  Github,
  GraduationCap,
  Linkedin,
  Mail,
  Users,
} from "lucide-react";

const developers = [
  {
    name: "Shubham Mahajan",
    role: "Backend Developer",
    email: "shubhamy0023@gmail.com",
    linkedin: "https://www.linkedin.com/in/shubham-y-mahajan/",
    github: "https://github.com/Shubham-Y-Mahajan",
    branch: "Computer Science and Engineering",
    degree: "B.Tech",
    yearStarting: "2022",
    yearEnding: "2026",
    college: "IIT Bhilai",
    image: "/images/shubham.jpg", // Replace with actual path or URL
    techStack: ["Django REST Framework", "PostgreSQL"],
  },
  {
    name: "Ashutosh Kumar Jha",
    role: "Frontend Developer",
    email: "ashutoshj@iitbhilai.ac.in",
    linkedin: "https://www.linkedin.com/in/ashutosh-kumar-jha-601098280/",
    github: "https://github.com/ashutosh229",
    branch: "Data Science and Artificial Intelligence",
    degree: "B.Tech",
    yearStarting: "2023",
    yearEnding: "2027",
    college: "IIT Bhilai",
    image: "/images/shubham.jpg", // Replace with actual path or URL
    techStack: ["Next.js", "Tailwind CSS", "ShadcnUI", "Redux Toolkit"],
  },
];

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            About IIT Bhilai Student Forum
          </h1>
          <p className="text-lg text-gray-600">
            Helping students make smarter course choices through shared feedback
            and resources.
          </p>
        </div>

        <Card className="p-8 mb-12">
          <h2 className="text-2xl font-semibold mb-6 flex items-center">
            <BookOpen className="mr-2 h-6 w-6 text-primary" />
            Our Mission
          </h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            IIT Bhilai Student Forum was created with a simple mission of
            enhancing the academic experience by providing a platform where
            students can share insights, resources, and feedback about their
            courses.
          </p>
          <p className="text-gray-700 leading-relaxed">
            We believe that collaborative learning leads to better outcomes for
            everyone. By creating a space where knowledge can be freely shared
            and discussed, we aim to help students make informed decisions about
            their academic journey and excel in their studies.
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
              <li>• View Website Statistics</li>
              <li>• Get insights into the academic environment</li>
              <li>
                • Understand the essence of course feedbacks and resources
              </li>
              <li>• Learn more about the application and the team behind it</li>
            </ul>
          </Card>
        </div>

        <Card className="p-8">
          <h2 className="text-2xl font-semibold mb-6 flex items-center">
            <Code className="mr-2 h-6 w-6 text-primary" />
            Development Team
          </h2>
          {/* Developer Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {developers.map((dev, index) => (
              <Card key={index} className="shadow-lg">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <img
                      src={dev.image}
                      alt={dev.name}
                      className="w-24 h-24 rounded-full object-cover border"
                    />
                    <div>
                      <CardTitle>{dev.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {dev.role}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {`${dev.degree} in ${dev.branch}, ${dev.college} (${dev.yearStarting} - ${dev.yearEnding})`}
                      </p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-2 mt-2 mb-4">
                    {dev.techStack.map((tech, i) => (
                      <span
                        key={i}
                        className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Socials */}
                  <div className="flex items-center gap-4">
                    <a
                      href={`mailto:${dev.email}`}
                      className="text-primary hover:text-red-500 transition-colors"
                    >
                      <Mail className="w-5 h-5" />
                    </a>
                    <a
                      href={dev.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-blue-600 transition-colors"
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                    <a
                      href={dev.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-gray-800 transition-colors"
                    >
                      <Github className="w-5 h-5" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
