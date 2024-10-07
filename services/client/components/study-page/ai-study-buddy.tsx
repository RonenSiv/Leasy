"use client";

import React from "react";
import MotionCardComponent from "./motion-card-component";
import { Brain } from "lucide-react";
import ChatInterface from "@/components/chatbot/chat-interface";

const AIStudyBuddyCard: React.FC = () => (
  <MotionCardComponent
    title="AI Study Buddy"
    icon={Brain}
    headerClasses="bg-gradient-to-r from-green-500 to-teal-500"
    contentClasses="p-0 h-[calc(100%-4rem)] px-3 py-2"
  >
    <ChatInterface />
  </MotionCardComponent>
);

export default AIStudyBuddyCard;
