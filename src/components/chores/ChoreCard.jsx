import React from "react";
import { motion } from "framer-motion";
import { Pencil, Trash2, Clock, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const frequencyLabels = {
  daily: "Daily",
  weekly: "Weekly",
  biweekly: "Every 2 weeks",
  monthly: "Monthly"
};

const difficultyConfig = {
  easy: { label: "Easy", color: "bg-green-100 text-green-700" },
  medium: { label: "Medium", color: "bg-amber-100 text-amber-700" },
  hard: { label: "Hard", color: "bg-red-100 text-red-700" }
};

export default function ChoreCard({ chore, onEdit, onDelete }) {
  const difficulty = difficultyConfig[chore.difficulty] || difficultyConfig.medium;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all ${
        !chore.is_active ? "opacity-50" : ""
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-2xl">
            {chore.icon || "🧹"}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{chore.name}</h3>
            {chore.description && (
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">{chore.description}</p>
            )}
            <div className="flex flex-wrap gap-2 mt-3">
              <Badge variant="secondary" className="rounded-lg bg-gray-100 text-gray-600">
                <Clock className="w-3 h-3 mr-1" />
                {frequencyLabels[chore.frequency]}
              </Badge>
              <Badge className={`rounded-lg ${difficulty.color}`}>
                <Zap className="w-3 h-3 mr-1" />
                {difficulty.label}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(chore)}
            className="h-9 w-9 rounded-xl text-gray-400 hover:text-gray-600"
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(chore)}
            className="h-9 w-9 rounded-xl text-gray-400 hover:text-red-500"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}