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
import { VideoPreviewResource } from "@/types";

export function VideoCard({ title, description, video }: VideoPreviewResource) {
  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Card className="h-full flex flex-col overflow-hidden">
        <div className="relative h-72">
          {" "}
          <img
            src={video.preview_image_url || "/placeholder.svg"}
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
            <Link href={`/video/${video.uuid}`}>View Video</Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
