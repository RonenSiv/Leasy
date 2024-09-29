import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Github, Linkedin } from "lucide-react";
import { ClientImage } from "@/components/ClientImage";

// Type for social media links
type SocialLinks = {
  linkedin: string;
  github: string;
};

// Type for each team member's data
type TeamMemberType = {
  name: string;
  role: string;
  image: string;
  bio: string;
  skills: string[];
  social: SocialLinks;
};

// Define the team members data with proper typing
const teamMembers: TeamMemberType[] = [
  {
    name: "Team Member 1",
    role: "Full-stack Developer",
    image: "/placeholder.png?height=400&width=400",
    bio: "Passionate about creating efficient and user-friendly web applications. Specializes in React and Node.js.",
    skills: ["React", "Node.js", "MongoDB"],
    social: {
      linkedin: "https://linkedin.com/in/teammember1",
      github: "https://github.com/teammember1",
    },
  },
  {
    name: "Team Member 2",
    role: "AI Specialist",
    image: "/placeholder.png?height=400&width=400",
    bio: "Fascinated by the potential of AI in education. Focuses on natural language processing and machine learning algorithms.",
    skills: ["Python", "TensorFlow", "NLP"],
    social: {
      linkedin: "https://linkedin.com/in/teammember2",
      github: "https://github.com/teammember2",
    },
  },
  {
    name: "Team Member 3",
    role: "UX/UI Designer",
    image: "/placeholder.png?height=400&width=400",
    bio: "Dedicated to creating intuitive and beautiful user interfaces. Passionate about accessibility and user-centered design.",
    skills: ["Figma", "Adobe XD", "User Research"],
    social: {
      linkedin: "https://linkedin.com/in/teammember3",
      github: "https://github.com/teammember3",
    },
  },
];

// Props type for the TeamMember component
type TeamMemberProps = {
  member: TeamMemberType;
};

// TeamMember component with proper typing
const TeamMember: React.FC<TeamMemberProps> = ({ member }) => (
  <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg group">
    <CardContent className="p-0">
      <div className="relative overflow-hidden">
        <ClientImage
          src={member.image}
          alt={member.name}
          className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <div className="space-y-2">
            {member.skills.map((skill, index) => (
              <Badge key={index} variant="secondary" className="mr-2">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      </div>
      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-2xl font-semibold">{member.name}</h3>
          <p className="text-muted-foreground">{member.role}</p>
        </div>
        <p className="text-sm">{member.bio}</p>
        <div className="flex space-x-2">
          <Button size="icon" variant="ghost" asChild>
            <a
              href={member.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Linkedin className="h-4 w-4" />
              <span className="sr-only">LinkedIn</span>
            </a>
          </Button>
          <Button size="icon" variant="ghost" asChild>
            <a
              href={member.social.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="h-4 w-4" />
              <span className="sr-only">GitHub</span>
            </a>
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
);

// TeamIntro component
const TeamIntro: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-16 bg-background text-foreground">
      <header className="text-center mb-16">
        <div className="flex items-center justify-center text-center mb-8 gap-4">
          <h1 className="text-4xl font-bold text-primary">
            Meet the Leasy Team{" "}
          </h1>{" "}
          <ClientImage
            src="/signup.png"
            alt="Leasy Team"
            width={50}
            height={50}
          />
        </div>

        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          We're three passionate students from Bar-Ilan University in Israel,
          bringing Leasy to life as our final project! 🎓
        </p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {teamMembers.map((member, index) => (
          <TeamMember key={index} member={member} />
        ))}
      </div>
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">Our Mission 🎯</h2>
        <p className="text-lg mb-6 max-w-3xl mx-auto">
          At Leasy, we're on a mission to revolutionize online learning. By
          combining our diverse skills in technology and education, we're
          creating an innovative platform that makes learning more accessible,
          efficient, and engaging for students worldwide. 🌍📚
        </p>
        <div className="flex justify-center space-x-4">
          <Badge variant="secondary" className="text-lg py-2 px-4">
            Innovation 💡
          </Badge>
          <Badge variant="secondary" className="text-lg py-2 px-4">
            Accessibility 🔑
          </Badge>
          <Badge variant="secondary" className="text-lg py-2 px-4">
            Efficiency ⚡
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default TeamIntro;
