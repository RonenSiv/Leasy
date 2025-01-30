import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Users } from "lucide-react";
import { Circle } from "./decorations";

const stories = [
  {
    name: "Dr. Sarah Johnson",
    role: "University Professor",
    quote:
      "Leasy has revolutionized how I create course materials. What used to take hours now takes minutes.",
    metric: "4x faster content creation",
  },
  {
    name: "Mike Chen",
    role: "Online Course Creator",
    quote:
      "The AI-generated summaries and quizzes have significantly improved student engagement in my courses.",
    metric: "85% increase in completion rates",
  },
  {
    name: "Emily Rodriguez",
    role: "Medical Student",
    quote:
      "The interactive features help me retain information better. It's like having a personal tutor.",
    metric: "92% exam success rate",
  },
];

export function SuccessStories() {
  return (
    <section className="py-32 bg-muted/30 relative">
      <Circle className="w-[400px] h-[400px] bg-primary/20 top-0 right-0 blur-3xl" />
      <div className="container px-4 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold mb-4">Success Stories</h2>
          <p className="text-xl text-muted-foreground">
            See how educators and students are transforming their learning
            experience
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {stories.map((story, index) => (
            <motion.div
              key={story.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
            >
              <Card className="h-full">
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{story.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {story.role}
                      </p>
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    &ldquo;{story.quote}&rdquo;
                  </p>
                  <div className="pt-4 border-t">
                    <p className="text-sm font-medium text-primary">
                      {story.metric}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
