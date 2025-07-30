"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { Trash2, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";


const answerSchema = z.object({
  text: z.string().min(1, "Answer text is required"),
  isCorrect: z.boolean().default(false),
});

const questionSchema = z.object({
  question: z.string().min(1, "Question text is required"),
  answers: z.array(answerSchema).min(2, "At least 2 answers are required").refine(
    (answers) => answers.some(answer => answer.isCorrect),
    "At least one answer must be marked as correct"
  ),
});

const examSchema = z.object({
  name: z.string().min(1, "Exam name is required"),
  description: z.string().optional(),
  questions: z.array(questionSchema).min(1, "At least one question is required"),
});

interface CreateExamPageProps {
  params: {
    courseId: string;
    chapterId: string;
  };
}

export default function CreateExamPage({ params }: CreateExamPageProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  
  const form = useForm<z.infer<typeof examSchema>>({
    resolver: zodResolver(examSchema),
    defaultValues: {
      name: "",
      description: "",
      questions: [
        {
          question: "",
          answers: [
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
          ],
        },
      ],
    },
  });

  const { fields: questionFields, append: appendQuestion, remove: removeQuestion } = useFieldArray({
    control: form.control,
    name: "questions",
  });

  const onSubmit = async (values: z.infer<typeof examSchema>) => {
    console.log('onsubmit called')
    try {
      setIsSubmitting(true);
      await axios.post(
        `/api/courses/${params.courseId}/chapters/${params.chapterId}/exams`,
        values
      );
      toast.success("Exam created successfully");
      router.push(`/dashboard/teacher/courses/${params.courseId}/chapters/${params.chapterId}`);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const addQuestion = () => {
    appendQuestion({
      question: "",
      answers: [
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
      ],
    });
  };

  const addAnswer = (questionIndex: number) => {
    const currentAnswers = form.getValues(`questions.${questionIndex}.answers`);
    form.setValue(`questions.${questionIndex}.answers`, [
      ...currentAnswers,
      { text: "", isCorrect: false },
    ]);
  };

  const removeAnswer = (questionIndex: number, answerIndex: number) => {
    const currentAnswers = form.getValues(`questions.${questionIndex}.answers`);
    if (currentAnswers.length > 2) {
      const newAnswers = currentAnswers.filter((_, index) => index !== answerIndex);
      form.setValue(`questions.${questionIndex}.answers`, newAnswers);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Create Exam</h1>
        <p className="text-gray-600 mt-2">
          Create an exam with questions and multiple choice answers for your course.
        </p>
      </div>

      <Form {...form}>
        <form   onSubmit={form.handleSubmit(onSubmit, (errors) => {
          toast.error("Validation failed, check all fields, there should be atleast one correct answer and try again.npm ")
})} className="space-y-6">
          {/* Exam Details */}
          <Card>
            <CardHeader>
              <CardTitle>Exam Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Exam Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter exam name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Enter exam description" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Questions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Questions</h2>
              <Button
                type="button"
                onClick={addQuestion}
                variant="outline"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Question
              </Button>
            </div>

            {questionFields.map((questionField, questionIndex) => (
              <Card key={questionField.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      Question {questionIndex + 1}
                    </CardTitle>
                    {questionFields.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeQuestion(questionIndex)}
                        variant="destructive"
                        size="sm"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name={`questions.${questionIndex}.question`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Question Text</FormLabel>
                        <FormControl>
                          <Textarea {...field} placeholder="Enter your question" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Answers */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <FormLabel>Answer Options</FormLabel>
                      <Button
                        type="button"
                        onClick={() => addAnswer(questionIndex)}
                        variant="outline"
                        size="sm"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Answer
                      </Button>
                    </div>

                    {form.watch(`questions.${questionIndex}.answers`)?.map((_, answerIndex) => (
                      <div key={answerIndex} className="flex items-center space-x-2">
                        <FormField
                          control={form.control}
                          name={`questions.${questionIndex}.answers.${answerIndex}.text`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Input {...field} placeholder={`Answer ${answerIndex + 1}`} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name={`questions.${questionIndex}.answers.${answerIndex}.isCorrect`}
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <FormLabel className="text-sm">Correct</FormLabel>
                            </FormItem>
                          )}
                        />
                        
                        {form.watch(`questions.${questionIndex}.answers`)?.length > 2 && (
                          <Button
                            type="button"
                            onClick={() => removeAnswer(questionIndex, answerIndex)}
                            variant="destructive"
                            size="sm"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <FormField
                    control={form.control}
                    name={`questions.${questionIndex}.answers`}
                    render={() => (
                      <FormItem>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Exam"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
