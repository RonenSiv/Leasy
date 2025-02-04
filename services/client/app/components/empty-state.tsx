"use client";

import { useState } from "react";
import { Play, Upload, VideoOff } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

export function EmptyState() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card className="max-w-2xl mx-auto">
      <CardContent>
        <motion.div
          className="flex flex-col items-center justify-center py-20 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="relative mb-8 w-24 h-24"
            animate={{ rotate: isHovered ? 360 : 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: isHovered ? 0 : 1 }}
              transition={{ duration: 0.3 }}
            >
              <VideoOff className="w-24 h-24 text-muted-foreground absolute top-0 left-0" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <Upload className="w-24 h-24 text-primary absolute top-0 left-0" />
            </motion.div>
          </motion.div>
          <h3 className="text-3xl font-bold mb-4">No Videos Found</h3>
          <p className="text-xl text-muted-foreground mb-8 max-w-md">
            You haven&apos;t uploaded any videos yet. Get started by uploading
            your first video and transform your learning experience.
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              asChild
              size="lg"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <Link href="/upload" className="flex items-center">
                {isHovered ? (
                  <Play className="mr-2 h-5 w-5" />
                ) : (
                  <Upload className="mr-2 h-5 w-5" />
                )}
                Upload Your First Video
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </CardContent>
    </Card>
  );
}
