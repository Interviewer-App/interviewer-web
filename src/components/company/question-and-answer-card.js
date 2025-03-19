import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "../ui/badge";
import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils/utill";

function QuestionAndAnswerCard({ index, question }) {
  return (

    <div key={index} className="p-6 rounded-lg bg-card/80">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold flex items-center gap-2">
            {question.id}
            <Badge
              variant="outline"
              className={cn(
                "ml-2",
                question.type === "Coding" ? "bg-blue-500/10 text-blue-500 border-blue-500/20" : "bg-purple-500/10 text-purple-500 border-purple-500/20"
              )}
            >
              {question.type}
            </Badge>
          </h3>
        </div>
        <div className="text-right">
          <span className="font-medium text-sm text-muted-foreground">Score</span>
          <div className="text-xl font-bold">{question.interviewResponses?.score?.score / 10 || 0}</div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="font-medium mb-2">Question:</h4>
          <p className="text-muted-foreground">{question.questionText}</p>
        </div>

        <div className="bg-muted/30 p-4 rounded-md border border-border">
          <h4 className="font-medium mb-2">Your Answer:</h4>
          <pre className="text-sm overflow-x-auto p-2 bg-background rounded"> {question.interviewResponses?.responseText || "No answer given"}</pre>
        </div>

        <div className="bg-muted/10 p-4 rounded-md border border-border">
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            Feedback:
          </h4>
          <p className="text-muted-foreground">{question.feedback}</p>
        </div>
      </div>
    </div>

    // <div key={index} className="mt-5">
    //   <div className=" w-full bg-slate-500/40 py-2 px-4 rounded-t-lg relative">
    //     <span className=" text-xl font-semibold text-gray-400">
    //       Q{index + 1}
    //     </span>
    //     <span className=" text-md text-gray-400 px-5">
    //       score: {question.interviewResponses?.score?.score / 10 || 0}/10
    //     </span>
    //     <div className="flex gap-2 absolute right-4 top-0 h-full items-center justify-between">
    //       <span className=" text-sm text-gray-400">Type:</span>
    //       <span className=" text-sm w-full text-gray-400">
    //         {question.type === "CODING" ? "Coding" : "Open Ended"}
    //       </span>
    //     </div>
    //   </div>
    //   <div className="w-full bg-slate-500/20 py-3 text-gray-300 px-6 rounded-b-lg">
    //     <p className="text-base w-full rounded-md bg-transparent text-gray-400 font-semibold focus:outline-none">
    //       {question.questionText}
    //     </p>
    //     <p className="text-sm w-full rounded-md bg-transparent text-gray-500 focus:outline-none px-5 py-3">
    //       {question.interviewResponses?.responseText || "No answer given"}
    //     </p>
    //   </div>
    // </div>
  );
}

export default QuestionAndAnswerCard;
