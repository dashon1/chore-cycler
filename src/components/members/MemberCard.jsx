import React from "react";
import { motion } from "framer-motion";
import { Check, X, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";

const colorClasses = {
  blue: "bg-blue-100 text-blue-700 border-blue-200",
  green: "bg-emerald-100 text-emerald-700 border-emerald-200",
  purple: "bg-purple-100 text-purple-700 border-purple-200",
  orange: "bg-orange-100 text-orange-700 border-orange-200",
  pink: "bg-pink-100 text-pink-700 border-pink-200",
  yellow: "bg-amber-100 text-amber-700 border-amber-200",
  teal: "bg-teal-100 text-teal-700 border-teal-200",
  red: "bg-red-100 text-red-700 border-red-200"
};

export default function MemberCard({ member, onEdit, onToggleActive, compact = false }) {
  const colorClass = colorClasses[member.avatar_color] || colorClasses.blue;

  if (compact) {
    return (
      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${colorClass}`}>
        <span className="text-lg">{member.emoji || "👤"}</span>
        <span className="font-medium text-sm">{member.name}</span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative p-5 rounded-2xl border-2 transition-all ${colorClass} ${
        !member.is_active ? "opacity-50" : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-white/60 flex items-center justify-center text-3xl shadow-sm">
            {member.emoji || "👤"}
          </div>
          <div>
            <h3 className="font-semibold text-lg">{member.name}</h3>
            <p className="text-sm opacity-70">
              {member.is_active ? "Active" : "Inactive"}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(member)}
            className="h-9 w-9 rounded-xl hover:bg-white/50"
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onToggleActive(member)}
            className="h-9 w-9 rounded-xl hover:bg-white/50"
          >
            {member.is_active ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}