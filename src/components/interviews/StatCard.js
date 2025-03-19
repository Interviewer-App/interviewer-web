import React from "react";
import { cn } from "@/lib/utils";
import {
  TrendingUp,
  Check,
  Clock,
  ListChecks,
  Users,
  Star,
  Award,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const StatCard = ({ title, value, variant, className }) => {
  const getIcon = () => {
    switch (variant) {
      case "total":
        return <Users className="h-6 w-6 text-primary" />;
      case "completed":
        return <Check className="h-6 w-6 text-success" />;
      case "pending":
        return <Clock className="h-6 w-6 text-warning" />;
      default:
        return null;
    }
  };

  const getBgClass = () => {
    switch (variant) {
      case "total":
        return "bg-gradient-to-br from-indigo-900/20 to-indigo-700/10";
      case "completed":
        return "bg-gradient-to-br from-emerald-900/20 to-emerald-700/10";
      case "pending":
        return "bg-gradient-to-br from-amber-900/20 to-amber-700/10";
      default:
        return "bg-secondary";
    }
  };

  const getIconBgClass = () => {
    switch (variant) {
      case "total":
        return "bg-indigo-500/20 text-indigo-400";
      case "completed":
        return "bg-emerald-500/20 text-emerald-400";
      case "pending":
        return "bg-amber-500/20 text-amber-400";
      default:
        return "bg-secondary-foreground/10";
    }
  };

  const getTrendIcon = () => {
    switch (variant) {
      case "total":
        return <TrendingUp className="h-4 w-4 text-indigo-400" />;
      case "completed":
        return <Award className="h-4 w-4 text-emerald-400" />;
      case "pending":
        return <Star className="h-4 w-4 text-amber-400" />;
      default:
        return null;
    }
  };

  return (
    <Card
      className={cn(
        "border-none overflow-hidden shadow-lg",
        getBgClass(),
        className
      )}
    >
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-[#b3b3b3] mb-1">{title}</p>
            <h3 className="text-3xl font-bold">{value}</h3>
            <div className="flex items-center gap-1 mt-2 text-xs">
              {getTrendIcon()}
              <span className="text-[#b3b3b3]">
                {variant === "total"
                  ? "+4 from last week"
                  : variant === "pending"
                  ? "3 this week"
                  : "Requiring feedback"}
              </span>
            </div>
          </div>
          <div className={cn("p-3 rounded-full", getIconBgClass())}>
            {getIcon()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
