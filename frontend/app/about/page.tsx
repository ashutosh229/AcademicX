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
    image: "./Ashutosh_12340390.jpg",
    techStack: ["Next.js", "Tailwind CSS", "ShadcnUI", "Redux Toolkit"],
  },
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
    image: "./Shubham_edited_pic_3.jpg",
    techStack: ["Django REST Framework", "PostgreSQL"],
  },
];

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            About IIT Bhilai Student Forum
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground">
            Helping students make smarter course choices through shared feedback
            and resources.
          </p>
        </div>

        {/* Mission Card */}
        <Card className="p-6 sm:p-8 mb-12">
          <h2 className="text-2xl font-semibold mb-6 flex items-center">
            <BookOpen className="mr-2 h-6 w-6 text-primary" />
            Our Mission
          </h2>
          <p className="text-muted-foreground mb-4 leading-relaxed text-sm sm:text-base">
            IIT Bhilai Student Forum was created with a simple mission of
            enhancing the academic experience by providing a platform where
            students can share insights, resources, and feedback about their
            courses.
          </p>
          <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
            We believe that collaborative learning leads to better outcomes for
            everyone. By creating a space where knowledge can be freely shared
            and discussed, we aim to help students make informed decisions about
            their academic journey and excel in their studies.
          </p>
        </Card>

        {/* Audience Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-12">
          <Card className="p-6 h-full">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <GraduationCap className="mr-2 h-5 w-5 text-primary" />
              For Students
            </h2>
            <ul className="space-y-2 text-muted-foreground text-sm sm:text-base">
              <li>• Access comprehensive course information</li>
              <li>• Share and discover valuable resources</li>
              <li>• Provide feedback on courses you've taken</li>
              <li>• Make informed decisions about your academic path</li>
              <li>• Connect with peers through shared experiences</li>
            </ul>
          </Card>

          <Card className="p-6 h-full">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Users className="mr-2 h-5 w-5 text-primary" />
              For Viewers
            </h2>
            <ul className="space-y-2 text-muted-foreground text-sm sm:text-base">
              <li>• View Website Statistics</li>
              <li>• Get insights into the academic environment</li>
              <li>• Understand the essence of course feedback and resources</li>
              <li>• Learn more about the application and the team behind it</li>
            </ul>
          </Card>
        </div>

        {/* Developer Team Section */}
        <Card>
          <CardHeader className="px-6 pt-6 pb-0">
            <CardTitle className="text-2xl font-semibold flex items-center">
              <Code className="mr-2 h-6 w-6 text-primary" />
              Development Team
            </CardTitle>
          </CardHeader>

          <CardContent className="p-6">
            <div className="grid sm:grid-cols-2 gap-8">
              {developers.map((dev, index) => (
                <Card
                  key={index}
                  className="p-6 flex flex-col items-center text-center shadow-sm"
                >
                  <img
                    src={dev.image}
                    alt={`Photo of ${dev.name}`}
                    className="w-48 h-48 sm:w-60 sm:h-60 rounded-full object-cover border-4 border-primary shadow-md mb-4"
                  />

                  <h3 className="text-xl font-semibold">{dev.name}</h3>
                  <p className="text-sm text-muted-foreground">{dev.role}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {`${dev.degree} in ${dev.branch}`}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {`${dev.yearStarting} - ${dev.yearEnding}`}
                  </p>

                  <div className="flex flex-wrap justify-center gap-2 mt-4">
                    {dev.techStack.map((tech, i) => (
                      <span
                        key={i}
                        className="bg-primary/10 text-primary text-xs sm:text-sm px-3 py-1 rounded-full font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex justify-center gap-5 mt-5">
                    <a
                      href={`mailto:${dev.email}`}
                      aria-label="Email"
                      className="text-primary hover:text-red-500 transition-colors"
                    >
                      <Mail className="w-5 h-5" />
                    </a>
                    <a
                      href={dev.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="LinkedIn"
                      className="text-primary hover:text-blue-600 transition-colors"
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                    <a
                      href={dev.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="GitHub"
                      className="text-primary hover:text-gray-800 transition-colors"
                    >
                      <Github className="w-5 h-5" />
                    </a>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
