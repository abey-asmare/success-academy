import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { MAX_ALLOWED_DEVICES } from "../constants"

export default function TooManyDevicesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-4 bg-red-100 rounded-full">
              <AlertTriangle className="h-12 w-12 text-red-600" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Too Many Devices</h1>
            <p className="text-lg text-gray-600">
              You&apos;ve reached the maximum number of {MAX_ALLOWED_DEVICES} devices for your account
            </p>
          </div>
        </div>

        {/* Alert */}
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            To continue using this device, you will be signed out from all other devices.
          </AlertDescription>
        </Alert>

        <Button variant="ghost" asChild>
          <Link href="/">Go Home</Link>
        </Button>

      </div>
    </div>
  )
}
