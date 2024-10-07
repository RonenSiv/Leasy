"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MotionCardComponentProps {
  children: React.ReactNode;
  title: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  headerClasses: string;
  contentClasses: string;
}

const MotionCard = motion(Card);

const MotionCardComponent: React.FC<MotionCardComponentProps> = ({
  children,
  title,
  icon: Icon,
  headerClasses,
  contentClasses,
}) => (
  <MotionCard
    className="overflow-hidden shadow-lg h-full"
    whileHover={{ scale: 1.02 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <CardHeader
      className={`drag-handle cursor-move ${headerClasses} text-white`}
    >
      <CardTitle className="flex items-center">
        <Icon className="mr-2" /> {title}
      </CardTitle>
    </CardHeader>
    <CardContent className={contentClasses}>{children}</CardContent>
  </MotionCard>
);

export default MotionCardComponent;
