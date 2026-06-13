import React, { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, XCircle, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format, parseISO, isBefore, startOfDay } from "date-fns";
import ChoreRatingDialog from "./ChoreRatingDialog";

const colorClasses = {
  blue: "bg-blue-100 text-blue-700",
  green: "bg-emerald-100 text-emerald-700",
  purple: "bg-purple-100 text-purple-700",
  orange: "bg-orange-100 text-orange-700",
  pink: "bg-pink-100 text-pink-700",
  yellow: "bg-amber-100 text-amber-700",
  teal: "bg-teal-100 text-teal-700",
  red: "bg-red-100 text-red-700"
};

export default function AssignmentCard({ assignment, chore, member, onComplete, onSkip }) {
  const [ratingDialogOpen, setRatingDialogOpen] = useState(false);
  
  if (!chore || !member) return null;

  const dueDate = assignment.due_date ? parseISO(assignment.due_date) : null;
  const isOverdue = dueDate && isBefore(dueDate, startOfDay(new Date())) && assignment.status === "pending";
  
  const colorClass = colorClasses[member.avatar_color] || colorClasses.blue;

  const speakChore = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const text = `${chore.name}. ${chore.description || ""}`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleRateComplete = (ratingData) => {
    if (onComplete) {
      onComplete(assignment, ratingData);
    }
    setRatingDialogOpen(false);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={`p-5 rounded-2xl border shadow-sm transition-all ${
          assignment.status === "completed"
            ? "bg-emerald-50 border-emerald-200"
            : assignment.status === "skipped"
            ? "bg-gray-50 border-gray-200 opacity-60"
            : isOverdue
            ? "bg-red-50 border-red-200"
            : "bg-white border-gray-100"
        }`}
      >
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center text-2xl shrink-0">
            {chore.icon || "🧹"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-gray-900 truncate">{chore.name}</h3>
              <span className={`text-2xl shrink-0 ${colorClass.replace('bg-', 'text-').replace('-100', '-500')}`}>
                {member.emoji || "👤"}
              </span>
              {member.age_group === "preschool" && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={speakChore}
                  className="h-8 w-8 rounded-lg shrink-0"
                  title="Hear this chore"
                >
                  <Volume2 className="w-4 h-4" />
                </Button>
              )}
            </div>

            {chore.description && (
              <p className="text-sm text-gray-600 mb-2">{chore.description}</p>
            )}

            <div className="flex flex-wrap gap-2">
              <Badge className={`${colorClass} border-0`}>
                {member.emoji} {member.name}
              </Badge>
              {dueDate && (
                <Badge variant="outline" className={`flex items-center gap-1 ${isOverdue ? 'text-red-600 border-red-300' : ''}`}>
                  <Clock className="w-3 h-3" />
                  {format(dueDate, "MMM d, yyyy")}
                </Badge>
              )}
              {assignment.status === "completed" && (
                <Badge className="bg-emerald-100 text-emerald-700 border-0">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Completed
                </Badge>
              )}
              {assignment.status === "skipped" && (
                <Badge className="bg-gray-100 text-gray-700 border-0">
                  <XCircle className="w-3 h-3 mr-1" />
                  Skipped
                </Badge>
              )}
            </div>

            {assignment.status === "pending" && (
              <div className="flex gap-2 mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onSkip && onSkip(assignment)}
                  className="rounded-xl flex-1"
                >
                  Skip
                </Button>
                <Button
                  size="sm"
                  onClick={() => member.age_group === "preschool" ? setRatingDialogOpen(true) : onComplete && onComplete(assignment)}
                  className="rounded-xl flex-1 bg-emerald-600 hover:bg-emerald-700"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Complete
                </Button>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {member.age_group === "preschool" && (
        <ChoreRatingDialog
          open={ratingDialogOpen}
          onOpenChange={setRatingDialogOpen}
          assignment={assignment}
          chore={chore}
          member={member}
          onRate={handleRateComplete}
        />
      )}
    </>
  );
}