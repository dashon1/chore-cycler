import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const colorClasses = {
  blue: "from-blue-400 to-blue-600",
  green: "from-emerald-400 to-emerald-600",
  purple: "from-purple-400 to-purple-600",
  orange: "from-orange-400 to-orange-600",
  pink: "from-pink-400 to-pink-600",
  yellow: "from-amber-400 to-amber-600",
  teal: "from-teal-400 to-teal-600",
  red: "from-red-400 to-red-600"
};

export default function ResponsibilityJar({ member, onSpinWheel }) {
  const points = member.responsibility_points || 0;
  const capacity = member.jar_capacity || 5;
  const percentage = Math.min((points / capacity) * 100, 100);
  const isFull = points >= capacity;
  const colorGradient = colorClasses[member.avatar_color] || colorClasses.blue;

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <span className="text-xl">{member.emoji}</span>
            {member.name}'s Responsibility Jar
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {isFull ? "🎉 Jar is full! Spin the wheel!" : `${points} of ${capacity} chores completed`}
          </p>
        </div>
        {isFull && (
          <motion.div
            animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <Sparkles className="w-6 h-6 text-yellow-500" />
          </motion.div>
        )}
      </div>

      {/* The Jar Visualization */}
      <div className="relative">
        {/* Jar Container */}
        <div className="relative w-full h-48 bg-gradient-to-b from-gray-50 to-gray-100 rounded-3xl border-4 border-gray-300 overflow-hidden shadow-inner">
          {/* Liquid Fill */}
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: `${percentage}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t ${colorGradient} opacity-80`}
          >
            {/* Bubbles Animation */}
            {points > 0 && (
              <>
                <motion.div
                  animate={{ y: [-10, -180], opacity: [0.8, 0] }}
                  transition={{ repeat: Infinity, duration: 3, delay: 0 }}
                  className="absolute left-[20%] w-4 h-4 bg-white/40 rounded-full"
                />
                <motion.div
                  animate={{ y: [-10, -180], opacity: [0.8, 0] }}
                  transition={{ repeat: Infinity, duration: 2.5, delay: 0.5 }}
                  className="absolute left-[50%] w-3 h-3 bg-white/40 rounded-full"
                />
                <motion.div
                  animate={{ y: [-10, -180], opacity: [0.8, 0] }}
                  transition={{ repeat: Infinity, duration: 2.8, delay: 1 }}
                  className="absolute left-[75%] w-5 h-5 bg-white/40 rounded-full"
                />
              </>
            )}
          </motion.div>

          {/* Shine Effect */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/30 via-transparent to-transparent pointer-events-none" />
          
          {/* Jar Lid */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-3/4 h-6 bg-gradient-to-b from-gray-400 to-gray-500 rounded-t-2xl border-2 border-gray-500" />
        </div>

        {/* Progress Markers */}
        <div className="absolute right-0 top-0 bottom-0 flex flex-col justify-between py-2 pr-2">
          {Array.from({ length: capacity + 1 }, (_, i) => (
            <div key={i} className="flex items-center gap-1">
              <span className="text-xs text-gray-400 font-medium">{capacity - i}</span>
              <div className="w-2 h-0.5 bg-gray-300" />
            </div>
          ))}
        </div>
      </div>

      {/* Action Button */}
      {isFull && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mt-6"
        >
          <Button
            onClick={onSpinWheel}
            className="w-full h-14 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-semibold text-lg shadow-lg"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Spin the Prize Wheel!
          </Button>
        </motion.div>
      )}
    </div>
  );
}