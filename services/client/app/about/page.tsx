import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AreaChart,
  ArrowRight,
  BookOpen,
  Brain,
  CheckCircle,
  MonitorSmartphone,
  Video,
  Zap,
} from "lucide-react";
import Link from "next/link";

const Section = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => <section className={`mb-20 ${className}`}>{children}</section>;

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-4xl font-semibold mb-8 text-center text-primary">
    {children}
  </h2>
);

const FeatureCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <Card className="group hover:shadow-lg transition-all duration-300">
    <CardHeader className="bg-muted flex items-center space-x-4">
      <div className="transform group-hover:scale-110 transition-transform duration-300 text-primary">
        {icon}
      </div>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent className={"mt-2"}>
      <p>{description}</p>
    </CardContent>
  </Card>
);

const TeamMemberCard = ({
  name,
  role,
  image,
  bio,
  emoji,
}: {
  name: string;
  role: string;
  image: string;
  bio: string;
  emoji: string;
}) => (
  <Card className="group hover:shadow-lg transition-all duration-300">
    <CardContent className="pt-6 flex flex-col items-center">
      <Avatar className="w-24 h-24 mb-4 ring-4 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300">
        <AvatarImage src={image} alt={name} />
        <AvatarFallback>{emoji}</AvatarFallback>
      </Avatar>
      <h3 className="text-xl font-semibold">{name}</h3>
      <Badge variant="secondary" className="mt-1 mb-2">
        {role}
      </Badge>
      <p className="text-center text-muted-foreground">{bio}</p>
    </CardContent>
  </Card>
);

export default function AboutPage() {
  const features = [
    {
      icon: <Video className="w-12 h-12" />,
      title: "Video Upload 📹",
      description: "Upload or link your lecture videos to our platform",
    },
    {
      icon: <Brain className="w-12 h-12" />,
      title: "AI Summarization 🤖",
      description:
        "Our AI generates concise, accurate summaries of the content",
    },
    {
      icon: <CheckCircle className="w-12 h-12" />,
      title: "Quiz Generation 📝",
      description: "Automatically created quizzes help reinforce your learning",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "AI-Powered Summaries",
      description: "Get the essence of lectures in minutes",
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Interactive Quizzes",
      description: "Test your knowledge and reinforce learning",
    },
    {
      icon: <AreaChart className="w-8 h-8" />,
      title: "Progress Tracking",
      description: "Monitor your learning journey with detailed analytics",
    },
    {
      icon: <MonitorSmartphone className="w-8 h-8" />,
      title: "Multi-Platform Support",
      description: "Learn on any device, anytime, anywhere",
    },
  ];

  const teamMembers = [
    {
      name: "Dr. Emily Chen",
      role: "Founder & CEO",
      image: "/placeholder.svg?height=100&width=100",
      bio: "EdTech innovator with a Ph.D. in Cognitive Science",
      emoji: "👩‍🔬",
    },
    {
      name: "Mark Rodriguez",
      role: "Chief Technology Officer",
      image: "/placeholder.svg?height=100&width=100",
      bio: "AI expert specializing in natural language processing",
      emoji: "👨‍💻",
    },
    {
      name: "Sarah Kim",
      role: "Head of Content",
      image: "/placeholder.svg?height=100&width=100",
      bio: "Former educator passionate about accessible learning",
      emoji: "👩‍🏫",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 bg-background text-foreground min-h-screen">
      <header className="mb-12 text-center">
        <h1 className="text-5xl font-bold mb-2 text-primary">
          About Leasy 🧠✨
        </h1>
        <p className="text-2xl text-muted-foreground">Learning Made Easy</p>
      </header>

      <main>
        <Section>
          <Card>
            <CardHeader className="bg-primary text-primary-foreground">
              <CardTitle className="text-3xl">Our Mission 🚀</CardTitle>
              <CardDescription className="text-primary-foreground/80">
                Revolutionizing online learning through AI-powered summaries and
                interactive quizzes
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <p className="text-lg">
                At Leasy, we believe that learning should be accessible,
                efficient, and engaging. Our platform harnesses the power of
                artificial intelligence to transform lengthy lecture videos into
                concise, easy-to-digest summaries. But we don't stop there – we
                also generate interactive quizzes to help reinforce your
                learning and boost retention.
              </p>
              <p className="text-lg">
                Whether you're a student looking to ace your exams, a
                professional aiming to upskill, or a lifelong learner pursuing
                your passions, Leasy is here to make your learning journey
                smoother and more effective.
              </p>
            </CardContent>
          </Card>
        </Section>

        <Section>
          <SectionTitle>How Leasy Works 🛠️</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.slice(0, 3).map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </Section>

        <Section>
          <SectionTitle>Key Features 🔑</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.slice(3).map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </Section>

        <Section>
          <SectionTitle>Meet Our Team 👨‍👨</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <TeamMemberCard key={index} {...member} />
            ))}
          </div>
        </Section>

        <Section className="text-center bg-accent p-10 rounded-2xl">
          <h2 className="text-4xl font-semibold mb-4 text-accent-foreground">
            Start Learning with Leasy Today 🚀
          </h2>
          <p className="mb-6 max-w-2xl mx-auto text-lg text-accent-foreground/80">
            Experience the future of online learning. Sign up now to transform
            your educational journey with AI-powered summaries and interactive
            quizzes.
          </p>
          <Link href="/authentication" passHref>
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </Section>
      </main>
    </div>
  );
}
