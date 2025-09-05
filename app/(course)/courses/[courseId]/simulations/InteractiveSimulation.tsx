"use client";
import AnswerDescription from '@/app/(course)/courses/[courseId]/components/AnswerDescription';
import UnDownloadableImage from "@/components/UnDownloadableImage";
import { cn } from "@/lib/utils";
import type {
  Answer,
  Exam,
  Question,
} from "@/prisma/app/generated/prisma/client";
import { AlertTriangle, ArrowLeft, Check, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

const alphabets = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];

type InteractiveExamProps = {
  exam: Exam & {
    questions: (Question & {
      answers: Answer[];
    })[];
  };
};

export default function InteractiveSimulation({ exam }: InteractiveExamProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, string[]>
  >({});
  const [showResults, setShowResults] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(2 * 60 * 60); // 2 hours in seconds
  const [isTimeUp, setIsTimeUp] = useState(false);

  // Format time as HH:MM:SS
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Auto-submit when time runs out
  const handleTimeUp = useCallback(() => {
    setIsTimeUp(true);
    setShowResults(true);
  }, []);

  // Timer effect
  useEffect(() => {
    if (showResults || timeRemaining <= 0) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [showResults, timeRemaining, handleTimeUp]);

  // Determine timer color based on remaining time
  const getTimerColor = () => {
    if (timeRemaining <= 300) return "text-red-600"; // Last 5 minutes
    if (timeRemaining <= 900) return "text-orange-600"; // Last 15 minutes
    if (timeRemaining <= 1800) return "text-yellow-600"; // Last 30 minutes
    return "text-green-600";
  };

  const handleAnswerSelect = (questionId: string, answerId: string) => {
    if (showResults || isTimeUp) return;

    setSelectedAnswers((prev) => {
      const currentSelections = prev[questionId] || [];

      if (currentSelections.includes(answerId)) {
        return {
          ...prev,
          [questionId]: currentSelections.filter((id) => id !== answerId),
        };
      } else {
        return {
          ...prev,
          [questionId]: [...currentSelections, answerId],
        };
      }
    });
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  const isAnswerSelected = (questionId: string, answerId: string) => {
    return selectedAnswers[questionId]?.includes(answerId) || false;
  };

  const getCorrectAnswersCount = () => {
    let correct = 0;
    exam.questions.forEach((question) => {
      const selectedForQuestion = selectedAnswers[question.id] || [];
      const correctAnswers = question.answers
        .filter((a) => a.isCorrect)
        .map((a) => a.id);

      // Check if selected answers match correct answers exactly
      if (
        selectedForQuestion.length === correctAnswers.length &&
        selectedForQuestion.every((id) => correctAnswers.includes(id))
      ) {
        correct++;
      }
    });
    return correct;
  };

  return (
    <div className="p-6 px-4 sm:px-6 lg:px-24">
      {/* Header with Timer */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div>
          <h1 className="text-2xl font-bold">{exam.name}</h1>
          <p className="text-gray-600">{exam.description}</p>
        </div>

        {!showResults && (
          <div
            className={cn(
              "flex items-center gap-2 bg-white border-2 rounded-lg px-4 py-2 shadow-sm",
              timeRemaining <= 300 && "border-red-200 bg-red-50",
              timeRemaining > 300 &&
                timeRemaining <= 900 &&
                "border-orange-200 bg-orange-50",
              timeRemaining > 900 &&
                timeRemaining <= 1800 &&
                "border-yellow-200 bg-yellow-50"
            )}
          >
            {timeRemaining <= 300 ? (
              <AlertTriangle className={cn("h-5 w-5", getTimerColor())} />
            ) : (
              <Clock className={cn("h-5 w-5", getTimerColor())} />
            )}
            <span
              className={cn("font-mono text-lg font-semibold", getTimerColor())}
            >
              {formatTime(timeRemaining)}
            </span>
          </div>
        )}
      </div>

      {/* Time Up Warning */}
      {isTimeUp && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            <span className="font-semibold">Time&apos;s Up!</span>
          </div>
          <p className="mt-1">
            The exam time has expired and your answers have been automatically
            submitted.
          </p>
        </div>
      )}

      <div className="mt-6">
        <div className="mt-4 space-y-8">
          {exam.questions.map((question, index) => (
            <div
              key={question.id}
              className="flex justify-between flex-col gap-3 w-full items-center"
            >
              <h1 className="font-medium text-lg text-start self-start w-full max-w-4xl mx-auto px-4">
                {index + 1}. {question.question}
              </h1>
              {question.imageUrl && (
                <div className="w-full">
                  <UnDownloadableImage className="mx-auto">
                    <Image
                      src={question.imageUrl}
                      alt={question.question}
                      objectFit="contain"
                      fill
                      className="w-full max-w-4xl mx-auto px-4 pointer-events-none select-none"
                    />
                  </UnDownloadableImage>
                </div>
              )}

              <div className="flex justify-center w-full px-4">
                <div className="space-y-4 w-full max-w-4xl">
                  {question.answers.map((answer, answerIndex) => (
                    <div
                      key={answer.id}
                      className={cn(
                        "text-gray-600 text-lg border p-1 rounded-sm mx-auto transition-all duration-200 w-full",
                        !showResults &&
                          !isTimeUp &&
                          "cursor-pointer hover:bg-gray-50",
                        (showResults || isTimeUp) && "cursor-not-allowed",
                        isAnswerSelected(question.id, answer.id) &&
                          "border-blue-500 bg-blue-50",
                        showResults &&
                          answer.isCorrect &&
                          "border-green-600 border-1 bg-green-50",
                        showResults &&
                          isAnswerSelected(question.id, answer.id) &&
                          !answer.isCorrect &&
                          "border-red-500 bg-red-50"
                      )}
                      onClick={() => handleAnswerSelect(question.id, answer.id)}
                    >
                      <div className="flex items-center gap-2 flex-wrap justify-between">
                        <div className="flex items-start gap-2 flex-wrap flex-1 min-w-0">
                          <span
                            className={cn(
                              "font-bold bg-gray-200 p-1 px-3 mr-2 rounded-sm transition-colors flex-shrink-0",
                              isAnswerSelected(question.id, answer.id) &&
                                "bg-blue-200 text-blue-700",
                              showResults &&
                                answer.isCorrect &&
                                "bg-green-200 text-green-700",
                              showResults &&
                                isAnswerSelected(question.id, answer.id) &&
                                !answer.isCorrect &&
                                "bg-red-200 text-red-700"
                            )}
                          >
                            {alphabets[answerIndex]}
                          </span>
                          <p className="break-words min-w-0 flex-1">
                            {answer.text}
                          </p>
                        </div>

                        {showResults && answer.isCorrect && (
                          <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                        )}
                      </div>
                    </div>
                  ))}
                {showResults && <AnswerDescription description = {question.answerDescription}/>}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 px-4 min-h-[200px] transition-all duration-300">
          {!showResults ? (
            <div className="flex justify-center">
              <button
                onClick={handleSubmit}
                disabled={isTimeUp}
                className={cn(
                  "font-medium py-2 px-6 rounded-lg transition-colors duration-200 text-lg",
                  isTimeUp
                    ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                    : "bg-sky-600 hover:bg-sky-700 text-white"
                )}
              >
                {isTimeUp ? "Time's Up" : "Submit Exam"}
              </button>
            </div>
          ) : (
            <div className="bg-gray-100 p-6 rounded-lg text-center max-w-2xl mx-auto">
              <h2 className="text-xl font-bold mb-2">
                {isTimeUp ? "Time's Up - Exam Results" : "Exam Results"}
              </h2>
              <p className="text-lg">
                You got{" "}
                <span className="font-bold text-green-600">
                  {getCorrectAnswersCount()}
                </span>{" "}
                out of{" "}
                <span className="font-bold">{exam.questions.length}</span>{" "}
                questions correct!
              </p>
              <p className="text-gray-600 mt-2">
                Score:{" "}
                {Math.round(
                  (getCorrectAnswersCount() / exam.questions.length) * 100
                )}
                %
              </p>
              {isTimeUp && (
                <p className="text-red-600 mt-2 text-sm">
                  Exam was automatically submitted due to time expiration.
                </p>
              )}
              <div className="flex flex-col gap-2 justify-center items-center">
                <button
                  onClick={() => {
                    setShowResults(false);
                    setSelectedAnswers({});
                    setTimeRemaining(2 * 60 * 60); // Reset timer to 2 hours
                    setIsTimeUp(false);
                  }}
                  className="mt-6 bg-sky-600 hover:bg-sky-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200"
                >
                  Retake Exam
                </button>

                <Link href={`/courses/${exam.courseId}`} className="group underline text-gray-600 flex gap-1 items-center"><span><ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-all duration-300"/></span>Back to course</Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
