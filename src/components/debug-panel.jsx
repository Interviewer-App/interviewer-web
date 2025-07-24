"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Target } from "lucide-react"

export function DebugPanel({
  gazePosition,
  isCalibrated,
  isCalibrating,
  isTestingAccuracy,
  accuracyScore,
  onForceShowDot,
}) {
  if (process.env.NODE_ENV !== "development") return null

  return (
    <Card className="fixed bottom-4 left-4 z-50 bg-gray-800 border-gray-600 text-white max-w-xs">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Eye className="w-4 h-4" />
          Debug Panel
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-xs">
        <div className="flex justify-between">
          <span>Gaze Position:</span>
          <span>{gazePosition ? `(${Math.round(gazePosition.x)}, ${Math.round(gazePosition.y)})` : "None"}</span>
        </div>

        <div className="flex justify-between">
          <span>Screen Size:</span>
          <span>{typeof window !== "undefined" ? `${window.innerWidth}x${window.innerHeight}` : "Unknown"}</span>
        </div>

        <div className="flex justify-between">
          <span>Calibrated:</span>
          <Badge variant={isCalibrated ? "default" : "secondary"} className="text-xs">
            {isCalibrated ? "Yes" : "No"}
          </Badge>
        </div>

        <div className="flex justify-between">
          <span>Calibrating:</span>
          <Badge variant={isCalibrating ? "default" : "secondary"} className="text-xs">
            {isCalibrating ? "Yes" : "No"}
          </Badge>
        </div>

        <div className="flex justify-between">
          <span>Testing:</span>
          <Badge variant={isTestingAccuracy ? "default" : "secondary"} className="text-xs">
            {isTestingAccuracy ? "Yes" : "No"}
          </Badge>
        </div>

        {accuracyScore !== null && (
          <div className="flex justify-between">
            <span>Accuracy:</span>
            <Badge
              variant="outline"
              className={`text-xs ${
                accuracyScore > 80 ? "text-green-400" : accuracyScore > 60 ? "text-yellow-400" : "text-red-400"
              }`}
            >
              {accuracyScore}%
            </Badge>
          </div>
        )}

        {gazePosition?.confidence && (
          <div className="flex justify-between">
            <span>Confidence:</span>
            <Badge
              variant="outline"
              className={`text-xs ${
                gazePosition.confidence > 0.7
                  ? "text-green-400"
                  : gazePosition.confidence > 0.4
                    ? "text-yellow-400"
                    : "text-red-400"
              }`}
            >
              {Math.round(gazePosition.confidence * 100)}%
            </Badge>
          </div>
        )}

        <Button
          size="sm"
          variant="outline"
          onClick={onForceShowDot}
          className="w-full mt-2 bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
        >
          <Target className="w-3 h-3 mr-1" />
          Test Dot
        </Button>
      </CardContent>
    </Card>
  )
}
