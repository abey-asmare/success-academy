'use client'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { FcGoogle } from 'react-icons/fc'
import {useForm} from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import { registerSchema, type RegisterFormData } from "@/schemas/authSchemas"

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    try {
      console.log("Registration data:", data)
      // TODO: Implement registration logic
    } catch (error) {
      console.error("Registration error:", error)
    }
  }

  return (
    <form className={cn("flex flex-col gap-6", className)} onSubmit={handleSubmit(onSubmit)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Register to your account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your phone number below to register to your account
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid grid-cols-2 gap-3">
          <div className="grid gap-3">
            <Label htmlFor="firstname">First Name</Label>
            <Input 
              id="firstname" 
              className={cn(
                "focus:outline-none focus:ring-2 focus:ring-primary-100!",
                errors.firstname && "border-red-500 focus:ring-red-500"
              )}
              type="text" 
              placeholder="John" 
              {...register("firstname")}
            />
            {errors.firstname && (
              <p className="text-sm text-red-500">{errors.firstname.message}</p>
            )}
          </div>
          <div className="grid gap-3">
            <Label htmlFor="lastname">Last Name</Label>
            <Input 
              id="lastname" 
              className={cn(
                "focus:outline-none focus:ring-2 focus:ring-primary-100!",
                errors.lastname && "border-red-500 focus:ring-red-500"
              )}
              type="text" 
              placeholder="Doe" 
              {...register("lastname")}
            />
            {errors.lastname && (
              <p className="text-sm text-red-500">{errors.lastname.message}</p>
            )}
          </div>
        </div>
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            className={cn(
              "focus:outline-none focus:ring-2 focus:ring-primary-100!",
              errors.email && "border-red-500 focus:ring-red-500"
            )}
            type="email" 
            placeholder="m@example.com" 
            {...register("email")}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>
        <div className="grid gap-3">
          <Label htmlFor="phone">Phone Number</Label>
          <Input 
            id="phone" 
            className={cn(
              "focus:outline-none focus:ring-2 focus:ring-primary-100!",
              errors.phone && "border-red-500 focus:ring-red-500"
            )}
            type="tel" 
            placeholder="0912345678" 
            {...register("phone")}
          />
          {errors.phone && (
            <p className="text-sm text-red-500">{errors.phone.message}</p>
          )}
        </div>
        <div className="grid gap-3">
          <Label htmlFor="password">Password</Label>
          <Input 
            id="password" 
            className={cn(
              "focus:outline-none focus:ring-2 focus:ring-primary-100!",
              errors.password && "border-red-500 focus:ring-red-500"
            )}
            type="password" 
            placeholder="Enter your password"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>
        <div className="grid gap-3">
          <Label htmlFor="confirmPassword">Repeat Password</Label>
          <Input 
            id="confirmPassword" 
            className={cn(
              "focus:outline-none focus:ring-2 focus:ring-primary-100!",
              errors.confirmPassword && "border-red-500 focus:ring-red-500"
            )}
            type="password" 
            placeholder="Enter your password again"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
          )}
        </div>
        <Button 
          type="submit" 
          className="w-full bg-primary-500 hover:bg-primary-500/80 text-primary-foreground"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Registering..." : "Register"}
        </Button>
        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background text-muted-foreground relative z-10 px-2">
            Or continue with
          </span>
        </div>
        <Button variant="outline" className="w-full bg-primary-500">
         <FcGoogle/>
          Login with Google
        </Button>
      </div>
      <div className="text-center text-sm">
        Already have an account?{" "}
        <Link href="/login" className="underline underline-offset-4 text-primary-500 hover:text-primary-700">
          Sign in
        </Link>
      </div>
    </form>
  )
}
