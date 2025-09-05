"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { ArrowLeft, Check } from "lucide-react";
import Image from "next/image";
import UnDownloadableImage from "@/components/UnDownloadableImage";
import { Answer, Exam, Question } from "@/prisma/app/generated/prisma/client";
import AnswerDescription from "@/app/(course)/courses/[courseId]/components/AnswerDescription";
import Link from "next/link";

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
  courseId: string;
  exam: Exam & {
    questions: (Question & {
      answers: Answer[];
    })[];
  };
};

export default function InteractiveExam({
  courseId,
  exam,
}: InteractiveExamProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, string[]>
  >({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswerSelect = (questionId: string, answerId: string) => {
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
      <h1 className="text-2xl font-bold">{exam.name}</h1>
      <p className="text-gray-600">{exam.description}</p>

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
                  <UnDownloadableImage>
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
                        "text-gray-600 text-lg border p-1 rounded-sm mx-auto cursor-pointer transition-all duration-200 hover:bg-gray-50 w-full",
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
                      onClick={() =>
                        !showResults &&
                        handleAnswerSelect(question.id, answer.id)
                      }
                    >
                      <div className="flex items-center gap-2 flex-wrap justify-between">
                        <div className="flex items-start gap-2 flex-wrap flex-1 min-w-0 ">
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
                  {showResults && (
                    <AnswerDescription
                      description={question.answerDescription}
                    />
                  )}
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
                className="bg-sky-600 hover:bg-sky-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200 text-lg"
              >
                Submit Exam
              </button>
            </div>
          ) : (
            <div className="bg-gray-100 p-6 rounded-lg text-center max-w-2xl mx-auto">
              <h2 className="text-xl font-bold mb-2">Exam Results</h2>
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
              <div className="flex flex-col gap-2 justify-center items-center">
                <button
                  onClick={() => {
                    setShowResults(false);
                    setSelectedAnswers({});
                  }}
                  className="mt-6 bg-sky-600 hover:bg-sky-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200"
                >
                  Retake Exam
                </button>

                <Link
                  href={`/courses/${courseId}/chapters/${exam.chapterId}`}
                  className="group underline text-gray-600 flex gap-1 items-center"
                >
                  <span>
                    <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-all duration-300" />
                  </span>
                  Back to course
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
