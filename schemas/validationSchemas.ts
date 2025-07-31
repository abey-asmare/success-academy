import { z } from "zod"

// Register form schema
export const registerSchema = z.object({
  firstname: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "First name can only contain letters and spaces"),
  
  lastname: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Last name can only contain letters and spaces"),
  
  email: z
    .string()
    .email("Please enter a valid email address")
    .min(1, "Email is required"),
  
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be less than 15 digits")
    .regex(/^[0-9+\-\s()]+$/, "Please enter a valid phone number"),
  
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one uppercase letter, one lowercase letter, and one number"),
  
  confirmPassword: z
    .string()
    .min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

// Login form schema
export const loginSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address")
    .min(1, "Email is required"),
  
  password: z
    .string()
    .min(1, "Password is required"),
})

// Type definitions
export type RegisterFormData = z.infer<typeof registerSchema>
export type LoginFormData = z.infer<typeof loginSchema>


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
  answers: z.array(answerSchema).min(2, "At least 2 answers are required").refine(
    (answers) => answers.some(answer => answer.isCorrect),
    "At least one answer must be marked as correct"
  ),
});

export const examSchema = z.object({
  name: z.string().min(1, "Exam name is required"),
  description: z.string().optional(),
  questions: z.array(questionSchema).min(1, "At least one question is required"),
});

