import { z } from "zod"

export interface Course {
    id: string;
    title: string;
    description: string;
    duration: string;
    level: string;
    price: number;
    features: string[];
    curriculum: string[];
}
export interface PaymentAccount {
    id: string;
    name: string;
    accountNumber: string;
    bankName: string;
    type: 'bank' | 'mobile' | 'crypto';
}



export const answerSchema = z.object({
  text: z.string().min(1, "Answer text is required"),
  isCorrect: z.boolean()
});

export const questionSchema = z.object({
  question: z.string().min(1, "Question text is required"),
  imageUrl: z.string().optional(),
  answerDescription: z.string().optional(),
  answers: z.array(answerSchema).min(2, "At least 2 answers are required").refine(
    (answers) => answers.some(answer => answer.isCorrect),
    "At least one answer must be marked as correct"
  ),
});

export const examSchema = z.object({
  courseId: z.string().min(1, "Course is required").optional(),
  name: z.string().min(1, "Exam name is required"),
  description: z.string().optional(),
  questions: z.array(questionSchema).min(1, "At least one question is required"),
});


// collect user infos for additional purposes
export const profileFormSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  email: z.email(), 
  phoneNumber: z.string().regex(/^\+?[0-9\s\-()]{7,20}$/, { message: "Invalid Phone Number" }),
  stream: z.enum(["Natural science", "Social science"]),
  referrer: z.enum([
    "Google",
    "Telegram",
    "Instagram",
    "Tiktok",
    "Youtube",
    "Friend",
    "Other",
  ]),
  university: z
    .string()
    .min(1, { message: "University is required" }),
});
