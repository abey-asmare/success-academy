"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, ArrowLeft } from "lucide-react"
import { telegramLink } from "@/app/constants"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md mx-auto text-center px-4">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-muted-foreground/20">404</h1>
          <h2 className="text-2xl font-semibold text-foreground mb-2">Page Not Found</h2>
          <p className="text-muted-foreground mb-8">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved, deleted, or you entered the
            wrong URL.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="default">
            <Link href="/" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              Go Home
            </Link>
          </Button>

          <Button asChild variant="outline" onClick={() => window.history.back()}>
            <button className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>
          </Button>
        </div>

        <div className="mt-12 text-sm text-muted-foreground">
          <p>
            Need help?{" "}
            <Link href={`${telegramLink}`} className="text-primary hover:underline">
              Contact support
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
