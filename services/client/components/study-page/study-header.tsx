import React from "react";
import { BookOpen, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface StudyHeaderProps {
  studyTime: number;
  toggleStudyTimer: () => void;
  studyProgress: number;
  isStudying: boolean;
}

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
};

const StudyHeader: React.FC<StudyHeaderProps> = ({
  studyTime,
  toggleStudyTimer,
  studyProgress,
  isStudying,
}) => {
  return (
    <div className="mb-4 flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <Clock className="text-purple-500" />
        <span className="font-bold">{formatTime(studyTime)}</span>
      </div>
      <Button
        onClick={toggleStudyTimer}
        variant="outline"
        className="bg-purple-500 text-white hover:bg-purple-600"
      >
        {isStudying ? "Pause Study" : "Start Study"}
      </Button>
      <div className="flex items-center space-x-2">
        <BookOpen className="text-purple-500" />
        <Progress value={studyProgress} className="w-[100px]" />
      </div>
    </div>
  );
};

export default StudyHeader;
