import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

interface VideoCardProps {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
}

export function VideoCard({
  id,
  title,
  description,
  thumbnail,
}: VideoCardProps) {
  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Card className="h-full flex flex-col overflow-hidden">
        <div className="relative h-72">
          {" "}
          {/* Increased from h-64 to h-72 */}
          <img
            src={thumbnail || "/placeholder.svg"}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
        <CardHeader>
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardFooter className="mt-auto">
          <Button asChild className="w-full">
            <Link href={`/video/${id}`}>View Video</Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
