"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
}

interface QuizletProps {
  questions: QuizQuestion[];
  onNewQuestions?: () => void;
}

export function Quizlet({ questions, onNewQuestions }: QuizletProps) {
  // Store user answers: mapping from question id to selected option.
  const [answers, setAnswers] = useState<Record<string, string>>({});
  // Track whether the quiz has been submitted.
  const [submitted, setSubmitted] = useState(false);

  // Calculate score based on correct answers.
  const score = questions.reduce((acc, q) => {
    return answers[q.id] === q.correctAnswer ? acc + 1 : acc;
  }, 0);

  // Compute percentage score (0-100%).
  const percentage =
    questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;

  const handleOptionClick = (questionId: string, option: string) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const handleRestart = () => {
    setAnswers({});
    setSubmitted(false);
  };

  // Footer with sticky buttons.
  const Footer = () => (
    <div className="sticky bottom-0 bg-background p-4 border-t flex flex-col gap-2">
      {submitted && (
        <p className="text-center text-lg font-semibold">
          Final Score: {percentage}%
        </p>
      )}
      <div className="flex justify-end gap-2">
        {submitted ? (
          <>
            <Button onClick={handleRestart}>Restart Test</Button>
            {onNewQuestions && (
              <Button variant="secondary" onClick={onNewQuestions}>
                New Questions
              </Button>
            )}
          </>
        ) : (
          <Button
            disabled={Object.keys(answers).length < questions.length}
            onClick={handleSubmit}
          >
            Submit Test
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 p-6 relative">
      {questions.map((q, idx) => (
        <div key={q.id} className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              Question {idx + 1} of {questions.length}
            </h3>
          </div>
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm font-medium mb-4">{q.question}</p>
            <div className="grid grid-cols-1 gap-2">
              {q.options.map((option, optionIdx) => {
                let additionalClasses = "";
                if (submitted) {
                  if (option === q.correctAnswer) {
                    additionalClasses = "bg-primary/10 border-primary";
                  } else if (
                    answers[q.id] === option &&
                    option !== q.correctAnswer
                  ) {
                    additionalClasses =
                      "bg-destructive/10 border-destructive/20";
                  }
                } else {
                  if (answers[q.id] === option) {
                    additionalClasses = "bg-primary/10 border-primary";
                  }
                }
                return (
                  <Button
                    key={optionIdx}
                    variant="outline"
                    className={`justify-start ${additionalClasses} hover:bg-primary/50`}
                    onClick={() => handleOptionClick(q.id, option)}
                    disabled={submitted}
                  >
                    {option}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      ))}
      <Footer />
    </div>
  );
}
