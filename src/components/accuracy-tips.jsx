"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Lightbulb, Monitor, User, Zap } from "lucide-react"

export function AccuracyTips() {
  return (
    <Card className="w-full max-w-2xl mx-auto mt-4 bg-[#1B1D22] border-gray-500/40 text-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5" />
          Tips for Better Accuracy
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className=" bg-blue-700/10 border-blue-500/40 text-white">
          <Lightbulb className="h-4 w-4 !text-white" />
          <AlertDescription>
            <strong>Lighting:</strong> Make sure your face is evenly lit. Avoid shadows and bright light behind you.
          </AlertDescription>
        </Alert>

        <Alert className=" bg-blue-700/10 border-blue-500/40 text-white">
          <Monitor className="h-4 w-4 !text-white" />
          <AlertDescription>
            <strong>Distance:</strong> Sit approximately 50-70 cm (20-28 inches) from your screen.
          </AlertDescription>
        </Alert>

        <Alert className=" bg-blue-700/10 border-blue-500/40 text-white">
          <User className="h-4 w-4 !text-white" />
          <AlertDescription>
            <strong>Posture:</strong> Sit upright and keep your head steady during calibration.
          </AlertDescription>
        </Alert>

        <div className="text-sm text-muted-foreground">
          <p>
            <strong>Calibration Advice:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Look directly at each red dot before clicking.</li>
            <li>Take your time - avoid rushing through the process.</li>
            <li>Use the 9-point calibration option if available for improved accuracy.</li>
            <li>If accuracy seems off (below 70%), you can recalibrate.</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
