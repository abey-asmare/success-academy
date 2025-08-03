"use client";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { examSchema } from "@/schemas/validationSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "@/components/ui/checkbox";
import axios from "axios";
import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import z from "zod";
import { CreateExamImageForm } from "./create-exam-image";

export default function CreateExamForm({
  courseId,
  chapterId,
}: {
  courseId: string;
  chapterId: string;
}) {
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
          imageUrl: "",
          answers: [
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
          ],
        },
      ],
    },
  });

  const {
    fields: questionFields,
    append: appendQuestion,
    remove: removeQuestion,
  } = useFieldArray({
    control: form.control,
    name: "questions",
  });

  const onSubmit = async (values: z.infer<typeof examSchema>) => {
    try {
      setIsSubmitting(true);
      await axios.post(
        `/api/courses/${courseId}/chapters/${chapterId}/exams`,
        values
      );
      toast.success("Exam created successfully");
      router.push(
        `/dashboard/teacher/courses/${courseId}/chapters/${chapterId}`
      );
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
      imageUrl: "",
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
      const newAnswers = currentAnswers.filter(
        (_, index) => index !== answerIndex
      );
      form.setValue(`questions.${questionIndex}.answers`, newAnswers);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, () => toast.error("Something went wrong,Perhapse you left some fields empty or you didn't specify the correct answer?"))} className="space-y-6">
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
          <div>
            <h2 className="text-xl font-semibold">Questions</h2>
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
                        <Textarea
                          {...field}
                          placeholder="Enter your question"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <CreateExamImageForm
                  initialData={form.watch(`questions.${questionIndex}.imageUrl`) || ""}
                  onChange={(url) => {
                    form.setValue(`questions.${questionIndex}.imageUrl`, url);
                  }}
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

                  {form
                    .watch(`questions.${questionIndex}.answers`)
                    ?.map((_, answerIndex) => (
                      <div
                        key={answerIndex}
                        className="flex items-center space-x-2"
                      >
                        <FormField
                          control={form.control}
                          name={`questions.${questionIndex}.answers.${answerIndex}.text`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder={`Answer ${answerIndex + 1}`}
                                />
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

                        {form.watch(`questions.${questionIndex}.answers`)
                          ?.length > 2 && (
                          <Button
                            type="button"
                            onClick={() =>
                              removeAnswer(questionIndex, answerIndex)
                            }
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
            onClick={addQuestion}
            variant="outline"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Question
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Exam"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
