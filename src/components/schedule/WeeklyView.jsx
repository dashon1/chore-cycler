import React from "react";
import { format, startOfWeek, addDays, isSameDay, parseISO } from "date-fns";
import { motion } from "framer-motion";

const colorClasses = {
  blue: "bg-blue-500",
  green: "bg-emerald-500",
  purple: "bg-purple-500",
  orange: "bg-orange-500",
  pink: "bg-pink-500",
  yellow: "bg-amber-500",
  teal: "bg-teal-500",
  red: "bg-red-500"
};

export default function WeeklyView({ assignments, chores, members, selectedDate, onSelectDate }) {
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getAssignmentsForDay = (date) => {
    return assignments.filter((a) => {
      const dueDate = a.due_date ? parseISO(a.due_date) : null;
      return dueDate && isSameDay(dueDate, date);
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((day, index) => {
          const dayAssignments = getAssignmentsForDay(day);
          const isSelected = isSameDay(day, selectedDate);
          const isToday = isSameDay(day, new Date());

          return (
            <motion.button
              key={index}
              onClick={() => onSelectDate(day)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-3 rounded-xl text-center transition-all ${
                isSelected
                  ? "bg-gray-900 text-white"
                  : isToday
                  ? "bg-blue-50 text-blue-700"
                  : "hover:bg-gray-50"
              }`}
            >
              <p className={`text-xs font-medium mb-1 ${isSelected ? "text-gray-300" : "text-gray-500"}`}>
                {format(day, "EEE")}
              </p>
              <p className={`text-lg font-semibold ${isSelected ? "text-white" : "text-gray-900"}`}>
                {format(day, "d")}
              </p>
              {dayAssignments.length > 0 && (
                <div className="flex justify-center gap-0.5 mt-2">
                  {dayAssignments.slice(0, 3).map((a) => {
                    const member = members.find((m) => m.id === a.member_id);
                    return (
                      <div
                        key={a.id}
                        className={`w-2 h-2 rounded-full ${
                          a.status === "completed"
                            ? "bg-emerald-400"
                            : colorClasses[member?.avatar_color] || "bg-gray-300"
                        }`}
                      />
                    );
                  })}
                  {dayAssignments.length > 3 && (
                    <span className={`text-xs ${isSelected ? "text-gray-300" : "text-gray-400"}`}>
                      +{dayAssignments.length - 3}
                    </span>
                  )}
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}