"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mail, Linkedin, Github } from "lucide-react";

const developers = [
  {
    name: "John Doe",
    role: "Lead Developer",
    email: "johndoe@example.com",
    linkedin: "https://linkedin.com/in/johndoe",
    github: "https://github.com/johndoe",
  },
  {
    name: "Jane Smith",
    role: "Backend Engineer",
    email: "janesmith@example.com",
    linkedin: "https://linkedin.com/in/janesmith",
    github: "https://github.com/janesmith",
  },
];

export default function ContactPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-center mb-6">Contact Us</h1>

      {/* Developer Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {developers.map((dev, index) => (
          <Card key={index} className="shadow-lg">
            <CardHeader>
              <CardTitle>{dev.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{dev.role}</p>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mt-2">
                <a
                  href={`mailto:${dev.email}`}
                  className="text-primary hover:text-accent"
                >
                  <Mail className="w-5 h-5" />
                </a>
                <a
                  href={dev.linkedin}
                  target="_blank"
                  className="text-primary hover:text-accent"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a
                  href={dev.github}
                  target="_blank"
                  className="text-primary hover:text-accent"
                >
                  <Github className="w-5 h-5" />
                </a>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Contact Form */}
      <div className="max-w-lg mx-auto">
        <h2 className="text-xl font-semibold mb-4">Send Us a Message</h2>
        <form className="space-y-4">
          <Input type="text" placeholder="Your Name" required />
          <Input type="email" placeholder="Your Email" required />
          <Textarea placeholder="Your Message" required />
          <Button type="submit" className="w-full">
            Send Message
          </Button>
        </form>
      </div>
    </div>
  );
}
