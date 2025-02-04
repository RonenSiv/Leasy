"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSettings } from "@/context/settings-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { fakeDb, Video } from "@/lib/fakeDb";
import { useUser } from "@/hooks/use-user";

export default function FavoritesPage() {
  const { reduceMotion } = useSettings();
  const { user } = useUser();
  const [favorites, setFavorites] = useState<Video[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (user) {
      // In a real application, you would fetch the user's favorites from an API
      // For this example, we'll use the fakeDb to simulate fetching favorites
      const userFavorites = fakeDb
        .getUserVideos(user.uuid)
        .filter((video) => video.isFavorite);
      setFavorites(userFavorites);
    }
  }, [user]);

  const filteredFavorites = favorites.filter((video) =>
    video.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <motion.div
        className="text-center mb-16"
        initial={reduceMotion ? {} : { opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-4">Your Favorite Videos</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Access your saved videos quickly and easily.
        </p>
      </motion.div>

      <motion.div
        className="mb-8"
        variants={reduceMotion ? {} : itemVariants}
        initial="hidden"
        animate="visible"
      >
        <Input
          type="text"
          placeholder="Search your favorites..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </motion.div>

      <motion.div
        variants={reduceMotion ? {} : containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        {filteredFavorites.length > 0 ? (
          filteredFavorites.map((video) => (
            <motion.div
              key={video.id}
              variants={reduceMotion ? {} : itemVariants}
            >
              {/*<VideoCard {...video} />*/}
            </motion.div>
          ))
        ) : (
          <motion.div
            variants={reduceMotion ? {} : itemVariants}
            className="col-span-full text-center"
          >
            <Card>
              <CardHeader>
                <CardTitle>No favorites found</CardTitle>
                <CardDescription>
                  {searchTerm
                    ? "No favorites match your search. Try a different term."
                    : "You haven't added any videos to your favorites yet."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild>
                  <a href="/browse">Browse Videos</a>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
