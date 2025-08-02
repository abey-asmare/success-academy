"use client" // Error boundaries must be Client Components

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, RefreshCw, Home } from "lucide-react"
import Link from "next/link"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <CardTitle className="text-xl">Something went wrong!</CardTitle>
          <CardDescription>An unexpected error occurred. Don&apos;t worry, our team has been notified.</CardDescription>
        </CardHeader>

        <CardContent className="text-center">
          {process.env.NODE_ENV === "development" && (
            <div className="mb-4 p-3 bg-muted rounded-md text-left">
              <p className="text-sm font-mono text-muted-foreground break-all">{error.message}</p>
              {error.digest && <p className="text-xs text-muted-foreground mt-2">Error ID: {error.digest}</p>}
            </div>
          )}

          <p className="text-sm text-muted-foreground mb-6">
            You can try refreshing the page or go back to the homepage.
          </p>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-3">
          <Button onClick={reset} className="flex items-center gap-2 w-full sm:w-auto">
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Button>

          <Button variant="outline" asChild className="flex items-center gap-2 w-full sm:w-auto bg-transparent">
            <Link href="/">
              <Home className="w-4 h-4" />
              Go Home
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
